import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";
import { useTheme } from "@/hooks/useTheme";

interface NavbarMobileProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const MobileAuthSection = ({
  login,
  register,
  onClose,
}: {
  login: string;
  register: string;
  onClose: () => void;
}) => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="border-t border-border pt-4 mt-2 flex flex-col space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-full justify-center gap-2 text-foreground border-border bg-background hover:bg-muted font-medium"
      >
        {theme === "dark" ? <Sun className="h-4 w-4 text-secondary" /> : <Moon className="h-4 w-4 text-primary" />}
        <span>{theme === "dark" ? "Mode Terang" : "Mode Gelap"}</span>
      </Button>
      <Button asChild variant="ghost" className="w-full text-foreground hover:bg-muted font-medium justify-center" onClick={onClose}>
        <Link to="/login">{login}</Link>
      </Button>
      <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full font-semibold shadow-md justify-center" onClick={onClose}>
        <Link to="/register">{register}</Link>
      </Button>
    </div>
  );
};

export function NavbarMobile({ isMenuOpen, setIsMenuOpen }: NavbarMobileProps) {
  if (!isMenuOpen) return null;
  const { LINKS, LOGIN, REGISTER } = LANDING_CONSTANTS.NAVBAR;

  const handleScroll = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("#")) {
      const el = document.getElementById(href.substring(1));
      if (el) {
        const navHeight = document.querySelector("nav")?.offsetHeight || 64;
        const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="md:hidden pb-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="bg-card text-card-foreground rounded-xl p-4 shadow-2xl border border-border">
        <div className="flex flex-col space-y-1">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleScroll(link.href);
              }}
              className="block text-foreground/80 hover:text-foreground hover:bg-muted/80 transition-colors py-2.5 px-3 rounded-lg font-medium text-sm cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <MobileAuthSection login={LOGIN} register={REGISTER} onClose={() => setIsMenuOpen(false)} />
        </div>
      </div>
    </div>
  );
}


