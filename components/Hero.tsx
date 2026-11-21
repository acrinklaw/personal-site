"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";

/* A flow-through oligonucleotide synthesizer, drawn as its process picture.
   Reagents are pumped through one column; each cycle (detritylate, couple,
   oxidize, cap) adds one monomer to the 5′ end of the chain on the support,
   so whatever `text` says gets built from its last letter to its first.
   When the last cycle is through, the strand is cleaved off the support,
   leaves the column and anneals to its complement as a duplex. */

const NAME = "AUSTIN CRINKLAW";

const NAV = [
  { label: "Experience", href: "#experience", run: "2018 TO NOW" },
  { label: "Projects", href: "#projects", run: "OPEN SOURCE" },
];

const CONTACT = [
  { label: "GitHub", href: "https://github.com/acrinklaw", run: "VIEW CODE", Icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/acrinklaw", run: "LETS CONNECT", Icon: Linkedin },
  { label: "Email", href: "mailto:austincrinklaw@gmail.com", run: "SAY HELLO", Icon: Mail },
];

/* ---------- Chemistry ---------- */

const PALE = "#ECEAF2";
const PLUM = "#1A0E2B";
const TRITYL = "#F59A3C"; // the DMT cation really is orange
const YELLOW = "#FDE725";
const TEAL = "#14696A";

type StepKey = "deblock" | "wash" | "couple" | "oxidize" | "cap";
type Step = { key: StepKey; label: string; from: number; to: number; color: string };

/* One cycle, as fractions of its duration: when each valve is open. */
const STEPS: Step[] = [
  { key: "deblock", label: "Detritylate", from: 0, to: 0.24, color: TRITYL },
  { key: "wash", label: "Wash", from: 0.24, to: 0.32, color: PALE },
  { key: "couple", label: "Couple", from: 0.32, to: 0.6, color: YELLOW },
  { key: "oxidize", label: "Oxidize", from: 0.6, to: 0.78, color: "#6DCD59" },
  { key: "cap", label: "Cap", from: 0.78, to: 0.92, color: "#2FB5A0" },
  { key: "wash", label: "Wash", from: 0.92, to: 1, color: PALE },
];
const RAIL = STEPS.filter((s) => s.key !== "wash");
const COUPLE = STEPS[2];
const OXIDIZE = STEPS[3];

/* After the last cycle the lines are flushed with acetonitrile. */
const FLUSH = 0.7;
const FLUSH_STEP: Step = { key: "wash", label: "Wash", from: 0, to: FLUSH, color: PALE };
const stepsOf = (cycle: number, n: number) => (cycle < n ? STEPS : cycle === n ? [FLUSH_STEP] : []);

/* Plug flow. Each stretch of the path holds this much liquid, in cycles of
   pumping, so a reagent that leaves its bottle at time g reaches a point
   further along at g plus everything held upstream of it. Every event on the
   column is timed by a front getting there, not by the valve opening. */
const HOLD = { feed: 0.06, inlet: 0.03, column: 0.5, outlet: 0.015, uv: 0.015, drain: 0.05 };
const AT = {
  inlet: HOLD.feed,
  column: HOLD.feed + HOLD.inlet,
  outlet: HOLD.feed + HOLD.inlet + HOLD.column,
  uv: HOLD.feed + HOLD.inlet + HOLD.column + HOLD.outlet,
  drain: HOLD.feed + HOLD.inlet + HOLD.column + HOLD.outlet + HOLD.uv,
};

/* The acid itself is colourless. The orange is the DMT cation it knocks off
   the 5′ end, carried downstream in the first liquid past the chain. */
const PLUME = 0.12;
const plume = (u: number) => (u <= 0 ? 0 : (u / 0.025) * Math.exp(1 - u / 0.025));

const REAGENTS = [
  {
    key: "acn",
    label: "ACN",
    x: 560,
    color: PALE,
    about: "Acetonitrile. Washes the column between steps.",
  },
  {
    key: "deblock",
    label: "Deblock",
    x: 660,
    color: TRITYL,
    about: "Dichloroacetic acid in toluene. Strips the DMT group off the 5′ end so the next monomer can attach.",
  },
  {
    key: "activator",
    label: "Activator",
    x: 760,
    color: YELLOW,
    about: "Mixed with the amidite on the way to the column, making it reactive enough to couple.",
  },
  {
    key: "oxidize",
    label: "Oxidizer",
    x: 860,
    color: "#6DCD59",
    about: "Iodine, water and pyridine. Turns the fresh phosphite linkage into a stable phosphate.",
  },
  {
    key: "cap",
    label: "Cap",
    x: 960,
    color: "#2FB5A0",
    about: "Acetic anhydride and N-methylimidazole. Blocks chains that failed to couple so they cannot grow into deletions.",
  },
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vialOf = (ch: string) => (ch === " " ? "Sp" : ch);

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (x: number) => 1 - (1 - clamp01(x)) ** 3;
const ease = (x: number) => {
  const c = clamp01(x);
  return c < 0.5 ? 4 * c * c * c : 1 - (-2 * c + 2) ** 3 / 2;
};
const frac = (x: number) => x - Math.floor(x);

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = rgb(a);
  const B = rgb(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * clamp01(t))).join(",")})`;
};

/* ---------- Projection ----------
   World space: x runs left to right along the instrument, y from the back of the
   deck to the front, z up, in roughly screen-sized units. The view looks down on
   the deck from the front right, so the top, front and right faces show. */

const W = 1200;
const H = 822;
const AX = { x: 0.966, y: 0.259 }; // where one unit of world x lands on screen
const AY = { x: -0.5, y: 0.5 }; // and one unit of world y
const OX = 200;
const OY = 362; // the band above the instrument is where the duplex forms

type P3 = [number, number, number];
type P2 = [number, number];

const pt = (x: number, y: number, z: number): P2 => [OX + x * AX.x + y * AY.x, OY + x * AX.y + y * AY.y - z];
const fmt = (ps: P2[]) => ps.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");
const shape = (ps: P2[]) => `M${fmt(ps)}Z`;
const line = (ps: P3[]) => `M${fmt(ps.map((q) => pt(...q)))}`;
const quad = (ps: P3[]) => shape(ps.map((q) => pt(...q)));

function hull(ps: P2[]): P2[] {
  const s = ps.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: P2[]) => {
    const out: P2[] = [];
    for (const q of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop();
      out.push(q);
    }
    out.pop();
    return out;
  };
  return [...half(s), ...half(s.reverse())];
}

const ring = (at: (t: number) => P3, n = 40) => Array.from({ length: n }, (_, i) => pt(...at((i / n) * 2 * Math.PI)));

/* A cylinder standing on the deck: its silhouette and its top. A liquid's
   surface can tip toward `psi`, which is how it sloshes. */
function upright(cx: number, cy: number, r: number, z0: number, h: number, tilt = 0, psi = 0) {
  const at = (z: number, lean: number) =>
    ring((t) => [cx + r * Math.cos(t), cy + r * Math.sin(t), z + lean * Math.cos(t - psi)]);
  const top = at(z0 + h, tilt);
  return { body: shape(hull([...at(z0, 0), ...top])), top: shape(top) };
}

/* A cylinder lying along x: its silhouette and the end facing us. */
function lying(x0: number, x1: number, y: number, z: number, r: number) {
  const at = (x: number) => ring((t) => [x, y + r * Math.cos(t), z + r * Math.sin(t)]);
  const end = at(x1);
  return { body: shape(hull([...at(x0), ...end])), end: shape(end), at: (x: number) => shape(at(x)) };
}

function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  return {
    top: quad([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]),
    front: quad([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]]),
    side: quad([[x1, y0, z1], [x1, y1, z1], [x1, y1, z0], [x1, y0, z0]]),
  };
}

/* Flat drawing onto a face: local u runs along x, v runs down the face. */
const onFront = (y: number, zTop: number) => {
  const [e, f] = pt(0, y, zTop);
  return `matrix(${AX.x} ${AX.y} 0 1 ${e} ${f})`;
};
const onTop = (z: number) => {
  const [e, f] = pt(0, 0, z);
  return `matrix(${AX.x} ${AX.y} ${AY.x} ${AY.y} ${e} ${f})`;
};
const onSide = (x: number, depth: number, zTop: number) => {
  const [e, f] = pt(x, depth, zTop);
  return `matrix(${-AY.x} ${-AY.y} 0 1 ${e} ${f})`; // u runs front to back
};

/* ---------- The instrument ---------- */

const BODY = { w: 1000, d: 340, h: 130 };
const DECK = BODY.h;
const GLASS = "#8C82A3"; // reads against both the dark deck and the pale page
const SKIN = { top: "#2C1D44", front: "#1F1233", side: "#160B26", edge: "rgba(236,234,242,.16)" };
const DARK = "#140A24"; // an empty column

const VIAL = { y: 52, r: 14, h: 70 };
const vialX = (i: number) => 44 + i * 40;
const BOTTLE = { y: 62, r: 30, h: 108 };
const MANIFOLD_Y = 110;
const PUMP = { x: 44, y: 252, r: 24, h: 30 };
const COL = { x0: 112, x1: 868, y: 252, z: DECK + 36, r: 30 };
const SUPPORT_X = 826;
const SUPPORT_R = 26;
const FIRST_X = 772;
const LAST_X = 200;
const UV = { x0: 892, x1: 944, y0: 226, y1: 278, z1: DECK + 66 };
const WASTE = { x: 966, y: 306, r: 20, h: 52 };
const SPOUT_Z = DECK + WASTE.h + 13;

/* The run monitor: a screen on the front face, in face coordinates. */
const SCREEN = { u0: 430, u1: 976, v0: 14, v1: 116 };
const TRACE = { x: 448, w: 512, base: 96, h: 58 };

const feedLine = (x: number, y: number, r: number): P3[] => [
  [x, y + r, DECK],
  [x, MANIFOLD_Y, DECK],
  [PUMP.x, MANIFOLD_Y, DECK],
  [PUMP.x, PUMP.y - PUMP.r, DECK],
];
/* The run every bottle's line shares on its way to the pump. */
const MANIFOLD = line(feedLine(REAGENTS[REAGENTS.length - 1].x, BOTTLE.y, BOTTLE.r).slice(1));
const INLET: P3[] = [
  [PUMP.x + PUMP.r, PUMP.y, DECK + 14],
  [COL.x0 - 22, PUMP.y, DECK + 14],
  [COL.x0 - 22, COL.y, COL.z],
  [COL.x0, COL.y, COL.z],
];
const OUTLET: P3[] = [
  [COL.x1, COL.y, COL.z],
  [UV.x0, COL.y, COL.z],
];
const DRAIN: P3[] = [
  [UV.x1, COL.y, COL.z],
  [WASTE.x, COL.y, COL.z],
  [WASTE.x, COL.y, SPOUT_Z],
  [WASTE.x, WASTE.y - 5, SPOUT_Z],
];

const TUBE = lying(COL.x0, COL.x1, COL.y, COL.z, COL.r);
const HOUSING = box(0, BODY.w, 0, BODY.d, 0, BODY.h);
const UV_BOX = box(UV.x0, UV.x1, UV.y0, UV.y1, DECK, UV.z1);
const PUMP_BODY = upright(PUMP.x, PUMP.y, PUMP.r, DECK, PUMP.h);
const WASTE_GLASS = upright(WASTE.x, WASTE.y, WASTE.r, DECK, WASTE.h);
const CLAMPS = [COL.x0 + 90, COL.x1 - 90].map((x) => box(x - 9, x + 9, COL.y - 13, COL.y + 13, DECK, COL.z - COL.r + 5));
const SHADOW = quad([
  [-14, 10, 0],
  [BODY.w + 22, 10, 0],
  [BODY.w + 22, BODY.d + 26, 0],
  [-14, BODY.d + 26, 0],
]);

/* How far along a bent line its first corner is, as a fraction of its length. */
function firstCorner(ps: P3[]) {
  const s = ps.map((q) => pt(...q));
  let total = 0;
  let first = 0;
  for (let i = 1; i < s.length; i++) {
    total += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
    if (i === 1) first = total;
  }
  return first / total;
}

/* ---------- The run ---------- */

/* The opening run starts with the surname already on the support, so the
   visitor only watches the first name being added to it. */
const PREBUILT = NAME.length - NAME.indexOf(" ");

/* Everything about a run that does not change while it plays. `pre` cycles
   are counted as already done when it starts. */
function plan(text: string, fast: boolean, pre = 0) {
  const order = text.split("").reverse(); // synthesis runs 3′ to 5′
  const n = order.length;
  const rand = mulberry32(text.split("").reduce((s, c) => s * 31 + c.charCodeAt(0), 7) | 0);
  const released: number[] = []; // trityl released at each cycle, relative to the first
  let surviving = 1;
  for (let i = 0; i < n; i++) {
    released.push(surviving);
    surviving *= 0.985 + rand() * 0.012; // stepwise coupling efficiency
  }
  const ends: number[] = [];
  let t = 0;
  let last = 0;
  for (let i = 0; i < n; i++) {
    // The first cycles watched are slow enough to follow, then it picks up.
    last = fast ? 240 : i < pre ? 1000 : Math.max(1500, 2600 * 0.88 ** (i - pre));
    t += last;
    ends.push(t);
  }
  pre = Math.min(pre, n - 1);
  const vials = Array.from(new Set(order.slice().reverse())).map(vialOf);
  const pitch = Math.min(48, (FIRST_X - LAST_X) / Math.max(1, n - 1));
  return {
    order,
    n,
    released,
    fullLength: surviving,
    ends,
    total: t,
    start: pre > 0 ? ends[pre - 1] : 0, // where the clock starts
    last,
    vials,
    pitch, // spacing of the chain along the column
    r: Math.min(20, pitch * 0.43),
    pace: fast ? 0.35 : 1, // how quickly the ending plays
  };
}
type Plan = ReturnType<typeof plan>;

function locate(elapsed: number, ends: number[]) {
  const n = ends.length;
  if (elapsed >= ends[n - 1]) return { cycle: n, phase: 0, done: true };
  const e = Math.max(0, elapsed);
  let c = 0;
  while (ends[c] <= e) c++;
  const start = c ? ends[c - 1] : 0;
  return { cycle: c, phase: (e - start) / (ends[c] - start), done: false };
}

/* Liquid pumped so far, in cycles. This is the clock the fluid runs on. */
function pumped(elapsed: number, p: Plan) {
  if (elapsed <= 0) return 0;
  const { cycle, phase, done } = locate(elapsed, p.ends);
  return done ? p.n + Math.min(FLUSH, (elapsed - p.total) / p.last) : cycle + phase;
}

type Slug = { a: number; b: number; color: string; opacity: number };

/* Which reagents sit in a stretch of the path, oldest and furthest along first.
   `a` and `b` are fractions of the stretch, measured from its upstream end. */
function slugsIn(g: number, at: number, hold: number, n: number) {
  const hi = g - at;
  const lo = hi - hold;
  const out: { a: number; b: number; step: Step }[] = [];
  if (hi <= 0) return out;
  for (let c = Math.max(0, Math.floor(lo)); c <= Math.min(n, Math.floor(hi)); c++) {
    for (const s of stepsOf(c, n)) {
      const e0 = Math.max(lo, c + s.from);
      const e1 = Math.min(hi, c + s.to);
      if (e1 > e0) out.push({ a: (hi - e1) / hold, b: (hi - e0) / hold, step: s });
    }
  }
  return out;
}

const inTube = (g: number, at: number, hold: number, n: number): Slug[] =>
  slugsIn(g, at, hold, n).map(({ a, b, step }) => ({ a, b, color: step.color, opacity: step.key === "wash" ? 0.4 : 0.9 }));

/* The trityl band, wherever it is in a stretch downstream of the column. */
function tritylIn(g: number, at: number, hold: number, n: number): Slug[] {
  const hi = g - at;
  const out: Slug[] = [];
  for (let c = Math.max(0, Math.floor(hi - hold - PLUME)); c <= Math.min(n - 1, Math.floor(hi)); c++) {
    for (const [e0, e1, opacity] of [[0.005, 0.06, 1], [0.06, PLUME, 0.5]]) {
      const a = Math.max(0, (hi - c - e1) / hold);
      const b = Math.min(1, (hi - c - e0) / hold);
      if (b > a) out.push({ a, b, color: TRITYL, opacity });
    }
  }
  return out;
}

const feeds = (src: string, s: Step, cycle: number, p: Plan) =>
  s.key === "couple"
    ? src === "activator" || src === `vial:${vialOf(p.order[cycle])}`
    : src === (s.key === "wash" ? "acn" : s.key);

/* How long ago a bottle last gave liquid, in cycles; 0 while it is giving. */
function idleFor(src: string, g: number, p: Plan) {
  if (g <= 0 || g >= p.n + FLUSH) return Infinity;
  for (let c = Math.min(p.n, Math.floor(g)); c >= Math.max(0, Math.floor(g) - 1); c--) {
    const steps = stepsOf(c, p.n);
    for (let i = steps.length - 1; i >= 0; i--) {
      const s = steps[i];
      if (c + s.from > g || !feeds(src, s, c, p)) continue;
      return g < c + s.to ? 0 : g - c - s.to;
    }
  }
  return Infinity;
}

/* Liquid in a bottle's own line. It stays primed as far as the valve; past the
   valve the next reagent pushes it on. */
function feedSlugs(src: string, color: string, valve: number, g: number, p: Plan): Slug[] {
  const out: Slug[] = [];
  for (let c = Math.max(0, Math.floor(g) - 1); c <= Math.min(p.n, Math.floor(g)); c++) {
    for (const s of stepsOf(c, p.n)) {
      if (!feeds(src, s, c, p)) continue;
      const tail = (g - c - s.to) / HOLD.feed;
      const a = tail > 0 ? Math.max(tail, valve) : 0;
      const b = Math.min(1, (g - c - s.from) / HOLD.feed);
      if (b > a) out.push({ a, b, color, opacity: src === "acn" ? 0.45 : 0.9 });
    }
  }
  return out;
}

/* Doses a bottle has given so far, counting the one in progress by its share. */
function drawn(src: string, g: number, p: Plan) {
  let u = 0;
  for (let c = 0; c <= Math.min(p.n - 1, Math.floor(g)); c++) {
    for (const s of STEPS) if (feeds(src, s, c, p)) u += clamp01((g - c - s.from) / (s.to - s.from));
  }
  return u;
}

/* ---------- The column ---------- */

const colX = (f: number) => COL.x0 + f * (COL.x1 - COL.x0);
const colAt = (x: number) => AT.column + ((x - COL.x0) / (COL.x1 - COL.x0)) * HOLD.column;
const NOSE = 56; // liquid in a tube runs ahead down the middle and lags at the wall

const across = (x: number, r: number) => ring((t) => [x, COL.y + r * Math.cos(t), COL.z + r * Math.sin(t)], 22);

/* A body of liquid from a flat back at xa to a rounded front around xb. */
function plug(xa: number, ra: number, xb: number, mid?: number) {
  const ps = across(xa, ra);
  if (mid !== undefined) ps.push(...across(mid, COL.r - 1));
  for (const rho of [1, 0.86, 0.68, 0.45, 0.2]) ps.push(...across(xb + NOSE * (0.5 - rho * rho), rho * (COL.r - 1)));
  return shape(hull(ps));
}

/* The chain on its support: where each monomer is, and when things happen to it. */
function chain(p: Plan, g: number, elapsed: number) {
  const afloat = elapsed <= 0 ? 0 : elapsed < p.total ? 1 : Math.max(0, 1 - (elapsed - p.total) / 600);
  const radius = (k: number) => (p.order[k] === " " ? 7 : p.r);
  const dockX = (k: number) => FIRST_X - k * p.pitch;
  const enters = (k: number) => k + COUPLE.from + AT.column; // the amidite front reaches the column
  const docks = (k: number) => k + COUPLE.from + colAt(dockX(k)) + 0.03; // and then the 5′ end
  const arrival = (k: number) => clamp01((g - enters(k)) / (docks(k) - enters(k)));
  const world = (k: number): P3 => {
    const e = 1 - (1 - arrival(k)) ** 2;
    const x = COL.x0 + 18 + (dockX(k) - COL.x0 - 18) * e;
    // The chain trails in the flow, more freely the further it is from its anchor.
    const bob = afloat
      ? afloat * (Math.min(1, (k + 1) / 3) * 2.4 * Math.sin(elapsed / 240 - k * 0.6) + (1 - e) * 5 * Math.sin(elapsed / 130 + k))
      : 0;
    return [x, COL.y, COL.z + bob];
  };
  return {
    radius,
    arrival,
    count: Math.min(p.n, Math.max(0, Math.floor(g - COUPLE.from - AT.column) + 1)), // monomers in the column
    pos: (k: number) => pt(...world(k)),
    /* The 5′ end a cycle starts from, and when its acid gets there. */
    tipX: (c: number) => (c > 0 ? dockX(c - 1) - radius(c - 1) : SUPPORT_X - SUPPORT_R),
    oxidized: (k: number) => g >= k + OXIDIZE.from + colAt(dockX(k)),
    enters,
  };
}

/* ---------- Parts ---------- */

/* A bottle: glass, the liquid in it, and a cap. `stir` is how recently it gave.
   The glass never changes, and a bottle at rest does not move, so callers round
   what they pass and an idle bottle is not redrawn at all. */
const Bottle = memo(function Bottle({
  x,
  y,
  r,
  h,
  color,
  stir,
  level,
  time,
  seed,
}: {
  x: number;
  y: number;
  r: number;
  h: number;
  color: string;
  stir: number;
  level: number;
  time: number;
  seed: number;
}) {
  const { glass, neck, cap } = useMemo(
    () => ({ glass: upright(x, y, r, DECK, h), neck: upright(x, y, r * 0.42, DECK + h, 7), cap: upright(x, y, r * 0.55, DECK + h + 7, 11) }),
    [x, y, r, h]
  );
  const liquid = upright(x, y, r - 2.5, DECK + 2, h * level, stir * r * 0.08, time / 170 + seed);
  return (
    <>
      <path d={glass.body} fill={GLASS} fillOpacity=".14" />
      <path d={liquid.body} fill={color} fillOpacity={0.42 + 0.3 * stir} />
      <path d={liquid.top} fill={color} fillOpacity={0.62 + 0.38 * stir} />
      {stir > 0.03 &&
        [0, 1, 2].map((i) => {
          const f = frac(seed * 0.37 + i / 3 + time / (760 + i * 140));
          const [bx, by] = pt(x + (i - 1) * r * 0.36, y + r * 0.3, DECK + 3 + f * h * level * 0.9);
          return <circle key={i} cx={bx} cy={by} r={1 + r * 0.045} fill="#fff" fillOpacity={stir * 0.55 * Math.sin(Math.PI * f)} />;
        })}
      <path d={glass.body} fill="none" stroke={mix(GLASS, color, stir * 0.7)} strokeOpacity=".85" strokeWidth="1.25" />
      <path d={neck.body} fill="#3A2A55" />
      <path d={cap.body} fill="#463466" />
      <path d={cap.top} fill="#5A4680" />
    </>
  );
});

/* What a bottle needs to be drawn, quantized so an idle one compares equal. */
const bottleState = (stir: number, level: number, time: number) => {
  const s = stir < 0.004 ? 0 : Math.round(stir * 400) / 400;
  return { stir: s, level: Math.round(level * 2000) / 2000, time: s > 0 ? time : 0 };
};

/* A length of tubing and the liquid in it. `glint` moves the highlights along. */
function Tube({ d, slugs, glint, bare }: { d: string; slugs: Slug[]; glint?: number; bare?: boolean }) {
  return (
    <g fill="none" strokeLinejoin="round">
      {!bare && <path d={d} stroke={PALE} strokeOpacity=".2" strokeWidth="4.5" strokeLinecap="round" />}
      {slugs.map((s, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          stroke={s.color}
          strokeOpacity={s.opacity}
          strokeWidth="2.6"
          strokeDasharray={`${(s.b - s.a).toFixed(4)} 2`}
          strokeDashoffset={(-s.a).toFixed(4)}
        />
      ))}
      {glint !== undefined && slugs.length > 0 && (
        <path d={d} stroke="#fff" strokeOpacity=".4" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="0.5 25.5" strokeDashoffset={-(glint % 26)} />
      )}
    </g>
  );
}

type Tip = { title: string; detail: string } | null;
type SetTip = (tip: Tip) => void;

const hoverWith = (setTip: SetTip) => (title: string, detail: string) => ({
  onPointerEnter: () => setTip({ title, detail }),
  onPointerLeave: () => setTip(null),
});

function Monomer({ ch, r, edge = 0 }: { ch: string; r: number; edge?: number }) {
  return (
    <>
      <circle r={r} fill={YELLOW} stroke={PLUM} strokeOpacity={edge} strokeWidth="1.5" />
      <circle cx={-r * 0.3} cy={-r * 0.35} r={r * 0.3} fill="#fff" fillOpacity=".3" />
      <text dy=".36em" textAnchor="middle" style={{ fontSize: r * 1.25, fontWeight: 600, fill: PLUM }}>
        {ch}
      </text>
    </>
  );
}

function Dmt({ x, y, opacity, lift, hover }: { x: number; y: number; opacity: number; lift: number; hover?: object }) {
  return (
    <g opacity={opacity} transform={`translate(${x} ${y - lift})`} {...hover}>
      <rect x="-19" y="-12" width="38" height="24" rx="6" fill={TRITYL} />
      <text dy=".36em" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, fill: PLUM }} className="synth-fine">
        DMT
      </text>
      <text x="-27" dy=".36em" textAnchor="end" className="synth-label">
        5′
      </text>
    </g>
  );
}

const DMT_ABOUT =
  "Dimethoxytrityl protects the 5′ end until the next cycle. Acid removes it as a bright orange cation, which is what the monitor measures.";

/* Small things carried along in the column, so the liquid can be seen moving. */
const MOTES = (() => {
  const rand = mulberry32(11);
  return Array.from({ length: 30 }, () => ({ at: rand(), rho: Math.sqrt(rand()) * 0.86, phi: rand() * 2 * Math.PI, r: 0.9 + rand() * 1.3 }));
})();

/* ---------- The instrument ---------- */

/* Everything that never moves. It is drawn on its own layer underneath, so the
   blurred shadow and the big faces are painted once rather than every frame. */
const StaticHousing = memo(function StaticHousing() {
  return (
    <>
      <defs>
        <filter id="soft-shadow" x="-10%" y="-20%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <path d={SHADOW} fill={PLUM} fillOpacity=".28" filter="url(#soft-shadow)" />
      <g stroke={SKIN.edge} strokeWidth="1" strokeLinejoin="round">
        <path d={HOUSING.front} fill={SKIN.front} />
        <path d={HOUSING.side} fill={SKIN.side} />
        <path d={HOUSING.top} fill={SKIN.top} />
      </g>
      <g transform={onTop(DECK)}>
        <rect x="14" y="12" width={BODY.w - 28} height={BODY.d - 24} rx="10" fill="none" stroke={PALE} strokeOpacity=".08" />
      </g>
      <g transform={onSide(BODY.w, BODY.d, BODY.h)} stroke={PALE} strokeOpacity=".12" strokeWidth="3" strokeLinecap="round">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${80 + i * 18} 32V92`} />
        ))}
      </g>
      <g transform={onFront(BODY.d, BODY.h)}>
        <text x="32" y="34" className="synth-label" style={{ fontSize: 10.5, letterSpacing: "0.2em", fillOpacity: 0.45 }}>
          CRINKLAW INSTRUMENTS
        </text>
        <text x="32" y="57" className="synth-label" style={{ fontSize: 18, fontWeight: 600, fillOpacity: 0.9 }}>
          OS-15 Oligo Synthesizer
        </text>
        <rect
          x={SCREEN.u0}
          y={SCREEN.v0}
          width={SCREEN.u1 - SCREEN.u0}
          height={SCREEN.v1 - SCREEN.v0}
          rx="6"
          fill="#0C0616"
          stroke={PALE}
          strokeOpacity=".18"
        />
      </g>
      {CLAMPS.map((clamp, i) => (
        <g key={i} stroke={SKIN.edge}>
          <path d={clamp.top} fill={SKIN.top} />
          <path d={clamp.front} fill={SKIN.front} />
          <path d={clamp.side} fill={SKIN.side} />
        </g>
      ))}
    </>
  );
});

