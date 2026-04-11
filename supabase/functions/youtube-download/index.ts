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

    // Try multiple Innertube clients for maximum compatibility
    const clients = [
      { name: 'IOS', fn: () => fetchIOS(videoId) },
      { name: 'ANDROID', fn: () => fetchAndroid(videoId) },
      { name: 'WEB', fn: () => fetchWeb(videoId) },
    ];

    for (const client of clients) {
      try {
        console.log(`Trying ${client.name} client...`);
        const result = await client.fn();
        if (result && result.formats.videos.length > 0) {
          console.log(`${client.name} client succeeded with ${result.formats.videos.length} videos, ${result.formats.audios.length} audios`);
          return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        console.log(`${client.name} client returned no usable formats`);
      } catch (e) {
        console.error(`${client.name} client failed:`, e);
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

// ─── Innertube Clients ────────────────────────────────────────────

async function fetchIOS(videoId: string) {
  const body = {
    videoId,
    context: {
      client: {
        clientName: 'IOS',
        clientVersion: '19.29.1',
        deviceMake: 'Apple',
        deviceModel: 'iPhone16,2',
        hl: 'en',
        gl: 'US',
        userAgent: 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
      },
    },
    playbackContext: {
      contentPlaybackContext: {
        html5Preference: 'HTML5_PREF_WANTS',
        signatureTimestamp: 20073,
      },
    },
    contentCheckOk: true,
    racyCheckOk: true,
  };

  const resp = await fetch(
    'https://www.youtube.com/youtubei/v1/player?key=AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc&prettyPrint=false',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
        'X-Goog-Api-Format-Version': '2',
      },
      body: JSON.stringify(body),
    }
  );

  if (!resp.ok) {
    console.error(`IOS player API returned ${resp.status}`);
    const text = await resp.text();
    console.error('Response:', text.substring(0, 500));
    return null;
  }

  const data = await resp.json();
  return parseInnertubeResponse(videoId, data);
}

async function fetchAndroid(videoId: string) {
  const body = {
    videoId,
    context: {
      client: {
        clientName: 'ANDROID',
        clientVersion: '19.30.36',
        androidSdkVersion: 34,
        hl: 'en',
        gl: 'US',
        userAgent: 'com.google.android.youtube/19.30.36 (Linux; U; Android 14; en_US) gzip',
      },
    },
    playbackContext: {
      contentPlaybackContext: {
        html5Preference: 'HTML5_PREF_WANTS',
        signatureTimestamp: 20073,
      },
    },
    contentCheckOk: true,
    racyCheckOk: true,
  };

  const resp = await fetch(
    'https://www.youtube.com/youtubei/v1/player?key=AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w&prettyPrint=false',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'com.google.android.youtube/19.30.36 (Linux; U; Android 14; en_US) gzip',
        'X-Goog-Api-Format-Version': '2',
      },
      body: JSON.stringify(body),
    }
  );

  if (!resp.ok) {
    console.error(`ANDROID player API returned ${resp.status}`);
    const text = await resp.text();
    console.error('Response:', text.substring(0, 500));
    return null;
  }

  const data = await resp.json();
  return parseInnertubeResponse(videoId, data);
}

async function fetchWeb(videoId: string) {
  // First get the page to extract sts (signature timestamp)
  const body = {
    videoId,
    context: {
      client: {
        clientName: 'WEB',
        clientVersion: '2.20250101.00.00',
        hl: 'en',
        gl: 'US',
      },
    },
    playbackContext: {
      contentPlaybackContext: {
        html5Preference: 'HTML5_PREF_WANTS',
        signatureTimestamp: 20073,
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
        'X-Goog-Api-Format-Version': '2',
        'Origin': 'https://www.youtube.com',
        'Referer': 'https://www.youtube.com/',
      },
      body: JSON.stringify(body),
    }
  );

  if (!resp.ok) {
    console.error(`WEB player API returned ${resp.status}`);
    const text = await resp.text();
    console.error('Response:', text.substring(0, 500));
    return null;
  }

  const data = await resp.json();
  return parseInnertubeResponse(videoId, data);
}

// ─── Parse Innertube Response ─────────────────────────────────────

