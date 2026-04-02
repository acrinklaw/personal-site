import MolecularViewer from "@/components/MolecularViewer";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero + Molecular Viewer */}
      <section className="px-6 md:px-12 lg:px-24 max-w-5xl mx-auto pt-24 md:pt-32 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
          {/* Left: Hero content */}
          <div className="flex-1 min-w-0">
            <div className="animate-entrance" style={{ animationDelay: "0ms" }}>
              <p className="font-mono text-sm text-cyan-400 tracking-widest uppercase mb-6">
                Scientific Software Developer
              </p>
            </div>

            <div className="flex items-end gap-6 md:gap-8">
              <h1
                className="animate-entrance font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[0.9]"
                style={{ animationDelay: "100ms" }}
              >
                Austin
                <br />
                Crinklaw
              </h1>
              <div
                className="animate-entrance hidden md:block lg:hidden mb-2"
                style={{ animationDelay: "250ms" }}
              >
                <Image
                  src="/headshot.jpeg"
                  alt="Austin Crinklaw"
                  width={96}
                  height={96}
                  className="rounded-full ring-2 ring-gray-700"
                />
              </div>
            </div>

            <div
              className="animate-entrance mt-8"
              style={{ animationDelay: "200ms" }}
            >
              <div className="h-px bg-gray-700/50 w-full" />
            </div>

            <p
              className="animate-entrance mt-8 text-lg md:text-xl text-gray-400 max-w-2xl font-body leading-relaxed"
              style={{ animationDelay: "300ms" }}
            >
              7+ years bridging software engineering and bioinformatics in biotech
              R&D. Building full-stack platforms, AI-driven discovery tools, and
              computational pipelines for therapeutic development.
            </p>

            <div
              className="animate-entrance mt-8 flex items-center gap-6"
              style={{ animationDelay: "400ms" }}
            >
              <a
                href="https://github.com/acrinklaw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/acrinklaw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:austincrinklaw@gmail.com"
                className="text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
              <span className="text-gray-700 select-none">|</span>
              <a
                href="mailto:austincrinklaw@gmail.com"
                className="font-mono text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                austincrinklaw@gmail.com
              </a>
            </div>
          </div>

          {/* Right: Molecular Viewer */}
          <div className="mt-12 lg:mt-0 lg:w-[420px] lg:shrink-0">
            <div className="animate-entrance" style={{ animationDelay: "300ms" }}>
              <MolecularViewer />
              <p className="mt-3 font-mono text-[11px] text-gray-600 text-center">
                RISC Complex · PDB 4W5N · drag to rotate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="px-6 md:px-12 lg:px-24 max-w-5xl mx-auto py-14">
        <SectionHeader label="Experience" annotation="2018 → present" />

        <div className="mt-10 space-y-12">
          <ExperienceEntry
            company="Empirico Inc"
            period="March 2023 — Present"
            roles={[
              {
                title: "Lead R&D Systems Engineer",
                period: "Jan 2026 — Present",
              },
              {
                title: "Senior Bioinformatics Scientist",
                period: "Jan 2024 — Dec 2025",
              },
              {
                title: "Bioinformatics Scientist",
                period: "Mar 2023 — Jan 2024",
              },
            ]}
            bullets={[
              "Architected the company's primary LIMS system (NextJS/React, FastAPI, PostgreSQL) serving 30 scientists, tracking mission-critical data across siRNA selection, synthesis chemistry, reagent inventory, and in-vivo studies",
              "Led a team of 2 engineers, driving mentorship and cross-functional collaboration with wet lab researchers",
              "Developed an agentic target discovery platform leveraging AI/LLMs to accelerate therapeutic research",
              "Designed integrated data pipeline feeding experimental results into models to predict siRNA efficacy",
              "Established CI/CD pipelines, containerized deployments, and testing standards for team infrastructure",
            ]}
          />

          <ExperienceEntry
            company="Jumpcode Genomics"
            period="March 2022 — March 2023"
            roles={[{ title: "Research Associate III", period: "" }]}
            bullets={[
              "Implemented pipelines (Python/Snakemake) to design CRISPR/Cas9 gRNA sequences; adopted across all R&D products",
              "Overhauled AWS infrastructure to reduce compute costs by 50%; managed general administration and provisioning",
            ]}
          />

          <ExperienceEntry
            company="1859 Inc"
            period="September 2021 — March 2022"
            roles={[{ title: "Senior Associate Scientist", period: "" }]}
            bullets={[
              "Developed automated NGS pipeline (Python/Nextflow) for DNA encoded libraries",
              "Created web apps (React, Flask, Celery) enabling scientists to trigger analyses and visualize results",
            ]}
          />

          <ExperienceEntry
            company="LJI, Peters Lab"
            period="February 2018 — September 2021"
            roles={[{ title: "Research Tech", period: "" }]}
            bullets={[
              "Implemented and optimized a method for determining T-cell receptor similarity and epitope specificity; prototyped in Python, optimized in C++. Co-first author",
              "Created Python package classifying protein sequences into TCR, Antibody, or MHC using Hidden Markov Models",
            ]}
          />
        </div>
      </section>

      {/* Projects */}
      <section className="px-6 md:px-12 lg:px-24 max-w-5xl mx-auto py-14">
        <SectionHeader label="Projects" annotation="open source" />

        <div className="mt-10 space-y-2">
          <ProjectEntry
            name="TCRMatch"
            tech="C++ · Computational Immunology"
            description="CLI tool for T-cell receptor specificity prediction. Determines TCR similarity and epitope specificity using an optimized scoring algorithm. Co-first author publication."
            url="https://github.com/IEDB/TCRMatch"
          />
          <ProjectEntry
            name="RustMelt5"
            tech="Rust · Bioinformatics"
            description="Fast library for calculating oligonucleotide melting temperatures. Built for performance-critical bioinformatics workflows."
            url="https://github.com/acrinklaw/RustMelt5"
          />
          <ProjectEntry
            name="ARC"
            tech="Python · Bioinformatics"
            description="Package for classifying protein sequences into TCR, Antibody, or MHC categories using Hidden Markov Models."
            url="https://github.com/IEDB/ARC"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="px-6 md:px-12 lg:px-24 max-w-5xl mx-auto py-14">
        <SectionHeader label="Skills" annotation="domains" />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <SkillGroup
            label="Languages"
            skills={["Python", "TypeScript", "C++", "Rust"]}
          />
          <SkillGroup
            label="Full Stack"
            skills={[
              "NextJS",
              "React",
              "FastAPI",
              "SQLAlchemy",
              "Pydantic",
              "PostgreSQL",
            ]}
          />
          <SkillGroup
            label="Bioinformatics"
            skills={[
              "NGS",
              "RNA-Seq",
              "PacBio Long Read",
              "Single-Cell",
              "Computational Immunology",
              "CRISPR/Cas9",
              "siRNA Design",
            ]}
          />
          <SkillGroup
            label="Infrastructure"
            skills={["AWS", "Docker", "CI/CD", "GNU/Linux"]}
          />
        </div>
      </section>

      {/* Education */}
      <section className="px-6 md:px-12 lg:px-24 max-w-5xl mx-auto py-14">
        <SectionHeader label="Education" annotation="2018" />
        <div className="mt-8">
          <p className="font-display text-xl text-white">
            University of California, San Diego
          </p>
          <p className="text-gray-400 mt-1">
            Bachelor of Science, Bioinformatics
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 lg:px-24 max-w-5xl mx-auto py-14 border-t border-gray-700/40">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="font-mono text-xs text-gray-600 tracking-wider mb-3">
              // get in touch
            </p>
            <a
              href="mailto:austincrinklaw@gmail.com"
              className="font-display text-2xl md:text-3xl text-white hover:text-cyan-400 transition-colors duration-200"
            >
              austincrinklaw@gmail.com
            </a>
            <div className="mt-4 flex items-center gap-6">
              <a
                href="https://github.com/acrinklaw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors duration-200 text-sm font-mono"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/acrinklaw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors duration-200 text-sm font-mono"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-mono italic max-w-xs text-right hidden md:block">
            If you&apos;re reading this, send me a horror movie recommendation.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ---------- Sub-components ---------- */

