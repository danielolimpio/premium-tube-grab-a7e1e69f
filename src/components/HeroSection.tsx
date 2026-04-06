import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Clipboard, Music, Smartphone, FolderOpen, Play, Loader2 } from "lucide-react";
import { fetchVideoInfo, type VideoResult } from "@/lib/youtube";
import { toast } from "@/hooks/use-toast";
import Disclaimer from "@/components/Disclaimer";
import { Download, Clipboard, Music, Smartphone, FolderOpen, Play, Loader2 } from "lucide-react";
import { fetchVideoInfo, type VideoResult } from "@/lib/youtube";
import { toast } from "@/hooks/use-toast";

interface HeroSectionProps {
  onResult: (result: VideoResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function HeroSection({ onResult, isLoading, setIsLoading }: HeroSectionProps) {
  const [url, setUrl] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      toast({ title: "Erro", description: "Não foi possível acessar a área de transferência", variant: "destructive" });
    }
  };

  const handleDownload = async (type?: string) => {
    const targetUrl = url.trim();
    if (!targetUrl) {
      toast({ title: "Erro", description: "Cole um link do YouTube primeiro", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchVideoInfo(targetUrl, type);
      if (result.success) {
        onResult(result);
        toast({ title: "Sucesso!", description: `"${result.title}" encontrado com sucesso` });
      } else {
        toast({ title: "Erro", description: result.error || "Falha ao processar o vídeo", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha na conexão com o servidor", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-6"
        >
          Baixar Vídeos do YouTube
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-12"
        >
          A plataforma premium mais avançada para download de vídeos, Shorts e áudio do YouTube. Qualidade 4K/8K sem perdas.
        </motion.p>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl mx-auto mb-6"
        >
          <div
            className={`flex items-center h-16 rounded-2xl border-2 transition-premium shadow-premium ${
              inputFocused
                ? "border-primary glow-red -translate-y-0.5"
                : "border-border/50 hover:border-primary/30"
            } bg-card`}
          >
            <div className="pl-5 pr-2 flex-shrink-0">
              <Play className="w-5 h-5 text-primary fill-primary animate-bounce-subtle" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
              placeholder="Cole o link do YouTube aqui..."
              className="flex-1 bg-transparent border-none outline-none text-foreground text-base placeholder:text-muted-foreground placeholder:italic px-2"
              disabled={isLoading}
            />
            <button
              onClick={handlePaste}
              disabled={isLoading}
              className="flex items-center gap-1.5 mr-3 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 hover:scale-105 transition-premium flex-shrink-0 disabled:opacity-50"
            >
              <Clipboard className="w-4 h-4" />
              <span className="hidden sm:inline">Colar</span>
            </button>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={isLoading ? {} : { y: -3, scale: 1.02 }}
          whileTap={isLoading ? {} : { y: -1 }}
          onClick={() => handleDownload()}
          disabled={isLoading}
          className="gradient-red text-primary-foreground px-10 py-4 rounded-2xl text-base font-bold tracking-wide uppercase shadow-button hover:shadow-button-hover transition-premium inline-flex items-center gap-3 mb-8 disabled:opacity-70"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className="w-5 h-5 animate-spin" />
              </motion.div>
            ) : (
              <motion.div key="download" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Download className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
          {isLoading ? "Processando..." : "Baixar Vídeo"}
        </motion.button>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { icon: Smartphone, label: "Shorts", type: "short" },
            { icon: Music, label: "Extrair MP3", type: "audio" },
            { icon: FolderOpen, label: "Playlist", type: "playlist" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleDownload(item.type)}
              disabled={isLoading || !url.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/50 text-muted-foreground text-sm font-medium hover:border-primary hover:text-foreground hover:bg-primary/5 transition-premium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
