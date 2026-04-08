import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Videos from "./pages/Videos.tsx";
import Shorts from "./pages/Shorts.tsx";
import Audio from "./pages/Audio.tsx";
import Playlist from "./pages/Playlist.tsx";
import Canais from "./pages/Canais.tsx";
import Downloads from "./pages/Downloads.tsx";
import UsoResponsavel from "./pages/UsoResponsavel.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/audio" element={<Audio />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/canais" element={<Canais />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/uso-responsavel" element={<UsoResponsavel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
