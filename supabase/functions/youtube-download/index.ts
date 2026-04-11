const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL do YouTube inválida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing video: ${videoId}`);

    // Strategy 1: Scrape YouTube watch page for embedded player data
    const result = await scrapeWatchPage(videoId);
    if (result && result.formats.videos.length > 0) {
      console.log(`Watch page scrape succeeded: ${result.formats.videos.length} videos, ${result.formats.audios.length} audios`);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Strategy 2: Try Innertube WEB_EMBEDDED client
    const embeddedResult = await fetchEmbedded(videoId);
    if (embeddedResult && embeddedResult.formats.videos.length > 0) {
      console.log(`Embedded client succeeded`);
      return new Response(JSON.stringify(embeddedResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Strategy 3: Try RapidAPI fallback if configured
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    if (rapidApiKey) {
      const rapidResult = await tryRapidApi(videoId, rapidApiKey);
      if (rapidResult && rapidResult.formats.videos.length > 0) {
        console.log(`RapidAPI fallback succeeded`);
        return new Response(JSON.stringify(rapidResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Não foi possível obter os formatos deste vídeo. Tente outro link.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ─── Strategy 1: Scrape Watch Page ────────────────────────────────

async function scrapeWatchPage(videoId: string) {
  try {
    // Fetch the YouTube watch page as a regular browser would
    const resp = await fetch(`https://www.youtube.com/watch?v=${videoId}&bpctr=9999999999&has_verified=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': 'CONSENT=YES+cb; YSC=DwKYllHNwuw; VISITOR_INFO1_LIVE=;',
      },
    });

    if (!resp.ok) {
      console.error(`Watch page returned ${resp.status}`);
      return null;
    }

    const html = await resp.text();
    console.log(`Got watch page HTML: ${html.length} bytes`);

    // Extract ytInitialPlayerResponse
    const playerMatch = html.match(/var\s+ytInitialPlayerResponse\s*=\s*(\{.+?\});\s*(?:var|<\/script>)/s);
    if (!playerMatch) {
      // Try alternative pattern
      const altMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});\s*(?:var|<\/script>)/s);
      if (!altMatch) {
        console.error('Could not find ytInitialPlayerResponse in HTML');
        // Try to find it with a different pattern
        const idx = html.indexOf('ytInitialPlayerResponse');
        if (idx > -1) {
          console.log('Found ytInitialPlayerResponse at index', idx, 'context:', html.substring(idx, idx + 100));
        }
        return null;
      }
      return parsePlayerResponse(videoId, JSON.parse(altMatch[1]));
    }

    const playerData = JSON.parse(playerMatch[1]);
    return parsePlayerResponse(videoId, playerData);
  } catch (error) {
    console.error('Watch page scrape error:', error);
    return null;
  }
}

// ─── Strategy 2: Innertube WEB_EMBEDDED ───────────────────────────

async function fetchEmbedded(videoId: string) {
  try {
    // First fetch the embed page to get a valid config
    const embedResp = await fetch(`https://www.youtube.com/embed/${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    });

    if (!embedResp.ok) {
      console.error(`Embed page returned ${embedResp.status}`);
      return null;
    }

    const embedHtml = await embedResp.text();
    
    // Extract signature timestamp
    const stsMatch = embedHtml.match(/"sts"\s*:\s*(\d+)/);
    const sts = stsMatch ? parseInt(stsMatch[1]) : 20073;

    const body = {
      videoId,
      context: {
        client: {
          clientName: 'WEB_EMBEDDED_PLAYER',
          clientVersion: '1.20250101.00.00',
          hl: 'en',
          gl: 'US',
        },
        thirdParty: {
          embedUrl: 'https://www.youtube.com/',
        },
      },
      playbackContext: {
        contentPlaybackContext: {
          html5Preference: 'HTML5_PREF_WANTS',
          signatureTimestamp: sts,
        },
      },
      contentCheckOk: true,
      racyCheckOk: true,
    };

    const resp = await fetch(
      'https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Origin': 'https://www.youtube.com',
          'Referer': `https://www.youtube.com/embed/${videoId}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!resp.ok) {
      console.error(`Embedded player API returned ${resp.status}`);
      const text = await resp.text();
      console.error('Response:', text.substring(0, 300));
      return null;
    }

    const data = await resp.json();
    return parsePlayerResponse(videoId, data);
  } catch (error) {
    console.error('Embedded client error:', error);
    return null;
  }
}

// ─── Strategy 3: RapidAPI Fallback ────────────────────────────────

