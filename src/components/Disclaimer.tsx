import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="max-w-2xl mx-auto mt-4 px-4">
      <p className="text-xs text-muted-foreground text-center leading-relaxed flex items-start justify-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary/60" />
        <span>
          Certifique-se de não violar os direitos de terceiros com os vídeos que baixar do YouTube. Conteúdos protegidos por direitos autorais não podem ser baixados com esta ferramenta.{" "}
          <Link to="/uso-responsavel" className="text-primary hover:underline font-medium">
            Saiba mais
          </Link>
        </span>
      </p>
    </div>
  );
}
