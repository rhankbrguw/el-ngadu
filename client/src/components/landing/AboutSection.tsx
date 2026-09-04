import { Check } from "lucide-react";
import { LANDING_CONSTANTS } from "@/lib/constants/landing";

const AboutFeatures = () => (
  <ul className="space-y-3 pt-2">
    {LANDING_CONSTANTS.ABOUT.FEATURES.map((feature) => (
      <li key={feature} className="flex items-center gap-3">
        <div className="h-5 w-5 rounded-full bg-success/15 flex items-center justify-center shrink-0">
          <Check className="h-3.5 w-3.5 text-success" />
        </div>
        <span className="text-foreground/90 text-sm sm:text-base font-medium">{feature}</span>
      </li>
    ))}
  </ul>
);

const AboutContent = () => (
  <div className="order-2 lg:order-1 space-y-4">
    <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{LANDING_CONSTANTS.ABOUT.SUBTITLE}</h3>
    <p className="text-muted-foreground leading-relaxed">{LANDING_CONSTANTS.ABOUT.DESC_1}</p>
    <p className="text-muted-foreground leading-relaxed">{LANDING_CONSTANTS.ABOUT.DESC_2}</p>
    <AboutFeatures />
  </div>
);

export function AboutSection() {
  return (
    <section id="tentang" className="py-16 md:py-20 bg-card border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">{LANDING_CONSTANTS.ABOUT.TITLE}</h2>
          <div className="w-24 h-1 bg-secondary rounded-full mx-auto" />
        </div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AboutContent />
          <div className="order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-full max-w-md rounded-2xl border border-border/70 bg-background p-2 sm:p-3 shadow-xl">
              <img src="/assets/image.png" alt={LANDING_CONSTANTS.ABOUT.IMAGE_ALT} className="w-full h-auto rounded-xl object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



