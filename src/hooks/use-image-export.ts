import { useCallback } from "react";
import { useEditorStore } from "@/stores/editor-store";
import {
  renderToCanvas,
  exportCanvasAsBlob,
  downloadBlob,
} from "@/lib/canvas-utils";

export function useImageExport() {
  const exportImage = useCallback(async () => {
    const store = useEditorStore.getState();
    const { imageElement, naturalWidth, naturalHeight, scale, offsetX, offsetY, fillMode, outputSize } = store;

    if (!imageElement) return;

    store.setExportStatus("exporting");

    try {
      const offscreen = document.createElement("canvas");
      offscreen.width = outputSize;
      offscreen.height = outputSize;
      const ctx = offscreen.getContext("2d");

      if (!ctx) {
        store.setExportStatus("error");
        return;
      }

      renderToCanvas({
        ctx,
        image: imageElement,
        canvasSize: outputSize,
        scale,
        offsetX,
        offsetY,
        fillMode,
        naturalWidth,
        naturalHeight,
      });

      const blob = await exportCanvasAsBlob(offscreen);
      const timestamp = Date.now();
      downloadBlob(blob, `instax-square-${timestamp}.png`);

      store.setExportStatus("saved");
      setTimeout(() => {
        if (useEditorStore.getState().exportStatus === "saved") {
          store.setExportStatus("idle");
        }
      }, 2000);
    } catch {
      store.setExportStatus("error");
      setTimeout(() => {
        if (useEditorStore.getState().exportStatus === "error") {
          store.setExportStatus("idle");
        }
      }, 3000);
    }
  }, []);

  return { exportImage };
}
