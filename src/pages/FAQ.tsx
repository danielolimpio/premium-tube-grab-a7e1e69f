import { useState } from "react";
import { motion } from "framer-motion";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import SEOHead from "@/components/SEOHead";
import { HelpCircle, Search, ChevronDown, ChevronUp } from "lucide-react";

const faqCategories = [
  {
    category: "Download de Vídeos",
    items: [
      { question: "Como baixar vídeo do YouTube grátis?", answer: "Basta copiar o link do vídeo do YouTube, colar na barra de pesquisa do nosso site e clicar em 'Baixar Vídeo'. Em segundos, você verá as opções de qualidade disponíveis para download. Todo o processo é 100% gratuito e sem necessidade de cadastro." },
      { question: "Como baixar vídeo do YouTube em MP4?", answer: "Após colar o link do vídeo, nosso sistema exibe automaticamente as opções em formato MP4 com diferentes resoluções (360p, 480p, 720p, 1080p, 4K). Selecione a qualidade desejada e clique no botão de download para salvar o arquivo MP4 no seu dispositivo." },
      { question: "Como baixar vídeo do YouTube em 4K?", answer: "Cole o link do vídeo na nossa plataforma. Se o vídeo original estiver disponível em 4K (2160p), essa opção aparecerá na lista de formatos. Clique em 'Baixar' ao lado da opção 4K para obter o vídeo na mais alta qualidade disponível." },
      { question: "Como baixar vídeo do YouTube em 1080p Full HD?", answer: "Após inserir o link, selecione a opção '1080p' na lista de formatos disponíveis. O formato MP4 com codec H.264 é o mais compatível com todos os dispositivos e players de vídeo." },
      { question: "É possível baixar vídeos em 8K?", answer: "Sim, se o vídeo original no YouTube estiver disponível em 8K (4320p), nosso sistema detectará essa resolução e a oferecerá como opção de download. Vídeos em 8K são ideais para telas de altíssima resolução." },
      { question: "Qual a diferença entre MP4 e WebM?", answer: "MP4 (H.264) é o formato mais universal, compatível com praticamente todos os dispositivos e players. WebM (VP9) oferece melhor compressão com qualidade similar, mas pode não ser compatível com alguns dispositivos mais antigos. Recomendamos MP4 para maior compatibilidade." },
    ],
  },
  {
    category: "Download de Áudio/MP3",
    items: [
      { question: "Como converter vídeo do YouTube para MP3?", answer: "Cole o link do vídeo do YouTube no nosso site e clique em 'Baixar'. Na lista de formatos, selecione a opção 'MP3' com a qualidade desejada (128kbps, 192kbps ou 320kbps). O áudio será extraído automaticamente do vídeo e disponibilizado para download." },
      { question: "Qual a melhor qualidade de MP3 disponível?", answer: "Oferecemos download de áudio MP3 em até 320kbps, que é a qualidade máxima para o formato MP3. Também disponibilizamos o formato M4A (AAC), que oferece qualidade superior ao MP3 com tamanho de arquivo similar." },
      { question: "Posso baixar apenas o áudio de um vídeo?", answer: "Sim! Nossa plataforma permite extrair e baixar apenas o áudio de qualquer vídeo do YouTube. Basta colar o link e escolher um dos formatos de áudio disponíveis (MP3 ou M4A) na lista de opções." },
      { question: "Qual a diferença entre MP3 e M4A?", answer: "MP3 é o formato de áudio mais popular e compatível universalmente. M4A (AAC) oferece qualidade de áudio ligeiramente superior ao MP3 no mesmo bitrate, sendo o formato padrão do iTunes e dispositivos Apple. Ambos são amplamente suportados." },
    ],
  },
  {
    category: "YouTube Shorts",
    items: [
      { question: "Como baixar YouTube Shorts?", answer: "O processo é idêntico ao download de vídeos normais. Copie o link do Short (que contém '/shorts/' na URL), cole na nossa barra de pesquisa e clique em 'Baixar'. Os formatos disponíveis serão exibidos para você escolher." },
      { question: "Shorts são baixados em formato vertical?", answer: "Sim, os YouTube Shorts são baixados exatamente como foram publicados, mantendo o formato vertical (9:16) original. A qualidade e resolução do vídeo são preservadas integralmente." },
      { question: "Posso converter Shorts para MP3?", answer: "Sim! Assim como qualquer outro vídeo do YouTube, você pode extrair o áudio de um Short e salvá-lo como MP3 ou M4A. Basta selecionar o formato de áudio desejado na lista de opções." },
    ],
  },
  {
    category: "Playlists e Canais",
    items: [
      { question: "Como baixar uma playlist inteira do YouTube?", answer: "Cole o link da playlist na barra de pesquisa. Nosso sistema detectará automaticamente que se trata de uma playlist e exibirá os vídeos disponíveis. Você pode baixar os vídeos individualmente selecionando a qualidade desejada para cada um." },
      { question: "Posso baixar todos os vídeos de um canal?", answer: "Sim, acesse a seção 'Canais', insira o link do canal do YouTube e visualize todos os vídeos disponíveis. Você pode selecionar e baixar os vídeos de seu interesse individualmente." },
      { question: "Existe limite de downloads por playlist?", answer: "Não há limite de downloads. Você pode baixar quantos vídeos quiser de qualquer playlist, quantas vezes precisar. Nosso serviço é 100% gratuito e ilimitado." },
    ],
  },
  {
    category: "Compatibilidade e Dispositivos",
    items: [
      { question: "Funciona no celular Android?", answer: "Sim! Nossa plataforma é totalmente responsiva e funciona perfeitamente em qualquer navegador Android (Chrome, Firefox, Samsung Internet, etc.). Basta acessar o site, colar o link e baixar. Não é necessário instalar nenhum aplicativo." },
      { question: "Funciona no iPhone/iPad?", answer: "Sim, funciona em dispositivos iOS. Acesse nosso site pelo Safari ou qualquer outro navegador. Em versões mais recentes do iOS, o download é feito diretamente. Em versões anteriores, pode ser necessário usar um gerenciador de arquivos." },
      { question: "Funciona no computador (PC/Mac)?", answer: "Sim, funciona em qualquer computador com navegador web moderno (Chrome, Firefox, Safari, Edge, Opera). Basta acessar o site, colar o link do vídeo e escolher o formato desejado para download." },
      { question: "Preciso instalar algum programa ou extensão?", answer: "Não! Nosso serviço funciona 100% online, direto do navegador. Não é necessário instalar programas, extensões, plugins ou aplicativos. Basta acessar o site e começar a baixar." },
      { question: "Os vídeos baixados funcionam em Smart TVs?", answer: "Sim, os vídeos em formato MP4 (H.264) são compatíveis com a maioria das Smart TVs. Recomendamos baixar neste formato para garantir a máxima compatibilidade. Você pode transferir os arquivos via USB ou pela rede local." },
    ],
  },
  {
    category: "Segurança e Privacidade",
    items: [
      { question: "O site é seguro para usar?", answer: "Sim, absolutamente seguro. Utilizamos conexão criptografada SSL/TLS (HTTPS) em todas as páginas. Não armazenamos dados pessoais, não exigimos cadastro e não instalamos nenhum software no seu dispositivo. Sua privacidade é nossa prioridade." },
      { question: "Preciso criar conta ou fazer login?", answer: "Não, nosso serviço não requer nenhum tipo de cadastro, login ou informação pessoal. Você pode começar a baixar vídeos imediatamente, sem fornecer e-mail, nome ou qualquer outro dado." },
      { question: "O site tem vírus ou malware?", answer: "Não. Nosso site é limpo e seguro, sem pop-ups maliciosos, redirecionamentos suspeitos ou downloads automáticos. Não utilizamos adware, spyware ou qualquer tipo de software prejudicial." },
      { question: "Meus dados são armazenados?", answer: "Não armazenamos nenhum dado pessoal. Não coletamos informações de identificação, histórico de downloads ou links pesquisados. Utilizamos apenas cookies essenciais para o funcionamento do site. Consulte nossa Política de Privacidade para mais detalhes." },
    ],
  },
  {
    category: "Questões Legais",
    items: [
      { question: "É legal baixar vídeos do YouTube?", answer: "O download de vídeos para uso pessoal e privado geralmente é aceito em muitas jurisdições. No entanto, redistribuir, comercializar ou reutilizar conteúdo protegido por direitos autorais sem autorização é ilegal. Recomendamos baixar apenas conteúdo de domínio público, Creative Commons ou com autorização do criador." },
      { question: "Posso usar os vídeos baixados comercialmente?", answer: "Não, a menos que o vídeo esteja sob licença Creative Commons que permita uso comercial, ou que você tenha autorização expressa do criador do conteúdo. O uso comercial não autorizado pode resultar em violação de direitos autorais." },
      { question: "O que acontece se eu baixar conteúdo com copyright?", answer: "O download para visualização pessoal e offline geralmente é tolerado. Porém, distribuir, publicar ou monetizar conteúdo protegido constitui violação de direitos autorais e pode resultar em consequências legais. Sempre respeite os direitos dos criadores." },
    ],
  },
  {
    category: "Problemas Técnicos",
    items: [
      { question: "O download não está funcionando, o que fazer?", answer: "Verifique se o link está correto e completo. Tente atualizar a página e colar o link novamente. Se o problema persistir, o vídeo pode ter restrições geográficas ou de idade. Tente com outro vídeo para confirmar se o serviço está operando normalmente." },
      { question: "O vídeo baixou sem som, como resolver?", answer: "Isso pode acontecer com vídeos em resoluções muito altas (4K/8K) que usam streams separados de áudio e vídeo. Tente baixar em uma resolução menor (1080p ou 720p) no formato MP4, que geralmente inclui áudio e vídeo combinados." },
      { question: "O download está muito lento, o que fazer?", answer: "A velocidade de download depende da sua conexão de internet e do tamanho do arquivo. Vídeos em 4K/8K são significativamente maiores. Tente baixar em uma resolução menor para downloads mais rápidos, ou verifique sua conexão de internet." },
      { question: "Por que alguns vídeos não estão disponíveis?", answer: "Alguns vídeos podem ter restrições de país, idade ou privacidade definidas pelo criador. Vídeos privados, não listados com restrições ou removidos não podem ser baixados. Vídeos com DRM (proteção digital) também podem não estar disponíveis." },
    ],
  },
];

