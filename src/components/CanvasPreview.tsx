"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { renderToCanvas } from "@/lib/canvas-utils";
import { useCanvasInteraction } from "@/hooks/use-canvas-interaction";

export function CanvasPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const displaySizeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const imageElement = useEditorStore((s) => s.imageElement);
  const naturalWidth = useEditorStore((s) => s.naturalWidth);
  const naturalHeight = useEditorStore((s) => s.naturalHeight);
  const scale = useEditorStore((s) => s.scale);
  const offsetX = useEditorStore((s) => s.offsetX);
  const offsetY = useEditorStore((s) => s.offsetY);
  const fillMode = useEditorStore((s) => s.fillMode);

  const { onPointerDown, onPointerMove, onPointerUp, onWheel } =
    useCanvasInteraction(canvasRef);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageElement) return;

    const dpr = window.devicePixelRatio || 1;
    const displaySize = displaySizeRef.current;
    if (displaySize === 0) return;

    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);

    renderToCanvas({
      ctx,
      image: imageElement,
      canvasSize: displaySize,
      scale,
      offsetX,
      offsetY,
      fillMode,
      naturalWidth,
      naturalHeight,
    });

    ctx.restore();
  }, [imageElement, scale, offsetX, offsetY, fillMode, naturalWidth, naturalHeight]);

  // Track container size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        displaySizeRef.current = entry.contentRect.width;
        draw();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [draw]);

  // Redraw on state changes
  useEffect(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [draw]);

  // Wheel event (non-passive)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  return (
    <div
      ref={containerRef}
      className="aspect-square w-full max-w-lg overflow-hidden rounded-2xl border border-nothing-border bg-nothing-surface"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        style={{ imageRendering: "auto" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </div>
  );
}
