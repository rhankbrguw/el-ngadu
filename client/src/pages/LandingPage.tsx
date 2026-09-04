import { useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { AboutSection } from "@/components/landing/AboutSection";
import { FlowSection } from "@/components/landing/FlowSection";
import { HubungiKamiSection } from "@/components/landing/HubungiKamiSection";
import { Footer } from "@/components/landing/Footer";

function useSmoothScroll() {
  useEffect(() => {
    const handleNavLinkClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest("a");
      if (target && target.hash && target.hash.startsWith("#")) {
        const targetElement = document.getElementById(target.hash.substring(1));
        if (targetElement) {
          event.preventDefault();
          const navHeight = document.querySelector("nav")?.offsetHeight || 64;
          const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    };
    document.addEventListener("click", handleNavLinkClick);
    return () => document.removeEventListener("click", handleNavLinkClick);
  }, []);
}


export default function LandingPage() {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-secondary/30 selection:text-foreground">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Stats />
        <AboutSection />
        <FlowSection />
        <HubungiKamiSection />
      </main>
      <Footer />
    </div>
  );
}



