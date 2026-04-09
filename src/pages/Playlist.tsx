import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FolderOpen, ListVideo, Play, Loader2, CheckCircle2 } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import SEOHead from "@/components/SEOHead";
import { fetchVideoInfo, type VideoResult } from "@/lib/youtube";
import VideoResults from "@/components/VideoResults";
import { toast } from "@/hooks/use-toast";
import heroTop from "@/assets/hero-top.webp";
import heroIntro from "@/assets/hero-intro.png";

const steps = [
  "Abra a playlist no YouTube",
  "Copie o link da playlist",
  "Cole aqui e clique em Baixar",
  "Todos os vídeos serão processados",
];

export default function Playlist() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({ title: "Erro", description: "Cole um link de playlist", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const result = await fetchVideoInfo(url.trim(), "playlist");
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
      <SEOHead
        title="Baixar Playlist YouTube - Download Completo Grátis"
        description="Baixe playlists inteiras do YouTube de uma vez. Selecione qualidade e formato para todos os vídeos. 100% gratuito."
        breadcrumbs={[
          { name: "Início", url: "https://baixarvideoyoutube.com/" },
          { name: "Playlist", url: "https://baixarvideoyoutube.com/playlist" },
        ]}
      />
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <section className="relative py-16 md:py-24 px-4 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <img src={heroTop} alt="Download Playlists" className="rounded-2xl shadow-2xl w-full" />
                </motion.div>

                <div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">
                      <ListVideo className="w-3.5 h-3.5" /> PLAYLIST
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4">
                      Baixar Playlists
                    </h1>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Baixe playlists inteiras do YouTube de uma vez. Selecione a qualidade e formato para todos os vídeos.
                    </p>
                  </motion.div>

                  <div className="space-y-3">
                    {steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <span className="w-8 h-8 rounded-full gradient-red text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm text-muted-foreground">{step}</p>
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
                    <FolderOpen className="w-5 h-5 text-primary" />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                    placeholder="Cole o link da playlist do YouTube..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground text-base placeholder:text-muted-foreground px-2"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="gradient-red text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold shadow-button hover:shadow-button-hover transition-premium mr-2 inline-flex items-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Baixar Playlist
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
                <img src={heroIntro} alt="YouTube Playlist" className="rounded-2xl shadow-2xl w-full max-w-3xl mx-auto mb-8" />
                <h2 className="text-2xl font-bold text-foreground mb-3">Download em massa</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Baixe todos os vídeos de uma playlist automaticamente. Ideal para cursos, séries e coleções de vídeos.
                </p>
              </div>
            </section>
          )}

          <AppFooter />
        </main>
      </div>
    </div>
  );
}
