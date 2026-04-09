import { motion } from "framer-motion";
import {
  Info, Target, Zap, Shield, Globe, Users, Heart, CheckCircle2,
  Download, Star, Smartphone, Music, FolderOpen, Tv, Award, Rocket
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import SEOHead from "@/components/SEOHead";
import logo from "@/assets/logo.png";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <motion.div {...fadeIn} className="glass-card rounded-2xl p-6 md:p-8 border border-border/30">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </motion.div>
  );
}

const stats = [
  { icon: Download, value: "1M+", label: "Downloads realizados" },
  { icon: Users, value: "500K+", label: "Usuários ativos" },
  { icon: Globe, value: "150+", label: "Países alcançados" },
  { icon: Star, value: "4.9/5", label: "Avaliação média" },
];

const features = [
  { icon: Tv, title: "Vídeos até 8K", desc: "Download em todas as resoluções disponíveis, incluindo 4K e 8K Ultra HD" },
  { icon: Smartphone, title: "YouTube Shorts", desc: "Suporte completo para download de vídeos curtos verticais" },
  { icon: Music, title: "Extração de Áudio", desc: "Converta vídeos para MP3 com qualidade até 320kbps" },
  { icon: FolderOpen, title: "Playlists Completas", desc: "Baixe playlists inteiras com um único clique" },
  { icon: Zap, title: "Velocidade Premium", desc: "Downloads rápidos com servidores de alta performance" },
  { icon: Shield, title: "100% Seguro", desc: "Sem vírus, sem malware, sem cadastro necessário" },
];

const values = [
  { icon: Shield, title: "Segurança", desc: "Protegemos seus dados e garantimos navegação segura com criptografia de ponta" },
  { icon: Heart, title: "Acessibilidade", desc: "Ferramentas gratuitas para todos, independente de localização ou condição financeira" },
  { icon: Award, title: "Qualidade", desc: "Compromisso com a melhor experiência possível em cada download" },
  { icon: Globe, title: "Transparência", desc: "Políticas claras e comunicação aberta com nossos usuários" },
];

export default function Sobre() {
  return (
    <div className="flex min-h-screen bg-background">
      <SEOHead
        title="Sobre - Baixar Vídeo YouTube | Plataforma Gratuita"
        description="Conheça a plataforma mais avançada para download de vídeos do YouTube. Nossa missão, valores e tecnologia."
        breadcrumbs={[
          { name: "Início", url: "https://baixarvideoyoutube.com/" },
          { name: "Sobre", url: "https://baixarvideoyoutube.com/sobre" },
        ]}
      />
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <section className="relative py-12 md:py-20 px-4">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
            </div>
            <div className="relative max-w-4xl mx-auto">
              <motion.div {...fadeIn} className="text-center mb-12">
                <img src={logo} alt="Baixar Vídeo YouTube" className="w-20 h-20 rounded-2xl shadow-button mx-auto mb-6" />
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
                  <Info className="w-4 h-4" />
                  Sobre Nós
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4">
                  Sobre o Baixar Vídeo YouTube
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  A plataforma gratuita mais avançada para download de vídeos do YouTube em alta qualidade.
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div {...fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass-card rounded-2xl p-4 border border-border/30 text-center">
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-extrabold gradient-text">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              <div className="space-y-6">
                <Section icon={Target} title="Nossa Missão">
                  <p>Democratizar o acesso a conteúdo educacional e de entretenimento, oferecendo uma ferramenta gratuita, segura e de alta qualidade para download de vídeos do YouTube. Acreditamos que todos merecem acesso ao conhecimento, independentemente de sua localização geográfica ou condições de conectividade.</p>
                  <p className="mt-2">Milhões de pessoas ao redor do mundo enfrentam limitações de internet que impedem o acesso a conteúdo online. Nossa plataforma existe para preencher essa lacuna, permitindo que estudantes, profissionais e entusiastas tenham acesso offline a conteúdo valioso.</p>
                </Section>

                <Section icon={Rocket} title="O Que Oferecemos">
                  <div className="grid sm:grid-cols-2 gap-3 mt-2">
                    {features.map((f) => (
                      <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                        <f.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-foreground text-xs">{f.title}</strong>
                          <p className="text-xs mt-0.5">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={Heart} title="Nossos Valores">
                  <div className="grid sm:grid-cols-2 gap-3 mt-2">
                    {values.map((v) => (
                      <div key={v.title} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                        <v.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-foreground text-xs">{v.title}</strong>
                          <p className="text-xs mt-0.5">{v.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={Shield} title="Compromisso com a Legalidade">
                  <p>Levamos a sério o respeito aos direitos autorais e à propriedade intelectual. Nossa plataforma foi projetada para uso pessoal e educacional, e incentivamos todos os usuários a:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Respeitar os direitos dos criadores de conteúdo",
                      "Utilizar os downloads exclusivamente para fins permitidos por lei",
                      "Apoiar criadores através de meios oficiais (likes, inscrições, compartilhamentos)",
                      "Consultar nossa página de Uso Responsável para orientações detalhadas",
                      "Reportar qualquer uso indevido através dos nossos canais de contato",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={Globe} title="Tecnologia e Infraestrutura">
                  <p>Nossa plataforma utiliza tecnologia de ponta para garantir a melhor experiência possível:</p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {[
                      { title: "Servidores globais", desc: "CDN distribuída para velocidade máxima em qualquer região" },
                      { title: "Criptografia SSL/TLS", desc: "Todas as conexões são protegidas e seguras" },
                      { title: "Processamento em tempo real", desc: "Sem armazenamento de dados — processamento instantâneo" },
                      { title: "Interface responsiva", desc: "Funciona perfeitamente em desktop, tablet e smartphone" },
                    ].map((item) => (
                      <div key={item.title} className="p-3 rounded-xl bg-secondary/30">
                        <strong className="text-foreground text-xs">{item.title}</strong>
                        <p className="text-xs mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            </div>
          </section>
          <AppFooter />
        </main>
      </div>
    </div>
  );
}
