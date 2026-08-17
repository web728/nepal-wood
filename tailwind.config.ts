import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";
import tailwindcssAnimate from "tailwindcss-animate";

// NOTE: HeroUI's current release line (3.x) requires Tailwind v4 and ships a
// completely different component set (no Navbar, different primitives).
// Prompt 2 asks specifically for HeroUI Navbar/hero/accordion components and
// a tailwind.config.ts-based theme, so we pin @heroui/react to 2.7.8 (the
// last release on the classic NextUI-derived v2 API/theme engine that still
// supports Tailwind v3). This keeps the exact component API the brief
// expects. Revisit if/when HeroUI v3 stabilizes its Navbar equivalent.

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "#FBF7F2",
          brown: "#4A2A16",
          amber: "#C97A2B",
          amberLight: "#E0943D",
          maroon: "#7A1F1F",
          dark: "#1A0F08",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "amber-gradient": "linear-gradient(135deg, #C97A2B 0%, #E0943D 100%)",
        "premium-gradient": "linear-gradient(135deg, #4A2A16 0%, #7A1F1F 50%, #4A2A16 100%)",
        "subtle-gradient": "linear-gradient(180deg, rgba(201,122,43,0.04) 0%, transparent 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "premium": "0 1px 3px rgba(74,42,22,0.04), 0 8px 24px rgba(74,42,22,0.06)",
        "premium-lg": "0 4px 12px rgba(74,42,22,0.04), 0 20px 48px rgba(74,42,22,0.08)",
        "premium-xl": "0 8px 20px rgba(74,42,22,0.06), 0 32px 64px rgba(74,42,22,0.1)",
        "glow-amber": "0 0 20px rgba(201,122,43,0.15), 0 0 60px rgba(201,122,43,0.08)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.1)",
      },
      spacing: {
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#C97A2B",
              foreground: "#FBF7F2",
            },
            secondary: {
              DEFAULT: "#7A1F1F",
              foreground: "#FBF7F2",
            },
          },
        },
      },
    }),
  ],
};

export default config;
