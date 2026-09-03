import sharp from "sharp";
import path from "node:path";

const input = path.resolve("public/logo.jpeg");
const output = path.resolve("public/logo-transparent.png");

const image = sharp(input);
const { data, info } = await image
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

// Mehrere Referenzpunkte am Bildrand abgreifen (statt nur einer Ecke), da das
// Bild einen leichten Vignetten-Verlauf hat
const samplePoints = [
  [10, 10],
  [width - 10, 10],
  [10, height - 10],
  [width - 10, height - 10],
  [Math.floor(width / 2), 10],
  [10, Math.floor(height / 2)],
];
let bgR = 0,
  bgG = 0,
  bgB = 0;
for (const [x, y] of samplePoints) {
  const idx = (y * width + x) * channels;
  bgR += data[idx];
  bgG += data[idx + 1];
  bgB += data[idx + 2];
}
bgR /= samplePoints.length;
bgG /= samplePoints.length;
bgB /= samplePoints.length;
console.log("Durchschnittliche Hintergrundfarbe:", bgR, bgG, bgB);

const threshold = 60; // großzügiger, um den Verlauf mit abzudecken
const minBrightness = 165; // zusätzliche Sicherheit: nur helle Pixel werden entfernt

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
  const brightness = (r + g + b) / 3;
  if (dist < threshold && brightness > minBrightness) {
    data[i + 3] = 0; // komplett durchsichtig
  }
}

await sharp(data, { raw: { width, height, channels } })
  .png()
  .toFile(output);

console.log("Fertig:", output, `${width}x${height}`);
