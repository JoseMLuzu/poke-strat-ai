import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  BookOpen,
  Grid3X3,
  Users,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Sparkles },
  { path: "/pokedex", label: "Pokédex", icon: BookOpen },
  { path: "/type-chart", label: "Type Chart", icon: Grid3X3 },
  { path: "/team-builder", label: "Team Builder", icon: Users },
  { path: "/ai-chat", label: "AI Strategist", icon: MessageSquare },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo: círculo naranja con estrella + texto PokéStrat AI */}
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,170,0,0.5)]"
              aria-hidden
            >
              <Sparkles
                className="w-5 h-5 text-primary-foreground"
                strokeWidth={2.5}
              />
            </div>
            <span className="font-semibold text-xl tracking-wide">
              <span className="text-primary">PokéStrat</span>
              <span className="text-accent"> AI</span>
            </span>
          </Link>

          {/* Desktop: enlaces con icono + texto, activo naranja con glow, inactivo gris */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary shadow-[0_0_12px_rgba(255,170,0,0.4)]"
                      : "text-muted-foreground hover:text-primary",
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-1">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "text-primary shadow-[0_0_12px_rgba(255,170,0,0.4)]"
                      : "text-muted-foreground hover:text-primary",
                  )}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
