"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEditorStore } from "@/stores/editor-store";
import { ImageDropZone } from "./ImageDropZone";
import { CanvasPreview } from "./CanvasPreview";
import { Controls } from "./Controls";
import { Header } from "./Header";
import { NOTHING_TRANSITION } from "@/lib/motion";

export function EditorView() {
  const imageElement = useEditorStore((s) => s.imageElement);
  const hasImage = imageElement !== null;

  return (
    <div className="flex min-h-dvh flex-col bg-nothing-bg">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 pb-8">
        <AnimatePresence mode="wait">
          {!hasImage ? (
            <ImageDropZone key="dropzone" />
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={NOTHING_TRANSITION}
              className="flex w-full flex-col items-center gap-6 px-6"
            >
              <CanvasPreview />
              <Controls />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
