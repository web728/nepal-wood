import JsonLd from '@/components/JsonLd';
import { PageHero } from '@/components/blocks';
import { pageMeta, graph, breadcrumbNode } from '@/lib/seo';
import { contacts } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Privacy Policy | Nepal Wood International Expo',
  description: 'How Nepal Wood International Expo collects, uses and protects personal information from visitor registrations, stand enquiries, brochure downloads and the website.',
  path: '/privacy-policy',
});

export default function Privacy() {
  const crumbs = [{ name: 'Privacy policy', path: '/privacy-policy' }];
  return (
    <>
      <JsonLd data={graph(breadcrumbNode(crumbs))} />
      <PageHero seed={191} dark={false} eyebrow="Legal" title={<>Privacy <em>policy.</em></>} lead="Last updated 23 October 2026." crumbs={crumbs} />
      <section className="section">
        <div className="container container--narrow prose">
          <p>This policy explains how the organisers of Nepal Wood International Expo, <strong>Futurex Trade Fair and Events Pvt. Ltd.</strong> (New Delhi, India) and <strong>Media Space Solutions Pvt. Ltd.</strong> (Kathmandu, Nepal), together “we”, handle personal information collected through nepalwood.com.np and at the expo. We follow the Individual Privacy Act, 2075 (2018) of Nepal and apply the same standards to every visitor, wherever they are.</p>

          <h2>1. What we collect</h2>
          <ul>
            <li><strong>Visitor registration:</strong> name, designation, company, business type, email, phone, city and country, product interests, how you heard about us, and your badge ID and check-in time.</li>
            <li><strong>Stand and sponsorship enquiries:</strong> company and contact details, products, stand type and size, technical needs and any message you send.</li>
            <li><strong>Brochure downloads and contact messages:</strong> name, company, email, phone and your message.</li>
            <li><strong>Technical data:</strong> the page you came from, campaign tags (such as utm_source), IP address and browser type, used for security and to understand which campaigns work.</li>
          </ul>

          <h2>2. Why we use it</h2>
          <ul>
            <li>To issue your visitor badge and verify entry at the venue.</li>
            <li>To prepare stand quotes, sponsorship proposals and exhibitor services.</li>
            <li>To send show information you asked for (schedules, exhibitor list, updates). You can opt out at any time.</li>
            <li>To keep the site secure and prevent spam or abuse.</li>
            <li>To measure and improve our promotion, using aggregated statistics.</li>
          </ul>
          <p>We only collect what we need for these purposes, and we ask for your consent on every form.</p>

          <h2>3. Who we share it with</h2>
          <p>We do not sell personal information. We share it only:</p>
          <ul>
            <li>between the two organisers, to run the expo;</li>
            <li>with service providers that host and operate our systems (website hosting, our database, Google Workspace/Sheets for the sales team, email delivery and, if you accept cookies, Google Analytics), under their data-protection terms;</li>
            <li>with exhibitors, only if you choose to share your details with them (for example, by having your badge scanned at a stand);</li>
            <li>where the law requires it.</li>
          </ul>

          <h2>4. Cookies & analytics</h2>
          <p>Essential storage remembers your cookie choice and, for staff, keeps the admin session signed in. Google Analytics cookies are set <strong>only if you click “Accept analytics”</strong>. You can change your choice at any time with “Cookie settings” in the footer. The venue map loads Google Maps only when you click “Show map”.</p>

          <h2>5. How long we keep it</h2>
          <p>Visitor and enquiry records are kept for up to 24 months after the edition they relate to, so we can invite you to the next edition, unless you ask us to delete them sooner. Records needed for accounting or legal reasons are kept as long as the law requires.</p>

          <h2>6. Security</h2>
          <p>Data is sent over encrypted connections (HTTPS) and stored in access-controlled systems. Only authorised team members can see registrations, and badge pages use unguessable links.</p>

          <h2>7. Your rights</h2>
          <p>You can ask to see, correct or delete your information, or withdraw your consent to marketing, at any time. Email <a href={`mailto:${contacts[2].email}`}>{contacts[2].email}</a> or <a href={`mailto:${contacts[0].email}`}>{contacts[0].email}</a> from the address you registered with, and we will respond within 30 days.</p>

          <h2>8. Changes</h2>
          <p>We may update this policy as the expo and the law change. The date at the top shows the latest version.</p>
        </div>
      </section>
    </>
  );
}
