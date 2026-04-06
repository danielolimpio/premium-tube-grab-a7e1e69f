import { motion } from "framer-motion";
import { Target, Zap, Shield, Gem, Music, Monitor } from "lucide-react";

const features = [
  { icon: Target, title: "Qualidade 4K/8K", desc: "Downloads em resolução máxima sem compressão" },
  { icon: Zap, title: "Ultra Rápido", desc: "Tecnologia de download acelerado multithread" },
  { icon: Shield, title: "100% Seguro", desc: "Sem malware, sem registros, privacidade total" },
  { icon: Gem, title: "Ilimitado", desc: "Baixe quantos vídeos quiser, sem restrições" },
  { icon: Music, title: "Áudio HD", desc: "Extração de MP3 em 320kbps de qualidade" },
  { icon: Monitor, title: "Multi-Plataforma", desc: "Funciona em desktop, tablet e mobile" },
];

export default function FeaturesGrid() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10 tracking-tight">
          Por que escolher nossa plataforma?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-card rounded-2xl p-7 text-center transition-premium hover:border-primary/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] cursor-default group"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-premium">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