const allFaqItems = faqCategories.flatMap((c) => c.items);

const faqSchema = allFaqItems.map((item) => ({
  question: item.question,
  answer: item.answer,
}));

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (question: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(question)) next.delete(question);
      else next.add(question);
      return next;
    });
  };

  const filtered = searchTerm.trim()
    ? faqCategories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (i) =>
              i.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              i.answer.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((cat) => cat.items.length > 0)
    : faqCategories;

  return (
    <div className="flex min-h-screen bg-background">
      <SEOHead
        title="FAQ - Perguntas Frequentes | Baixar Vídeo YouTube"
        description="Encontre respostas para as perguntas mais frequentes sobre como baixar vídeos do YouTube em MP4, MP3, 4K e outros formatos. Tire todas as suas dúvidas."
        breadcrumbs={[
          { name: "Início", url: "https://baixarvideoyoutube.com/" },
          { name: "FAQ", url: "https://baixarvideoyoutube.com/faq" },
        ]}
        faqItems={faqSchema}
      />
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          {/* Hero */}
          <section className="relative py-16 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
            <div className="relative max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Central de Ajuda</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Perguntas <span className="text-primary">Frequentes</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Encontre respostas rápidas para as dúvidas mais comuns sobre download de vídeos, áudio e playlists do YouTube.
              </motion.p>

              {/* Search */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-lg mx-auto">
                <div className="flex items-center h-12 rounded-xl border border-border bg-secondary/50 focus-within:border-primary focus-within:glow-red transition-premium">
                  <Search className="w-5 h-5 ml-4 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Buscar pergunta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none px-3 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQ Items */}
          <section className="py-8 px-4 pb-16">
            <div className="max-w-4xl mx-auto space-y-10">
              {filtered.map((cat, ci) => (
                <motion.div key={cat.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.05 }}>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded-full bg-primary" />
                    {cat.category}
                  </h2>
                  <div className="space-y-2">
                    {cat.items.map((item) => {
                      const isOpen = openItems.has(item.question);
                      return (
                        <div key={item.question} className="glass-card rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleItem(item.question)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left transition-premium hover:bg-secondary/50"
                          >
                            <span className="text-sm font-medium text-foreground pr-4">{item.question}</span>
                            {isOpen ? <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                          </button>
                          {isOpen && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-5 pb-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma pergunta encontrada para "{searchTerm}"</p>
                </div>
              )}
            </div>
          </section>

          <AppFooter />
        </main>
      </div>
    </div>
  );
}
