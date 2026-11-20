

import Link from 'next/link';

import Image from 'next/image';

import type { CSSProperties } from 'react';



import {

  Trees,

  Sprout,

  Zap,

  Settings2,

  Handshake,

  MessagesSquare,

  CalendarDays,

  Clock3,

  MapPin,

  ArrowUpRight,

  ArrowDown,

  CheckCircle2,

  Plus,

} from 'lucide-react';



import JsonLd from '@/components/JsonLd';

import {

  PageHero,

  SectionHead,

  CtaBand,

} from '@/components/blocks';



import {

  pageMeta,

  graph,

  breadcrumbNode,

} from '@/lib/seo';



import {

  agenda,

  sessions,

  audiences,

  faqs,

} from '@/lib/conference';



import ConferenceForms from '@/components/conference/ConferenceForms';



import heroImg from '@/assets/photos/inauguration-10th.jpg';

import teamImg from '@/assets/gallery/expo-56.jpg';



import './conference.css';



/* -----------------------------------------

   METADATA

----------------------------------------- */



export const metadata = pageMeta({

  title:

    'Technical Conclave 2027 | Nepal Wood International Expo',



  description:

    'Explore five technical seminars, an industry panel and speaker and attendee registrations at Nepal Wood International Expo 2027.',



  path: '/conference',

});



/* -----------------------------------------

   ICON CONFIGURATION

----------------------------------------- */



const sessionIcons = [

  Trees,

  Sprout,

  Zap,

  Settings2,

  Handshake,

] as const;



/* -----------------------------------------

   PAGE

----------------------------------------- */



