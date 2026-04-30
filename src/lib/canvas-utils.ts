import type { CanvasRenderOptions } from "@/types";

export function calculateFitScale(
  imgW: number,
  imgH: number,
  canvasSize: number
): number {
  return Math.min(canvasSize / imgW, canvasSize / imgH);
}

export function drawBlurredBackground(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasSize: number
): void {
  const supportsFilter = typeof ctx.filter === "string";

  ctx.save();

  const overflow = 40;
  const coverScale = Math.max(
    (canvasSize + overflow * 2) / image.naturalWidth,
    (canvasSize + overflow * 2) / image.naturalHeight
  );
  const drawW = image.naturalWidth * coverScale;
  const drawH = image.naturalHeight * coverScale;
  const drawX = (canvasSize - drawW) / 2;
  const drawY = (canvasSize - drawH) / 2;

  if (supportsFilter) {
    ctx.filter = "blur(40px) brightness(0.7)";
    ctx.drawImage(image, drawX - overflow, drawY - overflow, drawW + overflow * 2, drawH + overflow * 2);
    ctx.filter = "none";
  } else {
    // Fallback: draw tiny then scale up for pixelation ~ blur effect
    const tinySize = 20;
    const offscreen = document.createElement("canvas");
    offscreen.width = tinySize;
    offscreen.height = tinySize;
    const offCtx = offscreen.getContext("2d")!;
    offCtx.drawImage(image, 0, 0, tinySize, tinySize);

    ctx.globalAlpha = 0.7;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(offscreen, 0, 0, canvasSize, canvasSize);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

export function renderToCanvas(options: CanvasRenderOptions): void {
  const {
    ctx,
    image,
    canvasSize,
    scale,
    offsetX,
    offsetY,
    fillMode,
    naturalWidth,
    naturalHeight,
  } = options;

  // Clear canvas
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Draw fill
  if (fillMode === "white") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
  } else {
    drawBlurredBackground(ctx, image, canvasSize);
  }

  // Calculate image dimensions at fit scale, then apply user scale
  const fitScale = calculateFitScale(naturalWidth, naturalHeight, canvasSize);
  const drawW = naturalWidth * fitScale * scale;
  const drawH = naturalHeight * fitScale * scale;

  // Center position + normalized offset applied
  const drawX = (canvasSize - drawW) / 2 + offsetX * canvasSize;
  const drawY = (canvasSize - drawH) / 2 + offsetY * canvasSize;

  ctx.drawImage(image, drawX, drawY, drawW, drawH);
}

export function exportCanvasAsBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to export canvas as PNG"));
      },
      "image/png",
      1.0
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image. Unsupported format."));
    };
    img.src = url;
  });
}