function SectionHeader({
  label,
  annotation,
}: {
  label: string;
  annotation: string;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-white shrink-0">
        {label}
      </h2>
      <div className="hidden sm:flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-1 h-px bg-gray-700/50" />
        <span className="font-mono text-xs text-gray-600 tracking-wider shrink-0">
          {annotation}
        </span>
      </div>
    </div>
  );
}

function ExperienceEntry({
  company,
  period,
  roles,
  bullets,
}: {
  company: string;
  period: string;
  roles: { title: string; period: string }[];
  bullets: string[];
}) {
  return (
    <div className="pl-6 md:pl-8 border-l border-gray-700/50">
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
        <h3 className="font-display text-xl font-semibold text-white">
          {company}
        </h3>
        <span className="font-mono text-xs text-gray-500 shrink-0">
          {period}
        </span>
      </div>
      <div className="mt-3 space-y-1">
        {roles.map((role, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3"
          >
            <span className="text-gray-300 text-sm">{role.title}</span>
            {role.period && (
              <span className="font-mono text-[11px] text-gray-600">
                {role.period}
              </span>
            )}
          </div>
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {bullets.map((bullet, i) => (
          <li
            key={i}
            className="text-gray-400 text-sm leading-relaxed pl-4 relative"
          >
            <span className="absolute left-0 text-gray-600 select-none">
              ·
            </span>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectEntry({
  name,
  tech,
  description,
  url,
}: {
  name: string;
  tech: string;
  description: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-6 -mx-6 rounded-lg hover:bg-white/[0.03] transition-colors duration-200"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200">
          {name}
        </h3>
        <ExternalLink
          size={14}
          className="text-gray-700 group-hover:text-cyan-400 transition-colors duration-200 shrink-0 translate-y-[1px]"
        />
      </div>
      <p className="font-mono text-xs text-gray-500 mt-1">{tech}</p>
      <p className="text-gray-400 text-sm mt-2 leading-relaxed">
        {description}
      </p>
    </a>
  );
}

function SkillGroup({ label, skills }: { label: string; skills: string[] }) {
  return (
    <div>
      <p className="font-mono text-xs text-gray-500 tracking-wider uppercase mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 text-sm text-gray-300 bg-white/[0.04] border border-gray-700/60 rounded font-mono"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
