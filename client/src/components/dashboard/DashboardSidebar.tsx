import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { HelpCircle, LogOut, Moon, Sun } from "lucide-react";
import type { NavItem } from "@/types";
import { APP_MESSAGES } from "@/lib/constants/messages";


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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-border/60 bg-card md:flex transition-all duration-300 ease-in-out shadow-xs">
      <div className="flex h-14 shrink-0 items-center px-4 border-b border-border/40">
        <Link
          to="/dashboard"
          className="group flex items-center gap-2.5 text-lg font-bold text-primary hover:opacity-90 transition-opacity"
        >
          <img
            src="/assets/image.png"
            alt="Logo El Ngadu"
            className="h-7 w-7 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 tracking-tight">
            ElNgadu
          </span>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-xs sm:text-sm transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground font-medium"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <nav className="mt-auto flex flex-col gap-1 p-3 border-t border-border/40">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 h-9 px-3 text-xs text-muted-foreground hover:text-foreground transition-all duration-200"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 shrink-0" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 shrink-0" />
              <span>Dark Mode</span>
            </>
          )}
        </Button>

        <Button
          onClick={() => navigate("/dashboard/help")}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 h-9 px-3 text-xs text-muted-foreground hover:text-foreground transition-all duration-200 group"
        >
          <HelpCircle className="h-4 w-4 shrink-0 group-hover:scale-105 transition-transform" />
          <span>{APP_MESSAGES.HELP.TITLE}</span>
        </Button>

        <Button
          onClick={onLogout}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 h-9 px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group"
        >
          <LogOut className="h-4 w-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          <span>Logout</span>
        </Button>
      </nav>
    </aside>
  );
}
