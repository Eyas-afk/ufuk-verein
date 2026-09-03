"use client";

import { motion } from "framer-motion";

// Anteilige Bereiche innerhalb von logo-transparent.png (1374x1656px),
// als Prozent-Werte für clip-path: inset(oben rechts unten links)
const BANDS = {
  sun: { top: 0, bottom: 54.1 },
  book: { top: 42.3, bottom: 40.2 },
  arabic: { top: 58.0, bottom: 22.7 },
  latin: { top: 76.7, bottom: 0 },
};

function clipFor(band) {
  return `inset(${band.top}% 0% ${band.bottom}% 0%)`;
}

const layerBase = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

export default function LogoIntro() {
  return (
    <div
      className="relative mx-auto aspect-[1374/1656] w-48 rounded-3xl p-4 sm:w-56"
      style={{ backgroundColor: "#f5f0e1" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/logo-transparent.png"
        alt=""
        style={{ ...layerBase, clipPath: clipFor(BANDS.sun) }}
        initial={{ opacity: 0, y: 30, scale: 0.7 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/logo-transparent.png"
        alt=""
        style={{ ...layerBase, clipPath: clipFor(BANDS.book), transformOrigin: "bottom center" }}
        initial={{ opacity: 0, scaleY: 0.12 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/logo-transparent.png"
        alt=""
        style={{ ...layerBase, clipPath: clipFor(BANDS.arabic) }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.15, ease: "easeOut" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/logo-transparent.png"
        alt="Ufuk e.V. / أفق"
        style={{ ...layerBase, clipPath: clipFor(BANDS.latin) }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.35, ease: "easeOut" }}
      />
    </div>
  );
}
