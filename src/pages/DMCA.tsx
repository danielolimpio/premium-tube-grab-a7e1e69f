import { motion } from "framer-motion";
import {
  Scale, Shield, FileText, Mail, AlertTriangle, CheckCircle2,
  Gavel, Clock, Globe, Ban, UserCheck, MessageCircle, XCircle
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function Section({ icon: Icon, title, children, accent = false }: { icon: React.ElementType; title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <motion.div {...fadeIn} className={`glass-card rounded-2xl p-6 md:p-8 border ${accent ? "border-primary/30" : "border-border/30"}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent ? "gradient-red" : "bg-secondary"}`}>
          <Icon className={`w-5 h-5 ${accent ? "text-primary-foreground" : "text-primary"}`} />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </motion.div>
  );
}

export default function DMCA() {
  return (
    <div className="flex min-h-screen bg-background">
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
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
                  <Scale className="w-4 h-4" />
                  Direitos Autorais
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4">
                  Política DMCA
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Digital Millennium Copyright Act — Política de Notificação e Remoção
                </p>
              </motion.div>

              <div className="space-y-6">
                <Section icon={Shield} title="1. Compromisso com Direitos Autorais" accent>
                  <p>O baixarvideoyoutube.com respeita integralmente a propriedade intelectual e os direitos dos criadores de conteúdo. Em conformidade com o Digital Millennium Copyright Act (DMCA) e com a legislação brasileira de direitos autorais (Lei 9.610/98), respondemos prontamente a notificações válidas de violação.</p>
                  <p className="mt-2">Nossa plataforma funciona como um meio técnico neutro e não hospeda, armazena ou distribui conteúdo protegido. Entretanto, levamos a sério qualquer alegação de violação e agimos com diligência para proteger os direitos dos titulares.</p>
                </Section>

                <Section icon={Mail} title="2. Como Enviar uma Notificação DMCA">
                  <p>Se você é titular de direitos autorais ou representante legal e acredita que nosso serviço está sendo utilizado para violar seus direitos, envie uma notificação contendo:</p>
                  <div className="space-y-3 mt-3">
                    {[
                      { label: "Identificação da obra", desc: "Descrição detalhada do conteúdo original protegido por direitos autorais" },
                      { label: "URL infringente", desc: "Link específico ou identificação do conteúdo que viola seus direitos" },
                      { label: "Prova de titularidade", desc: "Documentação que comprove sua propriedade ou representação legal sobre a obra" },
                      { label: "Declaração de boa-fé", desc: "Afirmação de que o uso não foi autorizado pelo titular, agente ou lei" },
                      { label: "Informações de contato", desc: "Nome completo, endereço, telefone e e-mail válido para resposta" },
                      { label: "Assinatura", desc: "Assinatura física ou eletrônica do titular ou representante legal autorizado" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-foreground">{item.label}:</strong>
                          <span className="ml-1">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-xl gradient-red text-primary-foreground">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5" />
                      <strong>Enviar para:</strong>
                    </div>
                    <p className="text-sm">dmca@baixarvideoyoutube.com</p>
                  </div>
                </Section>

                <Section icon={Clock} title="3. Prazos e Procedimentos">
                  <div className="space-y-3 mt-2">
                    {[
                      { step: "Recebimento", time: "Imediato", desc: "Confirmação automática de recebimento da notificação" },
                      { step: "Análise inicial", time: "Até 48h úteis", desc: "Verificação da validade e completude da notificação" },
                      { step: "Ação de remoção", time: "Imediata após análise", desc: "Remoção ou bloqueio do conteúdo infringente" },
                      { step: "Notificação ao usuário", time: "Quando aplicável", desc: "Comunicação ao usuário sobre a ação tomada" },
                      { step: "Contranotificação", time: "Até 10 dias úteis", desc: "Prazo para o usuário apresentar defesa formal" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                        <div className="w-8 h-8 rounded-lg gradient-red flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-foreground text-xs font-bold">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-foreground text-xs">{item.step}</strong>
                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary font-medium">{item.time}</span>
                          </div>
                          <p className="text-xs mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={MessageCircle} title="4. Contranotificação">
                  <p>Se você acredita que seu conteúdo foi removido por engano ou identificação incorreta, você pode enviar uma contranotificação contendo:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Identificação do material removido e a localização onde aparecia",
                      "Declaração sob juramento de que a remoção foi um erro ou identificação incorreta",
                      "Seu nome, endereço, telefone e e-mail de contato",
                      "Declaração de consentimento à jurisdição do foro competente",
                      "Assinatura física ou eletrônica",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={Ban} title="5. Política de Reincidência" accent>
                  <p>Mantemos uma política rigorosa contra infratores reincidentes:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "1ª violação: Aviso formal e remoção do conteúdo",
                      "2ª violação: Suspensão temporária do acesso (30 dias)",
                      "3ª violação: Banimento permanente da plataforma",
                      "Violações graves: Ação imediata sem aviso prévio e cooperação com autoridades",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={Gavel} title="6. Notificações Falsas">
                  <p>Notificações DMCA falsas ou de má-fé constituem abuso de direito e podem resultar em:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Responsabilização civil por danos materiais e morais",
                      "Ações judiciais por abuso de direito processual",
                      "Indenização por perdas e danos causados à parte prejudicada",
                      "Sanções legais conforme a legislação penal aplicável",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={Globe} title="7. Legislação Aplicável">
                  <p>Esta política DMCA é complementada pela legislação brasileira, incluindo a Lei de Direitos Autorais (Lei 9.610/98), o Marco Civil da Internet (Lei 12.965/14) e o Código Civil (Lei 10.406/02).</p>
                  <p className="mt-2">Para questões internacionais, seguimos os tratados e convenções dos quais o Brasil é signatário, incluindo a Convenção de Berna e o Acordo TRIPS.</p>
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