export default function ConferencePage() {

  const crumbs = [

    {

      name: 'Technical Conclave',

      path: '/conference',

    },

  ];



  return (

    <main className="conference">



      {/* STRUCTURED DATA */}



      <JsonLd

        data={graph(breadcrumbNode(crumbs))}

      />



      {/* =====================================

          HERO

      ===================================== */}



      <PageHero

        seed={27}

        eyebrow="Industry Knowledge · Technology · Collaboration"

        title={

          <>

            Technical <em>Conclave 2027.</em>

          </>

        }

        lead="From sustainable timber to smart plywood factories — one focused industry forum connecting forestry experts, manufacturers, technology leaders and dealers."

        crumbs={crumbs}

        image={heroImg}

      />



      {/* =====================================

          EVENT INFORMATION

      ===================================== */}



      <section

        className="conference__quick"

        aria-label="Conclave event information"

      >

        <div className="container conference__quick-inner">



          <div className="conference__quick-item">

            <span className="conference__quick-icon">

              <CalendarDays

                size={20}

                strokeWidth={1.8}

              />

            </span>



            <div>

              <span className="conference__quick-label">

                Proposed date

              </span>



              <strong>

                29 January 2027

              </strong>



              <small>

                Day 2 · Subject to confirmation

              </small>

            </div>

          </div>



          <div className="conference__quick-item">

            <span className="conference__quick-icon">

              <Clock3

                size={20}

                strokeWidth={1.8}

              />

            </span>



            <div>

              <span className="conference__quick-label">

                Event time

              </span>



              <strong>

                09:30 AM – 02:10 PM

              </strong>



              <small>

                Tentative programme · Nepal time

              </small>

            </div>

          </div>



          <div className="conference__quick-item">

            <span className="conference__quick-icon">

              <MapPin

                size={20}

                strokeWidth={1.8}

              />

            </span>



            <div>

              <span className="conference__quick-label">

                Event location

              </span>



              <strong>

                Bhrikuti Mandap

              </strong>



              <small>

                Kathmandu · Hall to be announced

              </small>

            </div>

          </div>



          <div className="conference__quick-actions">

            <a

              href="#register-attendee"

              className="conference__button conference__button--copper"

            >

              <span>Register as attendee</span>

              <ArrowUpRight size={18} />

            </a>



            <a

              href="#register-speaker"

              className="conference__quick-link"

            >

              Apply as speaker

              <ArrowUpRight size={17} />

            </a>

          </div>



        </div>

      </section>



      {/* =====================================

          ABOUT CONCLAVE

      ===================================== */}



      <section

        className="section conference__about"

        id="about"

      >

        <div className="container split">



          <div

            className="conference__about-copy"

            data-reveal

          >

            <p className="eyebrow">

              About the conclave

            </p>



            <h2 className="h-lg">

              Ideas shaping the future of{' '}

              <em>Nepal&apos;s wood industry.</em>

            </h2>



            <p className="lead">

              The Nepal Wood Technical Conclave

              brings together the full plywood

              and wood-processing value chain —

              from responsible timber cultivation

              and agroforestry to energy-efficient

              manufacturing, factory automation

              and stronger manufacturer–dealer

              partnerships.

            </p>



            <p>

              Designed for practical knowledge

              sharing, the programme combines

              five focused technical seminars

              with an open panel discussion

              and audience Q&amp;A.

            </p>



            <a

              href="#agenda"

              className="link-arrow conference__about-link"

            >

              View full programme

              <ArrowDown size={18} />

            </a>

          </div>



          <div

            className="conference__about-media"

            data-reveal

          >

            <div className="split__media">

              <Image

                src={teamImg}

                alt="Nepal Wood Expo organisers and industry participants on stage"

                fill

                sizes="(max-width: 900px) 100vw, 45vw"

              />

            </div>



            <div className="conference__metric-row">



              <div>

                <strong>05</strong>

                <span>

                  Specialised seminars

                </span>

              </div>



              <div>

                <strong>40 min</strong>

                <span>

                  Per seminar incl. Q&amp;A

                </span>

              </div>



              <div>

                <strong>30 min</strong>

                <span>

                  Industry panel

                </span>

              </div>



            </div>

          </div>



        </div>

      </section>



      {/* =====================================

          TECHNICAL SESSIONS

      ===================================== */}



      <section

        className="section section--cream conference__sessions"

        id="topics"

      >

        <div className="container">



          <SectionHead

            eyebrow="Five core themes"

            title={

              <>

                Explore the{' '}

                <em>technical sessions.</em>

              </>

            }

            lead="Built around the challenges and opportunities across Nepal's timber, veneer and plywood ecosystem."

          />



          <div className="conference__topics">



            {sessions.map((session, index) => {

              const SessionIcon =

                sessionIcons[index] ?? Trees;



              return (

                <article

                  key={session.code}

                  className="conference__topic"

                  data-reveal

                  style={{

                    '--d': `${index * 0.07}s`,

                  } as CSSProperties}

                >

                  <div className="conference__topic-top">



                    <span className="conference__topic-number">

                      {String(index + 1).padStart(2, '0')}

                    </span>



                    <span

                      className="conference__topic-icon"

                      aria-hidden="true"

                    >

                      <SessionIcon

                        size={25}

                        strokeWidth={1.8}

                      />

                    </span>



                  </div>



                  <p className="card__kicker">

                    Seminar {session.code}

                    {' · '}

                    {session.group}

                  </p>



                  <h3 className="h-sm">

                    {session.title}

                  </h3>



                  <p className="conference__topic-description">

                    {session.description}

                  </p>



                  <div className="conference__topic-bottom">

                    <span>

                      Technical seminar

                    </span>

                    <ArrowUpRight

                      size={17}

                      aria-hidden="true"

                    />

                  </div>

                </article>

              );

            })}



            {/* PANEL CARD */}



            <article

              className="conference__topic conference__topic--panel"

              data-reveal

              style={{

                '--d': '.35s',

              } as CSSProperties}

            >

              <div className="conference__topic-top">



                <span className="conference__topic-number">

                  06

                </span>



                <span

                  className="conference__topic-icon"

                  aria-hidden="true"

                >

                  <MessagesSquare

                    size={25}

                    strokeWidth={1.8}

                  />

                </span>



              </div>



              <p className="card__kicker">

                Interactive industry exchange

              </p>



              <h3 className="h-sm">

                Panel Discussion

                {' & '}

                Open Q&amp;A

              </h3>



              <p className="conference__topic-description">

                A shared conversation between

                speakers, manufacturers, dealers

                and industry participants.

              </p>



              <a

                className="conference__panel-link"

                href="#register-attendee"

              >

                Join the conversation

                <ArrowUpRight size={18} />

              </a>

            </article>



          </div>



        </div>

      </section>



      {/* =====================================

          AGENDA

      ===================================== */}



      <section

        className="section conference__agenda-section"

        id="agenda"

      >

        <div className="container">



          <SectionHead

            eyebrow="Day 2 · Proposed programme"

            title={

              <>

                Technical Conclave{' '}

                <em>agenda.</em>

              </>

            }

            lead="All times are local to Kathmandu, Nepal. Speakers, date and hall will be announced following confirmation."

          />



          <div className="conference__agenda">



            <div className="conference__agenda-header">

              <span>Time</span>

              <span>Session</span>

              <span>Details</span>

            </div>



            {agenda.map((item, index) => (

              <article

                key={`${item.time}-${item.code}`}

                className="conference__agenda-row"

                data-reveal

                style={{

                  '--d': `${Math.min(index * .035, .2)}s`,

                } as CSSProperties}

              >

                <span className="conference__agenda-time">

                  {item.time}

                </span>



                <span className="conference__agenda-code">

                  {item.code}

                </span>



                <div className="conference__agenda-info">

                  <h3>

                    {item.title}

                  </h3>



                  <p>

                    {item.note}

                  </p>

                </div>



              </article>

            ))}

          </div>



          



        </div>

      </section>



      {/* =====================================

          WHO SHOULD ATTEND

      ===================================== */}



      <section

        className="section section--cream conference__audience"

        id="audience"

      >

        <div className="container">



          <SectionHead

            eyebrow="Who should attend"

            title={

              <>

                Built for people{' '}

                <em>moving the industry forward.</em>

              </>

            }

            lead="Relevant to professionals across the wood and panel value chain."

          />



          <div className="features features--3">



            {audiences.map(([name, description], index) => (

              <article

                className="feature conference__audience-card"

                key={name}

                data-reveal

                style={{

                  '--d': `${index * .06}s`,

                } as CSSProperties}

              >

                <span className="feature__icon">

                  <CheckCircle2

                    size={24}

                    strokeWidth={1.8}

                  />

                </span>



                <h3 className="h-sm">

                  {name}

                </h3>



                <p>

                  {description}

                </p>

              </article>

            ))}



          </div>

        </div>

      </section>



      {/* =====================================

          SPEAKER + ATTENDEE REGISTRATION

      ===================================== */}



      <section

        className="section conference__registration"

        id="register"

      >

        <div className="container">



          <SectionHead

            eyebrow="Join the conclave"

            title={

              <>

                Register your{' '}

                <em>interest.</em>

              </>

            }

            lead="Choose your participation type. Speaker applications are subject to review; attendee participation details will be confirmed by the organisers."

          />



          <ConferenceForms />



        



        </div>

      </section>



      {/* =====================================

          FAQ

      ===================================== */}



      <section

        className="section section--cream conference__faq-section"

        id="faq"

      >

        <div className="container conference__faq-layout">



          <div

            className="conference__faq-intro"

            data-reveal

          >

            <p className="eyebrow">

              Helpful information

            </p>



            <h2 className="h-lg">

              Frequently asked{' '}

              <em>questions.</em>

            </h2>



            <p>

              Need more information?{' '}

              <Link

                href="/contact"

                className="conference__inline-link"

              >

                Contact the organisers

              </Link>

              .

            </p>

          </div>



          <div className="faq conference__faq-list">



            {faqs.map(([question, answer]) => (

              <details

                className="faq__item"

                key={question}

              >

                <summary>

                  <span>{question}</span>

                  <Plus

                    size={22}

                    strokeWidth={1.8}

                    aria-hidden="true"

                  />

                </summary>



                <p>

                  {answer}

                </p>

              </details>

            ))}



          </div>



        </div>

      </section>



      {/* =====================================

          BOTTOM CTA

      ===================================== */}



      <section className="conference__closing">



        <div className="container conference__closing-inner">



          <div

            className="conference__closing-copy"

            data-reveal

          >

            <p className="eyebrow">

              Nepal Wood 2027

            </p>



            <h2 className="h-lg">

              Be part of the{' '}

              <em>technical conversation.</em>

            </h2>



            <p>

              Learn, exchange ideas and

              connect across the industry

              value chain.

            </p>

          </div>



          <div

            className="conference__closing-links"

            data-reveal

          >

            <a

              href="#register-attendee"

              className="conference__button conference__button--copper"

            >

              <span>

                Attendee registration

              </span>



              <ArrowUpRight size={18} />

            </a>



            <a

              href="#register-speaker"

              className="conference__button conference__button--outline"

            >

              <span>

                Speaker application

              </span>



              <ArrowUpRight size={18} />

            </a>

          </div>



        </div>

      </section>



      {/* GLOBAL CTA */}



      <CtaBand />



    </main>

  );

}
