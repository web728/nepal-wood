"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuItem,
  NavbarMenuToggle,
  NavbarMenu,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { ChevronDown, Calendar, MapPin, Download, ArrowRight, Sparkles } from "lucide-react";
import CTAButton from "@/components/shared/cta-button";
import { cn } from "@/lib/utils";

interface NavGroup {
  label: string;
  items: { label: string; href: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: "About",
    items: [
      { label: "The Show", href: "/about-show" },
      { label: "The Organizers", href: "/about-organizers" },
      { label: "The Venue", href: "/venue" },
    ],
  },
  {
    label: "Exhibit",
    items: [
      { label: "Exhibitor Profile", href: "/exhibitor-profile" },
      { label: "Exhibitor Registration", href: "/exhibitor-registration" },
    ],
  },
  {
    label: "Visit",
    items: [
      { label: "Visitor Profile", href: "/visitor-profile" },
      { label: "Visitor Registration", href: "/visitor-registration" },
    ],
  },
  {
    label: "Downloads",
    items: [
      { label: "2027 Event Brochure", href: "/downloads/event-brochure" },
    ],
  },
];

const simpleLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

function MarqueeGroup() {
  return (
    <div className="flex items-center gap-6 shrink-0 pr-10">
      <span className="flex items-center gap-2 text-brand-amber font-semibold tracking-wide">
        <Sparkles className="h-3.5 w-3.5" /> 12th International Edition
      </span>
      <span className="hidden md:flex items-center gap-2">
        <Calendar className="h-3.5 w-3.5 text-brand-amber" /> 28–31 January 2027
      </span>
      <span className="hidden lg:flex items-center gap-2">
        <MapPin className="h-3.5 w-3.5 text-brand-amber" /> Bhrikuti Mandap, Kathmandu
      </span>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState<string | null>(null);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const pathname = usePathname();

  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsMenuOpen(false);
    setMobileGroupOpen(null);
  }

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);

      if (currentScrollY > 150 && currentScrollY > lastScrollY && !isMenuOpen) {
        setHiddenByScroll(true);
      } else {
        setHiddenByScroll(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out",
        hiddenByScroll && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
      )}
    >
    {/* Top Announcement Bar */}
<div className="hidden sm:block border-b border-brand-brown/10 bg-brand-brown py-3 text-sm sm:text-base font-semibold text-white overflow-hidden shadow-sm">
  <div className="container-expo flex items-center justify-between gap-4 px-4 sm:px-6">
    <div className="relative flex-1 min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
      <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform gap-12 items-center">
        {/* Content Group - Duplicate 2-3 times for seamless looping */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className="text-brand-amber font-bold text-base sm:text-lg">
              12th Nepal Wood International Expo 2027
            </span>
            <span className="opacity-40">•</span>
            <span>28–31 January 2027</span>
            <span className="opacity-40">•</span>
            <span>Bhrikuti Mandap, Kathmandu</span>
          </div>
        ))}
      </div>
    </div>
  </div>

  <style jsx>{`
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-33.33%);
      }
    }
    .animate-marquee {
      animation: marquee 20s linear infinite;
    }
    .animate-marquee:hover {
      animation-play-state: paused;
    }
  `}</style>
