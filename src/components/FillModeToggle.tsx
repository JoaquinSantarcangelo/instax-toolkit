"use client";

import { motion } from "motion/react";
import { useEditorStore } from "@/stores/editor-store";
import type { FillMode } from "@/types";
import { NOTHING_TRANSITION } from "@/lib/motion";

const MODES: { value: FillMode; label: string }[] = [
  { value: "white", label: "WHITE" },
  { value: "blur", label: "BLUR" },
];

export function FillModeToggle() {
  const fillMode = useEditorStore((s) => s.fillMode);
  const setFillMode = useEditorStore((s) => s.setFillMode);

  return (
    <div className="relative flex rounded-full border border-nothing-border p-1">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          onClick={() => setFillMode(mode.value)}
          className="nothing-button-text relative z-10 px-4 py-1.5 transition-colors"
          style={{
            color:
              fillMode === mode.value
                ? "var(--nothing-bg)"
                : "var(--nothing-secondary)",
          }}
        >
          {mode.label}
          {fillMode === mode.value && (
            <motion.div
              layoutId="fill-mode-indicator"
              className="absolute inset-0 rounded-full bg-nothing-text"
              style={{ zIndex: -1 }}
              transition={NOTHING_TRANSITION}
            />
          )}
        </button>
      ))}
    </div>
  );
}
