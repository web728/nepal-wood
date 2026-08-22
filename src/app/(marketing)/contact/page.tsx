import type { Metadata } from "next";
import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import ContactForm from "@/components/forms/contact-form";
import { contactDetails, site } from "@/lib/site-data";
import {
  PhoneCall,
  Mail,
  MapPin,
  Calendar,
  Building2,
  MessageSquare,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Nepal Wood International Expo 2027",
  description:
    "Get in touch with our team for exhibiting, visiting, sponsorship, and media inquiries.",
};

export default function ContactPage() {
  // site-data se dono (India + Nepal) contacts ko single array me merge kar rahe hain
  const allContacts = [
    ...contactDetails.indiaContacts,
    contactDetails.nepalContact,
  ];

  return (
    <>
      <PageBanner
        kicker="Reach Out To Us"
        title="We’re Here to Help You Connect"
        subtitle="Have questions about stall booking, visitor passes, or event sponsorships? Our dedicated team is available to assist you."
        bgImage="/expo/expo-15.jpeg"
      />

      <section className="relative overflow-hidden bg-white section-premium">
        {/* Subtle background accents */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-amber/[0.03] blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-brand-amber/[0.03] blur-[100px]" />
        
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* Left Column - Form Wrapper */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-brand-brown/6 bg-white p-6 sm:p-8 shadow-premium-lg">
                <div className="mb-6 border-b border-brand-brown/6 pb-4">
                  <div className="flex items-center gap-2 text-brand-amber text-xs font-bold uppercase tracking-wider mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Instant Inquiry</span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-brand-brown">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-brown/70 mt-1">
                    Fill in your details below and our team will get back to you within 24 hours.
                  </p>
                </div>

                <ContactForm />
              </div>
            </div>

            {/* Right Column - Clean Contact Card */}
            <div className="flex flex-col gap-6 lg:col-span-5">
              
              {/* Direct Contacts Card */}
              <div className="rounded-2xl border border-brand-brown/6 bg-white p-6 shadow-premium">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-brown text-brand-amber">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-base font-bold text-brand-brown">
                    Contact Details
                  </h3>
                </div>

                <div className="space-y-4">
                  {allContacts.map((c) => (
                    <div
                      key={c.name}
                      className="border-b border-brand-brown/6 pb-3 last:border-none last:pb-0"
                    >
                      <p className="font-display text-sm font-bold text-brand-brown">
                        {c.name}
                      </p>
                      <div className="mt-1.5 flex flex-col gap-1 text-xs text-brand-brown/80">
                        <a
                          href={`tel:${c.phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1.5 font-semibold hover:text-brand-amber transition-colors"
                        >
                          <PhoneCall className="h-3.5 w-3.5 text-brand-amber shrink-0" />
                          {c.phone}
                        </a>
                        <a
                          href={`mailto:${c.email}`}
                          className="inline-flex items-center gap-1.5 hover:text-brand-amber transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5 text-brand-amber shrink-0" />
                          {c.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Venue Map Card */}
              <div className="overflow-hidden rounded-2xl border border-brand-brown/6 bg-white shadow-premium">
                <div className="p-4 border-b border-brand-brown/6 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-amber shrink-0" />
                    <span className="font-display text-xs font-bold text-brand-brown">
                      Venue Location
                    </span>
                  </div>
                  <span className="rounded bg-brand-brown/5 px-2 py-0.5 text-[10px] font-extrabold uppercase text-brand-maroon">
                    Kathmandu
                  </span>
                </div>

                <iframe
                  title="Bhrikuti Mandap, Kathmandu map"
                  src="https://www.google.com/maps?q=Bhrikuti+Mandap+Kathmandu+Nepal&output=embed"
                  className="h-48 w-full border-none"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <div className="p-4 bg-white text-xs text-brand-brown/80 space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-brand-amber shrink-0 mt-0.5" />
                    <span>{site.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-amber shrink-0" />
                    <span className="font-semibold text-brand-brown">{site.dates}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>
    </>
  );
}