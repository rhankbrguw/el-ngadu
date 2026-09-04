import { Link } from "react-router-dom";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";

const FooterBrand = () => (
  <div className="md:col-span-2 space-y-3">
    <Link to="/" className="text-xl font-bold flex items-center gap-2.5 text-primary-foreground hover:text-secondary/90 transition-colors">
      <img src="/assets/image.png" alt={LANDING_CONSTANTS.NAVBAR.LOGO_ALT} className="h-9 w-9 rounded-lg" />
      <span className="tracking-tight">{LANDING_CONSTANTS.FOOTER.APP_NAME}</span>
    </Link>
    <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-sm">{APP_MESSAGES.LANDING.FOOTER_DESC}</p>
  </div>
);

const FooterNav = () => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground">{LANDING_CONSTANTS.FOOTER.NAV_TITLE}</h3>
    <ul className="space-y-2">
      {LANDING_CONSTANTS.NAVBAR.LINKS.map((link) => (
        <li key={link.href}>
          <a href={link.href} className="text-sm text-primary-foreground/75 hover:text-secondary transition-colors">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const FooterQuickAccess = () => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground">{LANDING_CONSTANTS.FOOTER.QUICK_ACCESS_TITLE}</h3>
    <ul className="space-y-2">
      <li><Link to="/login" className="text-sm text-primary-foreground/75 hover:text-secondary transition-colors">{LANDING_CONSTANTS.FOOTER.LOGIN}</Link></li>
      <li><Link to="/register" className="text-sm text-primary-foreground/75 hover:text-secondary transition-colors">{LANDING_CONSTANTS.FOOTER.REGISTER}</Link></li>
      <li><Link to="/login" className="text-sm text-primary-foreground/75 hover:text-secondary transition-colors">{APP_MESSAGES.COMPLAINT.CREATE}</Link></li>
    </ul>
  </div>
);

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/80 py-12 md:py-16 shadow-inner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10">
          <FooterBrand />
          <FooterNav />
          <FooterQuickAccess />
        </div>
        <div className="border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} {LANDING_CONSTANTS.FOOTER.APP_NAME}. {APP_MESSAGES.LANDING.COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  );
}



