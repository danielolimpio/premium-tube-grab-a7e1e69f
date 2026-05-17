import { Search, Bell, Globe, Menu, Sun, Moon, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

export default function AppHeader({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center px-4 md:px-6 border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <button
        onClick={onMenuToggle}
        aria-label="Abrir menu de navegação"
        className="lg:hidden mr-3 p-2 rounded-lg hover:bg-secondary transition-premium text-muted-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto">
        <label htmlFor="header-search" className="sr-only">Pesquisar no site</label>
        <div className={`flex items-center h-10 rounded-xl border transition-premium ${
          searchFocused ? "border-primary glow-red bg-secondary" : "border-border bg-secondary/50"
        }`}>
          <Search className="w-4 h-4 ml-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          <input
            id="header-search"
            type="text"
            placeholder="Pesquisar..."
            aria-label="Pesquisar no site"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => navigate("/faq")}
          aria-label="Abrir perguntas frequentes"
          className="p-2 rounded-lg hover:bg-secondary transition-premium text-muted-foreground hover:text-foreground"
          title="FAQ"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          aria-label="Selecionar idioma"
          className="p-2 rounded-lg hover:bg-secondary transition-premium text-muted-foreground hover:text-foreground"
        >
          <Globe className="w-5 h-5" />
        </button>
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          className="p-2 rounded-lg hover:bg-secondary transition-premium text-muted-foreground hover:text-foreground"
          title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
