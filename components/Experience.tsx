"use client";

import { useState } from "react";

const AXIS_START = 2018;
const AXIS_END = 2027;

type Role = { title: string; from: number; to: number | null; dates: string; color: string };
export type Job = { company: string; dates: string; roles: Role[]; bullets: string[] };

const pct = (year: number) => ((year - AXIS_START) / (AXIS_END - AXIS_START)) * 100;

/* One shared track for every job. Clicking a job's span on it swaps in that job's details;
   the most recent job (first in the list) is shown until then. */
export default function Experience({ jobs }: { jobs: Job[] }) {
  const [selected, setSelected] = useState(0);
  const today = new Date();
  const now = today.getFullYear() + today.getMonth() / 12;
  const job = jobs[selected];

  return (
    <div>
      <div className="relative mb-3 h-5 font-display text-xs tabular-nums text-dim" aria-hidden="true">
        {Array.from({ length: AXIS_END - AXIS_START }, (_, i) => AXIS_START + i).map((y) => (
          <span key={y} className="absolute" style={{ left: `${pct(y)}%` }}>
            {y}
          </span>
        ))}
      </div>

      <div className="track track-tall" role="tablist" aria-label="Jobs by date">
        {jobs.map((j, i) => {
          const from = Math.min(...j.roles.map((r) => r.from));
          const to = Math.max(...j.roles.map((r) => r.to ?? now));
          const on = i === selected;
          return (
            <button
              key={j.company}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="job-panel"
              aria-label={`${j.company}, ${j.dates}`}
              title={j.company}
              onClick={() => setSelected(i)}
              className={`track-job ${on ? "is-on" : ""}`}
              style={{ left: `${pct(from)}%`, width: `calc(${pct(to) - pct(from)}% - 2px)` }}
            >
              {j.roles.map((r) => (
                <span
                  key={r.title}
                  className="track-seg"
                  style={{
                    left: `${((r.from - from) / (to - from)) * 100}%`,
                    width: `calc(${(((r.to ?? now) - r.from) / (to - from)) * 100}% - ${j.roles.length > 1 ? 2 : 0}px)`,
                    background: r.color,
                  }}
                />
              ))}
            </button>
          );
        })}
      </div>
      <p className="mt-2 font-display text-sm text-dim">Click a span on the timeline to see that role.</p>

      <article id="job-panel" role="tabpanel" className="mt-8" aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6">
          <h3 className="font-display text-2xl font-semibold tracking-tight">{job.company}</h3>
          <p className="font-display text-sm tabular-nums text-dim">{job.dates}</p>
        </div>
        <ul className="mt-2 font-display">
          {job.roles.map((r) => (
            <li key={r.title} className="flex flex-wrap items-baseline gap-x-3">
              <span className="inline-block h-2.5 w-2.5 translate-y-[-1px] rounded-full" style={{ background: r.color }} aria-hidden="true" />
              <span className="font-medium">{r.title}</span>
              {r.dates && <span className="text-sm tabular-nums text-dim">{r.dates}</span>}
            </li>
          ))}
        </ul>
        <ul className="prose-body mt-5 max-w-[68ch] space-y-2.5">
          {job.bullets.map((b) => (
            <li key={b} className="well-bullet">{b}</li>
          ))}
        </ul>
      </article>
    </div>
  );
}
