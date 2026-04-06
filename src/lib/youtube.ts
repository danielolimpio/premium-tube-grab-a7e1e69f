import { supabase } from "@/integrations/supabase/client";

export interface VideoFormat {
  quality: string;
  url: string;
  mimeType: string;
  size: string;
  hasAudio?: boolean;
}

export interface VideoResult {
  success: boolean;
  error?: string;
  videoId?: string;
  title?: string;
  channel?: string;
  duration?: number;
  thumbnail?: string;
  views?: string;
  formats?: {
    videos: VideoFormat[];
    audios: VideoFormat[];
  };
}

export async function fetchVideoInfo(url: string, type?: string): Promise<VideoResult> {
  const { data, error } = await supabase.functions.invoke('youtube-download', {
    body: { url, type },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data as VideoResult;
}

export function formatDuration(seconds: number): string {
  if (!seconds) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatViews(views: string | number): string {
  const n = typeof views === 'string' ? parseInt(views) : views;
  if (isNaN(n)) return '0 views';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

export function downloadFile(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
