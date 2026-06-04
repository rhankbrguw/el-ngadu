import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, LogOut, Moon, Sun } from "lucide-react";
import type { NavItem } from "@/types";

interface DashboardSidebarProps {
  navItems: NavItem[];
  onLogout: () => void;
}

export default function DashboardSidebar({ navItems, onLogout }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background md:flex transition-all duration-300 ease-in-out shadow-lg">
      <div className="flex h-14 shrink-0 items-center px-4 border-b border-border/40">
        <Link
          to="/dashboard"
          className="group flex items-center gap-3 text-xl font-bold text-primary"
        >
          <img
            src="/assets/image.png"
            alt="Logo El Ngadu"
            className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">ElNgadu</span>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5 p-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
              }`
            }
          >
            <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <nav className="mt-auto flex flex-col gap-1.5 p-4 border-t border-border/40">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          className="w-full justify-start gap-3 h-10 px-3 text-muted-foreground hover:text-foreground transition-all duration-200"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </>
          )}
        </Button>

        <Button
          onClick={() => navigate("/dashboard/help")}
          variant="ghost"
          className="w-full justify-start gap-3 h-10 px-3 text-muted-foreground hover:text-foreground transition-all duration-200 group"
        >
          <HelpCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span>Bantuan</span>
        </Button>

        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start gap-3 h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group mt-2"
        >
          <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          <span>Logout</span>
        </Button>
      </nav>
    </aside>
  );
}
