// Genera la imagen que aparece al compartir el enlace (WhatsApp, Facebook,
// Google…): foto de la casa terminada con el logo oficial. 1200×630.
//
// Uso:  node scripts/make-og-image.mjs
import path from "node:path";
import { copyFile } from "node:fs/promises";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const W = 1200, H = 630;
const photo = path.join(ROOT, "public/media/hero/fotoHero1.jpg");
const logo = path.join(ROOT, "src/assets/brand/logo-blanco.png");
const out = path.join(ROOT, "src/app/opengraph-image.jpg");

const logoBuf = await sharp(logo).resize({ width: 460 }).toBuffer();
const shade = Buffer.from(`<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#161b20" stop-opacity="0.15"/><stop offset="0.55" stop-color="#161b20" stop-opacity="0.2"/>
  <stop offset="1" stop-color="#161b20" stop-opacity="0.88"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`);

await sharp(photo).resize(W, H, { fit: "cover", position: "centre" })
  .composite([{ input: shade }, { input: logoBuf, left: 64, top: H - 64 - 111 }])
  .jpeg({ quality: 84, mozjpeg: true }).toFile(out);
await copyFile(out, path.join(ROOT, "src/app/twitter-image.jpg"));
console.log("ok: opengraph-image.jpg y twitter-image.jpg");
