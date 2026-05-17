import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, ExternalLink, Download, Clock, Video, Music, Search, X } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import Disclaimer from "@/components/Disclaimer";
import SEOHead from "@/components/SEOHead";

export interface DownloadHistoryItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  quality: string;
  type: "video" | "audio";
  downloadedAt: string;
  videoId: string;
}

const STORAGE_KEY = "download-history";

export function addToDownloadHistory(item: Omit<DownloadHistoryItem, "id" | "downloadedAt">) {
  const history = getDownloadHistory();
  const newItem: DownloadHistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    downloadedAt: new Date().toISOString(),
  };
  history.unshift(newItem);
  // Keep max 100 items
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100)));
}

export function getDownloadHistory(): DownloadHistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function Downloads() {
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [filter, setFilter] = useState<"all" | "video" | "audio">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setHistory(getDownloadHistory());
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  const removeItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  const filtered = history
    .filter((h) => filter === "all" || h.type === filter)
    .filter((h) => !search || h.title.toLowerCase().includes(search.toLowerCase()) || h.channel.toLowerCase().includes(search.toLowerCase()));

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SEOHead
        title="Histórico de Downloads - Baixar Vídeo YouTube"
        description="Veja o histórico dos vídeos e áudios que você baixou. Dados armazenados localmente no seu navegador."
        noindex
        breadcrumbs={[
          { name: "Início", url: "https://baixarvideoyoutube.com/" },
          { name: "Downloads", url: "https://baixarvideoyoutube.com/downloads" },
        ]}
      />
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <section className="relative py-12 md:py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="relative max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
                  <History className="w-4 h-4" />
                  Histórico de Downloads
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4">
                  Seus Downloads
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Veja o histórico dos vídeos e áudios que você baixou. Os dados são armazenados localmente no seu navegador.
                </p>
              </motion.div>

              {/* Controls */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                  <label htmlFor="downloads-search" className="sr-only">Buscar no histórico de downloads</label>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="downloads-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar no histórico..."
                    aria-label="Buscar no histórico de downloads"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/50 bg-card text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-premium"
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "video", "audio"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-premium ${
                        filter === f
                          ? "gradient-red text-primary-foreground shadow-button"
                          : "border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                      }`}
                    >
                      {f === "all" ? "Todos" : f === "video" ? "Vídeos" : "Áudios"}
                    </button>
                  ))}
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      aria-label="Limpar todo o histórico de downloads"
                      className="px-4 py-3 rounded-xl text-sm font-medium border border-destructive/30 text-destructive hover:bg-destructive/10 transition-premium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* List */}
              {filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="w-20 h-20 rounded-2xl gradient-red mx-auto flex items-center justify-center mb-6 opacity-50">
                    <Download className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {history.length === 0 ? "Nenhum download ainda" : "Nenhum resultado"}
                  </h3>
                  <p className="text-muted-foreground">
                    {history.length === 0
                      ? "Seus downloads aparecerão aqui automaticamente."
                      : "Tente alterar os filtros de busca."}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {filtered.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03 }}
                        className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:border-primary/30 transition-premium"
                      >
                        <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {item.type === "video" ? <Video className="w-6 h-6 text-muted-foreground" /> : <Music className="w-6 h-6 text-muted-foreground" />}
                            </div>
                          )}
                          <div className="absolute top-1 left-1">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.type === "video" ? "bg-primary text-primary-foreground" : "bg-green-500 text-white"}`}>
                              {item.type === "video" ? "MP4" : "MP3"}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-foreground truncate">{item.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{item.channel}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(item.downloadedAt)}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{item.quality}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-premium">
                          <a
                            href={`https://youtube.com/watch?v=${item.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Abrir "${item.title}" no YouTube`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-premium"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remover "${item.title}" do histórico`}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-premium"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <Disclaimer />
            </div>
          </section>
          <AppFooter />
        </main>
      </div>
    </div>
  );
}
