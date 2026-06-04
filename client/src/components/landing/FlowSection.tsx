import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
 { step: 1, title: "Registrasi", description: "Daftar akun dengan mengisi data diri Anda secara lengkap." },
 { step: 2, title: "Tulis Pengaduan", description: "Sampaikan keluhan atau aspirasi Anda dengan jelas dan lengkap." },
 { step: 3, title: "Verifikasi", description: "Pengaduan Anda akan diverifikasi oleh petugas." },
 { step: 4, title: "Response", description: "Dapatkan tanggapan dan tindak lanjut dari petugas." },
];

export function FlowSection() {
 return (
 <section id="alur" className="py-16 bg-background ">
 <div className="container mx-auto px-4">
 <div className="text-center mb-12">
 <h2 className="text-2xl font-bold text-foreground mb-4">Alur Pengaduan</h2>
 <div className="w-24 h-1 bg-secondary mx-auto"></div>
 <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
 Berikut adalah langkah-langkah mudah untuk membuat pengaduan melalui platform El Ngadu.
 </p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {steps.map((item, index) => (
 <Card key={item.step} style={{ animationDelay: `${index * 150}ms` }} className="text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-secondary/50 group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
 <CardHeader>
 <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold transition-colors group-hover:bg-secondary group-hover:text-foreground">
 {item.step}
 </div>
 <CardTitle className="group-hover:text-secondary/90 transition-colors">{item.title}</CardTitle>
 </CardHeader>
 <CardContent>
 <p className="text-muted-foreground ">{item.description}</p>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 </section>
 );
}
