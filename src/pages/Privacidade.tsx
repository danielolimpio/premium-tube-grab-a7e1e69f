import { motion } from "framer-motion";
import {
  Shield, Eye, Database, Lock, Globe, UserCheck, Server, FileText,
  AlertTriangle, CheckCircle2, Smartphone, Cookie, BarChart3, Mail
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

export default function Privacidade() {
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
                  <Shield className="w-4 h-4" />
                  Privacidade
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4">
                  Política de Privacidade
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </motion.div>

              <div className="space-y-6">
                <Section icon={Eye} title="1. Informações que Coletamos">
                  <p>Nosso compromisso é coletar o mínimo de dados necessário para o funcionamento da plataforma. A seguir, descrevemos quais informações podem ser coletadas:</p>
                  <div className="grid gap-3 mt-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                      <Globe className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div><strong className="text-foreground">Dados de navegação:</strong> Endereço IP, tipo de navegador, sistema operacional, páginas visitadas, tempo de permanência e URLs de referência. Estes dados são coletados automaticamente para fins estatísticos e de segurança.</div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                      <Cookie className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div><strong className="text-foreground">Cookies e tecnologias similares:</strong> Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para entender como os visitantes interagem com a plataforma.</div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                      <Smartphone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div><strong className="text-foreground">Dados de uso:</strong> URLs de vídeos submetidas para download, formato e qualidade selecionados. Estes dados são processados em tempo real e não são armazenados permanentemente.</div>
                    </div>
                  </div>
                </Section>

                <Section icon={Database} title="2. Como Usamos Seus Dados">
                  <p>Os dados coletados são utilizados exclusivamente para:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Processar suas solicitações de download de vídeos",
                      "Melhorar a performance e funcionalidades da plataforma",
                      "Garantir a segurança contra abusos e atividades maliciosas",
                      "Gerar estatísticas anônimas e agregadas sobre o uso do serviço",
                      "Cumprir obrigações legais e regulatórias",
                      "Responder a solicitações de suporte e comunicações",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={Lock} title="3. Proteção de Dados">
                  <p>Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {[
                      { icon: Server, title: "Criptografia", desc: "Todas as conexões são protegidas por SSL/TLS com certificados de alta segurança" },
                      { icon: Lock, title: "Acesso restrito", desc: "Apenas pessoal autorizado tem acesso aos sistemas de produção" },
                      { icon: BarChart3, title: "Monitoramento", desc: "Monitoramos continuamente nossos sistemas para detectar e prevenir ameaças" },
                      { icon: Database, title: "Backup seguro", desc: "Dados críticos são armazenados com redundância e criptografia em repouso" },
                    ].map((item) => (
                      <div key={item.title} className="p-3 rounded-xl bg-secondary/30 flex items-start gap-3">
                        <item.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div><strong className="text-foreground">{item.title}</strong><p className="text-xs mt-0.5">{item.desc}</p></div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={UserCheck} title="4. Seus Direitos (LGPD)">
                  <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/18), você tem os seguintes direitos:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Confirmação da existência de tratamento de dados pessoais",
                      "Acesso aos dados pessoais que possuímos sobre você",
                      "Correção de dados incompletos, inexatos ou desatualizados",
                      "Anonimização, bloqueio ou eliminação de dados desnecessários",
                      "Portabilidade dos dados a outro fornecedor de serviço",
                      "Eliminação dos dados pessoais tratados com seu consentimento",
                      "Informação sobre com quem seus dados foram compartilhados",
                      "Revogação do consentimento a qualquer momento",
                    ].map((right, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{right}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={Globe} title="5. Compartilhamento de Dados">
                  <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto nas seguintes situações:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Quando exigido por lei, ordem judicial ou autoridade governamental",
                      "Para proteger nossos direitos, propriedade ou segurança",
                      "Com prestadores de serviço essenciais (hospedagem, analytics) sob contratos de confidencialidade",
                      "Em caso de fusão, aquisição ou venda de ativos, com aviso prévio",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={FileText} title="6. Retenção de Dados">
                  <p>Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados, incluindo obrigações legais, contratuais, de prestação de contas e regulatórias.</p>
                  <p className="mt-2">Dados de navegação e logs de acesso são retidos por até 6 meses. URLs de download são processadas em tempo real e não são armazenadas após o processamento.</p>
                </Section>

                <Section icon={Mail} title="7. Contato do Encarregado (DPO)">
                  <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:</p>
                  <div className="mt-3 p-4 rounded-xl bg-secondary/30">
                    <p><strong className="text-foreground">E-mail:</strong> privacidade@baixarvideoyoutube.com</p>
                    <p className="mt-1"><strong className="text-foreground">Prazo de resposta:</strong> até 15 dias úteis</p>
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
