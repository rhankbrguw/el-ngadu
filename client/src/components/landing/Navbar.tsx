import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";

const NavbarBrand = () => (
  <Link to="/" className="text-xl font-bold flex items-center gap-3 text-primary-foreground hover:text-secondary/90 transition-colors">
    <img src="/assets/image.png" alt={LANDING_CONSTANTS.NAVBAR.LOGO_ALT} className="h-9 w-9 rounded-lg" />
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
      className="text-primary-foreground hover:text-secondary hover:bg-primary-foreground/10 transition-colors"
      aria-label="Toggle menu"
    >
      {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  </div>
);

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <TooltipProvider>
      <nav className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <NavbarBrand />
            <NavbarDesktop />
            <MobileToggle isMenuOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
          </div>
          <NavbarMobile isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </nav>
    </TooltipProvider>
  );
}



