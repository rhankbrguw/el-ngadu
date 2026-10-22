import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DesktopNavLinks, DesktopAuthButtons, TabletAuthButtons } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";

const NavbarBrand = () => (
  <Link to="/" className="text-base sm:text-lg font-bold flex items-center gap-2 text-primary-foreground hover:text-secondary/90 transition-colors shrink-0">
    <img src="/assets/image.png" alt={LANDING_CONSTANTS.NAVBAR.LOGO_ALT} className="h-8 w-8 rounded-lg shadow-xs" />
    <span className="tracking-tight">{LANDING_CONSTANTS.NAVBAR.APP_NAME}</span>
  </Link>
);

interface MobileToggleProps {
  isMenuOpen: boolean;
  onToggle: () => void;
}

const MobileToggle = ({ isMenuOpen, onToggle }: MobileToggleProps) => (
  <div className="md:hidden">
    <Button
      onClick={onToggle}
      variant="ghost"
      size="icon"
      className="text-primary-foreground hover:text-secondary hover:bg-primary-foreground/10 transition-colors h-8 w-8"
      aria-label="Toggle menu"
    >
      {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  </div>
);

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <TooltipProvider>
      <nav className="bg-primary text-primary-foreground shadow-xs sticky top-0 z-50 transition-colors border-b border-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-14 relative">
            <NavbarBrand />

            <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
              <DesktopNavLinks />
            </div>

            <div className="flex items-center gap-2">
              <DesktopAuthButtons />
              <TabletAuthButtons />
              <MobileToggle isMenuOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
            </div>
          </div>
          <NavbarMobile isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </nav>
    </TooltipProvider>
  );
}
