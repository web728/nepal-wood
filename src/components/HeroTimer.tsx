'use client';

import { useEffect, useState } from 'react';

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

export default function HeroTimer() {
  // null on the server and first paint, so server and client markup match.
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const tick = () => setState(getState(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (state?.phase === 'after') return null;

  if (state?.phase === 'live') {
    return (
      <div className="hero__timer hero__timer--live" role="status">
        <span className="hero__timer-pulse" aria-hidden="true" />
        <span className="hero__timer-label">The expo is on now</span>
      </div>
    );
  }

  const units =
    state?.phase === 'before'
      ? [
          { label: 'Days', value: pad(state.days) },
          { label: 'Hrs', value: pad(state.hours) },
          { label: 'Min', value: pad(state.minutes) },
          { label: 'Sec', value: pad(state.seconds) },
        ]
      : [
          { label: 'Days', value: '--' },
          { label: 'Hrs', value: '--' },
          { label: 'Min', value: '--' },
          { label: 'Sec', value: '--' },
        ];

  return (
    <div className="hero__timer" role="timer" aria-label="Time left until the expo opens">
      <span className="hero__timer-label">Expo opens in</span>
      <div className="hero__timer-grid">
        {units.map((unit) => (
          <span className="hero__timer-unit" key={unit.label}>
            <b className="tnum">{unit.value}</b>
            <small>{unit.label}</small>
          </span>
        ))}
      </div>
    </div>
  );
}