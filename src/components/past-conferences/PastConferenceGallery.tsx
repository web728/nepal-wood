"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Day = "all" | "day1" | "day2";
type Kind = "photos" | "posters";
type Item = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  day: "day1" | "day2";
  kind: Kind;
};
const root = "/past-conferences";
const items: Item[] = [
  {
    src: `${root}/day2-design-plans.jpeg`,
    alt: "Attendees at the Interior Design Conference",
    label: "Interior Designers’ Day · Conference session",
    caption: "Day 2 — Design presentation and conference audience",
    day: "day2",
    kind: "photos",
  },
  {
    src: `${root}/conference-1.jpeg`,
    alt: "Day 1 panel discussion",
    label: "Day 1 · Panel discussion",
    caption: "Day 1 — Woodworking industry panel discussion",
    day: "day1",
    kind: "photos",
  },
  {
    src: `${root}/conference-2.jpeg`,
    alt: "Speaker on stage at Day 1",
    label: "Day 1 · Industry insights",
    caption: "Day 1 — Speaker presentation",
    day: "day1",
    kind: "photos",
  },
  {
    src: `${root}/conference-3.jpeg`,
    alt: "Speaker on stage at Interior Designers’ Day",
    label: "Day 2 · Design perspectives",
    caption: "Day 2 — Interior Designers’ Day speaker",
    day: "day2",
    kind: "photos",
  },
  {
    src: `${root}/conference-4.jpeg`,
    alt: "Seated attendees during the conference",
    label: "Day 2 · Attendees",
    caption: "Day 2 — Interior design conference attendees",
    day: "day2",
    kind: "photos",
  },
  {
    src: `${root}/conference-5.jpg`,
    alt: "Audience at wood conference",
    label: "Day 1 · Audience",
    caption: "Day 1 — Conference audience",
    day: "day1",
    kind: "photos",
  },
  {
    src: `${root}/conference-6.jpg`,
    alt: "Audience at interior design conference",
    label: "Day 2 · Conference floor",
    caption: "Day 2 — Interior design conference audience",
    day: "day2",
    kind: "photos",
  },
  {
    src: `${root}/poster-day1-recap.jpg`,
    alt: "Official Day 1 conference recap poster",
    label: "Day 1 · Highlights poster",
    caption: "Day 1 — Official conference highlights creative",
    day: "day1",
    kind: "posters",
  },
  {
    src: `${root}/poster-day2-recap.jpg`,
    alt: "Official Day 2 conference recap poster",
    label: "Day 2 · Highlights poster",
    caption: "Day 2 — Official conference highlights creative",
    day: "day2",
    kind: "posters",
  },
  {
    src: `${root}/poster-day1-announcement.jpg`,
    alt: "18 January 2025 Timber Transformation panel discussion announcement poster",
    label: "Day 1 · Original announcement",
    caption: "Official 2025 campaign — Day 1 panel discussion announcement",
    day: "day1",
    kind: "posters",
  },
  {
    src: `${root}/poster-conference-campaign.jpg`,
    alt: "18–19 January 2025 timber and interior design conference announcement poster",
    label: "2025 · Conference campaign poster",
    caption: "Official 2025 two-day conference campaign announcement",
    day: "day2",
    kind: "posters",
  },
];

export default function PastConferenceGallery() {
  const [day, setDay] = useState<Day>("all");
  const [kind, setKind] = useState<Kind>("photos");
  const [active, setActive] = useState<Item | null>(null);
  const visible = items.filter(
    (x) => x.kind === kind && (day === "all" || x.day === day),
  );
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = oldOverflow;
    };
  }, [active]);
  return (
    <section
      className="pc25-gallery"
      id="gallery"
      aria-labelledby="pc25-gallery-title"
    >
      <div className="pc25-container">
        <div className="pc25-gallery-top">
          <div>
            <span className="pc25-eyebrow">Moments from the Event</span>
            <h2 className="pc25-heading" id="pc25-gallery-title">
              Inside the 2025 conferences.
            </h2>
            <p className="pc25-lead">
              Real conference moments, recap creatives and original
              announcements from January 2025.
            </p>
          </div>
          <div
            className="pc25-filters"
            role="group"
            aria-label="Filter gallery by day"
          >
            {(["all", "day1", "day2"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={day === v}
                onClick={() => setDay(v)}
              >
                {v === "all" ? "All moments" : v === "day1" ? "Day 1" : "Day 2"}
              </button>
            ))}
          </div>
        </div>
        <div
          className="pc25-gallery-kind"
          role="group"
          aria-label="Show photos or original campaign material"
        >
          {(["photos", "posters"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={kind === v}
              onClick={() => setKind(v)}
            >
              {v === "photos" ? "Event photographs" : "Original posters"}
            </button>
          ))}
        </div>
        <div
          className={`pc25-gallery-grid ${kind === "posters" ? "pc25-gallery-posters" : ""}`}
        >
          {visible.map((item, i) => (
            <button
              type="button"
              key={item.src}
              className={`pc25-gallery-item ${kind === "photos" && day === "all" && i === 0 ? "pc25-gallery-featured" : ""}`}
              onClick={() => setActive(item)}
              aria-label={`View full image: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
              />
            
            </button>
          ))}
        </div>
        {!visible.length && <p>No images in this category.</p>}
      
      </div>
      {active && (
        <div
          className="pc25-modal"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
        >
          <div
            className="pc25-modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
          >
            <button
              className="pc25-modal-close"
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close image viewer"
            >
              ×
            </button>
            <div className="pc25-modal-image">
              <Image src={active.src} alt={active.alt} fill sizes="95vw" />
            </div>
          
          </div>
        </div>
      )}
    </section>
  );
}
