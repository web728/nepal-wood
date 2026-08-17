import type { Metadata } from "next";
import PageBanner from "@/components/shared/page-banner";
import Container from "@/components/shared/container";
import { ShieldCheck, Mail, Lock, FileText, UserCheck, Eye, Database, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Nepal Wood International Expo 2027",
  description: "Privacy policy and data protection guidelines for Nepal Wood International Expo 2027.",
  robots: { index: true, follow: true },
};

const sections = [
  {
    id: "information-collection",
    title: "1. Information We Collect",
    icon: Database,
    content: (
      <>
        <p>
          We collect personal details when you interact with the <strong>Nepal Wood International Expo</strong> platform, including when registering as an exhibitor, visitor, or submitting inquiries through our contact forms.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-brand-brown/80">
          <li><strong>Personal Details:</strong> Full Name, Job Title, Company Name, Industry Sector.</li>
          <li><strong>Contact Information:</strong> Email Address, Phone/Mobile Number, Business Address, Country.</li>
          <li><strong>Technical Data:</strong> IP Address, browser type, device information, and site interaction data via cookies.</li>
        </ul>
      </>
    ),
  },
  {
    id: "purpose-lawful-basis",
    title: "2. Purpose and Lawful Basis for Processing",
    icon: UserCheck,
    content: (
      <p>
        Your data is processed to facilitate your participation in <strong>Nepal Wood International Expo 2027</strong>. This includes sending visitor/exhibitor passes, event updates, schedules, and administrative notices. We process this information based on legitimate business interest and your explicit consent during registration.
      </p>
    ),
  },
  {
    id: "marketing-communications",
    title: "3. Event Communications & Marketing",
    icon: Mail,
    content: (
      <p>
        We may use your contact details to provide essential event-related notifications. Optional promotional communications regarding future expos or industry updates will only be sent if you explicitly opt-in. You can unsubscribe from promotional emails at any time using the link in the footer of our emails.
      </p>
    ),
  },
  {
    id: "cookies-analytics",
    title: "4. Cookies & Analytics",
    icon: Eye,
    content: (
      <p>
        Our website uses cookies and web analytics tools to enhance site navigation, analyze performance, and deliver personalized content. You can manage or block cookies through your browser settings, though some interactive features of our portal may become limited.
      </p>
    ),
  },
  {
    id: "data-sharing",
    title: "5. Data Sharing & Third Parties",
    icon: Server,
    content: (
      <p>
        We do not sell your personal information. Data may be shared strictly on a need-to-know basis with official joint organizers (Futurex Trade Fair & Events and Media Space Solutions), venue managers, and IT service providers strictly for smooth operational execution of the event.
      </p>
    ),
  },
  {
    id: "data-security-retention",
    title: "6. Security & Retention",
    icon: Lock,
    content: (
      <p>
        We implement robust security measures to protect your personal data against unauthorized access, loss, or misuse. Personal data collected for event participation will be retained only as long as necessary to fulfill event management duties, resolve disputes, and comply with legal requirements.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageBanner
        kicker="Legal & Transparency"
        title="Privacy Policy"
        subtitle="How we handle and safeguard your personal information for Nepal Wood Expo 2027."
      />

      <section className="bg-white py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* MAIN CONTENT AREA */}
            <div className="lg:col-span-8 space-y-10">
              {/* Introduction Box */}
              <div className="rounded-2xl border border-brand-amber/20 bg-brand-cream/30 p-6 md:p-8">
                <div className="flex items-center gap-3 text-brand-amber mb-3">
                  <ShieldCheck className="h-6 w-6 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-amber">
                    Data Protection Standard
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-brand-brown/85 md:text-base">
                  Welcome to <strong>Nepal Wood International Expo 2027</strong> (accessible via{" "}
                  <code className="text-brand-amber font-mono text-xs">nepalwood.com.np</code>). We respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy outlines our procedures regarding the collection, usage, and safeguarding of your information.
                </p>
              </div>

              {/* Policy Sections */}
              <div className="space-y-8">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <article
                      key={section.id}
                      id={section.id}
                      className="rounded-2xl border border-brand-brown/10 bg-white p-6 shadow-sm transition-all hover:border-brand-amber/30 md:p-8"
                    >
                      <div className="flex items-center gap-3 border-b border-brand-brown/10 pb-4 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-amber/10 text-brand-amber shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h2 className="font-display text-xl font-bold text-brand-brown sm:text-2xl">
                          {section.title}
                        </h2>
                      </div>
                      <div className="text-sm md:text-base leading-relaxed text-brand-brown/80 font-body">
                        {section.content}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Your Rights Statement */}
              <div className="rounded-2xl border border-brand-brown/10 bg-white p-6 md:p-8 shadow-sm">
                <h3 className="font-display text-lg font-bold text-brand-brown mb-2">
                  7. Your Rights & Access
                </h3>
                <p className="text-sm md:text-base text-brand-brown/80 leading-relaxed">
                  You have the right to request access to the personal data we hold about you, request corrections, or ask for deletion of your records. For any privacy-related inquiries, please contact our support desk directly.
                </p>
              </div>
            </div>

            {/* SIDEBAR NAVIGATION & CONTACT */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Quick Navigation Card */}
                <div className="rounded-2xl border border-brand-brown/10 bg-brand-cream/20 p-6 shadow-sm">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-brown flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-brand-amber" /> Quick Index
                  </h3>
                  <nav className="space-y-2">
                    {sections.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className="block rounded-lg px-3 py-2 text-xs md:text-sm font-medium text-brand-brown/75 transition-colors hover:bg-white hover:text-brand-amber"
                      >
                        {sec.title}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Contact Card */}
                <div className="rounded-2xl border border-brand-amber/30 bg-white p-6 shadow-sm">
                  <h3 className="font-display text-base font-bold text-brand-brown mb-2">
                    Privacy Support
                  </h3>
                  <p className="text-xs text-brand-brown/75 leading-relaxed mb-4">
                    If you have questions about this policy or your personal data, reach out to our team:
                  </p>
                  <a
                    href="mailto:namit@futurextrade.com"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-brown px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-brand-amber hover:text-brand-brown"
                  >
                    <Mail className="h-4 w-4" />
                   namit@futurextrade.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}