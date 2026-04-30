import { create } from "zustand";
import type { FillMode } from "@/types";

export type ExportStatus = "idle" | "exporting" | "saved" | "error";

interface EditorState {
  // Image
  file: File | null;
  imageElement: HTMLImageElement | null;
  naturalWidth: number;
  naturalHeight: number;

  // Transform
  scale: number;
  offsetX: number; // normalized 0-1 range (center = 0)
  offsetY: number;

  // Settings
  fillMode: FillMode;
  outputSize: number;

  // Export
  isExporting: boolean;
  exportStatus: ExportStatus;

  // Actions
  setImage: (
    file: File,
    imageElement: HTMLImageElement,
    naturalWidth: number,
    naturalHeight: number
  ) => void;
  setScale: (scale: number) => void;
  setOffset: (offsetX: number, offsetY: number) => void;
  setFillMode: (mode: FillMode) => void;
  setExportStatus: (status: ExportStatus) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  file: null,
  imageElement: null,
  naturalWidth: 0,
  naturalHeight: 0,
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  fillMode: "white" as FillMode,
  outputSize: 1800,
  isExporting: false,
  exportStatus: "idle" as ExportStatus,
};

export const useEditorStore = create<EditorState>((set) => ({
  ...INITIAL_STATE,

  setImage: (file, imageElement, naturalWidth, naturalHeight) =>
    set({
      file,
      imageElement,
      naturalWidth,
      naturalHeight,
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
      exportStatus: "idle",
    }),

  setScale: (scale) =>
    set({ scale: Math.min(5.0, Math.max(0.1, scale)) }),

  setOffset: (offsetX, offsetY) =>
    set({ offsetX, offsetY }),

  setFillMode: (fillMode) =>
    set({ fillMode }),

  setExportStatus: (exportStatus) =>
    set({
      exportStatus,
      isExporting: exportStatus === "exporting",
    }),

  reset: () => set(INITIAL_STATE),
}));