/* Parts that never change but sit among moving ones, so they share the moving
   layer; memoized so React does not rebuild them every frame. */
const ColumnGlass = memo(function ColumnGlass() {
  const [lx, ly] = pt(COL.x0 + 40, COL.y + COL.r + 26, DECK);
  const [sx, sy] = pt(SUPPORT_X, COL.y + COL.r + 26, DECK);
  return (
    <>
      <g pointerEvents="none">
        <path d={TUBE.body} fill="url(#glass-sheen)" />
        <path d={line([[COL.x0 + 30, COL.y - 4, COL.z + COL.r * 0.8], [COL.x1 - 30, COL.y - 4, COL.z + COL.r * 0.8]])} stroke="#fff" strokeOpacity=".22" strokeWidth="3" strokeLinecap="round" />
        <path d={TUBE.body} fill="none" stroke={PALE} strokeOpacity=".45" strokeWidth="1.5" />
        <path d={TUBE.end} fill={PALE} fillOpacity=".05" stroke={PALE} strokeOpacity=".45" strokeWidth="1.5" />
      </g>
      <text x={lx} y={ly} className="synth-label">
        Column
      </text>
      <text x={sx} y={sy} textAnchor="middle" className="synth-label">
        3′
      </text>
    </>
  );
});

/* Liquid in the column. Where one reagent meets the next the boundary is soft:
   each plug fades out over its front, which reads like the blur it replaces
   but costs a gradient instead of a filter pass every frame. */
