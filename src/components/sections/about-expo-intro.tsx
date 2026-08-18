import Image from "next/image";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import CTAButton from "@/components/shared/cta-button";
import { Sparkles } from "lucide-react";

export default function AboutExpoIntro() {
  return (
    <section className="relative bg-white py-8 sm:py-12 md:py-16 overflow-hidden">
      {/* Subtle ambient light */}
      <div className="pointer-events-none absolute -top-12 right-0 h-72 w-72 rounded-full bg-brand-amber/[0.04] blur-[90px]" />

      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Text Content */}
          <div className="lg:col-span-6">
            <SectionHeading
              kicker="Welcome To"
              title="THE 12th EDITION OF NEPAL WOOD INTERNATIONAL EXPO 2027"
              subtitle="Nepal Wood & Furniture International Expo is the region's most specialized and prestigious platform dedicated to the wood and furniture industry. Scheduled from 28th to 31st January 2027, the 12th edition brings together manufacturers, importers, traders, distributors, converters, and end-users on a single powerful stage."
            />

            <div className="mt-4 flex flex-col gap-3 font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Building on the remarkable success of the 11th edition, this year's expo has doubled its exhibition space to meet growing demand. With over 17,000 trade visitors expected and exhibitors from more than 7 countries, Nepal Wood 2027 is set to be the most impactful edition yet.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3.5">
              <CTAButton href="/about-show" className="h-11 px-5 text-sm font-semibold shadow-md">
                Explore the Show
              </CTAButton>

              <CTAButton href="/downloads/event-brochure" variant="outline" className="h-11 px-5 text-sm font-semibold">
                Download Brochure
              </CTAButton>
            </div>
          </div>

          {/* Right Visual Image Wrapper */}
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              {/* Main Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xl">
                <Image
                  src="/images/gallery/img-80.jpg"
                  alt="Business conversation at Nepal Wood International Expo"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Compact Floating Thumbnail */}
              <div className="absolute -bottom-4 -left-4 hidden h-28 w-28 overflow-hidden rounded-xl border-4 border-white shadow-xl lg:block">
                <Image
                  src="/images/gallery/img-71.jpg"
                  alt="Exhibition crowd at Nepal Wood Expo"
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              {/* Floating Highlight Badge */}
              <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 rounded-xl border border-amber-200/60 bg-white/90 px-3.5 py-2 shadow-md backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-800">12th Edition</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}