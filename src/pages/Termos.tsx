import { motion } from "framer-motion";
import {
  FileText, CheckCircle2, XCircle, AlertTriangle, Scale, Gavel, Shield,
  Users, Globe, Lock, BookOpen, Ban, UserCheck, Server
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

export default function Termos() {
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
                  <FileText className="w-4 h-4" />
                  Termos Legais
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4">
                  Termos de Uso
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </motion.div>

              <div className="space-y-6">
                <Section icon={BookOpen} title="1. Aceitação dos Termos">
                  <p>Ao acessar e utilizar o site baixarvideoyoutube.com ("Plataforma"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços.</p>
                  <p>A utilização contínua da Plataforma após a publicação de alterações constitui aceitação dos novos termos. Recomendamos a revisão periódica desta página.</p>
                </Section>

                <Section icon={Globe} title="2. Descrição do Serviço">
                  <p>A Plataforma oferece ferramentas para download de conteúdo audiovisual disponível publicamente em plataformas de terceiros. O serviço funciona como um meio técnico neutro, similar a um navegador web ou player de vídeo.</p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {[
                      "Download de vídeos em múltiplas qualidades (até 8K)",
                      "Extração de áudio em formato MP3",
                      "Download de YouTube Shorts",
                      "Suporte a playlists e canais",
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-secondary/30">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs">{f}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={UserCheck} title="3. Elegibilidade" accent>
                  <p>Para utilizar nossa Plataforma, você deve:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Ter pelo menos 18 anos de idade ou contar com consentimento dos pais/responsáveis legais",
                      "Possuir capacidade legal para celebrar contratos vinculantes",
                      "Não estar impedido de receber serviços sob as leis aplicáveis",
                      "Concordar integralmente com estes Termos de Uso",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={CheckCircle2} title="4. Uso Permitido">
                  <p>Você pode utilizar a Plataforma para:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Baixar conteúdo de sua própria autoria para backup",
                      "Acessar conteúdo em domínio público ou sob licenças abertas (Creative Commons)",
                      "Uso pessoal, privado e educacional, respeitando a legislação",
                      "Visualização offline em áreas com conectividade limitada",
                      "Fins didáticos e de pesquisa acadêmica, com as devidas citações",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={Ban} title="5. Uso Proibido" accent>
                  <p>É expressamente proibido utilizar a Plataforma para:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Baixar conteúdo protegido por direitos autorais sem autorização",
                      "Redistribuir, republicar ou compartilhar conteúdo baixado",
                      "Utilizar conteúdo para fins comerciais ou lucrativos",
                      "Contornar sistemas de proteção contra cópia (DRM)",
                      "Realizar downloads em massa automatizados (bots, scrapers)",
                      "Praticar qualquer atividade ilegal ou fraudulenta",
                      "Violar direitos de privacidade, imagem ou honra de terceiros",
                      "Criar deepfakes ou manipulações enganosas de conteúdo",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={Shield} title="6. Propriedade Intelectual">
                  <p>Todo o conteúdo da Plataforma, incluindo design, código-fonte, textos, gráficos, logotipos e marcas, é de propriedade exclusiva de baixarvideoyoutube.com e está protegido pela legislação de propriedade intelectual brasileira e internacional.</p>
                  <p className="mt-2">O conteúdo baixado através da Plataforma pertence aos seus respectivos criadores e titulares de direitos. A Plataforma não reivindica propriedade sobre nenhum conteúdo de terceiros.</p>
                </Section>

                <Section icon={Scale} title="7. Limitação de Responsabilidade">
                  <p>A Plataforma é fornecida "como está" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas. Não nos responsabilizamos por:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Uso indevido da ferramenta pelos usuários",
                      "Violações de direitos autorais cometidas por terceiros",
                      "Indisponibilidade temporária do serviço",
                      "Precisão ou legalidade do conteúdo das plataformas de origem",
                      "Danos diretos, indiretos, incidentais ou consequenciais",
                      "Perda de dados ou interrupção de atividades comerciais",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={Gavel} title="8. Legislação Aplicável">
                  <p>Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, especialmente:</p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {[
                      { law: "Lei 9.610/98", desc: "Direitos Autorais" },
                      { law: "Lei 12.965/14", desc: "Marco Civil da Internet" },
                      { law: "Lei 13.709/18", desc: "LGPD" },
                      { law: "Lei 10.406/02", desc: "Código Civil" },
                    ].map((item) => (
                      <div key={item.law} className="p-3 rounded-xl bg-secondary/30">
                        <strong className="text-foreground text-xs">{item.law}</strong>
                        <p className="text-xs mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={Server} title="9. Modificações dos Termos">
                  <p>Reservamo-nos o direito de modificar estes termos a qualquer momento, sem aviso prévio, para adequação a mudanças legais, tecnológicas ou operacionais. A versão atualizada será sempre publicada nesta página com a data de vigência.</p>
                  <p className="mt-2">O uso continuado da Plataforma após quaisquer alterações constitui aceitação automática dos novos termos.</p>
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