const SOFT = 34;
function fadeAlong(id: string, color: string, stops: [number, number][]) {
  const xa = stops[0][0];
  const xb = stops[stops.length - 1][0];
  const [x1, y1] = pt(xa, COL.y, COL.z);
  const [x2, y2] = pt(xb, COL.y, COL.z);
  return (
    <linearGradient key={id} id={id} gradientUnits="userSpaceOnUse" x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)}>
      {stops.map(([x, o], i) => (
        <stop key={i} offset={((x - xa) / (xb - xa || 1)).toFixed(4)} stopColor={color} stopOpacity={o} />
      ))}
    </linearGradient>
  );
}

/* ---------- The instrument, at one moment of a run ---------- */

const Instrument = memo(function Instrument({ p, elapsed, setTip }: { p: Plan; elapsed: number; setTip: SetTip }) {
  const hover = useMemo(() => hoverWith(setTip), [setTip]);
  const n = p.n;
  const { cycle, phase, done } = locate(elapsed, p.ends);
  const g = pumped(elapsed, p);
  const flowing = elapsed > 0 && g < n + FLUSH;
  const running = flowing && !done;
  const step = STEPS[Math.max(0, STEPS.findIndex((s) => phase < s.to))]; // the valve that is open
  const time = Math.max(0, elapsed);
  const glint = flowing ? time * 0.07 : undefined;

  const sources = useMemo(
    () =>
      [
        ...p.vials.map((v, i) => ({ key: `vial:${v}`, x: vialX(i), y: VIAL.y, r: VIAL.r, color: YELLOW })),
        ...REAGENTS.map((r) => ({ key: r.key, x: r.x, y: BOTTLE.y, r: BOTTLE.r, color: r.color })),
      ].map((s) => {
        const path = feedLine(s.x, s.y, s.r);
        return { ...s, d: line(path), stub: line(path.slice(0, 2)), valve: firstCorner(path) };
      }),
    [p]
  );
  const stir = (key: string) => Math.exp(-idleFor(key, g, p) / 0.07);

  // The column, and the chain in it.
  const c = chain(p, g, elapsed);
  const liquid = slugsIn(g, AT.column, HOLD.column, n);
  const wet = clamp01((g - AT.column) / 0.2);
  const tint = (key: StepKey) => (key === "wash" ? 0.07 : 0.32);
  const ripple = (i: number) => NOSE * 0.12 * Math.sin(time / 310 + i * 2.1);

  // Trityl coming off the 5′ end and riding downstream.
  const plumes: { d: string; opacity: number; back: number; front: number }[] = [];
  for (let k = Math.max(0, Math.floor(g - AT.column - HOLD.column - PLUME)); k <= Math.min(n - 1, Math.floor(g - AT.column)); k++) {
    const tip = c.tipX(k);
    const front = colX((g - AT.column - k) / HOLD.column);
    if (front <= tip) continue;
    for (const [age, opacity] of [[PLUME, 0.34], [0.07, 0.45], [0.035, 0.6]]) {
      const back = colX((g - AT.column - k - age) / HOLD.column);
      if (back >= COL.x1) continue;
      const from = Math.max(tip, back);
      plumes.push({ d: plug(from, back > tip ? COL.r - 1 : 5, front, Math.min(from + 110, front)), opacity, back: from, front });
    }
  }
  /* The plume glows rather than keeping an edge. The blur is held to the plume's
     own extent so its cost follows the plume's size, not the column's. */
  let plumeBox: { x: string; y: string; width: string; height: string } | null = null;
  if (plumes.length) {
    const xa = Math.max(COL.x0, Math.min(...plumes.map((s) => s.back)) - NOSE);
    const xb = Math.min(COL.x1, Math.max(...plumes.map((s) => s.front)) + NOSE);
    const corners = [xa, xb].flatMap((x) => [-1, 1].flatMap((dy) => [-1, 1].map((dz) => pt(x, COL.y + dy * COL.r, COL.z + dz * COL.r))));
    const x0 = Math.min(...corners.map((q) => q[0])) - 21;
    const y0 = Math.min(...corners.map((q) => q[1])) - 21;
    const x1 = Math.max(...corners.map((q) => q[0])) + 21;
    const y1 = Math.max(...corners.map((q) => q[1])) + 21;
    plumeBox = { x: x0.toFixed(0), y: y0.toFixed(0), width: (x1 - x0).toFixed(0), height: (y1 - y0).toFixed(0) };
  }

  // DMT groups: one leaving the old 5′ end, one arriving on the new monomer.
  const dmts: { key: number; x: number; y: number; opacity: number; lift: number }[] = [];
  if (!done) {
    for (let site = Math.max(0, c.count - 1); site <= Math.min(n, c.count); site++) {
      const leaving = site < n ? easeOut((g - site - colAt(c.tipX(site))) / 0.07) : 0;
      if (leaving >= 1) continue;
      const [x, y] = site === 0 ? pt(SUPPORT_X - SUPPORT_R, COL.y, COL.z) : c.pos(site - 1);
      const lead = site === 0 ? 0 : c.radius(site - 1);
      dmts.push({
        key: site,
        x: x - (lead + 25) * AX.x,
        y: y - (lead + 25) * AX.y,
        opacity: (site === 0 ? 1 : clamp01(c.arrival(site - 1) * 4)) * (1 - leaving),
        lift: 22 * leaving,
      });
    }
  }

  // Trityl trace: one peak per cycle as its band passes the detector.
  const past = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i < Math.min(cycle, n); i++) {
      for (let q = 0; q < 1; q += 0.0125) {
        pts.push(`${(TRACE.x + ((i + q) / n) * TRACE.w).toFixed(1)},${(TRACE.base - TRACE.h * p.released[i] * plume(q - AT.uv)).toFixed(1)}`);
      }
    }
    return pts;
  }, [p, n, cycle]);
  const tracePts = past.slice();
  let head = { x: TRACE.x + (Math.min(cycle, n) / n) * TRACE.w, y: TRACE.base };
  if (!done && elapsed > 0) {
    for (let q = 0; q <= phase + 1e-6; q += 0.0125) {
      head = { x: TRACE.x + ((cycle + q) / n) * TRACE.w, y: TRACE.base - TRACE.h * p.released[cycle] * plume(q - AT.uv) };
      tracePts.push(`${head.x.toFixed(1)},${head.y.toFixed(1)}`);
    }
  }
  const detecting = g - AT.uv > 0 && g - AT.uv < n ? Math.min(1, plume(frac(g - AT.uv))) : 0;

  // Waste: whatever leaves the drain falls in and the level creeps up.
  const leavingDrain = slugsIn(g, AT.drain + HOLD.drain, 1e-4, n)[0]?.step;
  const wasteLevel = 0.1 + 0.72 * clamp01((g - AT.drain) / n);
  const waste = upright(WASTE.x, WASTE.y, WASTE.r - 2, DECK + 2, (WASTE.h - 4) * wasteLevel, flowing ? 1.4 : 0, time / 150);
  const [spoutX, spoutY] = pt(WASTE.x, WASTE.y - 5, SPOUT_Z);
  const [, surfaceY] = pt(WASTE.x, WASTE.y - 5, DECK + 2 + (WASTE.h - 4) * wasteLevel);

  const [pumpX, pumpY] = pt(PUMP.x, PUMP.y, DECK + PUMP.h);
  const [uvX, uvY] = pt((UV.x0 + UV.x1) / 2, UV.y1, UV.z1 - 34);
  const [supX, supY] = pt(SUPPORT_X, COL.y, COL.z);
  const [edgeX, edgeY] = pt(SUPPORT_X - SUPPORT_R, COL.y, COL.z);

  return (
    <>
      {/* Front panel: step lamps and the run monitor */}
      <g transform={onFront(BODY.d, BODY.h)}>
        {RAIL.map((s, i) => {
          const on = running && step.key === s.key;
          return (
            <g key={s.key} className="synth-fine synth-ease" opacity={on ? 1 : 0.4}>
              <circle cx={38 + i * 96} cy="90" r="10" fill={s.color} fillOpacity={on ? 0.25 : 0} />
              <circle cx={38 + i * 96} cy="90" r="5.5" fill={s.color} />
              <text x={50 + i * 96} y="90" dy=".36em" className="synth-label" style={{ fontSize: 12, fill: PALE, fillOpacity: 1 }}>
                {s.label}
              </text>
            </g>
          );
        })}

        <g {...hover("Trityl monitor", "Each peak is the orange DMT cation washed off at the start of a cycle. Its height reports how well the previous coupling went.")}>
          <rect x={SCREEN.u0} y={SCREEN.v0} width={SCREEN.u1 - SCREEN.u0} height={SCREEN.v1 - SCREEN.v0} fill="transparent" />
          <text x={TRACE.x} y={SCREEN.v0 + 17} className="synth-fine synth-label" style={{ fontSize: 10.5, letterSpacing: "0.08em" }}>
            TRITYL · 498 nm
          </text>
          <text x={TRACE.x + TRACE.w} y={SCREEN.v0 + 17} textAnchor="end" className="synth-fine synth-label" style={{ fontSize: 10.5 }}>
            {done ? `${n}/${n} complete` : `cycle ${cycle + 1}/${n}`}
          </text>
          <path d={`M${TRACE.x} ${TRACE.base}H${TRACE.x + TRACE.w}`} stroke={PALE} strokeOpacity=".22" />
          {p.order.map((_, i) => (
            <path key={i} d={`M${TRACE.x + (i / n) * TRACE.w} ${TRACE.base}v4`} stroke={PALE} strokeOpacity=".22" />
          ))}
          {tracePts.length > 1 && (
            <>
              <polyline points={tracePts.join(" ")} fill="none" stroke={TRITYL} strokeWidth="2" strokeLinejoin="round" />
              {!done && <circle cx={head.x} cy={head.y} r="3.5" fill={TRITYL} />}
            </>
          )}
        </g>
      </g>

      {/* Feed lines: primed as far as each valve, flowing past it when the valve is open */}
      <Tube d={MANIFOLD} slugs={[]} />
      {sources.map((s) => (
        <g key={s.key}>
          <Tube d={s.stub} slugs={[{ a: 0, b: 1, color: s.color, opacity: 0.28 }]} />
          {flowing && <Tube bare d={s.d} slugs={feedSlugs(s.key, s.color, s.valve, g, p)} glint={glint} />}
        </g>
      ))}
      {sources.map((s) => {
        const [vx, vy] = pt(s.x, MANIFOLD_Y, DECK);
        const open = stir(s.key);
        return <ellipse key={s.key} cx={vx} cy={vy} rx="5" ry="3" fill={mix(SKIN.top, s.color, open)} stroke={PALE} strokeOpacity={0.4 + 0.5 * open} />;
      })}

      {/* Amidite vials, one per distinct monomer in this run, then the reagent bottles */}
      <text x={pt(vialX(0), VIAL.y, 0)[0] - 14} y={pt(vialX(0), VIAL.y, DECK + VIAL.h + 40)[1]} className="synth-callout">
        Amidites
      </text>
      {p.vials.map((v, i) => {
        const uses = p.order.filter((ch) => vialOf(ch) === v).length;
        const [lx, ly] = pt(vialX(i), VIAL.y + VIAL.r, DECK + VIAL.h * 0.3);
        return (
          <g
            key={v}
            {...hover(
              v === "Sp" ? "Spacer amidite" : `Amidite ${v}`,
              `Phosphoramidite monomer, protected with DMT at its 5′ end. Coupled ${uses === 1 ? "once" : `${uses} times`} in this run.`
            )}
          >
            <Bottle
              x={vialX(i)}
              y={VIAL.y}
              r={VIAL.r}
              h={VIAL.h}
              color={YELLOW}
              {...bottleState(stir(`vial:${v}`), 0.86 - 0.13 * drawn(`vial:${v}`, g, p), time)}
              seed={i}
            />
            <text x={lx} y={ly} dy=".36em" textAnchor="middle" className="synth-label" style={{ fontSize: v === "Sp" ? 11 : 14, fontWeight: 600, fill: PALE, fillOpacity: 1 }}>
              {v}
            </text>
          </g>
        );
      })}
      {REAGENTS.map((r, i) => {
        const [lx, ly] = pt(r.x, BOTTLE.y, DECK + BOTTLE.h + 34);
        const doses = r.key === "acn" ? 2 * n : n;
        return (
          <g key={r.key} {...hover(r.label === "ACN" ? "Acetonitrile" : r.label, r.about)}>
            <Bottle
              x={r.x}
              y={BOTTLE.y}
              r={BOTTLE.r}
              h={BOTTLE.h}
              color={r.color}
              {...bottleState(stir(r.key), 0.8 - (0.36 * drawn(r.key, g, p)) / doses, time)}
              seed={20 + i}
            />
            <text x={lx} y={ly} textAnchor="middle" className="synth-callout">
              {r.label}
            </text>
          </g>
        );
      })}

      {/* Pump */}
      <g {...hover("Pump", "Meters each reagent from the manifold into the column, one at a time.")}>
        <path d={PUMP_BODY.body} fill={SKIN.side} stroke={SKIN.edge} />
        <path d={PUMP_BODY.top} fill="#3A2A55" stroke={PALE} strokeOpacity=".3" />
        <g transform={`translate(${pumpX} ${pumpY}) scale(1 .52) rotate(${flowing ? (time * 0.2) % 360 : 0})`}>
          <path d="M-15 0H15M0 -15V15" stroke={PALE} strokeOpacity=".7" strokeWidth="2.5" strokeLinecap="round" />
          <circle r="3.5" fill={PALE} fillOpacity=".7" />
        </g>
      </g>
      <Tube d={line(INLET)} slugs={inTube(g, AT.inlet, HOLD.inlet, n)} glint={glint} />

      {/* Column: clamps, then the glass tube with the liquid and the chain inside it */}
      <g
        {...hover(
          "Column",
          "Solid support held between two frits. The chain is anchored at its 3′ end and grows toward 5′, one cycle per monomer."
        )}
      >
        <path d={TUBE.body} fill={DARK} />
        <g clipPath="url(#in-column)">
          <defs>
            {liquid.map((s, i) => {
              const front = colX(s.b) + ripple(i);
              return fadeAlong(`lq${i}`, mix(DARK, s.step.color, tint(s.step.key)), [
                [front - NOSE / 2 - SOFT, 1],
                [front + NOSE / 2, 0],
              ]);
            })}
            {plumeBox && (
              <filter id="plume-blur" filterUnits="userSpaceOnUse" {...plumeBox}>
                <feGaussianBlur stdDeviation="7" />
              </filter>
            )}
          </defs>
          {liquid.map((s, i) => (
            <path
              key={i}
              d={s.b >= 1 ? plug(COL.x0, COL.r - 1, COL.x1 + NOSE) : plug(COL.x0, COL.r - 1, colX(s.b) + ripple(i))}
              fill={s.b >= 1 ? mix(DARK, s.step.color, tint(s.step.key)) : `url(#lq${i})`}
            />
          ))}
          {plumeBox && (
            <g filter="url(#plume-blur)">
              {plumes.map((s, i) => (
                <path key={i} d={s.d} fill={TRITYL} fillOpacity={s.opacity} />
              ))}
            </g>
          )}
          {wet > 0 &&
            MOTES.map((m, i) => {
              const f = frac(m.at + (g / HOLD.column) * (0.1 + 0.26 * (1 - m.rho * m.rho)));
              const [mx, my] = pt(colX(f), COL.y + m.rho * COL.r * Math.cos(m.phi), COL.z + m.rho * COL.r * Math.sin(m.phi));
              return <circle key={i} cx={mx} cy={my} r={m.r} fill={PALE} fillOpacity={0.3 * wet * Math.sin(Math.PI * f)} />;
            })}
        </g>
        <path d={TUBE.at(COL.x0 + 24)} fill={PALE} fillOpacity=".16" />
        <path d={TUBE.at(COL.x1 - 24)} fill={PALE} fillOpacity=".16" />
      </g>

      <g {...hover("Solid support", "The bead the chain is built on. The finished oligo is cleaved off it at the end.")}>
        <circle cx={supX} cy={supY} r={SUPPORT_R} fill={PALE} fillOpacity=".14" stroke={PALE} strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="3 4" />
      </g>
      {!done && (
        <>
          {Array.from({ length: c.count }, (_, k) => {
            const [x, y] = c.pos(k);
            const [ex, ey] = k === 0 ? [edgeX, edgeY] : c.pos(k - 1);
            const fresh = !c.oxidized(k);
            return (
              <line
                key={k}
                x1={x}
                y1={y}
                x2={ex}
                y2={ey}
                opacity={clamp01((c.arrival(k) - 0.85) / 0.15)}
                stroke={fresh ? "#6DCD59" : PALE}
                strokeOpacity={fresh ? 1 : 0.6}
                strokeWidth="3"
                strokeDasharray={fresh ? "2 3" : undefined}
              />
            );
          })}
          {Array.from({ length: c.count }, (_, k) => {
            const ch = p.order[k];
            const [x, y] = c.pos(k);
            return (
              <g
                key={k}
                transform={`translate(${x} ${y})`}
                opacity={clamp01(c.arrival(k) * 5)}
                {...hover(ch === " " ? "Spacer" : `Monomer ${ch}`, `Position ${n - k} of ${n} from the 5′ end, added in cycle ${k + 1}.`)}
              >
                {ch === " " ? <circle r="7" fill={PALE} fillOpacity=".5" /> : <Monomer ch={ch} r={p.r} />}
              </g>
            );
          })}
          {dmts.map((d) => (
            <Dmt key={d.key} x={d.x} y={d.y} opacity={d.opacity} lift={d.lift} hover={hover("DMT group", DMT_ABOUT)} />
          ))}
        </>
      )}

      {/* Glass over the chain */}
      <ColumnGlass />

      {/* Detector and waste */}
      <Tube d={line(OUTLET)} slugs={[...inTube(g, AT.outlet, HOLD.outlet, n), ...tritylIn(g, AT.outlet, HOLD.outlet, n)]} glint={glint} />
      <Tube d={line(DRAIN)} slugs={[...inTube(g, AT.drain, HOLD.drain, n), ...tritylIn(g, AT.drain, HOLD.drain, n)]} glint={glint} />
      <g {...hover("Trityl monitor", "Measures the DMT cation leaving the column. Each peak reports how well the previous coupling went.")}>
        <g stroke={mix("#4A3D62", TRITYL, detecting)} strokeWidth="1.25">
          <path d={UV_BOX.top} fill={SKIN.top} />
          <path d={UV_BOX.front} fill={SKIN.front} />
          <path d={UV_BOX.side} fill={SKIN.side} />
        </g>
        <text x={uvX} y={uvY} textAnchor="middle" className="synth-label" style={{ fontSize: 12, fill: mix("#A9A3B8", TRITYL, detecting), fillOpacity: 1 }}>
          UV
        </text>
      </g>
      <g {...hover("Waste", "Everything that passes through the column ends up here.")}>
        <path d={WASTE_GLASS.body} fill={GLASS} fillOpacity=".12" />
        <path d={waste.body} fill="#B9BE6A" fillOpacity=".5" />
        <path d={waste.top} fill={leavingDrain ? mix("#B9BE6A", leavingDrain.color, 0.6) : "#B9BE6A"} fillOpacity=".8" />
        {flowing && leavingDrain && (
          <path
            d={`M${spoutX} ${spoutY}V${surfaceY}`}
            stroke={leavingDrain.color}
            strokeOpacity={leavingDrain.key === "wash" ? 0.55 : 0.95}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray="5 6"
            strokeDashoffset={-((time * 0.11) % 11)}
          />
        )}
        <path d={WASTE_GLASS.body} fill="none" stroke={GLASS} strokeOpacity=".85" strokeWidth="1.25" />
        <path d={WASTE_GLASS.top} fill="none" stroke={GLASS} strokeOpacity=".6" />
      </g>
    </>
  );
});

