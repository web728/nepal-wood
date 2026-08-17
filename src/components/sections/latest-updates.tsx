"use client";

import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import AnimatedCard from "@/components/shared/animated-card";
import { useBatchReveal } from "@/hooks/useBatchReveal";

const placeholders = [
  { tag: "Announcement", text: "[Latest event announcement or milestone — to be added]", date: "[Date]" },
  { tag: "Media Mention", text: "[News or press mention headline — to be added]", date: "[Date]" },
  { tag: "Social", text: "[Recent social media highlight — to be added]", date: "[Date]" },
];

export default function LatestUpdates() {
  const gridRef = useBatchReveal<HTMLDivElement>();

  return (
    <section className="bg-brand-cream py-20 md:py-24">
      <Container>
        <SectionHeading kicker="Latest Updates" title="News and announcements" />
        <div ref={gridRef} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {placeholders.map((item) => (
            <AnimatedCard key={item.tag} className="border-dashed">
              <span className="text-xs font-bold uppercase tracking-wide text-brand-amber">
                {item.tag}
              </span>
              <p className="mt-3 text-sm text-brand-brown/60">{item.text}</p>
              <span className="mt-3 block text-xs text-brand-brown/40">{item.date}</span>
            </AnimatedCard>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-brand-brown/40">
          Sample layout — connect a social feed or CMS collection to populate with live updates.
        </p>
      </Container>
    </section>
  );
}
