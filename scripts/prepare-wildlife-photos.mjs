// One-time deterministic asset preparation. No compositing or generative processing.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
const sourceDir = process.argv[2];
if (!sourceDir) throw new Error("Supply the original-photo directory.");
await mkdir("public/wildlife", { recursive: true });
for (const [source, target, width] of [
  ["sunda-colugo-singapore-original.jpg", "sunda-colugo", 1200],
  ["oriental-pied-hornbill-singapore-original.jpg", "oriental-pied-hornbill", 900],
  ["smooth-coated-otter-singapore-original.jpg", "smooth-coated-otter", 1600],
]) {
  // Default Sharp output strips EXIF/GPS. Preserve composition and aspect ratio.
  const result = await sharp(resolve(sourceDir, source)).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 86 }).toFile(`public/wildlife/${target}.webp`);
  console.log(`${target}: ${result.width}×${result.height}, ${result.size} bytes`);
}
