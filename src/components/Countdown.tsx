'use client';
import { useEffect, useState } from 'react';
import { event } from '@/lib/site';

const UNITS = [
  { key: 'd', label: 'Days' },
  { key: 'h', label: 'Hours' },
  { key: 'm', label: 'Minutes' },
  { key: 's', label: 'Seconds' },
] as const;

function parts(target: number) {
  let ms = Math.max(0, target - Date.now());
  const d = Math.floor(ms / 864e5); ms -= d * 864e5;
  const h = Math.floor(ms / 36e5); ms -= h * 36e5;
  const m = Math.floor(ms / 6e4); ms -= m * 6e4;
  const s = Math.floor(ms / 1e3);
  const p = (n: number) => String(n).padStart(2, '0');
  return { d: String(d), h: p(h), m: p(m), s: p(s), done: target <= Date.now() };
}

export default function Countdown({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  const target = new Date(event.countdownTarget).getTime();
  // Render placeholders on the server so hydration matches, then tick on the client.
  const [now, setNow] = useState<ReturnType<typeof parts> | null>(null);
  useEffect(() => {
    setNow(parts(target));
    const id = setInterval(() => setNow(parts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (now?.done) return <p className={`countdown-live ${className}`}><span className="dot" />The expo is open: {event.datesLabel}</p>;
  return (
    <div className={`countdown ${compact ? 'countdown--compact' : ''} ${className}`} role="timer" aria-label={`Countdown to opening day, ${event.datesLabel}`}>
      {UNITS.map((u) => (
        <div className="countdown__unit" key={u.key}>
          <span className="countdown__num tnum" key={now?.[u.key]}>{now ? now[u.key] : '--'}</span>
          <span className="countdown__label">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
