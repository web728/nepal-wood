"use client";

import Container from "@/components/shared/container";
import CTAButton from "@/components/shared/cta-button";
import { useBatchReveal } from "@/hooks/useBatchReveal";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { Accordion, AccordionItem } from "@heroui/react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Cog,
  Handshake,
  MapPin,
  MessageCircleMore,
  Sprout,
  TreePine,
  Zap,
} from "lucide-react";
import ConclaveRegistrationForms from "./conclave-registration-forms";

const themes = [
  {
    tag: "Seminar A • Forestry",
    title: "Silvicultural Management of Alnus nepalensis (Uttis)",
    description:
      "Optimizing rotation cycles and harvesting techniques for Nepal's primary plywood timber in the sub-tropical mid-hills.",
    icon: TreePine,
  },
  {
    tag: "Seminar B • Agroforestry",
    title: "Commercial Agroforestry in the Terai",
    description:
      "Intercropping models using Eucalyptus and Populus alongside seasonal cash crops to supply veneer mills.",
    icon: Sprout,
  },
  {
    tag: "Seminar C • Efficiency",
    title: "VINCHI – Optimization of Energy Consumption",
    description:
      "High-Moisture Assembly vs. Intensive Veneer Drying: understanding energy optimization alternatives.",
    icon: Zap,
  },
  {
    tag: "Seminar E • Automation",
    title: "Smart Plywood Factory – From Log to Product",
    description:
      "The fully automated journey through integrated, modern plywood manufacturing.",
    icon: Cog,
  },
  {
    tag: "Seminar D • Distribution",
    title: "Bridging the Manufacturer–Dealer Gap",
    description:
      "Dealers' expectations and stronger relationships across supply, service and market development.",
    icon: Handshake,
  },
] as const;

const agenda = [
  { time: "09:30 – 10:00", code: "ARRIVAL", title: "Registration & Seating", detail: "Delegate check-in and welcome" },
  { time: "10:00 – 10:10", code: "OPENING", title: "Opening Remarks", detail: "Welcome by the organizers and overview of the day" },
  { time: "10:10 – 10:50", code: "SEMINAR A", title: "Silvicultural Management of Alnus nepalensis (Uttis)", detail: "Rotation cycles and harvesting techniques" },
  { time: "10:50 – 11:30", code: "SEMINAR B", title: "Commercial Agroforestry in the Terai", detail: "Eucalyptus, Populus and seasonal cash-crop intercropping" },
  { time: "11:30 – 12:10", code: "SEMINAR C", title: "VINCHI – Optimization of Energy Consumption", detail: "High-Moisture Assembly vs. Intensive Veneer Drying" },
  { time: "12:10 – 12:50", code: "SEMINAR E", title: "Smart Plywood Factory – From Log to Product", detail: "The fully automated journey" },
  { time: "12:50 – 13:30", code: "SEMINAR D", title: "Bridging the Manufacturer–Dealer Gap", detail: "Dealers' expectations" },
  { time: "13:30 – 14:00", code: "PANEL + Q&A", title: "Panel Discussion & Open Q&A", detail: "All speakers, manufacturers and dealers" },
  { time: "14:00 – 14:10", code: "CLOSING", title: "Closing & Vote of Thanks", detail: "Conclusion of the Technical Conclave" },
] as const;

const audiences = [
  { title: "Timber & Forestry", description: "Forestry specialists, agroforestry practitioners, plantation owners and timber suppliers." },
  { title: "Manufacturing", description: "Plywood, veneer, panel and furniture production managers and factory owners." },
  { title: "Machinery & Technology", description: "Automation providers, OEMs, process engineers and technical consultants." },
  { title: "Dealers & Distributors", description: "Dealers, importers, distributors and industry business-development teams." },
  { title: "Institutions & Associations", description: "Trade bodies, academic researchers, technical institutions and policy stakeholders." },
  { title: "Industry Decision-Makers", description: "Founders, directors, purchasing heads and senior operations teams." },
] as const;

