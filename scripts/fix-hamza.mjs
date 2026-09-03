import sharp from "sharp";
import path from "node:path";

const input = path.resolve("public/logo-transparent.png");
const output = path.resolve("public/logo-transparent.png");

// Bereich der fehlerhaften "Blase" (grob als Hamza gemeinter Klecks)
const eraseBox = { left: 858, top: 955, width: 78, height: 100 };

// Sauberes Hamza-Symbol als SVG, in der Tinten-Farbe des Logos
const inkColor = "rgb(6,7,2)";
const hamzaSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="100" viewBox="0 0 40 50">
  <path d="M22 3
           C11 3 3 12 4 24
           C 5 33 11 40 19 43
           C 15 37 13 30 16 23
           C 19 16 26 11 34 12
           C 31 6 27 3 22 3 Z"
        fill="${inkColor}" />
</svg>`;

// Bei doppelter Auflösung rendern, weichzeichnen, dann auf Zielgröße
// verkleinern – ergibt weiche statt scharfe Kanten (passt zum Bildstil).
const hamzaBuffer = await sharp(Buffer.from(hamzaSvg))
  .blur(1.5)
  .resize({ width: 40, height: 50 })
  .png()
  .toBuffer();

// Zielposition: Unterkante des Hamza knapp über dem Alef-Strich zentriert
const hamzaLeft = 876;
const hamzaTop = 1004;

const base = sharp(input);
const meta = await base.metadata();

// 1. Klecks löschen (transparent machen)
const { data, info } = await base
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, channels } = info;

for (let y = eraseBox.top; y < eraseBox.top + eraseBox.height; y++) {
  for (let x = eraseBox.left; x < eraseBox.left + eraseBox.width; x++) {
    const idx = (y * width + x) * channels;
    data[idx + 3] = 0;
  }
}

// 2. Sauberes Hamza an der richtigen Stelle einfügen
await sharp(data, { raw: { width, height: info.height, channels } })
  .composite([{ input: hamzaBuffer, left: hamzaLeft, top: hamzaTop }])
  .png()
  .toFile(output);

console.log("Hamza korrigiert:", output);
