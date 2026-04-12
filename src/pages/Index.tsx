import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import VideoResults from "@/components/VideoResults";
import SEOHead from "@/components/SEOHead";
import { type VideoResult } from "@/lib/youtube";
import heroVideos from "@/assets/hero-videos.jpg";
import heroDownload from "@/assets/hero-download.jpg";
import ytIcon from "@/assets/yt-icon.png";

const homeFaq = [
  { question: "Como baixar vídeos do YouTube grátis?", answer: "Basta copiar o link do vídeo do YouTube, colar na barra de pesquisa do nosso site e clicar em 'Baixar Vídeo'. Em segundos, você verá as opções de qualidade disponíveis para download. Todo o processo é 100% gratuito e sem necessidade de cadastro." },
  { question: "Como converter vídeo do YouTube para MP3?", answer: "Cole o link do vídeo do YouTube no nosso site e clique em 'Baixar'. Na lista de formatos, selecione a opção 'MP3' com a qualidade desejada (128kbps, 192kbps ou 320kbps). O áudio será extraído automaticamente do vídeo." },
  { question: "Funciona no celular Android e iPhone?", answer: "Sim! Nossa plataforma é totalmente responsiva e funciona perfeitamente em qualquer navegador em Android e iOS. Não é necessário instalar nenhum aplicativo." },
  { question: "O site é seguro para usar?", answer: "Sim, absolutamente seguro. Utilizamos conexão criptografada SSL/TLS (HTTPS), não armazenamos dados pessoais e não exigimos cadastro." },
  { question: "Posso baixar vídeos em 4K e 8K?", answer: "Sim! Se o vídeo original estiver disponível em 4K (2160p) ou 8K (4320p), essas opções aparecerão na lista de formatos para download." },
];

const Index = () => {
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <SEOHead
        title="Baixar Vídeo YouTube - Download 4K/8K Grátis | MP4, MP3"
        description="Baixe vídeos do YouTube em 4K, 8K, MP3 e muito mais. Plataforma premium, rápida e segura para download de vídeos, Shorts e áudio. 100% grátis."
        breadcrumbs={[{ name: "Início", url: "https://baixarvideoyoutube.com/" }]}
        faqItems={homeFaq}
      />
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <HeroSection
            onResult={setVideoResult}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <VideoResults result={videoResult} />

          {!videoResult && (
            <>
              {/* Banner section */}
              <section className="py-12 px-4">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl group"
                  >
                    <img src={heroVideos} alt="Download de vídeos" className="w-full h-56 object-cover group-hover:scale-105 transition-premium" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-bold text-foreground">Download Rápido</h3>
                      <p className="text-xs text-muted-foreground">Baixe vídeos em segundos com qualidade premium</p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl group"
                  >
                    <img src={heroDownload} alt="YouTube Download" className="w-full h-56 object-cover group-hover:scale-105 transition-premium" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-bold text-foreground">Qualidade 4K/8K</h3>
                      <p className="text-xs text-muted-foreground">Resolução máxima sem compressão</p>
                    </div>
                  </motion.div>
                </div>
              </section>

              <FeaturesGrid />

              {/* Supported formats */}
              <section className="py-12 px-4">
                <div className="max-w-3xl mx-auto text-center">
                  <img src={ytIcon} alt="YouTube" className="w-20 h-20 mx-auto mb-4 drop-shadow-2xl" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Todos os formatos suportados</h2>
                  <p className="text-muted-foreground text-sm mb-6">MP4, WebM, MP3, M4A — Vídeos, Shorts, Playlists e Canais</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["MP4", "WebM", "MP3", "M4A", "4K", "1080p", "720p", "Shorts", "Playlist"].map((tag) => (
                      <span key={tag} className="px-4 py-2 rounded-xl glass-card text-sm font-medium text-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          <AppFooter />
        </main>
      </div>
    </div>
  );
};

export default Index;
