// Procedural tree-ring cross-section, the brand motif from the 2027 brochure.
// Generated on the server from a seed: deterministic, so it ships as plain SVG with no client JS.

type Props = { rings?: number; seed?: number; size?: number; wobble?: number; className?: string; cracks?: number; indexed?: boolean };

function rng(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function TreeRings({ rings = 24, seed = 7, size = 1000, wobble = 1, className = '', cracks = 3, indexed = false }: Props) {
  const rand = rng(seed);
  const cx = size / 2, cy = size / 2;
  const maxR = size * 0.47;
  const f = (n: number) => String(Math.round(n));

  // Uneven growth years, like a real trunk.
  const gaps = Array.from({ length: rings }, () => 0.55 + rand() * 0.9);
  const total = gaps.reduce((a, b) => a + b, 0);
  let acc = size * 0.018;
  const radii = gaps.map((g) => (acc += (g / total) * (maxR - size * 0.018)));

  // One shared deformation field keeps rings parallel; an off-centre pith makes growth wider on one side.
  const ph = [rand() * 6.28, rand() * 6.28, rand() * 6.28, rand() * 6.28];
  const ecc = [(rand() - 0.5) * 0.16, (rand() - 0.5) * 0.12];

  const ringPath = (r: number, k: number) => {
    const outer = k === rings - 1;
    const n = outer ? 96 : 44;
    const ox = cx + ecc[0] * r, oy = cy + ecc[1] * r;
    const drift = k * 0.015;
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      let def = 0.045 * Math.sin(2 * t + ph[0] + drift) + 0.026 * Math.sin(3 * t + ph[1]) + 0.011 * Math.sin(5 * t + ph[2] - drift) + 0.004 * Math.sin(9 * t + ph[3] + k * 0.4);
      if (outer) def += 0.007 * Math.sin(23 * t + k) + (rand() - 0.5) * 0.012;
      const rr = r * (1 + wobble * def);
      pts.push([ox + rr * Math.cos(t), oy + rr * Math.sin(t) * 0.95]);
    }
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + 'Z';
  };

  const ringPaths = radii.map((r, k) => ringPath(r, k));
  const crackPaths = Array.from({ length: cracks }, () => {
    const a = rand() * Math.PI * 2;
    const len = maxR * (0.3 + rand() * 0.45);
    const start = maxR * (0.55 + rand() * 0.35);
    let d = `M${f(cx + start * Math.cos(a))} ${f(cy + start * Math.sin(a) * 0.95)}`;
    for (let s = 1; s <= 9; s++) {
      const rr = start - (len * s) / 9;
      const aa = a + (rand() - 0.5) * 0.08;
      d += `L${f(cx + rr * Math.cos(aa))} ${f(cy + rr * Math.sin(aa) * 0.95)}`;
    }
    return d;
  });

  return (
    <svg className={`tree-rings ${className}`} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true" focusable="false">
      {ringPaths.map((d, i) => (
        <path key={i} d={d} pathLength={1} style={{ ['--i' as string]: i }} data-ring={indexed ? i : undefined} className="tree-rings__ring" />
      ))}
      {crackPaths.map((d, i) => <path key={`c${i}`} d={d} className="tree-rings__crack" />)}
      <circle cx={cx} cy={cy} r={size * 0.012} className="tree-rings__pith" />
    </svg>
  );
}
