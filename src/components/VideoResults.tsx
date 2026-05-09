import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Clock, Eye, Music, Video, Loader2 } from "lucide-react";
import { type VideoResult, formatDuration, formatViews, downloadFile } from "@/lib/youtube";
import { toast } from "@/hooks/use-toast";
import { addToDownloadHistory } from "@/pages/Downloads";

interface VideoResultsProps {
  result: VideoResult | null;
}

const tabs = ["Todos", "Vídeos", "Áudio"];

export default function VideoResults({ result }: VideoResultsProps) {
  const [activeTab, setActiveTab] = useState("Todos");
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);

  if (!result || !result.success) return null;

  const videos = result.formats?.videos || [];
  const audios = result.formats?.audios || [];

  const filteredVideos = activeTab === "Áudio" ? [] : videos;
  const filteredAudios = activeTab === "Vídeos" ? [] : audios;

  const handleDownload = (url: string, quality: string, isAudio: boolean) => {
    const ext = isAudio ? "mp3" : "mp4";
    const safeName = (result.title || "video").replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "_");
    const filename = `${safeName}_${quality}.${ext}`;

    setDownloadingUrl(url);
    try {
      downloadFile(url, filename);
      addToDownloadHistory({
        title: result.title || "Vídeo",
        channel: result.channel || "Desconhecido",
        thumbnail: result.thumbnail || "",
        quality,
        type: isAudio ? "audio" : "video",
        videoId: result.videoId || "",
      });
      toast({ title: "Download iniciado!", description: `${quality} - ${filename}` });
    } catch {
      toast({ title: "Erro", description: "Falha ao iniciar o download", variant: "destructive" });
    } finally {
      setTimeout(() => setDownloadingUrl(null), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="py-12 px-4"
      >
        <div className="max-w-5xl mx-auto">
          {/* Video info header */}
          <div className="glass-card rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
            {result.thumbnail && (
              <div className="relative rounded-xl overflow-hidden aspect-video shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 text-xs font-semibold rounded bg-black/90 text-foreground backdrop-blur-sm">
                  {formatDuration(result.duration || 0)}
                </span>
              </div>
            )}
            <div className="flex flex-col justify-center min-w-0">
              <h2 className="text-xl font-bold text-foreground mb-1 line-clamp-2">{result.title}</h2>
              <p className="text-sm text-muted-foreground mb-2">{result.channel}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatViews(result.views || '0')}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDuration(result.duration || 0)}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border/30">
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Formatos Disponíveis ({filteredVideos.length + filteredAudios.length})
            </h3>
            <div className="flex gap-1 p-1 rounded-xl bg-secondary/50">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-premium ${
                    activeTab === tab
                      ? "gradient-red text-primary-foreground shadow-[0_4px_12px_rgba(255,0,0,0.3)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Video formats */}
          {filteredVideos.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Video className="w-4 h-4" /> Vídeo
              </h4>
              <div className="space-y-2">
                {filteredVideos.map((format, i) => (
                  <motion.div
                    key={`video-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 hover:border-primary/30 transition-premium group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-primary/15 text-primary">
                        {format.quality}
                      </span>
                      <span className="text-xs text-muted-foreground">{format.mimeType}</span>
                      <span className="text-xs text-muted-foreground">{format.size}</span>
                      {format.hasAudio ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-medium">+áudio</span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 font-medium" title="Vídeo sem áudio (formato adaptativo). Para áudio embutido, escolha 720p ou inferior.">sem áudio</span>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownload(format.url, format.quality, false)}
                      disabled={downloadingUrl === format.url}
                      className="gradient-red text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold shadow-button hover:shadow-button-hover transition-premium inline-flex items-center gap-1.5 flex-shrink-0 disabled:opacity-70"
                    >
                      {downloadingUrl === format.url ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      Baixar
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Audio formats */}
          {filteredAudios.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Music className="w-4 h-4" /> Áudio / MP3
              </h4>
              <div className="space-y-2">
                {filteredAudios.map((format, i) => (
                  <motion.div
                    key={`audio-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 hover:border-primary/30 transition-premium group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-primary/15 text-primary">
                        {format.quality}
                      </span>
                      <span className="text-xs text-muted-foreground">{format.mimeType}</span>
                      <span className="text-xs text-muted-foreground">{format.size}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownload(format.url, format.quality, true)}
                      disabled={downloadingUrl === format.url}
                      className="gradient-red text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold shadow-button hover:shadow-button-hover transition-premium inline-flex items-center gap-1.5 flex-shrink-0 disabled:opacity-70"
                    >
                      {downloadingUrl === format.url ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      Baixar MP3
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {filteredVideos.length === 0 && filteredAudios.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum formato disponível para esta categoria.
            </div>
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
