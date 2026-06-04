import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";

/**
 * Main navigation bar component for the landing page.
 * Includes responsive layout, desktop/tablet navigation, and a mobile hamburger menu.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { APP_NAME, LOGO_ALT } = LANDING_CONSTANTS.NAVBAR;

  return (
    <TooltipProvider>
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/"
              className="text-xl font-bold flex items-center gap-3 hover:text-yellow-400 transition-colors"
            >
              <img
                src="/assets/image.png"
                alt={LOGO_ALT}
                className="h-10 w-10 rounded-lg"
              />
              <span>{APP_NAME}</span>
            </Link>

            <NavbarDesktop />

            <div className="md:hidden">
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          <NavbarMobile isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </nav>
    </TooltipProvider>
  );
}
