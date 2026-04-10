const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url, type } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!rapidApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'RAPIDAPI_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract video ID - strip playlist params
    const videoId = extractVideoId(url);
    if (!videoId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid YouTube URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing video: ${videoId}, type: ${type || 'video'}`);

    // Try primary API
    const result = await tryPrimaryApi(videoId, rapidApiKey);
    if (result) {
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fallback
    const fallbackResult = await tryAlternativeApi(videoId, rapidApiKey);
    if (fallbackResult) {
      return new Response(JSON.stringify(fallbackResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Não foi possível obter os formatos deste vídeo. Tente outro link.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function tryPrimaryApi(videoId: string, rapidApiKey: string) {
  try {
    const infoResponse = await fetch(
      `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}`,
      {
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com',
        },
      }
    );

    if (!infoResponse.ok) {
      console.error('Primary API error:', infoResponse.status);
      return null;
    }

    const data = await infoResponse.json();
    console.log('Primary API success');

    const rawVideos = (data.videos?.items || []).filter((v: any) => v.url);
    const rawAudios = (data.audios?.items || []).filter((a: any) => a.url);

    return {
      success: true,
      videoId,
      title: data.title || 'Unknown',
      channel: data.channel?.name || 'Unknown',
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
    console.error('Primary API exception:', error);
    return null;
  }
}

async function tryAlternativeApi(videoId: string, rapidApiKey: string) {
  try {
    console.log('Trying alternative API...');
    const response = await fetch(
      `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`,
      {
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      console.error('Alternative API error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Alternative API success');

    const allFormats = [...(data.formats || []), ...(data.adaptiveFormats || [])];
    const rawVideos = allFormats.filter((f: any) => f.mimeType?.startsWith('video/') && f.url);
    const rawAudios = allFormats.filter((f: any) => f.mimeType?.startsWith('audio/') && f.url);

    return {
      success: true,
      videoId,
      title: data.title || 'Unknown',
      channel: data.channelTitle || 'Unknown',
      duration: data.lengthSeconds || 0,
      thumbnail: data.thumbnail?.[data.thumbnail.length - 1]?.url || '',
      views: data.viewCount || '0',
      formats: filterFormats(
        rawVideos.map((v: any) => ({
          quality: v.qualityLabel || v.quality || '',
          url: v.url,
          mimeType: v.mimeType || 'video/mp4',
          size: v.contentLength ? parseInt(v.contentLength) : 0,
          hasAudio: v.hasAudio !== false,
          codec: extractCodec(v.mimeType || ''),
          bitrate: v.bitrate || 0,
        })),
        rawAudios.map((a: any) => ({
          quality: a.qualityLabel || a.quality || '',
          url: a.url,
          mimeType: a.mimeType || 'audio/mp4',
          size: a.contentLength ? parseInt(a.contentLength) : 0,
          codec: extractCodec(a.mimeType || ''),
          bitrate: a.audioBitrate || a.bitrate || 0,
        }))
      ),
    };
  } catch (error) {
    console.error('Alternative API exception:', error);
    return null;
  }
}

interface RawVideoFormat {
  quality: string;
  url: string;
  mimeType: string;
  size: number;
  hasAudio: boolean;
  codec: string;
  bitrate: number;
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

  // For each resolution, pick best H.264 (avc1) mp4
  for (const res of targetResolutions) {
    const candidates = rawVideos.filter(v => {
      const q = normalizeQuality(v.quality);
      return q === res && v.codec.includes('avc1');
    });
    if (candidates.length > 0) {
      // Pick highest bitrate
      candidates.sort((a, b) => b.bitrate - a.bitrate || b.size - a.size);
      const best = candidates[0];
      videos.push({
        quality: `${res} - MP4 (H.264)`,
        url: best.url,
        mimeType: 'video/mp4',
        size: best.size > 0 ? formatBytes(best.size) : 'Unknown',
        hasAudio: best.hasAudio,
      });
    }
  }

  // Optional: 1080p VP9 webm
  const vp9_1080 = rawVideos.filter(v => {
    const q = normalizeQuality(v.quality);
    return q === '1080p' && v.codec.includes('vp9');
  });
  if (vp9_1080.length > 0) {
    vp9_1080.sort((a, b) => b.bitrate - a.bitrate || b.size - a.size);
    const best = vp9_1080[0];
    videos.push({
      quality: '1080p - WebM (VP9)',
      url: best.url,
      mimeType: 'video/webm',
      size: best.size > 0 ? formatBytes(best.size) : 'Unknown',
      hasAudio: best.hasAudio,
    });
  }

  // If no H.264 formats found at all, fall back to any available format per resolution
  if (videos.length === 0) {
    for (const res of targetResolutions) {
      const candidates = rawVideos.filter(v => normalizeQuality(v.quality) === res);
      if (candidates.length > 0) {
        candidates.sort((a, b) => b.bitrate - a.bitrate || b.size - a.size);
        const best = candidates[0];
        const codecLabel = best.codec.includes('vp9') ? 'VP9' : best.codec.includes('av01') ? 'AV1' : best.codec.split('.')[0];
        const ext = best.mimeType.includes('webm') ? 'WebM' : 'MP4';
        videos.push({
          quality: `${res} - ${ext} (${codecLabel})`,
          url: best.url,
          mimeType: best.mimeType,
          size: best.size > 0 ? formatBytes(best.size) : 'Unknown',
          hasAudio: best.hasAudio,
        });
      }
    }
  }

  // Audio: pick best MP3/M4A
  const audios: any[] = [];

  // M4A/AAC
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
      size: best.size > 0 ? formatBytes(best.size) : 'Unknown',
    });
  }

  // MP3 or second best audio (webm/opus as "MP3 equivalent")
  const otherAudio = rawAudios.filter(a =>
    a.mimeType.includes('webm') || a.codec.includes('opus') || a.codec.includes('vorbis')
  );
  if (otherAudio.length > 0) {
    otherAudio.sort((a, b) => b.bitrate - a.bitrate);
    const best = otherAudio[0];
    const kbps = best.bitrate > 1000 ? Math.round(best.bitrate / 1000) : best.bitrate;
    audios.push({
      quality: `WebM (Opus) ${kbps > 0 ? kbps + 'kbps' : ''}`.trim(),
      url: best.url,
      mimeType: 'audio/webm',
      size: best.size > 0 ? formatBytes(best.size) : 'Unknown',
    });
  }

  // If no audio found, take whatever is available (max 2)
  if (audios.length === 0 && rawAudios.length > 0) {
    rawAudios.sort((a, b) => b.bitrate - a.bitrate);
    for (let i = 0; i < Math.min(2, rawAudios.length); i++) {
      const a = rawAudios[i];
      const kbps = a.bitrate > 1000 ? Math.round(a.bitrate / 1000) : a.bitrate;
      audios.push({
        quality: `${kbps > 0 ? kbps + 'kbps' : 'Áudio'}`,
        url: a.url,
        mimeType: a.mimeType,
        size: a.size > 0 ? formatBytes(a.size) : 'Unknown',
      });
    }
  }

  return { videos, audios };
}

function normalizeQuality(q: string): string {
  if (!q) return '';
  const match = q.match(/(\d{3,4})p/);
  if (match) return `${match[1]}p`;
  return q.toLowerCase();
}

function extractCodec(mimeType: string): string {
  const match = mimeType.match(/codecs="?([^"]+)"?/);
  return match ? match[1] : '';
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

function extractVideoId(url: string): string | null {
  // Remove playlist and other params for cleaner extraction
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
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
