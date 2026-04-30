"use client";

import { Download, Maximize, RotateCcw } from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { useImageExport } from "@/hooks/use-image-export";
import { FillModeToggle } from "./FillModeToggle";

export function Controls() {
  const scale = useEditorStore((s) => s.scale);
  const setScale = useEditorStore((s) => s.setScale);
  const exportStatus = useEditorStore((s) => s.exportStatus);
  const isExporting = useEditorStore((s) => s.isExporting);
  const fitCenter = useEditorStore((s) => s.fitCenter);
  const reset = useEditorStore((s) => s.reset);
  const { exportImage } = useImageExport();

  const percentage = Math.round(scale * 100);

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      {/* Zoom control */}
      <div className="flex items-center gap-4">
        <span className="nothing-label w-12 shrink-0 text-nothing-secondary">
          ZOOM
        </span>
        <input
          type="range"
          min={10}
          max={500}
          value={percentage}
          onChange={(e) => setScale(Number(e.target.value) / 100)}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-nothing-border accent-nothing-text"
        />
        <span className="nothing-label w-12 shrink-0 text-right text-nothing-secondary">
          {percentage}%
        </span>
        <button
          onClick={fitCenter}
          className="flex shrink-0 items-center justify-center rounded-full border border-nothing-border p-2 text-nothing-secondary transition-colors hover:border-nothing-text hover:text-nothing-text"
          aria-label="Fit and center image"
          title="Fit & center"
        >
          <Maximize size={14} />
        </button>
      </div>

      {/* Fill mode + status */}
      <div className="flex items-center justify-between">
        <FillModeToggle />
        {exportStatus !== "idle" && (
          <span className="nothing-label text-nothing-secondary">
            {exportStatus === "exporting" && "[EXPORTING...]"}
            {exportStatus === "saved" && "[SAVED]"}
            {exportStatus === "error" && "[ERROR]"}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={exportImage}
          disabled={isExporting}
          className="nothing-button-text flex flex-1 items-center justify-center gap-2 rounded-full bg-nothing-text px-6 py-3 text-nothing-bg transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          <Download size={16} />
          DOWNLOAD
        </button>
        <button
          onClick={reset}
          className="nothing-button-text flex items-center gap-2 rounded-full border border-nothing-border px-6 py-3 text-nothing-secondary transition-colors hover:border-nothing-text hover:text-nothing-text"
        >
          <RotateCcw size={16} />
          NEW IMAGE
        </button>
      </div>
    </div>
  );
}
