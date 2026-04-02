"use client";

import { useEffect, useRef, useState } from "react";

export default function MolecularViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    const loadScript = (): Promise<void> => {
      if ((window as any).$3Dmol) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://3dmol.org/build/3Dmol-min.js";
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    const init = async () => {
      try {
        await loadScript();
        if (cancelled || !containerRef.current) return;

        const $3Dmol = (window as any).$3Dmol;

        // Disable OffscreenCanvas to avoid transferToImageBitmap errors
        const savedOffscreen = (window as any).OffscreenCanvas;
        (window as any).OffscreenCanvas = undefined;

        const viewer = $3Dmol.createViewer(containerRef.current, {
          backgroundColor: "#13151a",
          antialias: true,
        });

        (window as any).OffscreenCanvas = savedOffscreen;

        const response = await fetch(
          "https://files.rcsb.org/download/4W5N.pdb"
        );
        if (!response.ok) throw new Error("Failed to fetch PDB");
        const pdbData = await response.text();

        if (cancelled) return;

        viewer.addModel(pdbData, "pdb");

        // Protein as cartoon with spectrum coloring
        viewer.setStyle({}, { cartoon: { color: "spectrum", opacity: 0.9 } });

        // Highlight RNA nucleotides with stick + cartoon in cyan
        viewer.addStyle(
          { resn: ["A", "U", "G", "C"] },
          { stick: { color: "#22d3ee", radius: 0.12 } }
        );

        viewer.zoomTo();
        viewer.spin("y", 0.4);
        viewer.render();

        viewerRef.current = viewer;
        setLoading(false);

        const handleResize = () => viewer.resize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
      } catch {
        if (!cancelled) setError(true);
        setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-700/30">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="font-mono text-sm text-gray-600 animate-pulse">
            Loading RISC complex...
          </p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="font-mono text-sm text-gray-600">
            Failed to load structure
          </p>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-[400px]"
        style={{ position: "relative" }}
      />
    </div>
  );
}
