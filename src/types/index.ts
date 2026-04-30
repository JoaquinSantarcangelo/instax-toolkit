export type FillMode = "white" | "blur";

export interface ImageState {
  file: File | null;
  imageElement: HTMLImageElement | null;
  naturalWidth: number;
  naturalHeight: number;
}

export interface CanvasRenderOptions {
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  canvasSize: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  fillMode: FillMode;
  naturalWidth: number;
  naturalHeight: number;
}
