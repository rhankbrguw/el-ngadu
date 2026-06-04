import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";

interface NavbarMobileProps {
 isMenuOpen: boolean;
 setIsMenuOpen: (isOpen: boolean) => void;
}

/**
 * Mobile navigation menu dropdown for the landing page.
 * Displays navigation links and authentication buttons vertically when open.
 *
 * @param props - Component properties containing menu state
 */
export function NavbarMobile({ isMenuOpen, setIsMenuOpen }: NavbarMobileProps) {
 if (!isMenuOpen) return null;

 const { LINKS, LOGIN, REGISTER } = LANDING_CONSTANTS.NAVBAR;

 return (
 <div className="md:hidden pb-4">
 <div className="bg-card rounded-lg p-4 shadow-xl border border-border">
 <div className="flex flex-col space-y-3">
 {LINKS.map((link) => (
 <a
 key={link.href}
 href={link.href}
 onClick={() => setIsMenuOpen(false)}
 className="block text-muted-foreground hover:text-secondary/80 transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-accent"
 >
 {link.label}
 </a>
 ))}
 <div className="border-t border-border pt-6 flex flex-col space-y-3">
 <Button
 asChild
 size="lg"
 className="w-full text-primary-foreground bg-primary/90 hover:bg-primary transition-all duration-200 font-semibold"
 >
 <Link to="/login">{LOGIN}</Link>
 </Button>
 <Button
 asChild
 size="lg"
 className="bg-secondary hover:bg-secondary/90 text-foreground w-full font-semibold transition-all duration-200 shadow-lg"
 >
 <Link to="/register">{REGISTER}</Link>
 </Button>
 </div>
 </div>
 </div>
 </div>
 );
}
