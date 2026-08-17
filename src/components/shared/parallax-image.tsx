"use client";

import Image, { type ImageProps } from "next/image";
import { useParallax } from "@/hooks/useGsapReveal";
import { cn } from "@/lib/utils";

interface ParallaxImageProps extends Omit<ImageProps, "className"> {
  wrapperClassName?: string;
  imageClassName?: string;
  speed?: number;
}

/** A slightly-slower-than-scroll background image layer, used behind hero
 *  and key marketing sections. Disabled for prefers-reduced-motion. */
export default function ParallaxImage({
  wrapperClassName,
  imageClassName,
  speed = 0.3,
  alt,
  ...imgProps
}: ParallaxImageProps) {
  const ref = useParallax<HTMLDivElement>({ speed });

  return (
    <div className={cn("absolute inset-0 overflow-hidden", wrapperClassName)}>
      <div ref={ref} className="absolute inset-[-10%]">
        <Image
          alt={alt}
          fill
          className={cn("object-cover", imageClassName)}
          {...imgProps}
        />
      </div>
    </div>
  );
}
