import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import VideoResults from "@/components/VideoResults";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <HeroSection />
          <FeaturesGrid />
          <VideoResults />
          {/* Footer */}
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
