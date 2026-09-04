import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";

const contactInfo = [
  { icon: <MapPin className="h-5 w-5 text-secondary-foreground dark:text-secondary" />, title: "Alamat", content: LANDING_CONSTANTS.CONTACT.ADDRESS },
  { icon: <Phone className="h-5 w-5 text-secondary-foreground dark:text-secondary" />, title: "Telepon", content: LANDING_CONSTANTS.CONTACT.PHONE },
  { icon: <Mail className="h-5 w-5 text-secondary-foreground dark:text-secondary" />, title: "Email", content: LANDING_CONSTANTS.CONTACT.EMAIL },
];

const ContactInfoCard = () => (
  <Card className="bg-background border-border/70 p-4 sm:p-6 shadow-sm">
    <CardHeader className="px-0 pt-0 pb-4"><CardTitle className="text-xl font-bold text-foreground">Informasi Kontak</CardTitle></CardHeader>
    <CardContent className="px-0 pb-0 space-y-5">
      {contactInfo.map((item) => (
        <div key={item.title} className="flex items-start gap-4">
          <div className="bg-secondary/80 dark:bg-secondary/20 p-3 rounded-xl shrink-0">{item.icon}</div>
          <div>
            <h4 className="font-semibold text-base text-foreground">{item.title}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed mt-0.5">{item.content}</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const ContactMessageCard = () => (
  <Card className="bg-background border-border/70 p-4 sm:p-6 shadow-sm">
    <CardHeader className="px-0 pt-0 pb-4"><CardTitle className="text-xl font-bold text-foreground">Kirim Pesan</CardTitle></CardHeader>
    <CardContent className="px-0 pb-0">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-sm font-medium">{APP_MESSAGES.AUTH.NAME_LABEL}</Label>
          <Input id="name" type="text" placeholder={APP_MESSAGES.LANDING.PLACEHOLDER_NAME} className="bg-card" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium">{APP_MESSAGES.AUTH.EMAIL_LABEL}</Label>
          <Input id="email" type="email" placeholder={APP_MESSAGES.LANDING.PLACEHOLDER_EMAIL} className="bg-card" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message" className="text-sm font-medium">{APP_MESSAGES.COMMON.MESSAGE}</Label>
          <Textarea id="message" placeholder={APP_MESSAGES.LANDING.PLACEHOLDER_MESSAGE} className="bg-card min-h-[100px]" />
        </div>
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md">
          {APP_MESSAGES.COMMON.SUBMIT}
        </Button>
      </form>
    </CardContent>
  </Card>
);

export function HubungiKamiSection() {
  return (
    <section id="kontak" className="py-16 md:py-20 bg-card border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">{APP_MESSAGES.LANDING.CONTACT_US}</h2>
          <div className="w-24 h-1 bg-secondary rounded-full mx-auto" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ContactInfoCard />
          <ContactMessageCard />
        </div>
      </div>
    </section>
  );
}



