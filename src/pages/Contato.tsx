import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, MessageCircle, Clock, MapPin, Phone, Send,
  Shield, HelpCircle, Scale, FileText, CheckCircle2, Globe
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import SEOHead from "@/components/SEOHead";
import { toast } from "@/hooks/use-toast";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const contactChannels = [
  {
    icon: Mail,
    title: "E-mail Geral",
    value: "contato@baixarvideoyoutube.com",
    desc: "Para dúvidas gerais, sugestões e parcerias",
    response: "Até 5 dias úteis",
  },
  {
    icon: Shield,
    title: "Suporte Técnico",
    value: "suporte@baixarvideoyoutube.com",
    desc: "Problemas técnicos, bugs e dificuldades com downloads",
    response: "Até 48 horas úteis",
  },
  {
    icon: Scale,
    title: "DMCA / Legal",
    value: "dmca@baixarvideoyoutube.com",
    desc: "Notificações de direitos autorais e questões jurídicas",
    response: "Até 48 horas úteis",
  },
  {
    icon: FileText,
    title: "Privacidade (DPO)",
    value: "privacidade@baixarvideoyoutube.com",
    desc: "Solicitações LGPD e proteção de dados pessoais",
    response: "Até 15 dias úteis",
  },
];

const faqItems = [
  { q: "Os downloads são realmente gratuitos?", a: "Sim, nossa plataforma é 100% gratuita e oferece downloads ilimitados em todas as qualidades disponíveis." },
  { q: "É seguro usar o site?", a: "Sim, utilizamos conexões seguras (SSL/TLS), não armazenamos dados sensíveis e não requeremos cadastro ou informações pessoais." },
  { q: "Posso baixar vídeos em 4K?", a: "Sim, oferecemos download em todas as resoluções disponíveis, incluindo 4K e 8K, dependendo do vídeo original." },
  { q: "O site funciona no celular?", a: "Sim, a plataforma é totalmente responsiva e funciona em qualquer dispositivo com navegador web moderno." },
  { q: "Vocês armazenam meus downloads?", a: "Não. Os downloads são processados em tempo real e não mantemos cópia dos arquivos. O histórico é salvo apenas localmente no seu navegador." },
  { q: "Como posso reportar um problema?", a: "Envie um e-mail para suporte@baixarvideoyoutube.com com uma descrição detalhada do problema, incluindo o link do vídeo e o navegador utilizado." },
];

export default function Contato() {
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Mensagem enviada!", description: "Responderemos o mais breve possível." });
    setForm({ nome: "", email: "", assunto: "", mensagem: "" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SEOHead
        title="Contato - Baixar Vídeo YouTube"
        description="Entre em contato conosco. Suporte técnico, dúvidas, DMCA e privacidade. Resposta em até 48 horas úteis."
        breadcrumbs={[
          { name: "Início", url: "https://baixarvideoyoutube.com/" },
          { name: "Contato", url: "https://baixarvideoyoutube.com/contato" },
        ]}
        faqItems={faqItems.map(f => ({ question: f.q, answer: f.a }))}
      />
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <section className="relative py-12 md:py-20 px-4">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
            </div>
            <div className="relative max-w-5xl mx-auto">
              <motion.div {...fadeIn} className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
                  <Mail className="w-4 h-4" />
                  Fale Conosco
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4">
                  Contato
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Estamos aqui para ajudar. Escolha o canal mais adequado para sua necessidade.
                </p>
              </motion.div>

              {/* Contact channels */}
              <div className="grid sm:grid-cols-2 gap-4 mb-12">
                {contactChannels.map((ch) => (
                  <motion.div key={ch.title} {...fadeIn} className="glass-card rounded-2xl p-5 border border-border/30 hover:border-primary/30 transition-premium">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center flex-shrink-0">
                        <ch.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground">{ch.title}</h3>
                    </div>
                    <p className="text-primary text-sm font-medium mb-1">{ch.value}</p>
                    <p className="text-xs text-muted-foreground mb-2">{ch.desc}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Resposta: {ch.response}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Form + FAQ */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Form */}
                <motion.div {...fadeIn} className="glass-card rounded-2xl p-6 md:p-8 border border-border/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center">
                      <Send className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Enviar Mensagem</h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Nome completo</label>
                      <input
                        type="text"
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-premium text-sm"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">E-mail</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-premium text-sm"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Assunto</label>
                      <select
                        value={form.assunto}
                        onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-foreground outline-none focus:border-primary transition-premium text-sm"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="suporte">Suporte Técnico</option>
                        <option value="dmca">DMCA / Direitos Autorais</option>
                        <option value="privacidade">Privacidade / LGPD</option>
                        <option value="parceria">Parceria</option>
                        <option value="sugestao">Sugestão</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Mensagem</label>
                      <textarea
                        value={form.mensagem}
                        onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-premium text-sm resize-none"
                        placeholder="Descreva sua solicitação com o máximo de detalhes..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full gradient-red text-primary-foreground py-3 rounded-xl font-bold shadow-button hover:shadow-button-hover transition-premium flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Mensagem
                    </button>
                  </form>
                </motion.div>

                {/* FAQ */}
                <motion.div {...fadeIn} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Perguntas Frequentes</h2>
                  </div>
                  {faqItems.map((item, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 border border-border/30">
                      <h4 className="text-sm font-semibold text-foreground mb-1.5">{item.q}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>
          <AppFooter />
        </main>
      </div>
    </div>
  );
}