const faqs = [
  {
    question: "Is this part of Nepal Wood International Expo 2027?",
    answer:
      "Yes. The Technical Conclave is planned alongside the 12th Nepal Wood International Expo 2027. The expo runs 28–31 January at Bhrikuti Mandap, Kathmandu.",
  },
  {
    question: "Is the conclave date confirmed?",
    answer:
      "Not yet. The supplied programme marks it as Day 2 and leaves the date blank. 29 January 2027 is the proposed date inferred from the expo schedule and must be confirmed by the organizers.",
  },
  {
    question: "Are the speakers announced?",
    answer:
      "No speaker names have been confirmed in the supplied programme. The speaker application is intended for expressions of interest and review.",
  },
  {
    question: "Does registration guarantee attendance or a speaking slot?",
    answer:
      "No. Registrations and applications will be reviewed or confirmed by the event organizers.",
  },
  {
    question: "Is there a participation fee?",
    answer:
      "Conclave-specific fee and attendance eligibility have not yet been supplied. Please await organizer confirmation before any payment or travel commitment.",
  },
  {
    question: "How long are the seminars?",
    answer:
      "Each seminar is allocated 40 minutes: approximately 30 minutes of presentation followed by 10 minutes of audience Q&A.",
  },
] as const;

const sectionClassName = "relative overflow-hidden py-12 sm:py-16 md:py-20";
const cardClassName =
  "reveal-card group rounded-2xl border border-brand-brown/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-amber/40 hover:shadow-lg sm:p-7";

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-body text-[11px] font-extrabold uppercase tracking-[0.15em] ${light ? "text-brand-amber" : "text-brand-amber-700"}`}>
      <span aria-hidden="true" className="h-0.5 w-5 bg-current" />
      {children}
    </span>
  );
}

function SectionTitle({
  kicker,
  title,
  subtitle,
  headingId,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  headingId?: string;
}) {
  return (
    <div className="mb-7 max-w-2xl sm:mb-9">
      <Eyebrow>{kicker}</Eyebrow>
      <h2 id={headingId} className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-brand-brown sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 font-body text-sm leading-relaxed text-slate-600 sm:text-base">{subtitle}</p>}
    </div>
  );
}

export default function ConferencePage() {
  const heroTextRef = useGsapReveal<HTMLDivElement>({ selector: ":scope > *", y: 20, duration: 0.65, stagger: 0.09 });
  const heroPanelRef = useGsapReveal<HTMLDivElement>({ selector: ":scope > *", y: 14, duration: 0.55, stagger: 0.06 });
  const metricsRef = useBatchReveal<HTMLDivElement>();
  const themesRef = useBatchReveal<HTMLDivElement>();
  const agendaRef = useBatchReveal<HTMLDivElement>();
  const audienceRef = useBatchReveal<HTMLDivElement>();

  return (
    <main className="font-body text-brand-brown">
      {/* Site-level header and footer remain provided by the existing app layout. */}
      <section className="relative isolate overflow-hidden bg-brand-dark text-white" aria-labelledby="conclave-heading">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-brown/80 to-brand-dark" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-0 h-96 w-96 rounded-full bg-brand-amber/15 blur-[100px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 left-0 h-80 w-80 rounded-full bg-brand-amber/10 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:repeating-radial-gradient(ellipse_at_95%_90%,transparent_0_17px,#f4c87a_18px_19px,transparent_20px_36px)]" />
        <div className="relative z-10 border-b border-white/10 bg-white/[0.04] py-2">
          <Container>
            <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 text-[10px] font-bold uppercase tracking-wide text-white/75 sm:text-xs">
              <span>12TH NEPAL WOOD INTERNATIONAL EXPO 2027</span>
              <span>28–31 JANUARY 2027 • BHRIKUTI MANDAP, KATHMANDU</span>
            </div>
          </Container>
        </div>
        <Container>
          <nav aria-label="Conclave page sections" className="relative z-10 flex flex-wrap gap-x-5 gap-y-2 border-b border-white/10 py-4 text-xs font-semibold text-white/75">
            <a className="transition-colors hover:text-brand-amber" href="#about">Overview</a>
            <a className="transition-colors hover:text-brand-amber" href="#topics">Key Themes</a>
            <a className="transition-colors hover:text-brand-amber" href="#agenda">Agenda</a>
            <a className="transition-colors hover:text-brand-amber" href="#faq">FAQs</a>
            <a className="text-brand-amber transition-colors hover:text-white" href="#register">Register Now <ArrowUpRight aria-hidden className="inline h-3.5 w-3.5" /></a>
          </nav>
          <div className="relative z-10 grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
            <div ref={heroTextRef} className="lg:col-span-7">
              <Eyebrow light>Industry Knowledge • Technology • Collaboration</Eyebrow>
              <h1 id="conclave-heading" className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.09] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Technical <span className="text-brand-amber">Conclave</span> 2027
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-lg">
                From sustainable timber to smart plywood factories — one focused industry forum connecting forestry experts, manufacturers, technology leaders and dealers.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <CTAButton href="#register-attendee" className="min-h-11 px-5 text-sm font-bold shadow-lg shadow-brand-amber/20">
                  Register as Attendee <ArrowUpRight aria-hidden className="h-4 w-4" />
                </CTAButton>
                <CTAButton href="#register-speaker" variant="outline" className="min-h-11 border-white/40 !text-white hover:!bg-white hover:!text-brand-dark px-5 text-sm font-bold">
                  Apply as Speaker <ArrowUpRight aria-hidden className="h-4 w-4" />
                </CTAButton>
              </div>
              <p className="mt-5 text-xs text-white/70">Part of the 12th Nepal Wood International Expo 2027</p>
            </div>

            <aside ref={heroPanelRef} aria-label="Event at a glance" className="overflow-hidden rounded-2xl border border-white/20 bg-white text-brand-brown shadow-2xl shadow-black/25 lg:col-span-5">
              <div className="border-b-4 border-brand-amber bg-brand-cream px-5 py-5 sm:px-7">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-amber-700">EVENT AT A GLANCE</span>
                <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">Industry meets insight.</h2>
              </div>
              <div className="divide-y divide-brand-brown/10 px-5 py-2 sm:px-7">
                <div className="flex gap-4 py-4">
                  <CalendarDays aria-hidden className="mt-1 h-6 w-6 shrink-0 text-brand-amber-700" />
                  <div><p className="text-xs text-slate-500">Proposed conclave date</p><p className="font-display text-sm font-bold">Day 2 • 29 January 2027</p><p className="text-xs text-slate-500">Subject to final organizer confirmation</p></div>
                </div>
                <div className="flex gap-4 py-4">
                  <Clock3 aria-hidden className="mt-1 h-6 w-6 shrink-0 text-brand-amber-700" />
                  <div><p className="text-xs text-slate-500">Time</p><p className="font-display text-sm font-bold">09:30 AM – 02:10 PM</p><p className="text-xs text-slate-500">Tentative seminar programme</p></div>
                </div>
                <div className="flex gap-4 py-4">
                  <MapPin aria-hidden className="mt-1 h-6 w-6 shrink-0 text-brand-amber-700" />
                  <div><p className="text-xs text-slate-500">Location</p><p className="font-display text-sm font-bold">Bhrikuti Mandap, Kathmandu</p><p className="text-xs text-slate-500">Conclave hall to be announced</p></div>
                </div>
                <div className="flex gap-4 py-4">
                  <MessageCircleMore aria-hidden className="mt-1 h-6 w-6 shrink-0 text-brand-amber-700" />
                  <div><p className="text-xs text-slate-500">Programme status</p><span className="mt-1 inline-flex rounded-md border border-brand-amber/30 bg-brand-amber/10 px-2.5 py-1 text-[11px] font-bold text-brand-amber-700">TENTATIVE AGENDA</span></div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className={sectionClassName} id="about" aria-labelledby="about-heading">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Eyebrow>About the conclave</Eyebrow>
              <h2 id="about-heading" className="mt-3 max-w-xl font-display text-2xl font-extrabold leading-tight text-brand-brown sm:text-3xl lg:text-4xl">Ideas shaping the future of Nepal&apos;s wood industry.</h2>
              <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">The Nepal Wood Technical Conclave brings together the full plywood and wood-processing value chain — from responsible timber cultivation and agroforestry to energy-efficient manufacturing, factory automation and stronger manufacturer–dealer partnerships.</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">Designed for practical knowledge sharing, the programme combines five focused technical seminars with an open panel discussion and audience Q&amp;A.</p>
              <div className="mt-6"><CTAButton href="#agenda" className="min-h-11 px-5 text-sm font-semibold">View Full Programme <ArrowDown aria-hidden className="h-4 w-4" /></CTAButton></div>
            </div>
            <div ref={metricsRef} className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5">
              {[
                ["05", "Specialised seminars"],
                ["40 min", "Per seminar, including Q&A"],
                ["30 min", "Industry panel discussion"],
                ["01", "Focused industry forum"],
              ].map(([value, label]) => (
                <div key={label} className="reveal-card rounded-xl border-l-4 border-brand-amber bg-brand-cream p-4 transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                  <strong className="block font-display text-2xl font-extrabold text-brand-brown sm:text-3xl">{value}</strong>
                  <span className="mt-1 block text-xs leading-snug text-brand-brown/65 sm:text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className={`${sectionClassName} bg-brand-cream`} id="topics" aria-labelledby="topics-heading">
        <Container>
          <SectionTitle headingId="topics-heading" kicker="Five core themes" title="Explore the technical sessions" subtitle="Built around the challenges and opportunities across Nepal's timber, veneer and plywood ecosystem." />
          <div ref={themesRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map(({ tag, title, description, icon: Icon }) => (
              <article className={cardClassName} key={tag}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cream text-brand-amber-700 transition-colors duration-300 group-hover:bg-brand-amber/15">
                  <Icon aria-hidden className="h-6 w-6" />
                </span>
                <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-amber-700">{tag}</p>
                <h3 className="mt-2 font-display text-base font-bold leading-snug text-brand-brown sm:text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
              </article>
            ))}
            <article className="reveal-card group rounded-2xl border border-brand-brown bg-brand-brown p-5 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-brand-amber"><MessageCircleMore aria-hidden className="h-6 w-6" /></span>
              <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-amber">Interactive Industry Exchange</p>
              <h3 className="mt-2 font-display text-base font-bold sm:text-lg">Panel Discussion &amp; Open Q&amp;A</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">A shared conversation between speakers, manufacturers, dealers and industry participants.</p>
              <a className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-amber hover:underline" href="#register">Join the conversation <ArrowUpRight aria-hidden className="h-4 w-4" /></a>
            </article>
          </div>
        </Container>
      </section>

      <section className={sectionClassName} id="agenda" aria-labelledby="agenda-heading">
        <Container>
          <SectionTitle headingId="agenda-heading" kicker="Day 2 • Proposed Programme" title="Technical Conclave Agenda" subtitle="All times are local to Kathmandu, Nepal. Speakers, date and hall will be announced following confirmation." />
          <div ref={agendaRef} className="overflow-hidden rounded-2xl border border-brand-brown/10 bg-white shadow-lg shadow-brand-brown/5">
            <div className="hidden grid-cols-[150px_135px_1fr] gap-5 bg-brand-brown px-6 py-4 text-xs font-bold uppercase tracking-wider text-white md:grid">
              <div>Time</div><div>Session</div><div>Details</div>
            </div>
            {agenda.map((item, i) => (
              <div key={`${item.time}-${item.code}`} className={`reveal-card grid gap-x-4 gap-y-1 border-b border-brand-brown/10 px-4 py-4 last:border-b-0 sm:px-6 md:grid-cols-[150px_135px_1fr] md:items-center md:gap-5 md:py-5 ${i % 2 === 1 ? "bg-brand-cream/50" : "bg-white"}`}>
                <span className="font-display text-sm font-extrabold text-brand-brown">{item.time}</span>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-brand-amber-700">{item.code}</span>
                <div className="col-span-full md:col-span-1"><h3 className="font-display text-sm font-bold leading-snug text-brand-brown sm:text-base">{item.title}</h3><p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{item.detail}</p></div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">Note: Each seminar includes approximately 30 minutes of presentation and 10 minutes of Q&amp;A. The draft schedule has no scheduled refreshment or lunch break. Agenda subject to change.</p>
        </Container>
      </section>

      <section className={`${sectionClassName} bg-brand-cream`} id="audience" aria-labelledby="audience-heading">
        <Container>
          <SectionTitle headingId="audience-heading" kicker="Who should attend" title="Built for the people moving the industry forward" subtitle="Relevant to professionals across the wood and panel value chain." />
          <div ref={audienceRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((item) => (
              <article key={item.title} className={cardClassName}>
                <h3 className="font-display text-base font-bold text-brand-brown sm:text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className={sectionClassName} id="register" aria-labelledby="register-heading">
        <Container>
          <SectionTitle headingId="register-heading" kicker="Join the conclave" title="Register your interest" subtitle="Choose your participation type. Speaker applications are subject to review; attendee participation details will be confirmed by the organizers." />
          <ConclaveRegistrationForms />
        
        </Container>
      </section>

      <section className={`${sectionClassName} bg-brand-cream`} id="faq" aria-labelledby="faq-heading">
        <Container>
          <SectionTitle headingId="faq-heading" kicker="Helpful information" title="Frequently asked questions" />
          <Accordion variant="splitted" selectionMode="multiple" className="grid grid-cols-1 gap-3 px-0 md:grid-cols-2">
            {faqs.map((item, index) => (
              <AccordionItem
                key={String(index)}
                aria-label={item.question}
                title={item.question}
                classNames={{
                  base: "group rounded-xl border border-brand-brown/10 bg-white shadow-sm hover:border-brand-amber/40 transition-all duration-300",
                  title: "font-display text-sm sm:text-base font-bold text-brand-brown group-data-[expanded=true]:text-brand-amber-700",
                  trigger: "px-4 py-4 sm:px-5 cursor-pointer",
                  content: "px-4 pb-5 pt-0 text-sm leading-relaxed text-slate-600 sm:px-5",
                  indicator: "text-brand-brown/50 group-data-[expanded=true]:text-brand-amber-700",
                }}
              >{item.answer}</AccordionItem>
            ))}
          </Accordion>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-brand-brown py-12 text-white sm:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-brand-amber/10 blur-[70px]" />
        <Container>
          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div>
              <Eyebrow light>Nepal Wood 2027</Eyebrow>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">Be part of the technical conversation.</h2>
              <p className="mt-2 text-sm text-white/75 sm:text-base">Learn, exchange ideas and connect across the industry value chain.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <CTAButton href="#register-attendee" className="min-h-11 px-5 text-sm font-semibold">Attendee Registration <ArrowUpRight aria-hidden className="h-4 w-4" /></CTAButton>
              <CTAButton href="#register-speaker" variant="outline" className="min-h-11 border-white/40 !text-white hover:!bg-white hover:!text-brand-brown px-5 text-sm font-semibold">Speaker Application <ArrowUpRight aria-hidden className="h-4 w-4" /></CTAButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Conclave-specific original footer information, without duplicating the global site footer. */}
      <section aria-label="Conclave contacts and links" className="bg-brand-cream py-8">
        <Container>
          <div className="grid gap-6 text-sm sm:grid-cols-3">
            <div>
              <h2 className="font-display text-sm font-extrabold text-brand-brown">NEPAL WOOD <span className="block text-xs font-semibold text-brand-brown/60">International Expo 2027</span></h2>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-600">A focused B2B platform for wood processing, machinery, plywood, furniture hardware, panels and industry collaboration.</p>
            </div>
            <div>
              <h3 className="font-display font-bold text-brand-brown">Explore</h3>
              <div className="mt-2 flex flex-col gap-1.5 text-xs text-slate-600">
                <a className="hover:text-brand-amber-700" href="https://nepalwood.com.np/">Expo Homepage ↗</a>
                <a className="hover:text-brand-amber-700" href="#topics">Seminar Themes</a>
                <a className="hover:text-brand-amber-700" href="#agenda">Conclave Agenda</a>
                <a className="hover:text-brand-amber-700" href="#register">Register Interest</a>
              </div>
            </div>
            <div>
              <h3 className="font-display font-bold text-brand-brown">Organizer contacts</h3>
              <div className="mt-2 flex flex-col gap-1.5 text-xs text-slate-600">
                <a className="hover:text-brand-amber-700" href="mailto:namit@futurextrade.com">namit@futurextrade.com</a>
                <a className="hover:text-brand-amber-700" href="mailto:info@mss.com.np">info@mss.com.np</a>
                <a className="hover:text-brand-amber-700" href="https://nepalwood.com.np/contact">Official Contact Page ↗</a>
                <a className="hover:text-brand-amber-700" href="https://nepalwood.com.np/">nepalwood.com.np ↗</a>
              </div>
            </div>
          </div>
          <p className="mt-6 border-t border-brand-brown/10 pt-4 text-xs text-slate-500">© 2027 Nepal Wood International Expo • Technical Conclave • Tentative programme, subject to organizer confirmation.</p>
        </Container>
      </section>
    </main>
  );
}
