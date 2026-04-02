const SEQUENCE =
  "ATCGGATCAGTCTAGGCATTAGCCGATTCGATCGAATCGGATCAGTCTAGGCATTAGCCGATTCGATCGAATCGGATCAGTCTAGGCATTAGCCG";

const BASE_COLORS: Record<string, string> = {
  A: "#4ade80",
  T: "#fbbf24",
  C: "#f472b6",
  G: "#22d3ee",
};

export default function SequenceDivider() {
  return (
    <div
      className="overflow-hidden font-mono text-[11px] tracking-[3px] opacity-25 select-none"
      aria-hidden="true"
    >
      {SEQUENCE.split("").map((base, i) => (
        <span key={i} style={{ color: BASE_COLORS[base] }}>
          {base}
        </span>
      ))}
    </div>
  );
}
