"use client";

import { useRef, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Container from "@/components/shared/container";
import SectionHeading from "@/components/shared/section-heading";
import { site } from "@/lib/site-data";
import { MapPin, Calendar, Send, Compass, Loader2, Sparkles } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { toast } from "sonner";

export default function VenueMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const blobTopRightRef = useRef<HTMLDivElement>(null);
  const blobBottomLeftRef = useRef<HTMLDivElement>(null);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Dynamic Mouse Parallax Movement for Ambient Blobs
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    if (blobTopRightRef.current) {
      gsap.to(blobTopRightRef.current, {
        x: xRatio * 30,
        y: yRatio * 30,
        duration: 0.8,
        ease: "power2.out",
      });
    }

    if (blobBottomLeftRef.current) {
      gsap.to(blobBottomLeftRef.current, {
        x: xRatio * -30,
        y: yRatio * -30,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  useEffect(() => {
    let ctx: gsap.Context;

    const rafId = requestAnimationFrame(() => {
      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          ".venue-animate",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.to(".blob-top-right-inner", {
          scaleX: 1.2,
          scaleY: 0.85,
          rotation: 20,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.easeInOut",
        });

        gsap.to(".blob-bottom-left-inner", {
          scaleX: 0.85,
          scaleY: 1.2,
          rotation: -20,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.easeInOut",
        });
      }, sectionRef);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (ctx) ctx.revert();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA verification!");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: captchaToken,
          source: "Quick Enquiry (Venue Section)",
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Enquiry submitted successfully! We will contact you soon.");
        setFormData({ name: "", email: "", phone: "", message: "" });
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } else {
        toast.error(result.message || "Failed to send enquiry. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden bg-brand-brown py-10 sm:py-14 md:py-16 text-white"
    >
      {/* Ambient Background Glows */}
      <div
        ref={blobTopRightRef}
        className="pointer-events-none absolute -right-24 -top-24 z-0 h-[24rem] w-[24rem]"
      >
        <div className="blob-top-right-inner h-full w-full rounded-full bg-gradient-to-br from-brand-amber/25 via-amber-600/10 to-transparent blur-3xl" />
      </div>

      <div
        ref={blobBottomLeftRef}
        className="pointer-events-none absolute -bottom-24 -left-24 z-0 h-[26rem] w-[26rem]"
      >
        <div className="blob-bottom-left-inner h-full w-full rounded-full bg-gradient-to-tr from-brand-amber/15 via-brand-amber/5 to-transparent blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          
          {/* Left Column: Venue Details */}
          <div className="venue-animate space-y-5 lg:col-span-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-amber/30 bg-brand-amber/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-amber backdrop-blur-md mb-3">
                <Compass className="h-3.5 w-3.5" />
                <span>Event Location &amp; Info</span>
              </div>

              <SectionHeading
                kicker="Venue & Travel"
                title="Plan Your Visit to Kathmandu"
                subtitle="Easily accessible from major transit hubs, Bhrikuti Mandap offers world-class exhibition space in Nepal's capital."
                light
              />
            </div>

            {/* Quick Info Cards */}
            <div className="flex flex-col gap-3">
              <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:border-brand-amber/40 hover:bg-white/[0.08]">
                <div className="flex items-start gap-3.5">
                  <div className="shrink-0 rounded-lg bg-brand-amber/15 p-2.5 text-brand-amber border border-brand-amber/20 group-hover:bg-brand-amber group-hover:text-brand-brown transition-all duration-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-[10px] font-bold uppercase tracking-wider text-brand-amber">
                      Venue Address
                    </h4>
                    <p className="mt-0.5 font-body text-xs sm:text-sm font-semibold text-white/90">
                      {site.venue}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:border-brand-amber/40 hover:bg-white/[0.08]">
                <div className="flex items-start gap-3.5">
                  <div className="shrink-0 rounded-lg bg-brand-amber/15 p-2.5 text-brand-amber border border-brand-amber/20 group-hover:bg-brand-amber group-hover:text-brand-brown transition-all duration-300">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-[10px] font-bold uppercase tracking-wider text-brand-amber">
                      Expo Dates
                    </h4>
                    <p className="mt-0.5 font-body text-xs sm:text-sm font-semibold text-white/90">
                      {site.dates}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="venue-animate lg:col-span-7">
            <div className="relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.04] p-5 sm:p-7 shadow-xl backdrop-blur-2xl">
              
              <div className="relative mb-5">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-amber mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Get in touch</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Quick Enquiry
                </h3>
                <p className="mt-1 font-body text-xs sm:text-sm text-white/70">
                  Have questions regarding stall booking or visiting? Drop us a message.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="relative space-y-3.5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-lg border border-white/15 bg-black/20 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-white/40 transition-all focus:border-brand-amber focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-amber"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977 / +91 ..."
                      className="w-full rounded-lg border border-white/15 bg-black/20 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-white/40 transition-all focus:border-brand-amber focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-amber"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full rounded-lg border border-white/15 bg-black/20 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-white/40 transition-all focus:border-brand-amber focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-amber"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Message / Query *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirements..."
                    className="w-full rounded-lg border border-white/15 bg-black/20 px-3.5 py-2 text-xs sm:text-sm text-white placeholder-white/40 transition-all focus:border-brand-amber focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-amber"
                  />
                </div>

                {/* ReCAPTCHA Container */}
                <div className="pt-1 overflow-x-auto">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                    onChange={(token) => setCaptchaToken(token)}
                    theme="dark"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-brand-amber px-5 py-2.5 font-display text-xs sm:text-sm font-bold text-brand-brown shadow-md transition-all hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}