'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';

// Show opens 28 Jan 2027 and closes 31 Jan 2027 (Nepal time, UTC+05:45).
// Agar tumhare `event` object me start/end date already hai, to yahan wahi use kar sakte ho.
const START = new Date('2027-01-28T10:00:00+05:45').getTime();
const END = new Date('2027-01-31T18:00:00+05:45').getTime();

const pad = (n: number) => String(n).padStart(2, '0');

type State =
  | { phase: 'before'; days: number; hours: number; minutes: number; seconds: number }
  | { phase: 'live' }
  | { phase: 'after' };

function getState(now: number): State {
  if (now >= END) return { phase: 'after' };
  if (now >= START) return { phase: 'live' };

  const total = Math.floor((START - now) / 1000);
  return {
    phase: 'before',
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

type Props = {
  dates: string;
  venue: string;
};

export default function ExpoCountdown({ dates, venue }: Props) {
  // null on the server and first paint, so server and client markup match.
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const tick = () => setState(getState(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // After the show the whole section disappears.
  if (state?.phase === 'after') return null;

  const live = state?.phase === 'live';

  const units =
    state?.phase === 'before'
      ? [
          { label: 'Days', value: pad(state.days) },
          { label: 'Hours', value: pad(state.hours) },
          { label: 'Min', value: pad(state.minutes) },
          { label: 'Sec', value: pad(state.seconds) },
        ]
      : [
          { label: 'Days', value: '--' },
          { label: 'Hours', value: '--' },
          { label: 'Min', value: '--' },
          { label: 'Sec', value: '--' },
        ];

  return (
    <section className="cd on-dark" aria-labelledby="cd-title">
      <div className="container">
        <div className="cd__inner" data-fx="0">
          <div className="cd__copy">
            <p className="eyebrow">{live ? 'Happening now' : 'Countdown'}</p>
            <h2 id="cd-title" className="h-lg cd__title">
              {live ? (
                <>The expo is <em>on now.</em></>
              ) : (
                <>The 12th edition <em>opens in.</em></>
              )}
            </h2>
            <p className="cd__meta">
              <span className="tnum">{dates}</span>
              <span>{venue}</span>
            </p>
            <Link className="btn btn--copper" href={live ? '/visitor-registration' : '/exhibitor-registration'}>
              {live ? 'Register to visit' : 'Book a stand'} <Icon name="arrow" className="arrow" />
            </Link>
          </div>

          {!live && (
            <div className="cd__timer" role="timer" aria-label="Time left until the expo opens">
              {units.map((unit) => (
                <div className="cd__unit" key={unit.label}>
                  {/* The key restarts the small slide animation every time the number changes. */}
                  <span className="cd__num tnum" key={unit.value}>{unit.value}</span>
                  <span className="cd__label">{unit.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}