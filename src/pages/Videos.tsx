import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Play, Monitor, Film, Tv, Loader2, Clipboard } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { fetchVideoInfo, type VideoResult } from "@/lib/youtube";
import VideoResults from "@/components/VideoResults";
import { toast } from "@/hooks/use-toast";
import heroMp4 from "@/assets/hero-mp4.webp";
import heroDownload from "@/assets/hero-download.jpg";

const qualities = [
  { label: "4K Ultra HD", resolution: "3840×2160", icon: Tv },
  { label: "Full HD", resolution: "1920×1080", icon: Monitor },
  { label: "HD", resolution: "1280×720", icon: Film },
];

export default function Videos() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({ title: "Erro", description: "Cole um link do YouTube", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const result = await fetchVideoInfo(url.trim(), "video");
      if (result.success) {
        setVideoResult(result);
        toast({ title: "Sucesso!", description: `"${result.title}" encontrado` });
      } else {
        toast({ title: "Erro", description: result.error || "Falha ao processar", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro", description: "Falha na conexão", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          {/* Hero */}
          <section className="relative py-16 md:py-24 px-4 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4"
                  >
                    Baixar Vídeos MP4
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground leading-relaxed mb-6"
                  >
                    Baixe qualquer vídeo do YouTube em qualidade até 4K/8K. Formatos MP4 e WebM disponíveis com ou sem áudio.
                  </motion.p>

                  {/* Quality badges */}
                  <div className="flex gap-3 mb-6">
                    {qualities.map((q) => (
                      <div key={q.label} className="glass-card rounded-xl px-4 py-3 text-center flex-1">
                        <q.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-xs font-bold text-foreground">{q.label}</p>
                        <p className="text-[10px] text-muted-foreground">{q.resolution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <img src={heroMp4} alt="Download vídeos MP4" className="rounded-2xl shadow-2xl w-full" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/60 to-transparent" />
                </motion.div>
              </div>

              {/* Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <div className="flex items-center h-16 rounded-2xl border-2 border-border/50 hover:border-primary/30 transition-premium bg-card shadow-premium">
                  <div className="pl-5 pr-2">
                    <Play className="w-5 h-5 text-primary fill-primary" />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                    placeholder="Cole o link do vídeo do YouTube..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground text-base placeholder:text-muted-foreground px-2"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="gradient-red text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold shadow-button hover:shadow-button-hover transition-premium mr-2 inline-flex items-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Baixar
                  </button>
                </div>
              </motion.div>
              <Disclaimer />
            </div>
          </section>

          <VideoResults result={videoResult} />

          {/* Info section with image */}
          {!videoResult && (
            <section className="py-16 px-4">
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <img src={heroDownload} alt="Download YouTube" className="rounded-2xl shadow-2xl w-full" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Como baixar vídeos?</h2>
                  <div className="space-y-4">
                    {["Copie o link do vídeo do YouTube", "Cole na barra acima", "Escolha a qualidade desejada", "Clique em Baixar e pronto!"].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-full gradient-red text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-muted-foreground pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <AppFooter />
        </main>
      </div>
    </div>
  );
}
