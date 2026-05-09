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
      return jsonResponse({ success: false, error: 'URL é obrigatória' }, 400);
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return jsonResponse({ success: false, error: 'URL do YouTube inválida' }, 400);
    }

    console.log(`Processing video: ${videoId}`);

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    if (!rapidApiKey) {
      return jsonResponse({ success: false, error: 'API key não configurada' }, 500);
    }

    // Try multiple providers in order of reliability
    const providers = [
      { name: 'social-download', fn: () => trySocialDownload(videoId, rapidApiKey) },
      { name: 'ytstream', fn: () => tryYtStream(videoId, rapidApiKey) },
      { name: 'youtube-media-downloader', fn: () => tryYoutubeMediaDownloader(videoId, rapidApiKey) },
    ];

    for (const provider of providers) {
      try {
        console.log(`Trying provider: ${provider.name}`);
        const result = await provider.fn();
        if (result && result.formats.videos.length > 0) {
          console.log(`${provider.name} succeeded: ${result.formats.videos.length}V + ${result.formats.audios.length}A`);
          return jsonResponse(result);
        }
        console.log(`${provider.name}: no usable formats`);
      } catch (e) {
        console.error(`${provider.name} error:`, e);
      }
    }

    return jsonResponse({
      success: false,
      error: 'Não foi possível obter os formatos deste vídeo. O serviço pode estar temporariamente indisponível. Tente novamente em alguns minutos.',
    }, 502);
  } catch (error) {
    console.error('Error:', error);
    return jsonResponse({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ─── Provider 1: Social Download All In One ───────────────────────

async function trySocialDownload(videoId: string, apiKey: string) {
  const resp = await fetch(
    `https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}`,
    {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com',
      },
    }
  );

  if (!resp.ok) {
    console.error(`social-download returned ${resp.status}`);
    const text = await resp.text();
    console.error('Body:', text.substring(0, 300));
    return null;
  }

  const data = await resp.json();
  console.log(`social-download response keys: ${Object.keys(data).join(', ')}`);

  // This API returns medias array with different qualities
  const medias = data.medias || [];
  if (medias.length === 0) return null;

  const rawVideos = medias
    .filter((m: any) => m.videoAvailable && m.url)
    .map((m: any) => ({
      quality: m.quality || '',
      url: m.url,
      mimeType: m.extension === 'webm' ? 'video/webm' : 'video/mp4',
      size: m.formattedSize ? parseSizeString(m.formattedSize) : 0,
      hasAudio: m.audioAvailable !== false,
      codec: m.extension === 'webm' ? 'vp9' : 'avc1',
      bitrate: m.bitrate || 0,
      height: m.height || 0,
    }));

  const rawAudios = medias
    .filter((m: any) => m.audioAvailable && !m.videoAvailable && m.url)
    .map((m: any) => ({
      quality: m.quality || '',
      url: m.url,
      mimeType: m.extension === 'webm' ? 'audio/webm' : 'audio/mp4',
      size: m.formattedSize ? parseSizeString(m.formattedSize) : 0,
      codec: m.extension === 'webm' ? 'opus' : 'mp4a',
      bitrate: m.bitrate || 0,
    }));

  if (rawVideos.length === 0 && rawAudios.length === 0) return null;

  return {
    success: true,
    videoId,
    title: data.title || 'Sem título',
    channel: data.author || data.source || 'Desconhecido',
    duration: data.duration || 0,
    thumbnail: data.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    views: data.views || '0',
    formats: filterFormats(rawVideos, rawAudios),
  };
}

// ─── Provider 2: YTStream ─────────────────────────────────────────

async function tryYtStream(videoId: string, apiKey: string) {
  const resp = await fetch(
    `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`,
    {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com',
      },
    }
  );

  if (!resp.ok) {
    console.error(`ytstream returned ${resp.status}`);
    const text = await resp.text();
    console.error('Body:', text.substring(0, 300));
    return null;
  }

  const data = await resp.json();
  const allFormats = [...(data.formats || []), ...(data.adaptiveFormats || [])];

  const rawVideos = allFormats
    .filter((f: any) => f.mimeType?.startsWith('video/') && f.url)
    .map((v: any) => ({
      quality: v.qualityLabel || v.quality || '',
      url: v.url,
      mimeType: v.mimeType || 'video/mp4',
      size: v.contentLength ? parseInt(v.contentLength) : 0,
      hasAudio: v.hasAudio !== false,
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
      bitrate: a.audioBitrate || a.bitrate || 0,
    }));

  if (rawVideos.length === 0 && rawAudios.length === 0) return null;

  return {
    success: true,
    videoId,
    title: data.title || 'Sem título',
    channel: data.channelTitle || 'Desconhecido',
    duration: data.lengthSeconds || 0,
    thumbnail: data.thumbnail?.[data.thumbnail.length - 1]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    views: data.viewCount || '0',
    formats: filterFormats(rawVideos, rawAudios),
  };
}

// ─── Provider 3: YouTube Media Downloader ─────────────────────────

async function tryYoutubeMediaDownloader(videoId: string, apiKey: string) {
  const resp = await fetch(
    `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}`,
    {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com',
      },
    }
  );

  if (!resp.ok) {
    console.error(`youtube-media-downloader returned ${resp.status}`);
    const text = await resp.text();
    console.error('Body:', text.substring(0, 300));
    return null;
  }

  const data = await resp.json();
  const rawVideos = (data.videos?.items || []).filter((v: any) => v.url);
  const rawAudios = (data.audios?.items || []).filter((a: any) => a.url);

  if (rawVideos.length === 0 && rawAudios.length === 0) return null;

  return {
    success: true,
    videoId,
    title: data.title || 'Sem título',
    channel: data.channel?.name || 'Desconhecido',
    duration: data.lengthSeconds || 0,
    thumbnail: data.thumbnails?.[data.thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
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
      // Prefer formats WITH audio (progressive) over adaptive video-only
      candidates.sort((a, b) => {
        if (a.hasAudio !== b.hasAudio) return a.hasAudio ? -1 : 1;
        return b.bitrate - a.bitrate || b.size - a.size;
      });
      const best = candidates[0];
      const audioLabel = best.hasAudio ? '' : ' (sem áudio)';
      videos.push({
        quality: `${res} - MP4 (H.264)${audioLabel}`,
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

  // Fallback: any codec per resolution (prefer with audio)
  if (videos.length === 0) {
    for (const res of targetResolutions) {
      const candidates = rawVideos.filter(v => normalizeQuality(v.quality, v.height) === res);
      if (candidates.length > 0) {
        candidates.sort((a, b) => {
          if (a.hasAudio !== b.hasAudio) return a.hasAudio ? -1 : 1;
          return b.bitrate - a.bitrate || b.size - a.size;
        });
        const best = candidates[0];
        const codecLabel = best.codec.includes('vp9') ? 'VP9' : best.codec.includes('av01') ? 'AV1' : best.codec.includes('avc1') ? 'H.264' : best.codec.split('.')[0] || 'MP4';
        const ext = best.mimeType.includes('webm') ? 'WebM' : 'MP4';
        const audioLabel = best.hasAudio ? '' : ' (sem áudio)';
        videos.push({
          quality: `${res} - ${ext} (${codecLabel})${audioLabel}`,
          url: best.url,
          mimeType: best.mimeType,
          size: best.size > 0 ? formatBytes(best.size) : 'Tamanho variável',
          hasAudio: best.hasAudio,
        });
      }
    }
  }

  // If still no videos, take whatever raw formats we have (up to 5, prefer with audio)
  if (videos.length === 0 && rawVideos.length > 0) {
    rawVideos.sort((a, b) => {
      if (a.hasAudio !== b.hasAudio) return a.hasAudio ? -1 : 1;
      return b.height - a.height || b.bitrate - a.bitrate;
    });
    for (let i = 0; i < Math.min(5, rawVideos.length); i++) {
      const v = rawVideos[i];
      const q = v.quality || (v.height ? `${v.height}p` : 'Vídeo');
      const audioLabel = v.hasAudio ? '' : ' (sem áudio)';
      videos.push({
        quality: `${q}${audioLabel}`,
        url: v.url,
        mimeType: v.mimeType,
        size: v.size > 0 ? formatBytes(v.size) : 'Tamanho variável',
        hasAudio: v.hasAudio,
      });
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
