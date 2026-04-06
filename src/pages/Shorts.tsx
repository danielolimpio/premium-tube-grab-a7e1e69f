import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Play, Loader2, Zap, Clock, Sparkles } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { fetchVideoInfo, type VideoResult } from "@/lib/youtube";
import VideoResults from "@/components/VideoResults";
import { toast } from "@/hooks/use-toast";
import heroShorts from "@/assets/hero-shorts.webp";
import heroVideos from "@/assets/hero-videos.jpg";

const features = [
  { icon: Zap, title: "Download Instantâneo", desc: "Shorts baixam em segundos" },
  { icon: Clock, title: "Até 60 segundos", desc: "Suporte completo ao formato vertical" },
  { icon: Sparkles, title: "Qualidade Original", desc: "Sem perda de qualidade" },
];

export default function Shorts() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({ title: "Erro", description: "Cole um link de Short", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const result = await fetchVideoInfo(url.trim(), "short");
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
          <section className="relative py-16 md:py-24 px-4 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative order-2 md:order-1"
                >
                  <img src={heroShorts} alt="YouTube Shorts" className="rounded-2xl shadow-2xl w-full" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/50 to-transparent" />
                </motion.div>

                <div className="order-1 md:order-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">
                      <Smartphone className="w-3.5 h-3.5" /> SHORTS
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4">
                      Baixar YouTube Shorts
                    </h1>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Baixe Shorts do YouTube em qualidade HD. Vídeos verticais curtos prontos para salvar no seu dispositivo.
                    </p>
                  </motion.div>

                  <div className="space-y-3">
                    {features.map((f, i) => (
                      <motion.div
                        key={f.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="glass-card rounded-xl p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                          <f.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{f.title}</p>
                          <p className="text-xs text-muted-foreground">{f.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                <div className="flex items-center h-16 rounded-2xl border-2 border-border/50 hover:border-primary/30 transition-premium bg-card shadow-premium">
                  <div className="pl-5 pr-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                    placeholder="Cole o link do Short do YouTube..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground text-base placeholder:text-muted-foreground px-2"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="gradient-red text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold shadow-button hover:shadow-button-hover transition-premium mr-2 inline-flex items-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Baixar Short
                  </button>
                </div>
              </motion.div>
              <Disclaimer />
            </div>
          </section>

          <VideoResults result={videoResult} />

          {!videoResult && (
            <section className="py-16 px-4">
              <div className="max-w-5xl mx-auto text-center">
                <img src={heroVideos} alt="YouTube Downloads" className="rounded-2xl shadow-2xl w-full max-w-2xl mx-auto mb-8" />
                <h2 className="text-2xl font-bold text-foreground mb-3">Shorts em alta qualidade</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Nosso sistema detecta automaticamente vídeos Shorts e oferece a melhor qualidade disponível para download.
                </p>
              </div>
            </section>
          )}

          <footer className="py-8 px-4 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">© 2024 baixarvideoyoutube.com — Todos os direitos reservados.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
