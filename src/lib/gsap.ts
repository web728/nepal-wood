import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { Observer } from "gsap/Observer";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { CustomEase } from "gsap/CustomEase";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Top-level registration execute karo (Window check ke saath)
if (typeof window !== "undefined") {
  // GSAP plugins ko immediately register karo
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    Observer,
    Draggable,
    Flip,
    InertiaPlugin,
    CustomEase,
    ScrambleTextPlugin,
    DrawSVGPlugin,
    MotionPathPlugin,
    ScrollToPlugin
  );

  // Custom Ease Register
  if (!CustomEase.get("premium")) {
    CustomEase.create("premium", "M0,0 C0.65,0 0.35,1 1,1");
  }
}

export const EASE = {
  premium: "premium",
} as const;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  Observer,
  Draggable,
  Flip,
  InertiaPlugin,
  CustomEase,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  MotionPathPlugin,
  ScrollToPlugin,
};