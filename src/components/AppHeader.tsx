import { Search, Bell, Globe, Menu } from "lucide-react";
import { useState } from "react";

export default function AppHeader({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center px-4 md:px-6 border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <button onClick={onMenuToggle} className="lg:hidden mr-3 p-2 rounded-lg hover:bg-secondary transition-premium text-muted-foreground">
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className={`flex items-center h-10 rounded-xl border transition-premium ${
          searchFocused ? "border-primary glow-red bg-secondary" : "border-border bg-secondary/50"
        }`}>
          <Search className="w-4 h-4 ml-3 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        <button className="p-2 rounded-lg hover:bg-secondary transition-premium text-muted-foreground hover:text-foreground">
          <Globe className="w-5 h-5" />
        </button>
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-premium text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
        <div className="w-8 h-8 rounded-full gradient-red flex items-center justify-center text-xs font-bold text-primary-foreground ml-1">
          P
        </div>
      </div>
    </header>
  );
}
