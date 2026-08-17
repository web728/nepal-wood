"use client";

import type { Ref } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { cn } from "@/lib/utils";

interface CTAButtonProps extends Omit<ButtonProps, "asChild"> {
  href: string;
  arrow?: boolean;
  target?: string;
  rel?: string;
}

/** Primary/secondary CTA used across hero and section closers. */
export default function CTAButton({
  href,
  arrow = true,
  variant = "default",
  className,
  children,
  target,
  rel,
  ...props
}: CTAButtonProps) {
  const magneticRef = useMagneticHover<HTMLElement>();

  const isExternal =
    href.startsWith("http") ||
    href.startsWith("mailto") ||
    href.startsWith("tel") ||
    href.startsWith("/downloads");

  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </>
  );

  return (
    <Button
      asChild
      variant={variant}
      className={cn("group", className)}
      ref={magneticRef as Ref<HTMLButtonElement>}
      {...props}
    >
      {isExternal ? (
        <a
          href={href}
          target={target || "_blank"}
          rel={rel || "noopener noreferrer"}
        >
          {content}
        </a>
      ) : (
        <Link href={href} target={target} rel={rel}>
          {content}
        </Link>
      )}
    </Button>
  );
}