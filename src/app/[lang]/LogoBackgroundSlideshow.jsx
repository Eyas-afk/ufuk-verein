"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/hinterlogo/bg-1.jpeg",
  "/hinterlogo/bg-2.jpeg",
  "/hinterlogo/bg-3.jpeg",
  "/hinterlogo/bg-5.jpeg",
  "/hinterlogo/bg-6.jpeg",
];

function pickNext(current) {
  if (images.length <= 1) return 0;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * images.length);
  }
  return next;
}

export default function LogoBackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => pickNext(current));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? "animate-kenburns opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-white/35" />
    </div>
  );
}
