import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-slate-900 text-white py-5 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-12 items-center min-h-[500px] lg:min-h-[450px]">
          {/* Text Content - Centered on mobile/tablet, positioned slightly right on desktop */}
          <div className="text-center lg:text-left order-2 lg:order-1 space-y-3 lg:pl-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              Suarakan Aspirasi, Wujudkan Perubahan.
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-lg mx-auto lg:mx-0 delay-150 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
              El Ngadu adalah jembatan antara Anda dan pemerintah. Laporkan
              masalah, berikan masukan, dan pantau prosesnya dengan mudah dan
              transparan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start max-w-lg mx-auto lg:mx-0 delay-300 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
              <Button
                asChild
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 text-base font-semibold px-5 py-4 flex-1 sm:flex-none transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-yellow-500/25"
              >
                <Link to="/register">Buat Pengaduan Sekarang</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base font-semibold bg-white text-slate-900 hover:bg-slate-200 dark:bg-transparent dark:border-slate-400 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white px-5 py-4 flex-1 sm:flex-none transition-all hover:scale-105 active:scale-95"
              >
                <a href="#alur">Pelajari Alur</a>
              </Button>
            </div>
          </div>

          {/* Image - Centered on mobile/tablet, positioned slightly left on desktop */}
          <div className="flex justify-center lg:justify-start order-1 lg:order-2 lg:pr-8 animate-in fade-in zoom-in-95 duration-1000 delay-200 fill-mode-both">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-md relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-primary rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <img
                src="/assets/image.png"
                alt="Ilustrasi Pengaduan Masyarakat"
                className="relative w-full h-auto rounded-lg shadow-2xl transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
