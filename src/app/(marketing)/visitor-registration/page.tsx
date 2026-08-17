import type { Metadata } from "next";
import {
  Briefcase,
  IdCard,
  TicketCheck,
  Mail,
  PhoneCall,
  HelpCircle,
  Zap,
  ShieldCheck,
  Clock,
} from "lucide-react";

import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import VisitorRegistrationForm from "@/components/forms/visitor-registration-form";

export const metadata: Metadata = {
  title: "Visitor Registration | Nepal Wood International Expo 2027",
  description:
    "Register to visit Nepal Wood International Expo 2027, 28-31 January at Bhrikuti Mandap, Kathmandu.",
};

const infoPoints = [
  {
    icon: Briefcase,
    title: "Trade-Focused Event",
    body: "Registration is intended for industry professionals, business owners, architects, interior designers, and trade stakeholders.",
  },
  {
    icon: IdCard,
    title: "Carry Valid Identification",
    body: "Visitors may be requested to present a business card, company ID, or valid photo identification at the express counter.",
  },
  {
    icon: TicketCheck,
    title: "Instant Entry Pass Confirmation",
    body: "Digital entry badge and event schedules will be delivered straight to your registered email upon submission.",
  },
];

const highlights = [
  { icon: Zap, title: "Express Check-In", desc: "Skip physical queues" },
  { icon: ShieldCheck, title: "Verified Pass", desc: "Official trade badge" },
  { icon: Clock, title: "Free Entry", desc: "Pre-registered visitors" },
];

export default function VisitorRegistrationPage() {
  return (
    <>
      {/* Hero Page Banner */}
      <PageBanner
        kicker="Visit Nepal Wood 2027"
        title="Register for Visitor Pass"
        subtitle="Complete the form below to receive your official visitor confirmation badge and exclusive expo insights."
        bgImage="/images/gallery/stand-detail-4.webp"
      />

      <section className="bg-slate-50/50 py-12 lg:py-16">
        <Container>
          {/* Quick Perks / Trust Bar */}
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-xl border border-brand-brown/10 bg-white p-4 shadow-xs transition-all duration-200 hover:border-brand-amber/40 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-cream/60 text-brand-maroon">
                    <Icon className="h-5 w-5 text-brand-amber" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-brand-brown">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-brown/70">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            {/* Main Form Container */}
            <main className="lg:col-span-8">
              <div className="rounded-3xl border border-brand-brown/10 bg-white p-6 sm:p-8 md:p-10 shadow-premium-lg">
                <div className="mb-8 border-b border-brand-brown/10 pb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-amber/10 px-3 py-1 text-xs font-bold text-brand-brown mb-3">
                    <span className="h-2 w-2 rounded-full bg-brand-amber animate-pulse" />
                    Fast-Track Registration
                  </div>
                  <h2 className="font-display text-2xl font-bold text-brand-brown sm:text-3xl">
                    Visitor Registration Form
                  </h2>
                  <p className="mt-2 text-sm text-brand-brown/75 leading-relaxed">
                    Please fill out your verified professional details to ensure seamless badge issuance at Bhrikuti Mandap.
                  </p>
                </div>

                {/* Registration Form Component */}
                <VisitorRegistrationForm />
              </div>
            </main>

            {/* Sidebar Guidelines & VIP Helpdesk */}
            <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-28">
              {/* Guidelines Box */}
              <div className="rounded-3xl border border-brand-brown/10 bg-white p-6 shadow-premium space-y-5">
                <h3 className="font-display text-lg font-bold text-brand-brown flex items-center gap-2.5 border-b border-brand-brown/10 pb-4">
                  <HelpCircle className="h-5 w-5 text-brand-amber" />
                  <span>Important Guidelines</span>
                </h3>

                <div className="space-y-3.5">
                  {infoPoints.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.title}
                        className="group rounded-2xl border border-brand-brown/5 bg-brand-cream/30 p-4 transition-all duration-300 hover:border-brand-amber/40 hover:bg-white hover:shadow-md"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-maroon shadow-xs group-hover:bg-brand-brown group-hover:text-brand-amber transition-colors duration-300">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-display text-xs font-extrabold uppercase tracking-wider text-brand-brown">
                              {p.title}
                            </h4>
                            <p className="mt-1 text-xs leading-relaxed text-brand-brown/75">
                              {p.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

           {/* VIP / Delegation Support Card (Clean Light Theme & Compact) */}
<div className="relative overflow-hidden rounded-xl border border-brand-brown/10 bg-white p-4 text-brand-brown shadow-xs">
  {/* Ambient Subtle Glow */}
  <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-brand-amber/10 blur-xl pointer-events-none" />

  <div className="relative z-10">
    <span className="inline-block rounded-md bg-brand-brown/5 border border-brand-brown/10 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase text-brand-brown">
      Direct Support
    </span>

    <h4 className="mt-2 font-display text-base font-bold text-brand-brown">
      Need Group or VIP Assistance?
    </h4>
    <p className="mt-1 text-xs text-brand-brown/75 leading-relaxed">
      For delegation passes, international buyer matchmaking, or registration support, contact our desk directly:
    </p>

    <div className="mt-3.5 space-y-2 text-xs font-medium">
      <a
        href="mailto:info@mss.com.np"
        className="flex items-center gap-2.5 rounded-lg border border-brand-brown/10 bg-brand-cream/10 p-2 text-brand-brown hover:border-brand-amber/40 hover:bg-white hover:text-brand-amber transition-all duration-200"
      >
        <Mail className="h-3.5 w-3.5 text-brand-amber shrink-0" />
        <span className="truncate">info@mss.com.np</span>
      </a>
      <a
        href="tel:+977015970000"
        className="flex items-center gap-2.5 rounded-lg border border-brand-brown/10 bg-brand-cream/10 p-2 text-brand-brown hover:border-brand-amber/40 hover:bg-white hover:text-brand-amber transition-all duration-200"
      >
        <PhoneCall className="h-3.5 w-3.5 text-brand-amber shrink-0" />
        <span>+977 9801171141</span>
      </a>
    </div>
  </div>
</div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}