/* ---------- The product ----------
   Once the last cycle is through, the strand lets go of the support, floats up
   out of the column, meets its complement and winds into a duplex. */

const DUPLEX = { y: 70, amp: 30, turn: (2 * Math.PI) / 10.5, spin: (2 * Math.PI) / 18 };
const ENDING = { release: 500, rise: 350, riseFor: 1500, meet: 1500, meetFor: 1400, zip: 3300, zipFor: 350, twist: 4300, twistFor: 1900 };
const ENDING_MS = ENDING.twist + ENDING.twistFor;

function Product({ p, elapsed, setTip }: { p: Plan; elapsed: number; setTip: SetTip }) {
  const tau = (elapsed - p.total) / p.pace;
  if (!(tau > 0)) return null;
  const still = !Number.isFinite(tau); // reduced motion: straight to the finished duplex
  const n = p.n;
  const c = chain(p, n, elapsed);

  const pitch = Math.min(72, 924 / Math.max(1, n - 1));
  const R = Math.min(26, pitch * 0.4);
  const x0 = W / 2 - ((n - 1) * pitch) / 2;
  const stagger = Math.min(55, 800 / n);

  const wound = still ? 1 : ease((tau - ENDING.twist) / ENDING.twistFor);
  const since = still ? 0 : Math.max(0, (elapsed - p.total - ENDING.twist * p.pace) / 1000);
  const spin = still ? 0.5 : DUPLEX.spin * (since - 1.5 * (1 - Math.exp(-since / 1.5))); // eases into a steady turn

  type Item = { depth: number; el: React.ReactNode };
  const items: Item[] = [];
  const strand: { x: number; y: number; z: number; risen: number }[] = [];
  const partner: { x: number; y: number; z: number; shown: number }[] = [];

  for (let j = 0; j < n; j++) {
    const k = n - 1 - j; // the chain was built right to left
    const u = still ? 1 : clamp01((tau - ENDING.rise - j * stagger) / ENDING.riseFor);
    const zipped = still ? 1 : easeOut((tau - ENDING.zip - j * stagger) / ENDING.zipFor);
    const amp = DUPLEX.amp + 9 * (1 - zipped);
    const theta = wound * j * DUPLEX.turn + spin;
    const X = x0 + j * pitch;

    const [sx, sy] = c.pos(k);
    const drift = Math.sin(Math.PI * u) * 12 * Math.sin(u * 6 + j * 0.9);
    strand.push({
      x: sx + (X - sx) * ease((u - 0.15) / 0.85) + drift,
      y: sy + (DUPLEX.y - amp * Math.cos(theta) - sy) * ease(u * 1.2),
      z: Math.sin(theta),
      risen: ease(u),
    });

    const v = still ? 1 : clamp01((tau - ENDING.meet - j * stagger * 0.7) / ENDING.meetFor);
    const away = 1 - easeOut(v);
    partner.push({
      x: X + away * 420,
      y: DUPLEX.y + amp * Math.cos(theta) + away * (20 + 26 * Math.sin(j * 0.8 - (still ? 0 : tau) / 170)),
      z: -Math.sin(theta),
      shown: clamp01(v * 3),
    });

    // The base pair, reaching from each strand toward the other.
    if (zipped > 0) {
      const a = strand[j];
      const b = partner[j];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const half = (key: string, from: { x: number; y: number; z: number }, stroke: string) => ({
        depth: from.z - 0.03, // each half tucks in behind its own bead
        el: (
          <path
            key={key}
            d={`M${from.x} ${from.y}L${from.x + (mx - from.x) * zipped} ${from.y + (my - from.y) * zipped}`}
            stroke={stroke}
            strokeWidth="4"
            strokeLinecap="round"
            opacity={0.9 * zipped}
          />
        ),
      });
      items.push(half(`pa${j}`, a, "#B9A616"), half(`pb${j}`, b, TEAL));
    }
  }

  for (let j = 0; j < n; j++) {
    const ch = p.order[n - 1 - j];
    const a = strand[j];
    const b = partner[j];
    const lit = (z: number) => (z + 1) / 2;

    if (j > 0) {
      const a0 = strand[j - 1];
      const b0 = partner[j - 1];
      const risen = (a.risen + a0.risen) / 2;
      const az = (a.z + a0.z) / 2;
      const bz = (b.z + b0.z) / 2;
      items.push({
        depth: Math.min(a.z, a0.z) - 0.05,
        el: (
          <path
            key={`a${j}`}
            d={`M${a0.x} ${a0.y}L${a.x} ${a.y}`}
            stroke={mix(PALE, PLUM, risen)}
            strokeOpacity={0.6 + 0.4 * risen * (0.6 + 0.4 * lit(az))}
            strokeWidth={3 + 2 * risen * (0.75 + 0.25 * lit(az))}
            strokeLinecap="round"
          />
        ),
      });
      items.push({
        depth: Math.min(b.z, b0.z) - 0.05,
        el: (
          <path
            key={`b${j}`}
            d={`M${b0.x} ${b0.y}L${b.x} ${b.y}`}
            stroke={mix("#0F4F50", TEAL, lit(bz))}
            strokeOpacity={Math.min(b.shown, b0.shown)}
            strokeWidth={3.5 + 1.2 * lit(bz)}
            strokeLinecap="round"
          />
        ),
      });
    }

    const from = (ch === " " ? 7 : p.r) / R;
    const size = (from + ((ch === " " ? 0.36 : 1) - from) * a.risen) * (1 + 0.09 * a.z * wound);
    items.push({
      depth: 2 + a.z, // letters stay readable: nothing is drawn across them
      el: (
        <g key={`m${j}`} transform={`translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) scale(${size.toFixed(3)})`}>
          {ch === " " ? (
            <circle r={R} fill={mix(PALE, GLASS, a.risen)} fillOpacity={0.5 + 0.5 * a.risen} stroke={PLUM} strokeOpacity={a.risen} strokeWidth="3" />
          ) : (
            <>
              <Monomer ch={ch} r={R} edge={a.risen} />
              <circle r={R} fill={PLUM} fillOpacity={0.16 * wound * (1 - lit(a.z))} />
            </>
          )}
        </g>
      ),
    });
    items.push({
      depth: b.z,
      el: (
        <circle
          key={`c${j}`}
          cx={b.x}
          cy={b.y}
          r={R * (ch === " " ? 0.3 : 0.6) * (1 + 0.09 * b.z * wound)}
          fill={mix("#1B7F78", "#3CC9B3", lit(b.z))}
          stroke={PLUM}
          strokeWidth="1.5"
          opacity={b.shown}
        />
      ),
    });
  }
  items.sort((a, b) => a.depth - b.depth);

  // Letting go: the last DMT comes off and the link to the support dissolves.
  const letGo = still ? 1 : easeOut(tau / ENDING.release);
  const [ax, ay] = c.pos(0);
  const [edgeX, edgeY] = pt(SUPPORT_X - SUPPORT_R, COL.y, COL.z);
  const [tx, ty] = c.pos(n - 1);
  const lead = c.radius(n - 1) + 25;
  const formed = still ? 1 : clamp01((tau - ENDING_MS + 600) / 600);

  return (
    <g>
      {letGo < 1 && (
        <>
          <line x1={ax} y1={ay} x2={edgeX} y2={edgeY} stroke={PALE} strokeOpacity={0.6 * (1 - letGo)} strokeWidth="3" />
          <Dmt x={tx - lead * AX.x} y={ty - lead * AX.y} opacity={1 - letGo} lift={22 * letGo} />
        </>
      )}
      <g
        fill="none"
        pointerEvents={formed > 0 ? "auto" : "none"}
        onPointerEnter={() => setTip({ title: "Duplex", detail: "The finished strand, cleaved from its support and annealed to its complement. The two run antiparallel and wind into a helix about every ten and a half base pairs." })}
        onPointerLeave={() => setTip(null)}
      >
        {items.map((item) => item.el)}
      </g>
      {formed > 0 && (
        <g className="synth-callout" opacity={formed}>
          <text x={x0 - R - 16} y={DUPLEX.y} dy=".36em" textAnchor="end">
            5′
          </text>
          <text x={x0 + (n - 1) * pitch + R + 16} y={DUPLEX.y} dy=".36em">
            3′
          </text>
        </g>
      )}
    </g>
  );
}

