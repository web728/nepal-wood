"use client";

import { useBatchReveal } from "@/hooks/useBatchReveal";

type RevealGridProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Thin client-component boundary so Server Component pages (which export
 * `metadata` and therefore can't have "use client" at the top) can still
 * wrap a card grid in the shared ScrollTrigger.batch() reveal — the grid
 * markup and its AnimatedCard children stay written inline in the page.
 */
export default function RevealGrid({ children, ...props }: RevealGridProps) {
  const ref = useBatchReveal<HTMLDivElement>();
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
