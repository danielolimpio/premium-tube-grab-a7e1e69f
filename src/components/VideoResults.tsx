import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Play, Clock, Eye } from "lucide-react";

const tabs = ["Todos", "Vídeos", "Shorts", "Áudio", "Playlists"];

const mockVideos = [
  {
    title: "Como Criar Aplicações Web Modernas em 2024",
    channel: "Dev Master BR",
    views: "1.2M views",
    duration: "14:32",
    quality: "4K",
    type: "Vídeo",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop",
  },
  {
    title: "Tutorial Completo de React com TypeScript",
    channel: "Code Academy PT",
    views: "856K views",
    duration: "45:18",
    quality: "1080p",
    type: "Vídeo",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
  },
  {
    title: "Top 10 Dicas de Produtividade para Devs",
    channel: "Tech Tips Brasil",
    views: "2.3M views",
    duration: "0:58",
    quality: "1080p",
    type: "Short",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop",
  },
];

export default function VideoResults() {
  const [activeTab, setActiveTab] = useState("Todos");

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-border/30">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Resultados do Download</h2>
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

        {/* Cards */}
        <div className="space-y-4">
          {mockVideos.map((video, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
              className="glass-card rounded-2xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-[280px_1fr_auto] gap-4 md:gap-6 transition-premium hover:border-primary/30 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] group"
            >
              {/* Thumbnail */}
              <div className="relative rounded-xl overflow-hidden aspect-video shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-premium" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-premium">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary-foreground fill-current" />
                  </div>
                </div>
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-black/90 text-foreground backdrop-blur-sm">
                    {video.quality}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md gradient-red text-primary-foreground uppercase">
                    {video.type}
                  </span>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 text-xs font-semibold rounded bg-black/90 text-foreground backdrop-blur-sm">
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1 truncate">{video.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{video.channel}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{video.views}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{video.duration}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col items-center gap-2 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="gradient-red text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold shadow-button hover:shadow-button-hover transition-premium inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar
                </motion.button>
                <select className="bg-secondary text-foreground text-xs rounded-lg px-3 py-2 border border-border/50 outline-none">
                  <option>4K (2160p)</option>
                  <option>1080p</option>
                  <option>720p</option>
                  <option>MP3 320kbps</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
