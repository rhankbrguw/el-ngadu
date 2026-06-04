import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

const contactInfo = [
 { icon: <MapPin className="h-6 w-6 text-foreground" />, title: "Alamat", content: "Jl. Kelapa Dua, No 16, Jakarta Barat, Indonesia" },
 { icon: <Phone className="h-6 w-6 text-foreground" />, title: "Telepon", content: "+62 812 9629 9390" },
 { icon: <Mail className="h-6 w-6 text-foreground" />, title: "Email", content: "fahmicucian@gmail.com" },
];

export function ContactSection() {
 return (
 <section id="kontak" className="py-16 bg-card ">
 <div className="container mx-auto px-4">
 <div className="text-center mb-12">
 <h2 className="text-2xl font-bold text-foreground mb-4">Hubungi Kami</h2>
 <div className="w-24 h-1 bg-secondary mx-auto"></div>
 </div>
 <div className="grid lg:grid-cols-2 gap-12">
 <Card className="p-2">
 <CardHeader>
 <CardTitle>Informasi Kontak</CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
 {contactInfo.map((item) => (
 <div key={item.title} className="flex items-start gap-4">
 <div className="bg-secondary/80 p-3 rounded-full">{item.icon}</div>
 <div>
 <h4 className="font-semibold text-lg">{item.title}</h4>
 <p className="text-muted-foreground ">{item.content}</p>
 </div>
 </div>
 ))}
 </CardContent>
 </Card>
 <Card className="p-2">
 <CardHeader>
 <CardTitle>Kirim Pesan</CardTitle>
 </CardHeader>
 <CardContent>
 <form className="space-y-3">
 <div className="grid gap-2">
 <Label htmlFor="name">Nama Lengkap</Label>
 <Input id="name" type="text" placeholder="Nama Anda" />
 </div>
 <div className="grid gap-2">
 <Label htmlFor="email">Email</Label>
 <Input id="email" type="email" placeholder="email@anda.com" />
 </div>
 <div className="grid gap-2">
 <Label htmlFor="message">Pesan</Label>
 <Textarea id="message" placeholder="Tulis pesan Anda di sini..." />
 </div>
 <Button type="submit" className="w-full ">Kirim Pesan</Button>
 </form>
 </CardContent>
 </Card>
 </div>
 </div>
 </section>
 );
}
