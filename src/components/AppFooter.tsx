import { Link } from "react-router-dom";
import { Play, Shield, FileText, Cookie, Scale, Mail, Info, BookOpen, HelpCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const legalLinks = [
  { label: "Política de Privacidade", path: "/privacidade", icon: Shield },
  { label: "Termos de Uso", path: "/termos", icon: FileText },
  { label: "Política de Cookies", path: "/cookies", icon: Cookie },
  { label: "DMCA", path: "/dmca", icon: Scale },
];

const siteLinks = [
  { label: "Sobre", path: "/sobre", icon: Info },
  { label: "Contato", path: "/contato", icon: Mail },
  { label: "Uso Responsável", path: "/uso-responsavel", icon: BookOpen },
  { label: "FAQ", path: "/faq", icon: HelpCircle },
];

const toolLinks = [
  { label: "Vídeos", path: "/videos" },
  { label: "Shorts", path: "/shorts" },
  { label: "Áudio/MP3", path: "/audio" },
  { label: "Playlists", path: "/playlist" },
  { label: "Canais", path: "/canais" },
  { label: "Downloads", path: "/downloads" },
];

export default function AppFooter() {
  return (
    <footer className="border-t border-border/30 bg-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Baixar Vídeo YouTube" className="w-10 h-10 rounded-xl shadow-button" />
              <div>
                <h3 className="text-sm font-bold text-foreground">Baixar Vídeo YouTube</h3>
                <p className="text-[11px] text-muted-foreground">Download 4K/8K Grátis</p>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Plataforma gratuita e segura para download de vídeos, Shorts e áudio do YouTube em alta qualidade.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Ferramentas</h4>
            <ul className="space-y-2.5">
              {toolLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-xs text-muted-foreground hover:text-primary transition-premium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-xs text-muted-foreground hover:text-primary transition-premium flex items-center gap-1.5">
                    <link.icon className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-2.5">
              {siteLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-xs text-muted-foreground hover:text-primary transition-premium flex items-center gap-1.5">
                    <link.icon className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} baixarvideoyoutube.com — Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacidade" className="text-[11px] text-muted-foreground hover:text-primary transition-premium">Privacidade</Link>
            <Link to="/termos" className="text-[11px] text-muted-foreground hover:text-primary transition-premium">Termos</Link>
            <Link to="/dmca" className="text-[11px] text-muted-foreground hover:text-primary transition-premium">DMCA</Link>
            <Link to="/contato" className="text-[11px] text-muted-foreground hover:text-primary transition-premium">Contato</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
