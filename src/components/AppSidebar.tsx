import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, Video, Smartphone, Music, FolderOpen, Users,
  Download, Settings, Play, ChevronLeft, ChevronRight,
  Sparkles, History
} from "lucide-react";
import logo from "@/assets/logo.png";

const menuItems = [
  { icon: Home, label: "Início", path: "/" },
  { icon: Video, label: "Vídeos", path: "/videos" },
  { icon: Smartphone, label: "Shorts", path: "/shorts", badge: "NEW" },
  { icon: Music, label: "Áudio/MP3", path: "/audio" },
  { icon: FolderOpen, label: "Playlists", path: "/playlist" },
  { icon: Users, label: "Canais", path: "/canais" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="hidden lg:flex flex-col h-screen sticky top-0 bg-[hsl(0,0%,4%)] border-r border-border/50 overflow-hidden z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border/30">
        <div
          className="relative flex-shrink-0 w-10 h-10 rounded-xl gradient-red flex items-center justify-center shadow-button cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Play className="w-5 h-5 fill-current text-primary-foreground" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden cursor-pointer" onClick={() => navigate("/")}>
            <h1 className="text-lg font-bold text-foreground tracking-tight whitespace-nowrap">TubeSave Pro</h1>
            <p className="text-xs text-muted-foreground whitespace-nowrap">Download em 4K/8K</p>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-premium"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.label}
              whileHover={{ x: collapsed ? 0 : 4 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-premium group relative ${
                isActive
                  ? "gradient-red text-primary-foreground shadow-button"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full gradient-red text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border-t border-border/30 space-y-3">
          <div className="glass-card rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-semibold text-foreground">Pro Version</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full gradient-red rounded-full" style={{ width: "72%" }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">Premium ilimitado</p>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">v2.0.1 Premium</p>
        </motion.div>
      )}
    </motion.aside>
  );
}