</div>
      {/* Main Navbar */}
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="full"
        className={cn(
          "bg-white/95 backdrop-blur-xl border-b border-brand-brown/10 transition-shadow duration-300 py-1",
          scrolled || isMenuOpen ? "shadow-md" : "shadow-sm"
        )}
        classNames={{ wrapper: "container-expo px-4 sm:px-6 flex items-center justify-between" }}
      >
        {/* Logo Section */}
        <NavbarContent justify="start" className="!grow-0 pr-4">
          <NavbarBrand>
            <Link href="/" className="flex items-center py-1 group">
              {/* Increased size for mobile view while remaining clean on desktop */}
              <div className="relative h-14 w-36 sm:h-16 sm:w-44 lg:h-18 lg:w-52 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo/nepal-wood-expo-logo.png"
                  alt="Nepal Wood Expo Logo"
                  fill
                  sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 208px"
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        {/* Desktop Navigation Links */}
        <NavbarContent className="hidden items-center justify-center gap-1 lg:flex" justify="center">
          <NavbarItem>
            <Link
              href="/"
              className={cn(
                "inline-flex items-center h-10 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-lg text-brand-brown hover:bg-brand-brown/5 hover:text-brand-amber",
                pathname === "/" && "text-brand-amber font-extrabold bg-brand-brown/5"
              )}
            >
              Home
            </Link>
          </NavbarItem>

          {navGroups.map((group) => (
            <NavbarItem key={group.label}>
              <Dropdown className="bg-white/95 border border-brand-brown/10 backdrop-blur-xl shadow-xl rounded-xl">
                <DropdownTrigger>
                  <button className="inline-flex items-center gap-1 h-10 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-lg text-brand-brown hover:bg-brand-brown/5 hover:text-brand-amber focus:outline-none">
                    {group.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label={`${group.label} menu`} className="p-2">
                  {group.items.map((item) => (
                    <DropdownItem
                      key={item.href}
                      href={item.href}
                      textValue={item.label}
                      className="rounded-lg hover:bg-brand-amber/10 text-brand-brown hover:text-brand-amber font-medium transition-colors"
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          ))}

          {simpleLinks.map((link) => (
            <NavbarItem key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "inline-flex items-center h-10 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-lg text-brand-brown hover:bg-brand-brown/5 hover:text-brand-amber",
                  pathname === link.href && "text-brand-amber font-extrabold bg-brand-brown/5"
                )}
              >
                {link.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Action Button & Mobile Toggle */}
        <NavbarContent justify="end" className="!grow-0 gap-2 sm:gap-3 pl-2">
          <NavbarItem className="hidden sm:flex">
            <CTAButton
              href="/visitor-registration"
              size="sm"
              arrow={false}
              className="shadow-md font-bold text-xs uppercase tracking-wider whitespace-nowrap"
            >
              Book Your Visit
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </CTAButton>
          </NavbarItem>

          <NavbarItem className="lg:hidden">
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="scale-110 text-brand-brown p-1"
            />
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Dropdown Overlay Menu */}
        <NavbarMenu className="bg-white/98 backdrop-blur-2xl pt-6 px-6 border-t border-brand-brown/10">
          <NavbarMenuItem className="pb-1">
            <Link
              href="/"
              className={cn(
                "block py-2 text-base font-bold text-brand-brown hover:text-brand-amber transition-colors",
                pathname === "/" && "text-brand-amber"
              )}
            >
              Home
            </Link>
          </NavbarMenuItem>

          {navGroups.map((group) => (
            <NavbarMenuItem key={group.label} className="border-t border-brand-brown/10 py-2">
              <button
                className="flex w-full items-center justify-between py-1 text-base font-bold text-brand-brown focus:outline-none"
                onClick={() =>
                  setMobileGroupOpen(mobileGroupOpen === group.label ? null : group.label)
                }
                aria-expanded={mobileGroupOpen === group.label}
              >
                {group.label}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 text-brand-maroon",
                    mobileGroupOpen === group.label && "rotate-180"
                  )}
                />
              </button>
              {mobileGroupOpen === group.label && (
                <div className="flex flex-col gap-2.5 pl-4 pt-3 pb-2 transition-all">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-sm font-semibold text-brand-brown/80 hover:text-brand-amber transition-colors",
                        pathname === item.href && "text-brand-amber"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </NavbarMenuItem>
          ))}

          {simpleLinks.map((link) => (
            <NavbarMenuItem key={link.href} className="border-t border-brand-brown/10 py-2">
              <Link
                href={link.href}
                className={cn(
                  "block py-1 text-base font-bold text-brand-brown hover:text-brand-amber transition-colors",
                  pathname === link.href && "text-brand-amber"
                )}
              >
                {link.label}
              </Link>
            </NavbarMenuItem>
          ))}

          <NavbarMenuItem className="mt-6 flex flex-col gap-3 pb-8 border-t border-brand-brown/10 pt-4">
            <CTAButton href="/visitor-registration" arrow={false} className="w-full justify-center">
              Book Your Visit
            </CTAButton>
            <CTAButton
              href="/downloads/event-brochure"
              variant="outline"
              arrow={false}
              className="w-full justify-center border-brand-brown/30 text-brand-brown hover:bg-brand-brown hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Download Brochure
            </CTAButton>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </header>
  );
}