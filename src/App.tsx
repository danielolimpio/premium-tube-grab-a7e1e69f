import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";
import Videos from "./pages/Videos.tsx";
import Shorts from "./pages/Shorts.tsx";
import Audio from "./pages/Audio.tsx";
import Playlist from "./pages/Playlist.tsx";
import Canais from "./pages/Canais.tsx";
import Downloads from "./pages/Downloads.tsx";
import UsoResponsavel from "./pages/UsoResponsavel.tsx";
import Privacidade from "./pages/Privacidade.tsx";
import Termos from "./pages/Termos.tsx";
import Cookies from "./pages/Cookies.tsx";
import DMCA from "./pages/DMCA.tsx";
import Contato from "./pages/Contato.tsx";
import Sobre from "./pages/Sobre.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/audio" element={<Audio />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/canais" element={<Canais />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/uso-responsavel" element={<UsoResponsavel />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/dmca" element={<DMCA />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
