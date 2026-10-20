// Genera las versiones web de la secuencia de imágenes del hero.
//
// Uso:  node scripts/optimize-sequence.mjs
//
// Lee los fotogramas originales (no los modifica) y escribe:
//   public/media/scrollytelling/timelapse-house/desktop  → todos, 1280 px
//   public/media/scrollytelling/timelapse-house/mobile   → uno de cada dos, 854 px
// Si cambia la cantidad de fotogramas, actualiza `timelapseHouse` en
// src/content/site.ts. Usa `sharp`, que ya viene instalado con Next.js.

import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(ROOT, "public/media/scrollytelling/frames_timelapse_house");
const OUT = path.join(ROOT, "public/media/scrollytelling/timelapse-house");

const sets = [
  { name: "desktop", width: 1280, quality: 58, every: 1 },
  { name: "mobile", width: 854, quality: 60, every: 2 },
];

const files = (await readdir(SOURCE)).filter((f) => /^frame_\d+\.webp$/.test(f)).sort();
if (files.length === 0) throw new Error(`No hay fotogramas en ${SOURCE}`);

for (const set of sets) {
  const dir = path.join(OUT, set.name);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const picked = files.filter((_, i) => i % set.every === 0);
  let bytes = 0;
  for (const [i, file] of picked.entries()) {
    const info = await sharp(path.join(SOURCE, file))
      .resize({ width: set.width })
      .webp({ quality: set.quality, effort: 6, smartSubsample: true })
      .toFile(path.join(dir, `frame_${String(i + 1).padStart(4, "0")}.webp`));
    bytes += info.size;
  }
  console.log(`${set.name}: ${picked.length} fotogramas, ${(bytes / 1048576).toFixed(1)} MB`);
}
