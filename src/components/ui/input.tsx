import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-brand-brown/12 bg-white px-4 py-2 text-sm text-brand-brown placeholder:text-brand-brown/35 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber/40 focus-visible:border-brand-amber focus-visible:shadow-glow-amber disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
