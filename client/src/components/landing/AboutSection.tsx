import { Check } from "lucide-react";

const features = [
 "Mudah digunakan dan diakses dari mana saja",
 "Proses pengaduan yang transparan",
 "Response cepat dari petugas",
];

export function AboutSection() {
 return (
 <section id="tentang" className="py-16 bg-card ">
 <div className="container mx-auto px-4">
 <div className="text-center mb-12">
 <h2 className="text-2xl font-bold text-foreground mb-4">Tentang El Ngadu</h2>
 <div className="w-24 h-1 bg-secondary mx-auto"></div>
 </div>
 <div className="grid md:grid-cols-2 gap-12 items-center">
 <div className="order-2 md:order-1">
 <h3 className="text-xl font-semibold text-foreground mb-4">Layanan Pengaduan Masyarakat Online</h3>
 <p className="text-muted-foreground mb-4">
 El Ngadu adalah platform pengaduan masyarakat yang memudahkan warga untuk menyampaikan keluhan, saran, dan aspirasi kepada pemerintah secara online.
 </p>
 <p className="text-muted-foreground mb-4">
 Dengan El Ngadu, pengaduan Anda akan diproses dengan cepat dan transparan. Anda juga dapat memantau status pengaduan yang telah disampaikan.
 </p>
 <ul className="space-y-3">
 {features.map((feature, index) => (
 <li key={index} className="flex items-center">
 <Check className="h-5 w-5 text-success mr-3 flex-shrink-0" />
 <span className="text-muted-foreground ">{feature}</span>
 </li>
 ))}
 </ul>
 </div>
 <div className="order-1 md:order-2 flex justify-center">
 <img src="/assets/image.png" alt="Tentang El Ngadu" className="max-w-md w-full h-auto rounded-lg shadow-xl" />
 </div>
 </div>
 </div>
 </section>
 );
}
