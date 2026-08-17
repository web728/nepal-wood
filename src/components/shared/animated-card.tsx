import { cn } from "@/lib/utils";

type AnimatedCardProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Premium Card used inside staggered grids (Why Exhibit, Exhibitor Profile, etc).
 * Features glassmorphic depth, ambient glow, and subtle warm metallic borders.
 * Retains 'reveal-card' class for GSAP useBatchReveal() trigger compatibility.
 */
export default function AnimatedCard({ className, children, ...props }: AnimatedCardProps) {
  return (
    <div
      className={cn(
        // Core layout & Reveal trigger target
        "reveal-card group relative overflow-hidden rounded-2xl p-6 sm:p-7",
        // Background & Glassmorphism
        "bg-gradient-to-b from-white via-white to-brand-cream/20 backdrop-blur-md",
        // Premium Border & Shadow Base
        "border border-brand-brown/10 shadow-[0_4px_20px_-4px_rgba(74,42,22,0.05)]",
        // Micro-Interactions & Hover Dynamics
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1.5 hover:border-brand-amber/40",
        "hover:shadow-[0_20px_40px_-15px_rgba(74,42,22,0.12)]",
        className
      )}
      {...props}
    >
      {/* Top Border Accent Line on Hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-amber to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Ambient Ambient Glow (Bottom Right Corner) */}
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-brand-amber/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

      {/* Card Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}