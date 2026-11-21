import Experience, { type Job } from "@/components/Experience";
import Hero from "@/components/Hero";

const EMAIL = "austincrinklaw@gmail.com";

/* Years as decimals: 2023.17 is March 2023. `to: null` means still running. */
const JOBS: Job[] = [
  {
    company: "Empirico Inc",
    dates: "March 2023 to present",
    roles: [
      { title: "Lead R&D Systems Engineer", from: 2026, to: null, dates: "Jan 2026 to present", color: "#35B779" },
      { title: "Senior Bioinformatics Scientist", from: 2024, to: 2026, dates: "Jan 2024 to Dec 2025", color: "#1F9E89" },
      { title: "Bioinformatics Scientist", from: 2023.17, to: 2024, dates: "Mar 2023 to Jan 2024", color: "#26828E" },
    ],
    bullets: [
      "Architected the company's primary LIMS system (NextJS/React, FastAPI, PostgreSQL) serving 30 scientists, tracking mission-critical data across siRNA selection, synthesis chemistry, reagent inventory, and in-vivo studies",
      "Led a team of 2 engineers, driving mentorship and cross-functional collaboration with wet lab researchers",
      "Developed an agentic target discovery platform leveraging AI/LLMs to accelerate therapeutic research",
      "Designed integrated data pipeline feeding experimental results into models to predict siRNA efficacy",
      "Established CI/CD pipelines, containerized deployments, and testing standards for team infrastructure",
    ],
  },
  {
    company: "Jumpcode Genomics",
    dates: "March 2022 to March 2023",
    roles: [{ title: "Research Associate III", from: 2022.17, to: 2023.17, dates: "", color: "#31688E" }],
    bullets: [
      "Implemented pipelines (Python/Snakemake) to design CRISPR/Cas9 gRNA sequences; adopted across all R&D products",
      "Overhauled AWS infrastructure to reduce compute costs by 50%; managed general administration and provisioning",
    ],
  },
  {
    company: "1859 Inc",
    dates: "September 2021 to March 2022",
    roles: [{ title: "Senior Associate Scientist", from: 2021.67, to: 2022.17, dates: "", color: "#3E4989" }],
    bullets: [
      "Developed automated NGS pipeline (Python/Nextflow) for DNA encoded libraries",
      "Created web apps (React, Flask, Celery) enabling scientists to trigger analyses and visualize results",
    ],
  },
  {
    company: "La Jolla Institute for Immunology, Peters Lab",
    dates: "February 2018 to September 2021",
    roles: [{ title: "Research Tech", from: 2018.08, to: 2021.67, dates: "", color: "#482878" }],
    bullets: [
      "Implemented and optimized a method for determining T-cell receptor similarity and epitope specificity; prototyped in Python, optimized in C\u2060+\u2060+. Co-first author",
      "Created Python package classifying protein sequences into TCR, Antibody, or MHC using Hidden Markov Models",
    ],
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <main>
        <Section id="experience" title="Experience">
          <Experience jobs={JOBS} />
        </Section>

        <Section id="projects" title="Open source">
          <div className="divide-y divide-ink/15 border-y border-ink/15">
            <Project
              name="TCRMatch"
              tech="C++, computational immunology"
              url="https://github.com/IEDB/TCRMatch"
              description="Command-line tool for T-cell receptor specificity prediction. Scores how similar two receptors are and, from that, which epitopes a new receptor is likely to recognise. Co-first author publication."
            >
              <SequenceMatch a="CASSLGQAYEQYF" b="CASSLGQGYEQYF" />
            </Project>
            <Project
              name="RustMelt5"
              tech="Rust, bioinformatics"
              url="https://github.com/acrinklaw/RustMelt5"
              description="Fast library for calculating oligonucleotide melting temperatures. Built for performance-critical bioinformatics workflows."
            >
              <MeltCurve />
            </Project>
            <Project
              name="ARC"
              tech="Python, bioinformatics"
              url="https://github.com/IEDB/ARC"
              description="Package for classifying protein sequences into TCR, antibody, or MHC categories using Hidden Markov Models."
            >
              <Classifier />
            </Project>
          </div>
        </Section>

      </main>

      <footer className="bg-plum text-bench">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-5 py-8 md:px-10">
          <p className="italic text-bench/70">
            If you&apos;re reading this, send me a horror movie recommendation.
          </p>
          <a className="text-link-dark font-display" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>
      </footer>
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-[1240px] px-5 py-16 md:px-10 md:py-20">
      <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[13rem_1fr]">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          {title}
        </h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function Project({
  name,
  tech,
  url,
  description,
  children,
}: {
  name: string;
  tech: string;
  url: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="grid items-center gap-x-12 gap-y-6 py-10 md:grid-cols-[19rem_1fr]">
      <div className="flex h-32 items-center">{children}</div>
      <div>
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          <a className="text-link" href={url} target="_blank" rel="noopener noreferrer">
            {name}
          </a>
        </h3>
        <p className="mt-1 font-display text-sm text-dim">{tech}</p>
        <p className="prose-body mt-3 max-w-[60ch]">{description}</p>
      </div>
    </article>
  );
}

/* ---------- Small figures, one per project ---------- */

function SequenceMatch({ a, b }: { a: string; b: string }) {
  return (
    <div className="grid w-full font-display text-[0.95rem] font-semibold" style={{ gridTemplateColumns: `repeat(${a.length}, 1fr)` }} aria-hidden="true">
      {a.split("").map((ch, i) => (
        <span key={`a${i}`} className={`seq-cell ${ch !== b[i] ? "bg-hit" : ""}`}>{ch}</span>
      ))}
      {a.split("").map((ch, i) => (
        <span key={`m${i}`} className="flex h-5 justify-center">
          {ch === b[i] && <span className="h-full w-px bg-ink/40" />}
        </span>
      ))}
      {b.split("").map((ch, i) => (
        <span key={`b${i}`} className={`seq-cell ${ch !== a[i] ? "bg-hit" : ""}`}>{ch}</span>
      ))}
    </div>
  );
}

function MeltCurve() {
  const pts = Array.from({ length: 53 }, (_, i) => {
    const x = 20 + i * 5;
    const y = 104 - 88 / (1 + Math.exp(-(x - 150) / 20));
    return `${x},${y.toFixed(1)}`;
  });
  return (
    <svg viewBox="0 0 300 128" className="w-full" aria-hidden="true">
      <path d="M20 8V112H284" fill="none" stroke="#1E1030" strokeOpacity=".35" />
      <path d="M150 112V60" stroke="#1E1030" strokeOpacity=".5" strokeDasharray="3 4" />
      <polyline points={pts.join(" ")} fill="none" stroke="#14696A" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="150" cy="60" r="6" fill="#FDE725" stroke="#1E1030" strokeWidth="1.5" />
      <text x="162" y="64" className="fig-text" fontWeight="600">Tm</text>
      <text x="284" y="126" textAnchor="end" className="fig-text fig-muted">temperature</text>
      <text x="28" y="16" className="fig-text fig-muted">fraction melted</text>
    </svg>
  );
}

function Classifier() {
  const classes = [
    { label: "TCR", y: 22 },
    { label: "Antibody", y: 64 },
    { label: "MHC", y: 106 },
  ];
  return (
    <svg viewBox="0 0 300 128" className="w-full" aria-hidden="true">
      <text x="0" y="68" className="fig-text" fontWeight="600">QVQLVESGG</text>
      {classes.map((c) => (
        <g key={c.label}>
          <path
            d={`M92 64C140 64 140 ${c.y} 186 ${c.y}`}
            fill="none"
            stroke={c.label === "Antibody" ? "#14696A" : "#1E1030"}
            strokeOpacity={c.label === "Antibody" ? 1 : 0.3}
            strokeWidth={c.label === "Antibody" ? 2.5 : 1}
          />
          <circle
            cx="198"
            cy={c.y}
            r="9"
            fill={c.label === "Antibody" ? "#FDE725" : "none"}
            stroke="#1E1030"
            strokeOpacity={c.label === "Antibody" ? 1 : 0.4}
            strokeWidth="1.5"
          />
          <text x="216" y={c.y + 4} className={`fig-text ${c.label === "Antibody" ? "" : "fig-muted"}`} fontWeight={c.label === "Antibody" ? 600 : 400}>
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