function parseInnertubeResponse(videoId: string, data: any) {
  const details = data.videoDetails;
  const streaming = data.streamingData;

  if (!streaming) {
    console.error('No streamingData in response. Status:', data.playabilityStatus?.status, data.playabilityStatus?.reason);
    return null;
  }

  const allFormats = [...(streaming.formats || []), ...(streaming.adaptiveFormats || [])];

  if (allFormats.length === 0) {
    console.error('Empty formats array');
    return null;
  }

  console.log(`Got ${allFormats.length} raw formats`);

  const rawVideos = allFormats
    .filter((f: any) => f.mimeType?.startsWith('video/') && (f.url || f.signatureCipher))
    .map((v: any) => ({
      quality: v.qualityLabel || v.quality || '',
      url: v.url || '', // signatureCipher URLs need decryption, skip them
      mimeType: v.mimeType || 'video/mp4',
      size: v.contentLength ? parseInt(v.contentLength) : 0,
      hasAudio: !!(v.audioQuality || v.audioChannels),
      codec: extractCodec(v.mimeType || ''),
      bitrate: v.bitrate || 0,
      width: v.width || 0,
      height: v.height || 0,
    }))
    .filter((v: any) => v.url); // Only keep formats with direct URLs

  const rawAudios = allFormats
    .filter((f: any) => f.mimeType?.startsWith('audio/') && (f.url || f.signatureCipher))
    .map((a: any) => ({
      quality: a.qualityLabel || a.quality || '',
      url: a.url || '',
      mimeType: a.mimeType || 'audio/mp4',
      size: a.contentLength ? parseInt(a.contentLength) : 0,
      codec: extractCodec(a.mimeType || ''),
      bitrate: a.bitrate || 0,
    }))
    .filter((a: any) => a.url);

  console.log(`Filtered: ${rawVideos.length} videos, ${rawAudios.length} audios with direct URLs`);

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
  quality: string;
  url: string;
  mimeType: string;
  size: number;
  hasAudio: boolean;
  codec: string;
  bitrate: number;
  width: number;
  height: number;
}

interface RawAudioFormat {
  quality: string;
  url: string;
  mimeType: string;
  size: number;
  codec: string;
  bitrate: number;
}

function filterFormats(rawVideos: RawVideoFormat[], rawAudios: RawAudioFormat[]) {
  const videos: any[] = [];
  const targetResolutions = ['1080p', '720p', '480p', '360p'];

  // For each resolution pick best H.264 (avc1) mp4
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

  // Optional: 1080p VP9 webm
  const vp9_1080 = rawVideos.filter(v => {
    const q = normalizeQuality(v.quality, v.height);
    return q === '1080p' && v.codec.includes('vp9');
  });
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

  // Fallback: if no H.264, use any codec per resolution
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

  // Audio: M4A/AAC
  const audios: any[] = [];
  const m4aCandidates = rawAudios.filter(a =>
    a.mimeType.includes('mp4') || a.mimeType.includes('m4a') || a.codec.includes('mp4a')
  );
  if (m4aCandidates.length > 0) {
    m4aCandidates.sort((a, b) => b.bitrate - a.bitrate);
    const best = m4aCandidates[0];
    const kbps = best.bitrate > 1000 ? Math.round(best.bitrate / 1000) : best.bitrate;
    audios.push({
      quality: `M4A - AAC ${kbps > 0 ? kbps + 'kbps' : ''}`.trim(),
      url: best.url,
      mimeType: 'audio/mp4',
      size: best.size > 0 ? formatBytes(best.size) : 'Tamanho variável',
    });
  }

  // WebM/Opus
  const opusCandidates = rawAudios.filter(a =>
    a.mimeType.includes('webm') || a.codec.includes('opus') || a.codec.includes('vorbis')
  );
  if (opusCandidates.length > 0) {
    opusCandidates.sort((a, b) => b.bitrate - a.bitrate);
    const best = opusCandidates[0];
    const kbps = best.bitrate > 1000 ? Math.round(best.bitrate / 1000) : best.bitrate;
    audios.push({
      quality: `WebM (Opus) ${kbps > 0 ? kbps + 'kbps' : ''}`.trim(),
      url: best.url,
      mimeType: 'audio/webm',
      size: best.size > 0 ? formatBytes(best.size) : 'Tamanho variável',
    });
  }

  // Fallback audio
  if (audios.length === 0 && rawAudios.length > 0) {
    rawAudios.sort((a, b) => b.bitrate - a.bitrate);
    const a = rawAudios[0];
    const kbps = a.bitrate > 1000 ? Math.round(a.bitrate / 1000) : a.bitrate;
    audios.push({
      quality: `${kbps > 0 ? kbps + 'kbps' : 'Áudio'}`,
      url: a.url,
      mimeType: a.mimeType,
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
  // Fallback: use height
  if (height) {
    if (height >= 1080) return '1080p';
    if (height >= 720) return '720p';
    if (height >= 480) return '480p';
    if (height >= 360) return '360p';
    if (height >= 240) return '240p';
    if (height >= 144) return '144p';
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
