"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { 
  Cpu, 
  Presentation, 
  Sparkles, 
  Globe2, 
  ChevronDown 
} from "lucide-react";

export default function EditionHighlightsAccordion() {
  const itemClasses = {
    base: "group group-[.is-expanded]:bg-brand-cream/40 border border-brand-brown/10 hover:border-brand-amber/40 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 mb-4 overflow-hidden",
    title: "font-display text-base sm:text-lg font-bold text-brand-brown group-data-[expanded=true]:text-brand-amber transition-colors duration-200",
    subtitle: "text-xs text-brand-brown/60",
    trigger: "px-6 py-5 flex items-center justify-between cursor-pointer gap-4",
    indicator: "text-brand-brown/50 group-data-[expanded=true]:text-brand-amber group-data-[expanded=true]:rotate-180 transition-transform duration-300",
    content: "px-6 pb-6 pt-0 text-sm sm:text-base text-brand-brown/80 leading-relaxed",
  };

  return (
    <Accordion
      variant="splitted"
      className="px-0 gap-0"
      selectionMode="multiple"
    >
      <AccordionItem
        key="1"
        aria-label="Live product demonstrations"
        title="Live Product & Machinery Demonstrations"
        subtitle="Experience high-precision woodworking tools in action"
        startContent={
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-cream/60 text-brand-brown group-data-[expanded=true]:bg-brand-amber group-data-[expanded=true]:text-brand-brown transition-colors">
            <Cpu className="h-5 w-5" />
          </div>
        }
        indicator={<ChevronDown className="h-5 w-5" />}
        classNames={itemClasses}
      >
        Exhibitors run live demonstrations of woodworking machinery, panel-processing equipment,
        and automated finishing systems throughout all show days. Discover cut-edge technology live on the floor.
      </AccordionItem>

      <AccordionItem
        key="2"
        aria-label="Industry seminars"
        title="Industry Seminars & Knowledge Sessions"
        subtitle="Insights on sustainable forestry & automation"
        startContent={
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-cream/60 text-brand-brown group-data-[expanded=true]:bg-brand-amber group-data-[expanded=true]:text-brand-brown transition-colors">
            <Presentation className="h-5 w-5" />
          </div>
        }
        indicator={<ChevronDown className="h-5 w-5" />}
        classNames={itemClasses}
      >
        Keynote sessions covering smart manufacturing, sustainable material sourcing, and modern design
        trends tailored specifically for the Nepalese and South Asian markets.
        <span className="block mt-2 text-xs font-semibold text-brand-amber-700 bg-brand-amber/10 px-3 py-1.5 rounded-lg w-fit">
          * Session schedule to be confirmed by organizer
        </span>
      </AccordionItem>

      <AccordionItem
        key="3"
        aria-label="Opening ceremony"
        title="Grand Opening & VIP Inauguration"
        subtitle="Official event kickoff with industry leaders"
        startContent={
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-cream/60 text-brand-brown group-data-[expanded=true]:bg-brand-amber group-data-[expanded=true]:text-brand-brown transition-colors">
            <Sparkles className="h-5 w-5" />
          </div>
        }
        indicator={<ChevronDown className="h-5 w-5" />}
        classNames={itemClasses}
      >
        An official inauguration featuring key government dignitaries, trade association heads, and international delegates marks the commencement of the expo.
        <span className="block mt-2 text-xs font-semibold text-brand-amber-700 bg-brand-amber/10 px-3 py-1.5 rounded-lg w-fit">
          * Inauguration itinerary to be updated soon
        </span>
      </AccordionItem>

      <AccordionItem
        key="4"
        aria-label="International participation"
        title="Global Trade & International Pavilions"
        subtitle="Connect with global brands & distributors"
        startContent={
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-cream/60 text-brand-brown group-data-[expanded=true]:bg-brand-amber group-data-[expanded=true]:text-brand-brown transition-colors">
            <Globe2 className="h-5 w-5" />
          </div>
        }
        indicator={<ChevronDown className="h-5 w-5" />}
        classNames={itemClasses}
      >
        Previous editions featured international representation from leading markets including India,
        China, Malaysia, Germany, and Taiwan, alongside Nepal’s top domestic industry leaders.
      </AccordionItem>
    </Accordion>
  );
}