import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Music, Headphones, Volume2, Loader2, Disc3 } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { fetchVideoInfo, type VideoResult } from "@/lib/youtube";
import VideoResults from "@/components/VideoResults";
import { toast } from "@/hooks/use-toast";
import heroAudio from "@/assets/hero-audio.png";
import ytIcon from "@/assets/yt-icon.png";

const audioQualities = [
  { bitrate: "320kbps", label: "Ultra HD", desc: "Máxima qualidade" },
  { bitrate: "256kbps", label: "Alta", desc: "Qualidade excelente" },
  { bitrate: "128kbps", label: "Normal", desc: "Bom para streaming" },
];

export default function Audio() {
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
      const result = await fetchVideoInfo(url.trim(), "audio");
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
              <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
                <div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">
                      <Music className="w-3.5 h-3.5" /> ÁUDIO / MP3
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4">
                      Extrair Áudio MP3
                    </h1>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Converta qualquer vídeo do YouTube em arquivo MP3 de alta qualidade. Até 320kbps sem perda de qualidade.
                    </p>
                  </motion.div>

                  {/* Audio quality cards */}
                  <div className="space-y-3">
                    {audioQualities.map((q, i) => (
                      <motion.div
                        key={q.bitrate}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="glass-card rounded-xl p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                            {i === 0 ? <Headphones className="w-5 h-5 text-primary" /> :
                             i === 1 ? <Volume2 className="w-5 h-5 text-primary" /> :
                             <Disc3 className="w-5 h-5 text-primary" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{q.label}</p>
                            <p className="text-xs text-muted-foreground">{q.desc}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-primary/15 text-primary text-xs font-bold">{q.bitrate}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <img src={heroAudio} alt="Extrair áudio MP3" className="rounded-2xl shadow-2xl w-full" />
                </motion.div>
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
                    <Music className="w-5 h-5 text-primary" />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                    placeholder="Cole o link para extrair o áudio..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground text-base placeholder:text-muted-foreground px-2"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="gradient-red text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold shadow-button hover:shadow-button-hover transition-premium mr-2 inline-flex items-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Extrair MP3
                  </button>
                </div>
              </motion.div>
              <Disclaimer />
            </div>
          </section>

          <VideoResults result={videoResult} />

          {!videoResult && (
            <section className="py-16 px-4">
              <div className="max-w-3xl mx-auto text-center">
                <img src={ytIcon} alt="YouTube Audio" className="w-32 h-32 mx-auto mb-6 drop-shadow-2xl" />
                <h2 className="text-2xl font-bold text-foreground mb-3">YouTube para MP3</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Extraia o áudio de qualquer vídeo do YouTube e salve como arquivo MP3. Perfeito para músicas, podcasts e audiobooks.
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
