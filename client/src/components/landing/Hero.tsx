import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";

const HeroActions = () => (
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-stretch sm:items-center">
    <Button
      asChild
      size="lg"
      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-6 py-5 sm:flex-none shadow-lg transition-all duration-200 hover:scale-105 active:scale-[0.98]"
    >
      <Link to="/register" className="flex items-center justify-center gap-2">
        <span>{APP_MESSAGES.LANDING.HERO_CTA}</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
    <Button
      asChild
      size="lg"
      variant="outline"
      className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary font-medium px-6 py-5 sm:flex-none transition-all duration-200 hover:scale-105 active:scale-[0.98]"
    >
      <a href="#alur">{APP_MESSAGES.LANDING.HERO_SECONDARY_CTA}</a>
    </Button>
  </div>
);

const HeroText = () => (
  <div className="flex flex-col justify-center text-center lg:text-left space-y-5 max-w-xl mx-auto lg:mx-0 order-2 lg:order-1">
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-xs sm:text-sm font-semibold text-secondary self-center lg:self-start">
      <Sparkles className="h-3.5 w-3.5 text-secondary" />
      <span>{LANDING_CONSTANTS.HERO.BADGE}</span>
    </div>
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary-foreground leading-[1.2]">
      {APP_MESSAGES.LANDING.HERO_TITLE}
    </h1>
    <p className="text-base sm:text-lg text-primary-foreground/80 leading-relaxed">
      {APP_MESSAGES.LANDING.HERO_SUBTITLE}
    </p>
    <HeroActions />
  </div>
);

const HeroImage = () => (
  <div className="flex justify-center lg:justify-end items-center order-1 lg:order-2 w-full">
    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-md group">
      <div className="absolute -inset-3 bg-gradient-to-tr from-secondary/40 via-primary-foreground/10 to-secondary/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary-foreground/20 bg-primary-foreground/5 p-2 sm:p-3 transition-transform duration-500 group-hover:scale-[1.01]">
        <img src="/assets/image.png" alt="Ilustrasi Pengaduan Masyarakat" className="w-full h-auto object-cover rounded-xl" />
      </div>
    </div>
  </div>
);

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground py-12 md:py-16 lg:py-20 shadow-inner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <HeroText />
          <HeroImage />
        </div>
      </div>
    </section>
  );
}



