import { useCallback, useRef } from "react";
import { useEditorStore } from "@/stores/editor-store";

interface PointerState {
  pointerId: number;
  x: number;
  y: number;
}

export function useCanvasInteraction(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const pointers = useRef<PointerState[]>([]);
  const initialPinchDistance = useRef<number | null>(null);
  const initialPinchScale = useRef<number>(1);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const getDisplaySize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 1;
    return canvas.getBoundingClientRect().width;
  }, [canvasRef]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.setPointerCapture(e.pointerId);
      pointers.current.push({
        pointerId: e.pointerId,
        x: e.clientX,
        y: e.clientY,
      });

      if (pointers.current.length === 1) {
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
      }

      if (pointers.current.length === 2) {
        isDragging.current = false;
        const [p1, p2] = pointers.current;
        initialPinchDistance.current = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        initialPinchScale.current = useEditorStore.getState().scale;
      }
    },
    [canvasRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Update pointer position
      const idx = pointers.current.findIndex(
        (p) => p.pointerId === e.pointerId
      );
      if (idx !== -1) {
        pointers.current[idx].x = e.clientX;
        pointers.current[idx].y = e.clientY;
      }

      const store = useEditorStore.getState();

      // Pinch zoom
      if (
        pointers.current.length === 2 &&
        initialPinchDistance.current !== null
      ) {
        const [p1, p2] = pointers.current;
        const currentDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const ratio = currentDistance / initialPinchDistance.current;
        store.setScale(initialPinchScale.current * ratio);
        return;
      }

      // Single pointer drag
      if (isDragging.current && pointers.current.length === 1) {
        const displaySize = getDisplaySize();
        const dx = (e.clientX - lastPos.current.x) / displaySize;
        const dy = (e.clientY - lastPos.current.y) / displaySize;
        store.setOffset(store.offsetX + dx, store.offsetY + dy);
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [getDisplaySize]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      pointers.current = pointers.current.filter(
        (p) => p.pointerId !== e.pointerId
      );

      if (pointers.current.length < 2) {
        initialPinchDistance.current = null;
      }

      if (pointers.current.length === 0) {
        isDragging.current = false;
      }
    },
    []
  );

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const store = useEditorStore.getState();
      const delta = -e.deltaY * 0.001;
      store.setScale(store.scale + delta);
    },
    []
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
  };
}
