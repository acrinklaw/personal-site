"use client";

import { useEffect, useMemo, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";

/* A flow-through oligonucleotide synthesizer, drawn as its process picture.
   Reagents are pumped through one column; each cycle (detritylate, couple,
   oxidize, cap) adds one monomer to the 5′ end of the chain on the support,
   so whatever `text` says gets built from its last letter to its first. */

const NAME = "AUSTIN CRINKLAW";

const NAV = [
  { label: "Experience", href: "#experience", run: "2018 TO NOW" },
  { label: "Projects", href: "#projects", run: "OPEN SOURCE" },
  { label: "Skills", href: "#skills", run: "TOOL KIT" },
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

type StepKey = "deblock" | "wash" | "couple" | "oxidize" | "cap";

/* One cycle, as fractions of its duration. */
const STEPS: { key: StepKey; label: string; from: number; to: number; color: string }[] = [
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

const REAGENTS = [
  {
    key: "acn",
    label: "ACN",
    x: 700,
    color: PALE,
    about: "Acetonitrile. Washes the column between steps.",
  },
  {
    key: "deblock",
    label: "Deblock",
    x: 790,
    color: TRITYL,
    about: "Dichloroacetic acid in toluene. Strips the DMT group off the 5′ end so the next monomer can attach.",
  },
  {
    key: "activator",
    label: "Activator",
    x: 880,
    color: YELLOW,
    about: "Mixed with the amidite on the way to the column, making it reactive enough to couple.",
  },
  {
    key: "oxidize",
    label: "Oxidizer",
    x: 970,
    color: "#6DCD59",
    about: "Iodine, water and pyridine. Turns the fresh phosphite linkage into a stable phosphate.",
  },
  {
    key: "cap",
    label: "Cap",
    x: 1060,
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

/* Everything about a run that does not change while it plays. */
function plan(text: string, fast: boolean) {
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
  for (let i = 0; i < n; i++) {
    t += fast ? 240 : Math.max(750, 2000 * 0.85 ** i); // the first cycles are slow enough to follow
    ends.push(t);
  }
  const vials = Array.from(new Set(order.slice().reverse())).map((ch) => (ch === " " ? "Sp" : ch));
  return { order, n, released, fullLength: surviving, ends, total: t, vials };
}

function locate(elapsed: number, ends: number[]) {
  const n = ends.length;
  if (elapsed >= ends[n - 1]) return { cycle: n, phase: 0, done: true };
  const e = Math.max(0, elapsed);
  let c = 0;
  while (ends[c] <= e) c++;
  const start = c ? ends[c - 1] : 0;
  return { cycle: c, phase: (e - start) / (ends[c] - start), done: false };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (x: number) => 1 - (1 - clamp01(x)) ** 3;
const peak = (p: number) => Math.exp(-(((p - 0.17) / 0.05) ** 2));

/* ---------- Geometry (SVG units, 1200 by 600) ---------- */

const W = 1200;
const H = 600;
const SOURCE_BOTTOM = 132;
const MANIFOLD_Y = 178;
const INLET_X = 48;
const COL = { x: 90, y: 244, w: 920, h: 112 };
const MID_Y = COL.y + COL.h / 2;
const SUPPORT_X = 940;
const SUPPORT_R = 30;
const FIRST_X = 882;
const LAST_X = 190;
const TRACE = { x: 104, w: 892, base: 560, h: 96 };
const vialX = (i: number) => 112 + i * 44;

type Tip = { title: string; detail: string } | null;

export default function Hero() {
  const [run, setRun] = useState({ text: NAME, fast: false, id: 0 });
  const [elapsed, setElapsed] = useState(0);
  const [tip, setTip] = useState<Tip>(null);

  const p = useMemo(() => plan(run.text, run.fast), [run]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setElapsed(Infinity);
      return;
    }
    const start = performance.now() + (run.fast ? 0 : 500);
    let frame = 0;
    const tick = (now: number) => {
      const e = now - start;
      setElapsed(e);
      if (e < p.total) frame = requestAnimationFrame(tick);
    };
    setElapsed(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, p]);

  const { cycle, phase, done } = locate(elapsed, p.ends);
  const idle = done || elapsed <= 0;
  const stepIndex = STEPS.findIndex((s) => phase < s.to);
  const step = STEPS[Math.max(0, stepIndex)];
  const coupling = !done && phase >= COUPLE.from;
  const count = done ? p.n : cycle + (coupling ? 1 : 0); // monomers on the support
  const arriving = easeOut((phase - COUPLE.from) / (COUPLE.to - COUPLE.from - 0.06));
  const incoming = done ? "" : p.order[cycle];
  const incomingVial = incoming === " " ? "Sp" : incoming;

  const pitch = Math.min(54, (FIRST_X - LAST_X) / Math.max(1, p.n - 1));
  const r = Math.min(22, pitch * 0.43);
  const slide = (k: number) => (!done && coupling && k === cycle ? -(1 - arriving) * 70 : 0);
  const beadX = (k: number) => FIRST_X - k * pitch + slide(k);
  const beadR = (k: number) => (p.order[k] === " " ? 7 : r);

  // The 5′ end, and the DMT group protecting it.
  const leadX = count > 0 ? beadX(count - 1) - beadR(count - 1) : SUPPORT_X - SUPPORT_R;
  const leaving = easeOut(phase / 0.2);
  const dmt = done
    ? { opacity: 1, dy: 0 }
    : phase < COUPLE.from
      ? { opacity: 1 - leaving, dy: -22 * leaving }
      : { opacity: arriving, dy: 0 };

  // Which lines are carrying liquid.
  const sources: { x: number; color: string }[] = [];
  if (!idle) {
    if (step.key === "couple") {
      sources.push({ x: vialX(p.vials.indexOf(incomingVial)), color: step.color });
      sources.push({ x: REAGENTS[2].x, color: step.color });
    } else {
      const reagent = REAGENTS.find((g) => g.key === (step.key === "wash" ? "acn" : step.key))!;
      sources.push({ x: reagent.x, color: step.color });
    }
  }
  const active = (key: string) =>
    !idle &&
    (step.key === "couple"
      ? key === "activator" || key === `vial:${incomingVial}`
      : key === (step.key === "wash" ? "acn" : step.key));
  const trityl = !idle && phase > 0.07 && phase < 0.3;
  const dash = { strokeDasharray: "5 9", strokeDashoffset: -((Math.max(0, elapsed) * 0.05) % 14) };

  // Liquid in the column: the new reagent pushes the old one out, inlet to outlet.
  const prev = STEPS[(stepIndex + STEPS.length - 1) % STEPS.length];
  const front = clamp01((phase - step.from) / 0.07);
  const tint = (key: StepKey) => (key === "wash" ? 0.04 : 0.17);

  // Trityl trace: one peak per cycle, each a little smaller than the last.
  const tracePts: string[] = [];
  let head = { x: TRACE.x, y: TRACE.base };
  for (let i = 0; i < p.n && i <= cycle; i++) {
    const until = i < cycle ? 1 : phase;
    for (let q = 0; q <= until + 1e-6; q += 0.025) {
      head = {
        x: TRACE.x + ((i + q) / p.n) * TRACE.w,
        y: TRACE.base - TRACE.h * p.released[i] * peak(q),
      };
      tracePts.push(`${head.x.toFixed(1)},${head.y.toFixed(1)}`);
    }
  }

  const status = done
    ? null
    : `Cycle ${cycle + 1} of ${p.n}: ${
        step.key === "couple" ? `coupling ${incoming === " " ? "a spacer" : incoming}` : step.label.toLowerCase()
      }`;

  const hover = (title: string, detail: string) => ({
    onPointerEnter: () => setTip({ title, detail }),
    onPointerLeave: () => setTip(null),
  });

  const queue = (text: string) => ({
    onPointerEnter: () => setRun((v) => ({ text, fast: true, id: v.id + 1 })),
    onPointerLeave: () => setRun((v) => ({ text: NAME, fast: true, id: v.id + 1 })),
    onFocus: () => setRun((v) => ({ text, fast: true, id: v.id + 1 })),
    onBlur: () => setRun((v) => ({ text: NAME, fast: true, id: v.id + 1 })),
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

      <section id="top" className="snap-section mx-auto flex max-w-[1240px] flex-col justify-center px-5 pb-10 pt-4 md:min-h-[calc(100svh-var(--header-h))] md:px-10">
        <div className="synth-wrap mx-auto w-full">
          <div className="synth">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label="An oligonucleotide synthesizer building a chain one monomer at a time. The finished chain spells Austin Crinklaw."
              className="block w-full font-display"
            >
              <defs>
                <clipPath id="column-clip">
                  <rect x={COL.x} y={COL.y} width={COL.w} height={COL.h} rx="30" />
                </clipPath>
              </defs>

              {/* Plumbing at rest */}
              <g fill="none" stroke={PALE} strokeOpacity=".2" strokeWidth="2">
                {p.vials.map((v, i) => (
                  <path key={v} d={`M${vialX(i)} ${SOURCE_BOTTOM}V${MANIFOLD_Y}`} />
                ))}
                {REAGENTS.map((g) => (
                  <path key={g.key} d={`M${g.x} ${SOURCE_BOTTOM}V${MANIFOLD_Y}`} />
                ))}
                <path d={`M${REAGENTS[4].x} ${MANIFOLD_Y}H${INLET_X}V${MID_Y}H${COL.x}`} />
                <path d={`M${COL.x + COL.w} ${MID_Y}H1046M1104 ${MID_Y}H1152V352`} />
                <path d={`M1075 322V${TRACE.base}H${COL.x + COL.w}`} strokeDasharray="2 5" />
              </g>

              {/* Plumbing in use */}
              {sources.map((s) => (
                <path
                  key={s.x}
                  d={`M${s.x} ${SOURCE_BOTTOM}V${MANIFOLD_Y}H${INLET_X}V${MID_Y}H${COL.x}`}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  {...dash}
                />
              ))}
              {!idle && (
                <path
                  d={`M${COL.x + COL.w} ${MID_Y}H1046M1104 ${MID_Y}H1152V352`}
                  fill="none"
                  className="synth-ease"
                  stroke={trityl ? TRITYL : step.color}
                  strokeOpacity={trityl ? 1 : 0.55}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  {...dash}
                />
              )}

              {/* Amidite vials: one per distinct monomer in this run */}
              <text x={vialX(0) - 15} y="36" className="synth-label">
                Amidites
              </text>
              {p.vials.map((v, i) => {
                const on = active(`vial:${v}`);
                const uses = p.order.filter((ch) => (ch === " " ? "Sp" : ch) === v).length;
                return (
                  <g
                    key={v}
                    className="synth-ease"
                    {...hover(
                      v === "Sp" ? "Spacer amidite" : `Amidite ${v}`,
                      `Phosphoramidite monomer, protected with DMT at its 5′ end. Coupled ${uses === 1 ? "once" : `${uses} times`} in this run.`
                    )}
                  >
                    <circle cx={vialX(i)} cy={MANIFOLD_Y} r="4" fill={on ? YELLOW : PLUM} stroke={PALE} strokeOpacity={on ? 1 : 0.35} />
                    <rect x={vialX(i) - 6} y="54" width="12" height="9" rx="2" fill={PALE} fillOpacity=".3" />
                    <rect
                      x={vialX(i) - 15}
                      y="62"
                      width="30"
                      height="70"
                      rx="5"
                      fill={on ? YELLOW : PALE}
                      fillOpacity={on ? 0.75 : 0.08}
                      stroke={on ? YELLOW : PALE}
                      strokeOpacity={on ? 1 : 0.4}
                      strokeWidth="1.5"
                    />
                    <text
                      x={vialX(i)}
                      y="103"
                      textAnchor="middle"
                      className="synth-label"
                      style={{ fontSize: v === "Sp" ? 13 : 16, fontWeight: 600, fill: on ? PLUM : PALE, fillOpacity: on ? 1 : 0.8 }}
                    >
                      {v}
                    </text>
                  </g>
                );
              })}

              {/* Reagent bottles */}
              {REAGENTS.map((g) => {
                const on = active(g.key);
                return (
                  <g key={g.key} className="synth-ease" {...hover(g.label === "ACN" ? "Acetonitrile" : g.label, g.about)}>
                    <circle cx={g.x} cy={MANIFOLD_Y} r="4" fill={on ? g.color : PLUM} stroke={PALE} strokeOpacity={on ? 1 : 0.35} />
                    <text x={g.x} y="36" textAnchor="middle" className="synth-label" style={on ? { fill: PALE, fillOpacity: 1 } : undefined}>
                      {g.label}
                    </text>
                    <rect x={g.x - 10} y="45" width="20" height="9" rx="2" fill={PALE} fillOpacity=".3" />
                    <rect x={g.x - 28} y="53" width="56" height="79" rx="8" fill={PLUM} stroke={on ? g.color : PALE} strokeOpacity={on ? 1 : 0.4} strokeWidth="1.5" />
                    <rect x={g.x - 24} y="82" width="48" height="46" rx="5" fill={g.color} fillOpacity={on ? 0.7 : 0.22} />
                  </g>
                );
              })}

              {/* Pump */}
              <g {...hover("Pump", "Meters each reagent from the manifold into the column, one at a time.")}>
                <circle cx={INLET_X} cy="240" r="14" fill={PLUM} stroke={PALE} strokeOpacity=".5" strokeWidth="1.5" />
                <path
                  d={`M${INLET_X - 7} 240H${INLET_X + 7}M${INLET_X} 233V247`}
                  stroke={PALE}
                  strokeOpacity=".7"
                  strokeWidth="1.5"
                  transform={`rotate(${idle ? 0 : (elapsed * 0.3) % 360} ${INLET_X} 240)`}
                />
              </g>

              {/* Column */}
              <g
                {...hover(
                  "Column",
                  "Solid support held between two frits. The chain is anchored at its 3′ end and grows toward 5′, one cycle per monomer."
                )}
              >
                <text x={COL.x + 14} y={COL.y - 10} className="synth-label">
                  Column
                </text>
                <g clipPath="url(#column-clip)">
                  <rect x={COL.x} y={COL.y} width={COL.w} height={COL.h} fill={PALE} fillOpacity=".05" />
                  {!idle && (
                    <>
                      <rect x={COL.x} y={COL.y} width={COL.w} height={COL.h} fill={prev.color} fillOpacity={tint(prev.key)} />
                      <rect x={COL.x} y={COL.y} width={COL.w * front} height={COL.h} fill={PLUM} />
                      <rect x={COL.x} y={COL.y} width={COL.w * front} height={COL.h} fill={PALE} fillOpacity=".05" />
                      <rect x={COL.x} y={COL.y} width={COL.w * front} height={COL.h} fill={step.color} fillOpacity={tint(step.key)} />
                    </>
                  )}
                  <rect x={COL.x + 22} y={COL.y} width="6" height={COL.h} fill={PALE} fillOpacity=".22" />
                  <rect x={COL.x + COL.w - 28} y={COL.y} width="6" height={COL.h} fill={PALE} fillOpacity=".22" />
                </g>
                <rect x={COL.x} y={COL.y} width={COL.w} height={COL.h} rx="30" fill="none" stroke={PALE} strokeOpacity=".45" strokeWidth="1.5" />
              </g>

              {/* Support and the growing chain */}
              <g {...hover("Solid support", "The bead the chain is built on. The finished oligo is cleaved off it at the end.")}>
                <circle cx={SUPPORT_X} cy={MID_Y} r={SUPPORT_R} fill={PALE} fillOpacity=".14" stroke={PALE} strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="3 4" />
                <text x={SUPPORT_X} y={MID_Y + 47} textAnchor="middle" className="synth-label">
                  3′
                </text>
              </g>
              {p.order.slice(0, count).map((ch, k) => {
                const x = beadX(k);
                const rightEdge = k === 0 ? SUPPORT_X - SUPPORT_R : beadX(k - 1) - beadR(k - 1);
                const fresh = !done && k === cycle;
                const unoxidized = fresh && phase < OXIDIZE.from;
                return (
                  <g
                    key={k}
                    opacity={fresh ? arriving : 1}
                    {...hover(
                      ch === " " ? "Spacer" : `Monomer ${ch}`,
                      `Position ${p.n - k} of ${p.n} from the 5′ end, added in cycle ${k + 1}.`
                    )}
                  >
                    <line
                      x1={x + beadR(k)}
                      x2={rightEdge}
                      y1={MID_Y}
                      y2={MID_Y}
                      stroke={unoxidized ? "#6DCD59" : PALE}
                      strokeOpacity={unoxidized ? 1 : 0.6}
                      strokeWidth="3"
                      strokeDasharray={unoxidized ? "2 3" : undefined}
                    />
                    {ch === " " ? (
                      <circle cx={x} cy={MID_Y} r="7" fill={PALE} fillOpacity=".5" />
                    ) : (
                      <>
                        <circle cx={x} cy={MID_Y} r={r} fill={YELLOW} />
                        <text x={x} y={MID_Y} dy=".36em" textAnchor="middle" style={{ fontSize: r * 1.3, fontWeight: 600, fill: PLUM }}>
                          {ch}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
              <g
                opacity={dmt.opacity}
                transform={`translate(0 ${dmt.dy})`}
                {...hover(
                  "DMT group",
                  "Dimethoxytrityl protects the 5′ end until the next cycle. Acid removes it as a bright orange cation, which is what the monitor measures."
                )}
              >
                <line x1={leadX - 6} x2={leadX} y1={MID_Y} y2={MID_Y} stroke={TRITYL} strokeWidth="3" />
                <rect x={leadX - 44} y={MID_Y - 12} width="38" height="24" rx="6" fill={TRITYL} />
                <text x={leadX - 25} y={MID_Y} dy=".36em" textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, fill: PLUM }} className="synth-fine">
                  DMT
                </text>
                <text x={leadX - 25} y={MID_Y + 47} textAnchor="middle" className="synth-label">
                  5′
                </text>
              </g>

              {/* Detector and waste */}
              <g className="synth-ease" {...hover("Trityl monitor", "Measures the DMT cation leaving the column. Each peak reports how well the previous coupling went.")}>
                <rect x="1046" y="278" width="58" height="44" rx="6" fill={PLUM} stroke={trityl ? TRITYL : PALE} strokeOpacity={trityl ? 1 : 0.5} strokeWidth="1.5" />
                <text x="1075" y={MID_Y} dy=".36em" textAnchor="middle" className="synth-label" style={trityl ? { fill: TRITYL, fillOpacity: 1 } : undefined}>
                  UV
                </text>
              </g>
              <g {...hover("Waste", "Everything that passes through the column ends up here.")}>
                <rect x="1130" y="352" width="44" height="52" rx="7" fill={PALE} fillOpacity=".08" stroke={PALE} strokeOpacity=".4" strokeWidth="1.5" />
                <text x="1152" y="424" textAnchor="middle" className="synth-label">
                  Waste
                </text>
              </g>

              {/* The four steps of a cycle */}
              {RAIL.map((s, i) => {
                const on = !idle && step.key === s.key;
                return (
                  <g key={s.key} opacity={on ? 1 : 0.45} className="synth-fine synth-ease">
                    <circle cx={COL.x + 20 + i * 132} cy="392" r="5" fill={s.color} />
                    <text x={COL.x + 32 + i * 132} y="392" dy=".36em" className="synth-label" style={{ fill: PALE, fillOpacity: 1, fontWeight: on ? 600 : 400 }}>
                      {s.label}
                    </text>
                  </g>
                );
              })}

              {/* Trityl trace */}
              <text x={TRACE.x + TRACE.w} y="392" dy=".36em" textAnchor="end" className="synth-label">
                Trityl signal by cycle
              </text>
              <path d={`M${COL.x} ${TRACE.base}H${COL.x + COL.w}`} stroke={PALE} strokeOpacity=".3" />
              {p.order.map((_, i) => (
                <g key={i}>
                  <path d={`M${TRACE.x + (i / p.n) * TRACE.w} ${TRACE.base}v5`} stroke={PALE} strokeOpacity=".3" />
                  <text x={TRACE.x + ((i + 0.17) / p.n) * TRACE.w} y={TRACE.base + 22} textAnchor="middle" className="synth-label" style={{ fontSize: 12 }}>
                    {i + 1}
                  </text>
                </g>
              ))}
              {tracePts.length > 1 && (
                <>
                  <polyline points={tracePts.join(" ")} fill="none" stroke={TRITYL} strokeWidth="2.25" strokeLinejoin="round" />
                  {!done && <circle cx={head.x} cy={head.y} r="4" fill={TRITYL} />}
                </>
              )}
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
                {p.n}-mer, DMT on, {done ? `${Math.round(p.fullLength * 100)}% full length` : `${count} of ${p.n} coupled`}
              </span>
              <button
                type="button"
                className="nav-link font-medium text-ink"
                onClick={() => setRun((v) => ({ text: NAME, fast: false, id: v.id + 1 }))}
              >
                Run again
              </button>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
