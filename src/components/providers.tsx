"use client";

import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      {children}
      <Toaster position="top-center" richColors />
    </HeroUIProvider>
  );
}
