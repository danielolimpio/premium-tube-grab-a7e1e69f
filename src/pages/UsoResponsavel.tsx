import { motion } from "framer-motion";
import {
  ShieldCheck, AlertTriangle, BookOpen, Heart, Wifi, GraduationCap, Lock, Users,
  Ban, Scale, Gavel, FileWarning, CheckCircle2, XCircle, HelpCircle, Mail,
  Globe, Eye, Smartphone, UserCheck, Bookmark, MessageCircle, Clock, FileText
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function SectionCard({ icon: Icon, title, id, children, accent = false }: {
  icon: React.ElementType; title: string; id?: string; children: React.ReactNode; accent?: boolean;
}) {
  return (
    <motion.section {...fadeIn} id={id} className="scroll-mt-24">
      <div className={`rounded-2xl border p-6 md:p-8 ${accent ? "border-primary/30 bg-primary/5" : "border-border/40 bg-card/60"}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent ? "gradient-red" : "bg-primary/15"}`}>
            <Icon className={`w-5 h-5 ${accent ? "text-primary-foreground" : "text-primary"}`} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </motion.section>
  );
}

function BulletList({ items, icon: Icon = CheckCircle2, color = "text-green-400" }: { items: string[]; icon?: React.ElementType; color?: string }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ProhibitedList({ items }: { items: string[] }) {
  return <BulletList items={items} icon={XCircle} color="text-red-400" />;
}

const tocItems = [
  { id: "aviso", label: "Aviso Legal" },
  { id: "finalidade", label: "Finalidade Legítima" },
  { id: "proibido", label: "O Que É Proibido" },
  { id: "responsabilidades", label: "Suas Responsabilidades" },
  { id: "isencao", label: "Isenção de Responsabilidade" },
  { id: "direitos", label: "Direitos Autorais" },
  { id: "dmca", label: "Política DMCA" },
  { id: "sancoes", label: "Sanções" },
  { id: "boas-praticas", label: "Boas Práticas" },
  { id: "faq", label: "FAQ" },
  { id: "contato", label: "Contato" },
];

export default function UsoResponsavel() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          {/* Hero */}
          <section className="relative py-16 md:py-24 px-4 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
            </div>
            <div className="relative max-w-4xl mx-auto text-center">
              <motion.div {...fadeIn}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold mb-4">
                  <ShieldCheck className="w-3.5 h-3.5" /> USO RESPONSÁVEL
                </span>
              </motion.div>
              <motion.h1 {...fadeIn} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-extrabold gradient-text tracking-tighter leading-[1.1] mb-6">
                Termos de Uso e Política de Download Responsável
              </motion.h1>
              <motion.p {...fadeIn} transition={{ delay: 0.2 }} className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-4">
                Nosso compromisso com a transparência, o respeito aos direitos autorais e o uso ético da tecnologia.
              </motion.p>
              <motion.p {...fadeIn} transition={{ delay: 0.3 }} className="text-xs text-muted-foreground/60">
                Última atualização: 6 de abril de 2026
              </motion.p>
            </div>
          </section>

          {/* TOC */}
          <div className="max-w-4xl mx-auto px-4 mb-12">
            <motion.div {...fadeIn} className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-primary" /> Índice
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {tocItems.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-premium"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-4 space-y-8 pb-16">

            {/* 1. AVISO LEGAL */}
            <SectionCard icon={AlertTriangle} title="1. Aviso Legal Importante" id="aviso" accent>
              <p>
                Esta ferramenta é fornecida exclusivamente para <strong className="text-foreground">uso pessoal, privado, educacional e sem fins lucrativos</strong>. Ao acessar e utilizar nossos serviços, você declara estar ciente e concordar em cumprir integralmente as leis de direitos autorais vigentes, os termos de serviço das plataformas originais e todas as disposições aqui estabelecidas.
              </p>
              <div className="glass-card rounded-xl p-4 border-l-4 border-primary">
                <p className="text-xs font-medium text-foreground">
                  ⚠️ O descumprimento destas diretrizes pode resultar em responsabilização civil e criminal conforme a legislação brasileira e internacional aplicável.
                </p>
              </div>
            </SectionCard>

            {/* 2. FINALIDADE */}
            <SectionCard icon={Heart} title="2. Finalidade Legítima da Ferramenta" id="finalidade">
              <p>
                Nossa plataforma foi desenvolvida para atender a necessidades reais e legítimas de usuários que enfrentam limitações técnicas, geográficas ou pessoais no acesso a conteúdo online.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {[
                  {
                    icon: Wifi, title: "Acessibilidade e Conectividade",
                    items: [
                      "Áreas com infraestrutura precária de internet",
                      "Economia de dados móveis em planos limitados",
                      "Profissionais em trânsito sem conexão",
                      "Estudantes de zonas rurais",
                      "Navegação em transporte público sem sinal",
                    ],
                  },
                  {
                    icon: Heart, title: "Necessidades Especiais",
                    items: [
                      "Crianças e adultos com necessidades especiais",
                      "Terapias e reabilitação com conteúdo específico",
                      "Acesso offline em consultórios de saúde",
                      "Inclusão digital para pessoas com dificuldades",
                    ],
                  },
                  {
                    icon: GraduationCap, title: "Educação e Desenvolvimento",
                    items: [
                      "Estudo e pesquisa acadêmica",
                      "Capacitação profissional com tutoriais",
                      "Aprendizado de idiomas offline",
                      "Preparação de aulas por educadores",
                    ],
                  },
                  {
                    icon: Lock, title: "Privacidade e Segurança",
                    items: [
                      "Proteção de dados pessoais",
                      "Controle de privacidade de visualização",
                      "Segurança da informação profissional",
                      "Evitar rastreamento por algoritmos",
                    ],
                  },
                ].map((block) => (
                  <div key={block.title} className="glass-card rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <block.icon className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-bold text-foreground">{block.title}</h4>
                    </div>
                    <BulletList items={block.items} />
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-xl p-5 mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-foreground">Preservação de Memórias</h4>
                </div>
                <BulletList items={[
                  "Backup de momentos especiais — vídeos de família, casamentos, formaturas",
                  "Cópia de segurança de conteúdo próprio publicado",
                  "Documentação histórica de conteúdos que podem ser removidos",
                  "Arquivo pessoal com valor sentimental ou histórico",
                ]} />
              </div>
            </SectionCard>

            {/* 3. PROIBIDO */}
            <SectionCard icon={Ban} title="3. O Que É Estritamente Proibido" id="proibido" accent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Violação de Direitos Autorais",
                    items: [
                      "Baixar conteúdo protegido sem autorização",
                      "Contornar sistemas de proteção DRM",
                      "Acessar conteúdo pago sem licença",
                      "Violar marcas, direitos de imagem ou propriedade intelectual",
                    ],
                  },
                  {
                    title: "Redistribuição e Compartilhamento",
                    items: [
                      "Republicar vídeos em outras plataformas",
                      "Compartilhar em redes sociais ou grupos",
                      "Upload em servidores para distribuição",
                      "Incorporar em sites sem autorização",
                    ],
                  },
                  {
                    title: "Uso Comercial e Lucrativo",
                    items: [
                      "Usar vídeos para fins comerciais ou publicitários",
                      "Lucrar direta ou indiretamente com conteúdo de terceiros",
                      "Incluir em produtos vendidos (DVDs, cursos pagos)",
                      "Monetizar em plataformas com receita",
                    ],
                  },
                  {
                    title: "Usos Ilícitos e Danosos",
                    items: [
                      "Assédio, perseguição, difamação ou calúnia",
                      "Criar deepfakes ou manipulações enganosas",
                      "Discurso de ódio ou apologia à violência",
                      "Qualquer atividade ilegal ou fraudulenta",
                    ],
                  },
                ].map((block) => (
                  <div key={block.title} className="glass-card rounded-xl p-5">
                    <h4 className="text-sm font-bold text-foreground mb-3">{block.title}</h4>
                    <ProhibitedList items={block.items} />
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-xl p-5 mt-2">
                <h4 className="text-sm font-bold text-foreground mb-3">Contorno de Medidas de Proteção</h4>
                <ProhibitedList items={[
                  "Burlar restrições de privacidade (baixar vídeos privados sem autorização)",
                  "Acessar contas de terceiros para realizar downloads",
                  "Usar métodos automatizados em massa (bots, scrapers)",
                  "Violar medidas tecnológicas de proteção das plataformas",
                ]} />
              </div>
            </SectionCard>

            {/* 4. RESPONSABILIDADES */}
            <SectionCard icon={UserCheck} title="4. Suas Responsabilidades e Obrigações" id="responsabilidades">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Verificação Prévia",
                    items: [
                      "Confirmar se possui direito legal de baixar o conteúdo",
                      "Verificar restrições de uso ou licenciamento",
                      "Assegurar-se de que não viola termos da plataforma",
                      "Confirmar conformidade com a legislação aplicável",
                    ],
                  },
                  {
                    title: "Uso Adequado",
                    items: [
                      "Usar vídeos exclusivamente para fins pessoais",
                      "Manter conteúdo em dispositivos de acesso restrito",
                      "Não remover marcas d'água ou créditos de autoria",
                      "Apoiar os criadores originais (likes, inscrições)",
                    ],
                  },
                  {
                    title: "Armazenamento Seguro",
                    items: [
                      "Guardar arquivos em local seguro e controlado",
                      "Não compartilhar acesso aos dispositivos",
                      "Excluir conteúdos quando solicitado pelos titulares",
                      "Manter registro de autorizações quando aplicável",
                    ],
                  },
                  {
                    title: "Conformidade Legal",
                    items: [
                      "Lei de Direitos Autorais (Lei 9.610/98)",
                      "Marco Civil da Internet (Lei 12.965/14)",
                      "LGPD (Lei 13.709/18)",
                      "Termos de uso das plataformas originais",
                    ],
                  },
                ].map((block) => (
                  <div key={block.title} className="glass-card rounded-xl p-5">
                    <h4 className="text-sm font-bold text-foreground mb-3">{block.title}</h4>
                    <BulletList items={block.items} />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* 5. ISENÇÃO */}
            <SectionCard icon={ShieldCheck} title="5. Isenção de Responsabilidade" id="isencao">
              <p>
                Nossa plataforma funciona como um <strong className="text-foreground">meio técnico neutro</strong> — similar a um navegador web, player de vídeo ou ferramenta de busca. Não criamos, hospedamos, distribuímos ou controlamos o conteúdo original das plataformas de terceiros.
              </p>
              <div className="glass-card rounded-xl p-5 mt-2">
                <h4 className="text-sm font-bold text-foreground mb-3">Não somos responsáveis por:</h4>
                <ProhibitedList items={[
                  "Como você utiliza os vídeos após o download",
                  "Violações de direitos autorais cometidas pelos usuários",
                  "Consequências legais do uso inadequado",
                  "Conteúdo original das plataformas de origem",
                  "Danos diretos, indiretos ou consequenciais do uso",
                ]} />
              </div>
              <p className="text-xs text-muted-foreground/60 mt-2">
                A disponibilidade desta ferramenta não constitui endosso do conteúdo, autorização para violar direitos de terceiros, ou garantia de legalidade do download em todas as jurisdições. As leis de direitos autorais variam significativamente entre países — é sua responsabilidade verificar a legalidade em sua jurisdição.
              </p>
            </SectionCard>

            {/* 6. DIREITOS AUTORAIS */}
            <SectionCard icon={Scale} title="6. Direitos Autorais e Exceções Legais" id="direitos">
              <p>Conforme a Lei 9.610/98, são protegidos: obras audiovisuais, composições musicais, fotografias, textos, roteiros, coreografias, programas de computador e qualquer criação expressa por qualquer meio.</p>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="glass-card rounded-xl p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Exceções Legais (Uso Justo)</h4>
                  <BulletList items={[
                    "Citação para estudo, crítica ou polêmica (com créditos)",
                    "Uso em estabelecimentos de ensino para fins didáticos",
                    "Reprodução de pequenos trechos para uso privado",
                    "Acesso para deficientes visuais ou auditivos",
                    "Cópia de segurança de programas de computador",
                  ]} />
                  <p className="text-xs text-muted-foreground/60 mt-3">
                    Estas exceções são restritas e específicas. Não constituem autorização geral para download indiscriminado.
                  </p>
                </div>
                <div className="glass-card rounded-xl p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Você PODE baixar quando:</h4>
                  <BulletList items={[
                    "Conteúdo em domínio público (70+ anos após morte do autor)",
                    "Licença Creative Commons que permita download",
                    "Autor autorizou explicitamente download e uso",
                    "É conteúdo de sua própria autoria",
                  ]} />
                </div>
              </div>
            </SectionCard>

            {/* 7. DMCA */}
            <SectionCard icon={FileWarning} title="7. Política de Notificação e Remoção (DMCA)" id="dmca" accent>
              <p>Respeitamos integralmente os direitos dos titulares de propriedade intelectual e agimos prontamente mediante notificação válida de violação.</p>

              <div className="glass-card rounded-xl p-5 mt-2">
                <h4 className="text-sm font-bold text-foreground mb-3">Como enviar uma notificação:</h4>
                <BulletList items={[
                  "Identificação da obra protegida com descrição detalhada",
                  "URL do conteúdo infringente com link específico",
                  "Prova de titularidade que comprove propriedade ou representação legal",
                  "Declaração de boa-fé sobre uso não autorizado",
                  "Informações de contato completas e assinatura",
                ]} />
              </div>

              <div className="grid md:grid-cols-3 gap-3 mt-4">
                {[
                  { icon: Clock, title: "Análise inicial", desc: "Até 48 horas úteis" },
                  { icon: ShieldCheck, title: "Ação de remoção", desc: "Imediata após confirmação" },
                  { icon: MessageCircle, title: "Contranotificação", desc: "Defesa em até 10 dias úteis" },
                ].map((item) => (
                  <div key={item.title} className="glass-card rounded-xl p-4 text-center">
                    <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs font-bold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* 8. SANÇÕES */}
            <SectionCard icon={Gavel} title="8. Sanções e Consequências" id="sancoes">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Medidas da Plataforma</h4>
                  <ProhibitedList items={[
                    "Suspensão ou encerramento de contas reincidentes",
                    "Bloqueio de acesso a IPs que violem reiteradamente",
                    "Remoção de links ou funcionalidades",
                    "Cooperação com autoridades mediante ordem judicial",
                  ]} />
                </div>
                <div className="glass-card rounded-xl p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Consequências Legais</h4>
                  <ProhibitedList items={[
                    "Indenização por danos materiais e morais",
                    "Detenção de 3 meses a 1 ano (violação simples)",
                    "Reclusão de 2 a 4 anos (violação com fins lucrativos)",
                    "Multas aplicadas por órgãos de fiscalização",
                  ]} />
                </div>
              </div>
            </SectionCard>

            {/* 9. BOAS PRÁTICAS */}
            <SectionCard icon={BookOpen} title="9. Recomendações de Boas Práticas" id="boas-praticas">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Antes de Baixar</h4>
                  <BulletList items={[
                    '"Eu tenho direito legal de baixar este conteúdo?"',
                    "Verifique se é de sua autoria ou tem autorização",
                    "Considere se há download oficial disponível",
                    "Avalie se seu uso se enquadra em exceções legais",
                  ]} />
                </div>
                <div className="glass-card rounded-xl p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Após o Download</h4>
                  <BulletList items={[
                    "Armazene com segurança em dispositivo pessoal",
                    "Mantenha o arquivo em uso estritamente pessoal",
                    "Dê créditos quando pertinente e autorizado",
                    "Apoie o criador: curta, inscreva-se, compartilhe oficialmente",
                  ]} />
                </div>
              </div>
              <div className="glass-card rounded-xl p-5 mt-2">
                <h4 className="text-sm font-bold text-foreground mb-3">💡 Alternativas Legais</h4>
                <BulletList items={[
                  "Assinaturas oficiais: YouTube Premium, Netflix, Spotify",
                  "Download oficial dentro dos apps das plataformas",
                  "Conteúdo gratuito legal: Creative Commons, domínio público",
                  "Contato direto com criadores para solicitar autorização",
                ]} />
              </div>
            </SectionCard>

            {/* 10. FAQ */}
            <SectionCard icon={HelpCircle} title="10. Perguntas Frequentes" id="faq">
              <div className="space-y-4">
                {[
                  { q: "Posso baixar vídeos para assistir offline?", a: "Sim, desde que seja para uso estritamente pessoal, você tenha direito legal sobre o conteúdo ou esteja amparado por exceções legais específicas." },
                  { q: "É permitido baixar meus próprios vídeos?", a: "Sim, você pode baixar vídeos de sua própria autoria para backup e uso pessoal." },
                  { q: "Posso usar vídeos baixados em trabalhos escolares?", a: "A legislação permite citação para fins didáticos, mas com limitações. Consulte seu educador sobre as regras específicas da instituição." },
                  { q: "É crime baixar vídeos do YouTube?", a: "Depende do uso. Para visualização pessoal de conteúdo público, geralmente não há crime. Porém, redistribuir, lucrar ou violar direitos autorais é ilegal." },
                  { q: "O que acontece se eu republicar um vídeo baixado?", a: "Você pode receber notificação de remoção, ter sua conta suspensa e ser responsabilizado civil e criminalmente." },
                  { q: "Como sei se um vídeo está protegido?", a: "Praticamente todo conteúdo criativo está automaticamente protegido. A ausência de símbolo © não significa que é livre. Na dúvida, presuma que está protegido." },
                  { q: "E se o criador não se manifestar contra?", a: "A tolerância não significa autorização. O titular pode exercer seus direitos a qualquer momento." },
                ].map((item) => (
                  <div key={item.q} className="glass-card rounded-xl p-5">
                    <p className="text-sm font-bold text-foreground mb-2 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      {item.q}
                    </p>
                    <p className="text-sm text-muted-foreground pl-6">{item.a}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* RESUMO PRÁTICO */}
            <motion.section {...fadeIn}>
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">📋 Resumo Prático</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="glass-card rounded-xl p-5">
                    <h4 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> PODE BAIXAR
                    </h4>
                    <BulletList items={[
                      "É seu próprio conteúdo",
                      "Tem autorização por escrito",
                      "Está em domínio público",
                      "Possui licença Creative Commons",
                      "É para uso pessoal e privado",
                    ]} />
                  </div>
                  <div className="glass-card rounded-xl p-5">
                    <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> NÃO PODE BAIXAR
                    </h4>
                    <ProhibitedList items={[
                      "Conteúdo protegido sem autorização",
                      "Pretende redistribuir ou compartilhar",
                      "Vai usar para fins comerciais",
                      "É conteúdo privado de terceiros",
                      "Viola termos da plataforma",
                    ]} />
                  </div>
                  <div className="glass-card rounded-xl p-5">
                    <h4 className="text-sm font-bold text-yellow-400 mb-3 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> NA DÚVIDA
                    </h4>
                    <ul className="space-y-2.5">
                      {["Não baixe", "Consulte um advogado", "Entre em contato conosco", "Busque alternativas legais"].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* CONTATO */}
            <SectionCard icon={Mail} title="11. Contato e Suporte" id="contato">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Dúvidas sobre Uso Legítimo</h4>
                  <p>Para questões sobre legalidade de download, interpretação dos termos ou direitos autorais.</p>
                  <p className="mt-3 text-xs flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary" /> legal@baixarvideoyoutube.com</p>
                </div>
                <div className="glass-card rounded-xl p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Notificações DMCA</h4>
                  <p>Para notificações de violação de direitos autorais.</p>
                  <p className="mt-3 text-xs flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary" /> dmca@baixarvideoyoutube.com</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Dúvidas gerais", time: "Até 5 dias úteis" },
                  { label: "Notificações DMCA", time: "Até 48 horas úteis" },
                  { label: "Urgências legais", time: "Imediatamente" },
                ].map((item) => (
                  <div key={item.label} className="glass-card rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* DISPOSIÇÕES FINAIS */}
            <motion.div {...fadeIn} className="glass-card rounded-xl p-5 text-xs text-muted-foreground/70 leading-relaxed space-y-2">
              <p><strong className="text-muted-foreground">Legislação Aplicável:</strong> Lei de Direitos Autorais (Lei 9.610/98), Marco Civil da Internet (Lei 12.965/14), Código Civil (Lei 10.406/02), Código Penal (Decreto-Lei 2.848/40).</p>
              <p><strong className="text-muted-foreground">Aceite dos Termos:</strong> Ao clicar no botão "BAIXAR" ou utilizar qualquer funcionalidade desta plataforma, você declara que leu, compreendeu e concorda em cumprir todas as disposições aqui estabelecidas.</p>
              <p><strong className="text-muted-foreground">Menores de Idade:</strong> Menores de 18 anos devem obter consentimento dos pais ou responsáveis legais.</p>
              <p>Esta ferramenta é um recurso técnico para facilitar o acesso offline a conteúdos que você tem direito legal de acessar. O respeito aos direitos autorais e aos criadores de conteúdo é fundamental para um ecossistema digital justo e sustentável.</p>
              <p className="text-primary/60 font-medium">Apoie os criadores que você admira através de meios oficiais. O trabalho deles merece ser valorizado e remunerado adequadamente.</p>
            </motion.div>
          </div>

          <footer className="py-8 px-4 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">© 2024 baixarvideoyoutube.com — Todos os direitos reservados.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
