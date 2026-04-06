import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import VideoResults from "@/components/VideoResults";
import { type VideoResult } from "@/lib/youtube";

const Index = () => {
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <HeroSection
            onResult={setVideoResult}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <VideoResults result={videoResult} />
          {!videoResult && <FeaturesGrid />}
          <footer className="py-8 px-4 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 baixarvideoyoutube.com — Todos os direitos reservados.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
