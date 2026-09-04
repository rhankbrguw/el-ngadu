import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Moon, Sun, UserPlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";
import { useTheme } from "@/hooks/useTheme";

const DesktopNavLinks = () => {
  const { LINKS } = LANDING_CONSTANTS.NAVBAR;
  return (
    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
      {LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-primary-foreground/80 hover:text-secondary transition-colors duration-200 text-sm font-medium relative group"
        >
          {link.label}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-200 group-hover:w-full" />
        </a>
      ))}
    </div>
  );
};

const ThemeToggleBtn = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-primary-foreground hover:text-secondary hover:bg-primary-foreground/10 h-9 w-9 rounded-full transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

const DesktopAuthButtons = () => {
  const { LOGIN, REGISTER } = LANDING_CONSTANTS.NAVBAR;
  return (
    <div className="hidden lg:flex items-center space-x-3">
      <ThemeToggleBtn />
      <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:text-secondary hover:bg-primary-foreground/10 font-medium text-sm px-3 transition-colors">
        <Link to="/login">{LOGIN}</Link>
      </Button>
      <Button asChild size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-sm shadow-md px-4 transition-all duration-200 hover:scale-105">
        <Link to="/register">{REGISTER}</Link>
      </Button>
    </div>
  );
};

const TabletAuthButtons = () => {
  const { LOGIN, REGISTER } = LANDING_CONSTANTS.NAVBAR;
  return (
    <div className="hidden md:flex lg:hidden items-center space-x-2">
      <ThemeToggleBtn />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary hover:bg-primary-foreground/10">
            <Link to="/login"><LogIn className="h-4 w-4" /></Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>{LOGIN}</p></TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon" className="text-primary-foreground hover:text-secondary hover:bg-primary-foreground/10">
            <Link to="/register"><UserPlus className="h-4 w-4" /></Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>{REGISTER}</p></TooltipContent>
      </Tooltip>
    </div>
  );
};


export function NavbarDesktop() {
  return (
    <>
      <DesktopNavLinks />
      <DesktopAuthButtons />
      <TabletAuthButtons />
    </>
  );
}


