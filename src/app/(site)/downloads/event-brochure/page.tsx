
import Image from 'next/image';

import Icon from '@/components/Icon';
import JsonLd from '@/components/JsonLd';
import BrochureForm from '@/components/forms/BrochureForm';

import { PageHero } from '@/components/blocks';

import {
  pageMeta,
  graph,
  breadcrumbNode,
} from '@/lib/seo';

import { downloads } from '@/lib/site';

import cover from '@/assets/brochure-cover.jpg';

import './brochure.css';

export const metadata = pageMeta({
  title:
    '2027 Event Brochure | Nepal Wood International Expo (PDF)',

  description:
    'Download the official Nepal Wood International Expo 2027 brochure: dates, venue, exhibitor and visitor profiles, show highlights and organiser contacts.',

  path: '/downloads/event-brochure',
});

export default function Brochure() {
  const crumbs = [
    {
      name: '2027 brochure',
      path: '/downloads/event-brochure',
    },
  ];

  const brochureUrl = downloads.brochure.file;
    
 const postShowReportUrl = downloads.reports[0].file;
  return (
    <div className="brochure-page">
      <JsonLd
        data={graph(breadcrumbNode(crumbs))}
      />

      <PageHero
        seed={181}
        dark={false}
        eyebrow="Official Event Brochure"
        title={
          <>
            The 2027 <em>event brochure.</em>
          </>
        }
        lead={`Explore the show in numbers, exhibitor and visitor profiles, previous edition highlights and organiser contacts. PDF, ${downloads.brochure.size}.`}
        crumbs={crumbs}
      />

      <section className="section section--cream">
        <div className="container form-layout">

          {/* LEFT SIDE: EXISTING LEAD FORM */}

          <div className="form-card">
            <p className="eyebrow">
              Download the brochure
            </p>

            <h2
              className="h-md"
              style={{
                margin: '14px 0 14px',
              }}
            >
              Get the event brochure.
            </h2>

            <p
              className="muted"
              style={{
                marginBottom: 26,
              }}
            >
              Fill in your details and select your
              interest. Your brochure download
              starts automatically after submission.
            </p>

            <BrochureForm />
          </div>

          {/* RIGHT SIDE: BROCHURE PREVIEW */}

          <aside className="form-aside">
            <div className="brochure-cover">
              <Image
                src={cover}
                alt="Cover of Nepal Wood International Expo 2027 brochure"
                sizes="(max-width: 900px) 80vw, 30vw"
                placeholder="blur"
                priority={false}
              />
            </div>

            {/* DIRECT PDF DOWNLOAD BUTTON */}

            <div className="brochure-download-card">
              <span
                className="brochure-download-card__icon"
                aria-hidden="true"
              >
                <Icon name="download" />
              </span>

              <div className="brochure-download-card__text">
                <strong>
               Post Show Report
                </strong>

                <p>
                  PDF document  
                </p>
              </div>

              <a
                className="brochure-download-btn"
                href={postShowReportUrl}
                download
                type="application/pdf"
                aria-label="Download Nepal Wood 2027 post show report PDF"
              >
                <Icon name="download" />
                Download PDF
              </a>
            </div>

            {/* BROCHURE CONTENT DETAILS */}

            <div className="card">
              <p className="card__kicker">
                What's inside
              </p>

              <ul>
                <li>
                  <Icon name="check" />
                  12th edition dates, venue and format
                </li>

                <li>
                  <Icon name="check" />
                  Exhibitor profile and product zones
                </li>

                <li>
                  <Icon name="check" />
                  Visitor profiles and event highlights
                </li>

                <li>
                  <Icon name="check" />
                  Organisers and booking contacts
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
