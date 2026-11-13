'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type Visitor = { name: string; designation: string; company: string; city: string; badgeId: string; interests: string[]; checkedInAt: string | null };
type Result = { ok: boolean; already?: boolean; undone?: boolean; error?: string; visitor?: Visitor };

declare global {
  interface Window { BarcodeDetector?: new (opts: { formats: string[] }) => { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> } }
}

export default function CheckinClient() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [camera, setCamera] = useState<'off' | 'on' | 'unsupported' | 'denied'>('off');
  const [count, setCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastRef = useRef<{ v: string; t: number }>({ v: '', t: 0 });

  const submit = useCallback(async (value: string, undo = false) => {
    if (!value.trim()) return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/checkin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: value, undo }) });
      const json: Result = await res.json();
      setResult(json);
      if (json.ok && !json.already && !json.undone) setCount((c) => c + 1);
      if (navigator.vibrate) navigator.vibrate(json.ok ? (json.already ? [60, 60, 60] : 80) : [200, 80, 200]);
    } catch {
      setResult({ ok: false, error: 'Network error. Check the connection.' });
    } finally {
      setBusy(false);
      setCode('');
    }
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamera('off');
  }, []);

  const start = async () => {
    if (!window.BarcodeDetector || !navigator.mediaDevices?.getUserMedia) { setCamera('unsupported'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setCamera('on');
    } catch {
      setCamera('denied');
    }
  };

  useEffect(() => {
    if (camera !== 'on' || !window.BarcodeDetector) return;
    const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    let raf = 0;
    let alive = true;
    const loop = async () => {
      if (!alive || !videoRef.current) return;
      try {
        const codes = await detector.detect(videoRef.current);
        const v = codes[0]?.rawValue;
        const now = Date.now();
        // Ignore the same badge for 4 s so one scan is one check-in.
        if (v && (v !== lastRef.current.v || now - lastRef.current.t > 4000)) {
          lastRef.current = { v, t: now };
          await submit(v);
        }
      } catch { /* frame not ready */ }
      raf = window.setTimeout(loop, 250) as unknown as number;
    };
    loop();
    return () => { alive = false; clearTimeout(raf); };
  }, [camera, submit]);

  useEffect(() => () => stop(), [stop]);

  const v = result?.visitor;
  return (
    <div className="checkin">
      <div className="panel checkin__scan">
        <div className={`checkin__video${camera === 'on' ? ' is-on' : ''}`}>
          <video ref={videoRef} playsInline muted />
          {camera !== 'on' && (
            <div className="checkin__placeholder">
              {camera === 'unsupported' && <p>This browser can’t scan QR codes. Use Chrome on Android, or type the badge ID below.</p>}
              {camera === 'denied' && <p>Camera permission was blocked. Allow the camera in the browser settings, or type the badge ID.</p>}
              <button className="btn" type="button" onClick={start}>Start camera scanner</button>
            </div>
          )}
        </div>
        {camera === 'on' && <button className="btn btn--ghost btn--sm" type="button" onClick={stop}>Stop camera</button>}
        <form className="checkin__manual" onSubmit={(e) => { e.preventDefault(); submit(code); }}>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Badge ID (NW27-XXXXXX), email or QR text" aria-label="Badge ID or email" autoComplete="off" />
          <button className="btn" type="submit" disabled={busy}>Check in</button>
        </form>
        <p className="muted small">Checked in on this device this session: <strong>{count}</strong></p>
      </div>

      <div className={`panel checkin__result${result ? (result.ok ? (result.already ? ' is-warn' : ' is-ok') : ' is-bad') : ''}`} aria-live="assertive">
        {!result && <p className="muted">Scan a badge to see the visitor here.</p>}
        {result && !result.ok && <><h2>✕ Not found</h2><p>{result.error}</p><p className="small">Send the visitor to the registration desk to register on the spot.</p></>}
        {v && (
          <>
            <h2>{result?.undone ? 'Check-in undone' : result?.already ? '⚠ Already checked in' : '✓ Welcome'}</h2>
            <p className="checkin__name">{v.name}</p>
            <p>{v.designation} · <strong>{v.company}</strong></p>
            <p className="muted">{v.city} · <code>{v.badgeId}</code></p>
            {v.interests?.length > 0 && <p className="small">Interested in: {v.interests.join(', ')}</p>}
            {v.checkedInAt && <p className="small">Checked in {new Date(v.checkedInAt).toLocaleString('en-GB', { timeZone: 'Asia/Kathmandu' })}</p>}
            {!result?.undone && <button className="admin-link" type="button" onClick={() => submit(`${v.badgeId}`, true)}>Undo check-in</button>}
          </>
        )}
      </div>
    </div>
  );
}
