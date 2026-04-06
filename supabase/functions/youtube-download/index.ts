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

    // Extract video ID from various YouTube URL formats
    const videoId = extractVideoId(url);
    if (!videoId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid YouTube URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing video: ${videoId}, type: ${type || 'video'}`);

    // Step 1: Get video info
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
      const errorText = await infoResponse.text();
      console.error('Info API error:', infoResponse.status, errorText);
      
      // Fallback to alternative API
      return await tryAlternativeApi(videoId, type, rapidApiKey, corsHeaders);
    }

    const infoData = await infoResponse.json();
    console.log('Video info retrieved successfully');

    // Build response with available formats
    const result = {
      success: true,
      videoId,
      title: infoData.title || 'Unknown',
      channel: infoData.channel?.name || 'Unknown',
      duration: infoData.lengthSeconds || 0,
      thumbnail: infoData.thumbnails?.[infoData.thumbnails.length - 1]?.url || '',
      views: infoData.viewCount || '0',
      formats: {
        videos: (infoData.videos?.items || []).filter((v: any) => v.url).map((v: any) => ({
          quality: v.quality || v.qualityLabel || 'Unknown',
          url: v.url,
          mimeType: v.mimeType || 'video/mp4',
          size: typeof v.size === 'number' ? formatBytes(v.size) : (v.size || 'Unknown'),
          hasAudio: v.hasAudio !== false,
        })),
        audios: (infoData.audios?.items || []).filter((a: any) => a.url).map((a: any) => ({
          quality: a.bitrate ? `${Math.round(a.bitrate / 1000)}kbps` : (a.quality || 'Unknown'),
          url: a.url,
          mimeType: a.mimeType || 'audio/mp4',
          size: typeof a.size === 'number' ? formatBytes(a.size) : (a.size || 'Unknown'),
        })),
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function tryAlternativeApi(videoId: string, type: string | undefined, rapidApiKey: string, corsHeaders: Record<string, string>) {
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
      const errorText = await response.text();
      console.error('Alternative API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `API error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Alternative API success');

    const result = {
      success: true,
      videoId,
      title: data.title || 'Unknown',
      channel: data.channelTitle || 'Unknown',
      duration: data.lengthSeconds || 0,
      thumbnail: data.thumbnail?.[data.thumbnail.length - 1]?.url || '',
      views: data.viewCount || '0',
      formats: {
        videos: (data.formats || [])
          .filter((f: any) => f.mimeType?.startsWith('video/'))
          .map((v: any) => ({
            quality: v.qualityLabel || v.quality || 'Unknown',
            url: v.url,
            mimeType: v.mimeType || 'video/mp4',
            size: v.contentLength ? formatBytes(parseInt(v.contentLength)) : 'Unknown',
            hasAudio: v.hasAudio !== false,
          })),
        audios: (data.adaptiveFormats || data.formats || [])
          .filter((f: any) => f.mimeType?.startsWith('audio/'))
          .map((a: any) => ({
            quality: a.audioBitrate ? `${a.audioBitrate}kbps` : 'Unknown',
            url: a.url,
            mimeType: a.mimeType || 'audio/mp4',
            size: a.contentLength ? formatBytes(parseInt(a.contentLength)) : 'Unknown',
          })),
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Alternative API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'All download APIs failed' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

function extractVideoId(url: string): string | null {
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