async function tryRapidApi(videoId: string, rapidApiKey: string) {
  try {
    console.log('Trying RapidAPI fallback...');
    const response = await fetch(
      `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}`,
      {
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      console.error('RapidAPI error:', response.status);
      return null;
    }

    const data = await response.json();
    const rawVideos = (data.videos?.items || []).filter((v: any) => v.url);
    const rawAudios = (data.audios?.items || []).filter((a: any) => a.url);

    if (rawVideos.length === 0 && rawAudios.length === 0) return null;

    return {
      success: true,
      videoId,
      title: data.title || 'Sem título',
      channel: data.channel?.name || 'Desconhecido',
      duration: data.lengthSeconds || 0,
      thumbnail: data.thumbnails?.[data.thumbnails.length - 1]?.url || '',
      views: data.viewCount || '0',
      formats: filterFormats(
        rawVideos.map((v: any) => ({
          quality: v.quality || v.qualityLabel || '',
          url: v.url,
          mimeType: v.mimeType || 'video/mp4',
          size: typeof v.size === 'number' ? v.size : parseSizeString(v.size),
          hasAudio: v.hasAudio !== false,
          codec: extractCodec(v.mimeType || ''),
          bitrate: v.bitrate || 0,
          height: 0,
        })),
        rawAudios.map((a: any) => ({
          quality: a.quality || '',
          url: a.url,
          mimeType: a.mimeType || 'audio/mp4',
          size: typeof a.size === 'number' ? a.size : parseSizeString(a.size),
          codec: extractCodec(a.mimeType || ''),
          bitrate: a.bitrate || 0,
        }))
      ),
    };
  } catch (error) {
    console.error('RapidAPI error:', error);
    return null;
  }
}

// ─── Parse Player Response ────────────────────────────────────────

function parsePlayerResponse(videoId: string, data: any) {
  const details = data.videoDetails;
  const streaming = data.streamingData;

  if (!streaming) {
    const status = data.playabilityStatus;
    console.error('No streamingData. Status:', status?.status, status?.reason || status?.messages?.join(', '));
    return null;
  }

  const allFormats = [...(streaming.formats || []), ...(streaming.adaptiveFormats || [])];

  if (allFormats.length === 0) {
    console.error('Empty formats array');
    return null;
  }

  console.log(`Got ${allFormats.length} raw formats from player response`);

  const rawVideos = allFormats
    .filter((f: any) => f.mimeType?.startsWith('video/') && f.url)
    .map((v: any) => ({
      quality: v.qualityLabel || v.quality || '',
      url: v.url,
      mimeType: v.mimeType || 'video/mp4',
      size: v.contentLength ? parseInt(v.contentLength) : 0,
      hasAudio: !!(v.audioQuality || v.audioChannels),
      codec: extractCodec(v.mimeType || ''),
      bitrate: v.bitrate || 0,
      height: v.height || 0,
    }));

  const rawAudios = allFormats
    .filter((f: any) => f.mimeType?.startsWith('audio/') && f.url)
    .map((a: any) => ({
      quality: a.qualityLabel || a.quality || '',
      url: a.url,
      mimeType: a.mimeType || 'audio/mp4',
      size: a.contentLength ? parseInt(a.contentLength) : 0,
      codec: extractCodec(a.mimeType || ''),
      bitrate: a.bitrate || 0,
    }));

  console.log(`Parsed: ${rawVideos.length} videos, ${rawAudios.length} audios with direct URLs`);

  // If we have streamingData but all URLs require signature decryption (no direct URLs)
  if (rawVideos.length === 0 && rawAudios.length === 0) {
    const signedCount = allFormats.filter((f: any) => f.signatureCipher || f.cipher).length;
    if (signedCount > 0) {
      console.error(`${signedCount} formats require signature decryption (cipher) - not supported`);
    }
    return null;
  }

  const formats = filterFormats(rawVideos, rawAudios);

  return {
    success: true,
    videoId,
    title: details?.title || 'Vídeo sem título',
    channel: details?.author || 'Desconhecido',
    duration: parseInt(details?.lengthSeconds || '0'),
    thumbnail: details?.thumbnail?.thumbnails?.slice(-1)?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    views: details?.viewCount || '0',
    formats,
  };
}

// ─── Format Filtering (max 7: 5 video + 2 audio) ─────────────────

interface RawVideoFormat {
  quality: string; url: string; mimeType: string; size: number;
  hasAudio: boolean; codec: string; bitrate: number; height: number;
}

interface RawAudioFormat {
  quality: string; url: string; mimeType: string; size: number;
  codec: string; bitrate: number;
}

function filterFormats(rawVideos: RawVideoFormat[], rawAudios: RawAudioFormat[]) {
  const videos: any[] = [];
  const targetResolutions = ['1080p', '720p', '480p', '360p'];

  for (const res of targetResolutions) {
    const candidates = rawVideos.filter(v => {
      const q = normalizeQuality(v.quality, v.height);
      return q === res && v.codec.includes('avc1');
    });
    if (candidates.length > 0) {
      candidates.sort((a, b) => b.bitrate - a.bitrate || b.size - a.size);
      const best = candidates[0];
      videos.push({
        quality: `${res} - MP4 (H.264)`,
        url: best.url,
        mimeType: 'video/mp4',
        size: best.size > 0 ? formatBytes(best.size) : 'Tamanho variável',
        hasAudio: best.hasAudio,
      });
    }
  }

  // 1080p VP9 webm optional
  const vp9_1080 = rawVideos.filter(v => normalizeQuality(v.quality, v.height) === '1080p' && v.codec.includes('vp9'));
  if (vp9_1080.length > 0) {
    vp9_1080.sort((a, b) => b.bitrate - a.bitrate || b.size - a.size);
    const best = vp9_1080[0];
    videos.push({
      quality: '1080p - WebM (VP9)',
      url: best.url,
      mimeType: 'video/webm',
      size: best.size > 0 ? formatBytes(best.size) : 'Tamanho variável',
      hasAudio: best.hasAudio,
    });
  }

  // Fallback: any codec per resolution
  if (videos.length === 0) {
    for (const res of targetResolutions) {
      const candidates = rawVideos.filter(v => normalizeQuality(v.quality, v.height) === res);
      if (candidates.length > 0) {
        candidates.sort((a, b) => b.bitrate - a.bitrate || b.size - a.size);
        const best = candidates[0];
        const codecLabel = best.codec.includes('vp9') ? 'VP9' : best.codec.includes('av01') ? 'AV1' : best.codec.split('.')[0];
        const ext = best.mimeType.includes('webm') ? 'WebM' : 'MP4';
        videos.push({
          quality: `${res} - ${ext} (${codecLabel})`,
          url: best.url,
          mimeType: best.mimeType,
          size: best.size > 0 ? formatBytes(best.size) : 'Tamanho variável',
          hasAudio: best.hasAudio,
        });
      }
    }
  }

  // Audio
  const audios: any[] = [];
  const m4a = rawAudios.filter(a => a.mimeType.includes('mp4') || a.mimeType.includes('m4a') || a.codec.includes('mp4a'));
  if (m4a.length > 0) {
    m4a.sort((a, b) => b.bitrate - a.bitrate);
    const best = m4a[0];
    const kbps = best.bitrate > 1000 ? Math.round(best.bitrate / 1000) : best.bitrate;
    audios.push({
      quality: `M4A - AAC ${kbps > 0 ? kbps + 'kbps' : ''}`.trim(),
      url: best.url, mimeType: 'audio/mp4',
      size: best.size > 0 ? formatBytes(best.size) : 'Tamanho variável',
    });
  }

  const opus = rawAudios.filter(a => a.mimeType.includes('webm') || a.codec.includes('opus') || a.codec.includes('vorbis'));
  if (opus.length > 0) {
    opus.sort((a, b) => b.bitrate - a.bitrate);
    const best = opus[0];
    const kbps = best.bitrate > 1000 ? Math.round(best.bitrate / 1000) : best.bitrate;
    audios.push({
      quality: `WebM (Opus) ${kbps > 0 ? kbps + 'kbps' : ''}`.trim(),
      url: best.url, mimeType: 'audio/webm',
      size: best.size > 0 ? formatBytes(best.size) : 'Tamanho variável',
    });
  }

  if (audios.length === 0 && rawAudios.length > 0) {
    rawAudios.sort((a, b) => b.bitrate - a.bitrate);
    const a = rawAudios[0];
    const kbps = a.bitrate > 1000 ? Math.round(a.bitrate / 1000) : a.bitrate;
    audios.push({
      quality: `${kbps > 0 ? kbps + 'kbps' : 'Áudio'}`,
      url: a.url, mimeType: a.mimeType,
      size: a.size > 0 ? formatBytes(a.size) : 'Tamanho variável',
    });
  }

  return { videos, audios };
}

// ─── Utilities ────────────────────────────────────────────────────

function normalizeQuality(q: string, height?: number): string {
  if (q) {
    const match = q.match(/(\d{3,4})p/);
    if (match) return `${match[1]}p`;
  }
  if (height) {
    if (height >= 1080) return '1080p';
    if (height >= 720) return '720p';
    if (height >= 480) return '480p';
    if (height >= 360) return '360p';
  }
  return q?.toLowerCase() || '';
}

function extractCodec(mimeType: string): string {
  const match = mimeType.match(/codecs="?([^"]+)"?/);
  return match ? match[1] : '';
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function parseSizeString(s: string | undefined): number {
  if (!s) return 0;
  const n = parseFloat(s);
  if (isNaN(n)) return 0;
  if (s.includes('GB')) return n * 1024 * 1024 * 1024;
  if (s.includes('MB')) return n * 1024 * 1024;
  if (s.includes('KB')) return n * 1024;
  return n;
}
