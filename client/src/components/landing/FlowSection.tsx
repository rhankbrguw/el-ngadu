import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
 { step: 1, title: "Registrasi", description: "Daftar akun dengan mengisi data diri Anda secara lengkap." },
 { step: 2, title: "Tulis Pengaduan", description: "Sampaikan keluhan atau aspirasi Anda dengan jelas dan lengkap." },
 { step: 3, title: "Verifikasi", description: "Pengaduan Anda akan diverifikasi oleh petugas." },
 { step: 4, title: "Response", description: "Dapatkan tanggapan dan tindak lanjut dari petugas." },
];

type StepItem = (typeof steps)[number];

const StepCard = ({ item }: { item: StepItem }) => (
  <Card className="text-center bg-card border-border/70 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group">
    <CardHeader className="pb-2">
      <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground shadow-md">
        {item.step}
      </div>
      <CardTitle className="text-base sm:text-lg font-bold text-foreground group-hover:text-secondary transition-colors">{item.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
    </CardContent>
  </Card>
);

export function FlowSection() {
  return (
    <section id="alur" className="py-16 md:py-20 bg-background border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">Alur Pengaduan</h2>
          <div className="w-24 h-1 bg-secondary rounded-full mx-auto" />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Berikut adalah langkah-langkah mudah untuk membuat pengaduan melalui platform El Ngadu.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <StepCard key={item.step} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}


