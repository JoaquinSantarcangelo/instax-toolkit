# Instax Square — Image Formatter for Fujifilm Instax Square Prints

A free, open-source web tool that fits any photo into a perfect 1:1 square canvas for **Fujifilm Instax Square Link** and **Instax Square SQ1** prints. No cropping, no lost details — just drag, zoom, and download.

**[Use the app &rarr; instax.sant.ar](https://instax.sant.ar)**

---

## The Problem

The official Fujifilm Instax app only lets you reposition a square crop over your image. Portrait and landscape photos get cut off — you lose faces, backgrounds, and composition. There is no way to fit the full image with margins.

## The Solution

Instax Square places your entire image inside a 1:1 canvas with your choice of fill:

- **White fill** — clean borders, classic look
- **Blur fill** — the image itself, blurred and darkened, fills the background

The result is a **1800 x 1800 px PNG** ready to send to the Instax app. Every pixel of your original photo is preserved.

---

## Features

| Feature | Details |
|---|---|
| **Drag & drop upload** | Drop any image or tap to select from your library |
| **Interactive canvas** | Drag to pan, scroll to zoom (desktop), pinch to zoom (mobile) |
| **White or blur fill** | Toggle between clean white margins and a blurred background |
| **Zoom control** | Slider from 10% to 500% with live percentage display |
| **Retina rendering** | Canvas renders at native device pixel ratio for sharp previews |
| **1800px export** | Downloads a high-resolution 1800 x 1800 PNG |
| **Dark / light mode** | Toggle between dark and light themes, persisted across sessions |
| **PWA / offline** | Install on your home screen, works without internet after first load |
| **Fully client-side** | No server uploads — your images never leave your device |

---

## How It Works

1. **Open** [instax.sant.ar](https://instax.sant.ar) on any device
2. **Drop or select** a photo (portrait, landscape, or square)
3. **Adjust** — drag to reposition, scroll/pinch to zoom
4. **Choose fill** — white borders or blurred background
5. **Download** — tap the download button to save the 1800px square PNG
6. **Print** — open the PNG in the Fujifilm Instax app and print

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 with custom design tokens |
| Animation | [Motion](https://motion.dev) (Framer Motion) |
| State | [Zustand](https://zustand.docs.pmnd.rs) |
| Icons | [Lucide React](https://lucide.dev) |
| Themes | [next-themes](https://github.com/pacocoursey/next-themes) |
| PWA | [Serwist](https://serwist.pages.dev) (service worker + precaching) |
| Canvas | HTML Canvas API (2D context, retina-aware) |
| Fonts | Doto (display), Space Grotesk (body), Space Mono (UI labels) |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, ThemeProvider, viewport
│   ├── page.tsx            # Server component → <EditorView />
│   ├── globals.css         # Design tokens, Tailwind @theme, utility classes
│   └── sw.ts              # Serwist service worker entry
├── components/
│   ├── EditorView.tsx      # Orchestrator: drop zone ↔ editor (AnimatePresence)
│   ├── Header.tsx          # App title (Doto font) + ThemeToggle
│   ├── ImageDropZone.tsx   # Drag-and-drop + file input
│   ├── CanvasPreview.tsx   # Interactive square canvas (retina, ResizeObserver)
│   ├── Controls.tsx        # Zoom slider, fill toggle, download, reset
│   ├── FillModeToggle.tsx  # Segmented control with animated indicator
│   └── ThemeToggle.tsx     # Sun/Moon icon toggle (next-themes)
├── hooks/
│   ├── use-canvas-interaction.ts  # Pointer drag, pinch zoom, scroll zoom
│   └── use-image-export.ts        # Off-screen 1800px canvas → PNG download
├── stores/
│   └── editor-store.ts    # Zustand: image, scale, offset, fillMode, export status
├── lib/
│   ├── canvas-utils.ts    # renderToCanvas, blur background, export, file loading
│   └── motion.ts          # Easing curves and transition presets
└── types/
    └── index.ts           # FillMode, ImageState, CanvasRenderOptions
```

### Key Design Decisions

- **Normalized offsets (0 to 1)** — Pan offsets are stored as ratios, not pixels. The same offset value produces identical framing on the 400px preview and the 1800px export canvas. No scaling bugs.
- **Canvas filter with fallback** — Blur fill uses `ctx.filter = "blur(40px)"` where supported, falling back to a pixelation-based approach on older browsers.
- **Pointer Events API** — Unified mouse and touch handling. Single pointer = drag. Two pointers = pinch zoom. Scroll wheel = desktop zoom.
- **No server dependency** — Everything runs in the browser. Images are loaded via `URL.createObjectURL`, rendered on canvas, and exported as blobs. Nothing is uploaded.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io) 8+

### Install & Run

```bash
git clone https://github.com/JoaquinSantarcangelo/instax-toolkit.git
cd instax-toolkit
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
pnpm build
pnpm start
```

The production build generates a service worker (`public/sw.js`) for offline support.

---

## Compatibility

| Platform | Support |
|---|---|
| Chrome / Edge 90+ | Full support |
| Safari 15+ / iOS Safari | Full support |
| Firefox 90+ | Full support (blur fallback on older versions) |
| HEIC images (iPhone) | Decoded natively by modern browsers |
| PWA install | Chrome, Edge, Safari (iOS / macOS) |

---

## Privacy

Instax Square is **100% client-side**. Your images are processed entirely in your browser using the HTML Canvas API. No image data is ever sent to a server. No analytics, no tracking, no cookies.

---

## License

MIT

---

Built by [Joaquin Santarcangelo](https://sant.ar)