/* ---------- The page's opening ---------- */

type Run = { text: string; fast: boolean; pre: number; id: number };
const OPENING = { text: NAME, fast: false, pre: PREBUILT };

export default function Hero() {
  const [run, setRun] = useState<Run>({ ...OPENING, id: 0 });

  const queue = (text: string) => ({
    onPointerEnter: () => setRun((v) => ({ text, fast: true, pre: 0, id: v.id + 1 })),
    onPointerLeave: () => setRun((v) => ({ text: NAME, fast: true, pre: 0, id: v.id + 1 })),
    onFocus: () => setRun((v) => ({ text, fast: true, pre: 0, id: v.id + 1 })),
    onBlur: () => setRun((v) => ({ text: NAME, fast: true, pre: 0, id: v.id + 1 })),
  });

  return (
    <>
      <header className="site-header">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-baseline justify-between gap-x-8 gap-y-1 px-5 py-4 md:px-10">
          <h1 className="font-display text-lg font-semibold tracking-tight">
            <a href="#top">Austin Crinklaw</a>
          </h1>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-1 font-display text-[0.95rem]">
            <nav aria-label="Sections" className="flex gap-x-5">
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className="nav-link" {...queue(item.run)}>
                  {item.label}
                </a>
              ))}
            </nav>
            <nav aria-label="Contact" className="flex items-center gap-x-4">
              {CONTACT.map(({ label, href, run, Icon }) => (
                <a
                  key={href}
                  href={href}
                  aria-label={label}
                  title={label}
                  className="nav-link inline-flex"
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...queue(run)}
                >
                  <Icon aria-hidden className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <section id="top" className="mx-auto flex max-w-[1240px] flex-col justify-center px-5 pb-10 pt-4 md:min-h-[calc(100svh-var(--header-h))] md:px-10">
        <Stage run={run} onRunAgain={() => setRun((v) => ({ ...OPENING, id: v.id + 1 }))} />
      </section>
    </>
  );
}

