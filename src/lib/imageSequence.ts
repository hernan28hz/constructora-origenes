// Secuencia de imágenes dibujada en un <canvas>, pensada para avanzar con el
// scroll (scrollytelling). No sabe nada de GSAP: quien la use le indica qué
// posición dibujar con `draw()`.
//
// - Carga los fotogramas de lo general a lo particular (primero, último, los
//   intermedios, y así hasta completar), de modo que el scroll ya funciona
//   aunque falten fotogramas: se dibuja el más cercano disponible.
// - Entre dos fotogramas se mezclan con un fundido, así el avance es continuo
//   incluso con pocos fotogramas.
// - Cada fotograma se guarda como ImageBitmap ya decodificado y se libera con
//   `destroy()`.

type SequenceOptions = {
  urls: string[];
  /** Límite de ancho del bitmap en px, para no gastar memoria de más. */
  maxBitmapWidth?: number;
  /** Punto de enfoque (0 a 1) cuando el canvas recorta el fotograma. */
  focusX?: number;
  focusY?: number;
  /**
   * 1 = el fotograma cubre todo el canvas (recorta lo que sobre). Menos de 1
   * lo acerca a "ajustar": se ve más imagen y quedan franjas que se rellenan
   * con el mismo fotograma ampliado y oscurecido. Útil en pantallas verticales.
   */
  zoom?: number;
  /** Color que oscurece el relleno de las franjas. */
  backdrop?: string;
  concurrency?: number;
  /** Se llama cada vez que llega un fotograma. */
  onFrame?: (loaded: number, total: number) => void;
};

/** Orden de carga: de lo general a lo particular. */
function coarseToFine(count: number) {
  const seen = new Set<number>();
  const order: number[] = [];
  const add = (i: number) => {
    if (i >= 0 && i < count && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  add(0);
  add(count - 1);
  for (let step = 2 ** Math.floor(Math.log2(Math.max(1, count - 1))); step >= 1; step >>= 1) {
    for (let i = 0; i < count; i += step) add(i);
  }
  return order;
}

export class ImageSequence {
  private readonly frames: (ImageBitmap | null)[];
  private readonly ctx: CanvasRenderingContext2D;
  private readonly abort = new AbortController();
  private resizeObserver: ResizeObserver | null = null;
  private loaded = 0;
  private position = 0;
  private lastKey = "";
  private destroyed = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: SequenceOptions,
  ) {
    this.frames = new Array(options.urls.length).fill(null);
    // Transparente hasta que llegue el primer fotograma: mientras tanto se
    // ve la imagen que haya debajo, en lugar de un cuadro negro.
    this.ctx = canvas.getContext("2d")!;
    this.fit();
    this.resizeObserver = new ResizeObserver(() => this.fit());
    this.resizeObserver.observe(canvas);
  }

  get count() {
    return this.frames.length;
  }

  /** Ajusta la resolución interna del canvas a su tamaño en pantalla. */
  private fit() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const scale = Math.min(dpr, 1600 / rect.width);
    const w = Math.round(rect.width * scale);
    const h = Math.round(rect.height * scale);
    if (w === this.canvas.width && h === this.canvas.height) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.lastKey = "";
    this.draw(this.position);
  }

  /** Empieza a descargar y decodificar los fotogramas. */
  async load() {
    const { urls, maxBitmapWidth, concurrency = 4, onFrame } = this.options;
    const order = coarseToFine(urls.length);
    let cursor = 0;

    const worker = async () => {
      while (!this.destroyed && cursor < order.length) {
        const index = order[cursor++];
        try {
          const response = await fetch(urls[index], { signal: this.abort.signal });
          if (!response.ok) continue;
          const blob = await response.blob();
          const bitmap = await createImageBitmap(
            blob,
            maxBitmapWidth ? { resizeWidth: maxBitmapWidth, resizeQuality: "medium" } : undefined,
          );
          if (this.destroyed) {
            bitmap.close();
            return;
          }
          this.frames[index] = bitmap;
          this.loaded++;
          onFrame?.(this.loaded, urls.length);
          // Si el fotograma recién llegado es el que se está mirando, se redibuja.
          this.lastKey = "";
          this.draw(this.position);
        } catch {
          if (this.destroyed) return;
          // Un fotograma que falla no detiene la secuencia: se usa el más cercano.
        }
      }
    };

    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  /** Índice del fotograma cargado más cercano a `index`, o -1 si no hay ninguno. */
  private nearest(index: number) {
    const n = this.frames.length;
    for (let d = 0; d < n; d++) {
      if (this.frames[index - d]) return index - d;
      if (this.frames[index + d]) return index + d;
    }
    return -1;
  }

  private paint(bitmap: ImageBitmap, alpha: number, backdrop = false) {
    const { width: cw, height: ch } = this.canvas;
    const { focusX = 0.5, focusY = 0.5, zoom = 1 } = this.options;
    const cover = Math.max(cw / bitmap.width, ch / bitmap.height);
    const contain = Math.min(cw / bitmap.width, ch / bitmap.height);
    const scale = backdrop ? cover : contain + (cover - contain) * zoom;
    const dw = bitmap.width * scale;
    const dh = bitmap.height * scale;
    this.ctx.globalAlpha = alpha;
    this.ctx.drawImage(bitmap, (cw - dw) * focusX, (ch - dh) * focusY, dw, dh);
  }

  /** Dibuja la posición indicada (0 a count - 1, admite decimales). */
  draw(position: number) {
    const last = this.frames.length - 1;
    const p = Math.min(Math.max(position, 0), last);
    this.position = p;

    const base = Math.floor(p);
    const mix = p - base;
    const a = this.nearest(base);
    const b = this.nearest(Math.min(base + 1, last));
    if (a < 0) return;

    const key = `${a}|${b}|${mix.toFixed(2)}|${this.canvas.width}`;
    if (key === this.lastKey) return;
    this.lastKey = key;

    const blend = b >= 0 && b !== a && mix > 0.01;
    if ((this.options.zoom ?? 1) < 1) {
      this.paint(this.frames[a]!, 1, true);
      if (blend) this.paint(this.frames[b]!, mix, true);
      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = this.options.backdrop ?? "rgba(22, 27, 32, 0.74)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.paint(this.frames[a]!, 1);
    if (blend) this.paint(this.frames[b]!, mix);
    this.ctx.globalAlpha = 1;
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.frames.forEach((bitmap, i) => {
      bitmap?.close();
      this.frames[i] = null;
    });
  }
}
