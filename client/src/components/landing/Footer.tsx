import { Link } from "react-router-dom";

export function Footer() {
 return (
 <footer className="bg-background text-muted-foreground py-12">
 <div className="container mx-auto px-4">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
 <div className="md:col-span-2">
 <Link to="/" className="text-xl font-bold flex items-center gap-2 text-primary-foreground mb-2">
 <img src="/assets/image.png" alt="Logo El Ngadu" className="h-10" />
 <span>El Ngadu</span>
 </Link>
 <p className="text-muted-foreground">Platform Pengaduan Masyarakat Online.</p>
 </div>
 <div>
 <h3 className="font-semibold text-primary-foreground mb-4">Navigasi</h3>
 <ul className="space-y-2">
 <li><a href="#tentang" className="hover:text-primary-foreground">Tentang</a></li>
 <li><a href="#alur" className="hover:text-primary-foreground">Alur Pengaduan</a></li>
 <li><a href="#kontak" className="hover:text-primary-foreground">Kontak</a></li>
 </ul>
 </div>
 <div>
 <h3 className="font-semibold text-primary-foreground mb-4">Akses Cepat</h3>
 <ul className="space-y-2">
 <li><Link to="/login" className="hover:text-primary-foreground">Masuk</Link></li>
 <li><Link to="/register" className="hover:text-primary-foreground">Daftar</Link></li>
 <li><Link to="/login" className="hover:text-primary-foreground">Buat Pengaduan</Link></li>
 </ul>
 </div>
 </div>
 <div className="border-t border-border pt-6 text-center text-muted-foreground">
 <p>&copy; {new Date().getFullYear()} El Ngadu. Hak Cipta Dilindungi.</p>
 </div>
 </div>
 </footer>
 );
}
