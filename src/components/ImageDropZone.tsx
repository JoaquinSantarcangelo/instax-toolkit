"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { motion } from "motion/react";
import { loadImageFromFile } from "@/lib/canvas-utils";
import { useEditorStore } from "@/stores/editor-store";
import { NOTHING_TRANSITION } from "@/lib/motion";

export function ImageDropZone() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setImage = useEditorStore((s) => s.setImage);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      try {
        const img = await loadImageFromFile(file);
        setImage(file, img, img.naturalWidth, img.naturalHeight);
      } catch {
        setError("UNSUPPORTED FORMAT");
      }
    },
    [setImage]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={NOTHING_TRANSITION}
      className="flex w-full flex-1 items-center justify-center px-6"
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`flex aspect-square w-full max-w-md cursor-pointer flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed transition-colors ${
          isDragOver
            ? "border-nothing-text bg-nothing-surface"
            : "border-nothing-border hover:border-nothing-secondary"
        }`}
      >
        <ImagePlus
          size={48}
          strokeWidth={1}
          className={`transition-colors ${
            isDragOver ? "text-nothing-text" : "text-nothing-secondary"
          }`}
        />
        <span className="nothing-label text-nothing-secondary">
          DROP IMAGE OR TAP TO SELECT
        </span>
        {error && (
          <span className="nothing-label text-red-500">[{error}]</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />
    </motion.div>
  );
}
