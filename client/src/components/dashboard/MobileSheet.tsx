import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/ui/sheet";
import { HelpCircle, LogOut, Moon, Sun } from "lucide-react";
import type { NavItem } from "@/types";

interface MobileSheetProps {
  navItems: NavItem[];
  onLogout: () => void;
  onClose?: () => void;
}

export default function MobileSheet({
  navItems,
  onLogout,
  onClose,
}: MobileSheetProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <SheetContent side="left" className="sm:max-w-xs p-0 flex flex-col h-full bg-background border-r">
      <div className="flex h-14 shrink-0 items-center px-4 border-b border-border/40">
        <Link
          to="/dashboard"
          onClick={handleNavClick}
          className="group flex items-center gap-2.5 text-lg font-bold text-primary"
        >
          <img
            src="/assets/image.png"
            alt="Logo El Ngadu"
            className="h-7 w-7 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">ElNgadu</span>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-3 border-t border-border/40 flex flex-col gap-1">
        <Button
          onClick={() => { toggleTheme(); }}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 h-9 px-3 text-xs text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </Button>
        <Button
          onClick={() => { handleNavClick(); navigate("/dashboard/help"); }}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 h-9 px-3 text-xs text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Bantuan</span>
        </Button>
        <Button
          onClick={() => { handleNavClick(); onLogout(); }}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 h-9 px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </SheetContent>
  );
}