/* The drawing and its caption. It owns the clock, so a frame redraws only this. */
function Stage({ run, onRunAgain }: { run: Run; onRunAgain: () => void }) {
  const p = useMemo(() => plan(run.text, run.fast, run.pre), [run]);
  const [elapsed, setElapsed] = useState(p.start);
  const [tip, setTip] = useState<Tip>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In development, ?frame=<ms> holds the drawing at one moment of the run.
    const frozen = process.env.NODE_ENV !== "production" && new URLSearchParams(location.search).get("frame");
    if (frozen && run.id === 0) {
      setElapsed(Number(frozen));
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setElapsed(Infinity);
      return;
    }
    // The duplex keeps turning after the run, so only draw while it can be seen.
    // Time off screen (or in a background tab) is not counted: it picks up where it left off.
    let visible = true;
    const watch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (stage.current) watch.observe(stage.current);
    let clock = p.start;
    let last: number | null = null;
    let frame = 0;
    const tick = (now: number) => {
      if (visible && last !== null) {
        clock += Math.min(50, now - last);
        setElapsed(clock);
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    setElapsed(clock);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      watch.disconnect();
    };
  }, [run, p]);

  const { cycle, phase, done } = locate(elapsed, p.ends);
  const step = STEPS[Math.max(0, STEPS.findIndex((s) => phase < s.to))];
  const incoming = done ? "" : p.order[cycle];
  const count = chain(p, pumped(elapsed, p), elapsed).count;
  const ending = (elapsed - p.total) / p.pace;
  const finished = ending >= ENDING_MS;

  const status = !done
    ? `Cycle ${cycle + 1} of ${p.n}: ${step.key === "couple" ? `coupling ${incoming === " " ? "a spacer" : incoming}` : step.label.toLowerCase()}`
    : ending < ENDING.meet
      ? "Cleaving the finished strand from its support"
      : !finished
        ? "Annealing to the complementary strand"
        : null;

  return (
    <div className="synth-wrap mx-auto w-full">
      <div className="synth" ref={stage}>
        {/* Two layers: the housing is painted once underneath, the moving parts on top. */}
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className="synth-layer absolute inset-0 h-full w-full font-display">
          <StaticHousing />
        </svg>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="An oligonucleotide synthesizer building a chain one monomer at a time. The finished strand leaves the column and pairs with its complement as a double helix that spells Austin Crinklaw."
          className="synth-layer relative block w-full font-display"
        >
          <defs>
            <clipPath id="in-column">
              <path d={TUBE.body} />
            </clipPath>
            <linearGradient id="glass-sheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={PALE} stopOpacity=".28" />
              <stop offset=".35" stopColor={PALE} stopOpacity="0" />
              <stop offset="1" stopColor={PALE} stopOpacity=".06" />
            </linearGradient>
          </defs>

          <Instrument p={p} elapsed={Math.min(elapsed, p.total + 1600)} setTip={setTip} />
          <Product p={p} elapsed={elapsed} setTip={setTip} />
        </svg>
      </div>

      <div className="mt-3 grid items-start gap-x-8 gap-y-2 font-display text-sm leading-5 text-dim sm:grid-cols-[minmax(0,1fr)_auto]">
        <p aria-live="off" className="line-clamp-2 h-10 max-w-[62ch] tabular-nums">
          {tip ? (
            <>
              <span className="font-semibold text-ink">{tip.title}</span>
              <span className="ml-3">{tip.detail}</span>
            </>
          ) : (
            (status ?? "Point at any part to see what it does, or at the menu to start a new run.")
          )}
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 whitespace-nowrap tabular-nums">
          <span>
            {p.n}-mer{finished ? " duplex" : ""}, {done ? `${Math.round(p.fullLength * 100)}% full length` : `${count} of ${p.n} coupled`}
          </span>
          <button type="button" className="nav-link font-medium text-ink" onClick={onRunAgain}>
            Run again
          </button>
        </p>
      </div>
    </div>
  );
}
