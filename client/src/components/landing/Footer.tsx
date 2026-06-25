import { Link } from "react-router-dom";
import { APP_MESSAGES } from "@/lib/constants/messages";

export function Footer() {
 return (
  <footer className="bg-primary text-primary-foreground/80 py-12">
  <div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
  <div className="md:col-span-2">
  <Link to="/" className="text-xl font-bold flex items-center gap-2 text-primary-foreground mb-2">
  <img src="/assets/image.png" alt="Logo El Ngadu" className="h-10" />
  <span>El Ngadu</span>
  </Link>
  <p className="text-primary-foreground/80">{APP_MESSAGES.LANDING.FOOTER_DESC}</p>
  </div>
  <div>
  <h3 className="font-semibold text-primary-foreground mb-4">Navigasi</h3>
  <ul className="space-y-2">
  <li><a href="#tentang" className="hover:text-secondary transition-colors">Tentang</a></li>
  <li><a href="#alur" className="hover:text-secondary transition-colors">Alur Pengaduan</a></li>
  <li><a href="#kontak" className="hover:text-secondary transition-colors">Kontak</a></li>
  </ul>
  </div>
  <div>
  <h3 className="font-semibold text-primary-foreground mb-4">Akses Cepat</h3>
  <ul className="space-y-2">
  <li><Link to="/login" className="hover:text-secondary transition-colors">Masuk</Link></li>
  <li><Link to="/register" className="hover:text-secondary transition-colors">Daftar</Link></li>
  <li><Link to="/login" className="hover:text-secondary transition-colors">{APP_MESSAGES.COMPLAINT.CREATE}</Link></li>
  </ul>
  </div>
  </div>
  <div className="border-t border-primary-foreground/20 pt-6 text-center text-primary-foreground/60">
  <p>&copy; {new Date().getFullYear()} El Ngadu. {APP_MESSAGES.LANDING.COPYRIGHT}</p>
  </div>
  </div>
  </footer>
 );
}
