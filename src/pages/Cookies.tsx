import { motion } from "framer-motion";
import {
  Cookie, Shield, Settings, BarChart3, Globe, CheckCircle2,
  AlertTriangle, Lock, Eye, Server, Smartphone, FileText
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import SEOHead from "@/components/SEOHead";

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

export default function Cookies() {
  return (
    <div className="flex min-h-screen bg-background">
      <SEOHead
        title="Política de Cookies - Baixar Vídeo YouTube"
        description="Saiba como utilizamos cookies e tecnologias similares. Conheça os tipos de cookies, como gerenciá-los e seus direitos."
        breadcrumbs={[
          { name: "Início", url: "https://baixarvideoyoutube.com/" },
          { name: "Cookies", url: "https://baixarvideoyoutube.com/cookies" },
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
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
                  <Cookie className="w-4 h-4" />
                  Cookies
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-4">
                  Política de Cookies
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </motion.div>

              <div className="space-y-6">
                <Section icon={Cookie} title="1. O que são Cookies?">
                  <p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, smartphone ou tablet) quando você visita um site. Eles permitem que o site reconheça seu dispositivo e lembre informações sobre sua visita, como suas preferências e configurações.</p>
                  <p className="mt-2">Os cookies são amplamente utilizados na internet e são essenciais para o funcionamento adequado de muitos sites. Eles não contêm vírus e não podem acessar outras informações armazenadas no seu dispositivo.</p>
                </Section>

                <Section icon={Settings} title="2. Tipos de Cookies que Utilizamos">
                  <div className="space-y-4 mt-3">
                    {[
                      {
                        icon: Lock,
                        title: "Cookies Essenciais",
                        desc: "Necessários para o funcionamento básico do site. Sem eles, funcionalidades como navegação entre páginas e acesso a áreas seguras não funcionariam.",
                        examples: "Sessão do usuário, preferências de idioma, configurações de segurança",
                        required: true,
                      },
                      {
                        icon: BarChart3,
                        title: "Cookies Analíticos",
                        desc: "Nos ajudam a entender como os visitantes interagem com o site, coletando informações de forma anônima e agregada.",
                        examples: "Google Analytics, tempo de permanência, páginas mais visitadas",
                        required: false,
                      },
                      {
                        icon: Settings,
                        title: "Cookies de Funcionalidade",
                        desc: "Permitem que o site lembre escolhas que você faz e forneça recursos aprimorados e personalizados.",
                        examples: "Tema escuro/claro, histórico de downloads local, preferências de qualidade",
                        required: false,
                      },
                      {
                        icon: Smartphone,
                        title: "Cookies de Performance",
                        desc: "Coletam informações sobre como você usa o site para melhorar seu desempenho e experiência.",
                        examples: "Tempo de carregamento, erros encontrados, otimização de recursos",
                        required: false,
                      },
                    ].map((cookie) => (
                      <div key={cookie.title} className="p-4 rounded-xl bg-secondary/30 border border-border/20">
                        <div className="flex items-center gap-2 mb-2">
                          <cookie.icon className="w-4 h-4 text-primary" />
                          <strong className="text-foreground">{cookie.title}</strong>
                          {cookie.required && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full gradient-red text-primary-foreground">OBRIGATÓRIO</span>
                          )}
                        </div>
                        <p className="text-xs">{cookie.desc}</p>
                        <p className="text-xs mt-2"><strong className="text-foreground">Exemplos:</strong> {cookie.examples}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={Eye} title="3. Cookies de Terceiros">
                  <p>Alguns cookies são definidos por serviços de terceiros que aparecem em nossas páginas. Não controlamos esses cookies e recomendamos que você consulte as políticas de privacidade dos respectivos serviços:</p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {[
                      { name: "Google Analytics", purpose: "Análise de tráfego e comportamento" },
                      { name: "Google AdSense", purpose: "Publicidade contextual" },
                      { name: "Cloudflare", purpose: "Segurança e performance (CDN)" },
                      { name: "YouTube API", purpose: "Processamento de downloads" },
                    ].map((service) => (
                      <div key={service.name} className="p-3 rounded-xl bg-secondary/30">
                        <strong className="text-foreground text-xs">{service.name}</strong>
                        <p className="text-xs mt-0.5">{service.purpose}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={Shield} title="4. Como Gerenciar Cookies">
                  <p>Você pode controlar e/ou excluir cookies conforme desejar. A maioria dos navegadores permite:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Ver quais cookies estão armazenados e excluí-los individualmente",
                      "Bloquear cookies de terceiros",
                      "Bloquear cookies de sites específicos",
                      "Bloquear todos os cookies",
                      "Excluir todos os cookies ao fechar o navegador",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs"><strong className="text-foreground">Importante:</strong> Desativar cookies pode afetar a funcionalidade do site. Alguns recursos podem não funcionar corretamente sem cookies essenciais.</p>
                    </div>
                  </div>
                </Section>

                <Section icon={Globe} title="5. Configurações por Navegador">
                  <p>Para gerenciar cookies no seu navegador, acesse as configurações de privacidade:</p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {[
                      { browser: "Google Chrome", path: "Configurações > Privacidade e segurança > Cookies" },
                      { browser: "Mozilla Firefox", path: "Configurações > Privacidade e Segurança > Cookies" },
                      { browser: "Safari", path: "Preferências > Privacidade > Cookies" },
                      { browser: "Microsoft Edge", path: "Configurações > Privacidade > Cookies" },
                    ].map((b) => (
                      <div key={b.browser} className="p-3 rounded-xl bg-secondary/30">
                        <strong className="text-foreground text-xs">{b.browser}</strong>
                        <p className="text-xs mt-0.5">{b.path}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section icon={Server} title="6. Armazenamento Local (localStorage)">
                  <p>Além de cookies, utilizamos o armazenamento local do navegador (localStorage) para salvar preferências e o histórico de downloads. Estes dados:</p>
                  <ul className="space-y-2 mt-3">
                    {[
                      "Permanecem exclusivamente no seu dispositivo",
                      "Não são enviados a nossos servidores",
                      "Podem ser excluídos a qualquer momento nas configurações do navegador",
                      "São utilizados para melhorar sua experiência de uso",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section icon={FileText} title="7. Atualizações desta Política">
                  <p>Esta política de cookies pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na legislação aplicável. Recomendamos que visite esta página regularmente para se manter informado.</p>
                  <p className="mt-2">Ao continuar utilizando nosso site após quaisquer alterações, você concorda com a política atualizada.</p>
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
