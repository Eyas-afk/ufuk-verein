"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function EventsCarousel({ events }) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function updateActiveIndex() {
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(itemCenter - containerCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateActiveIndex();
          ticking = false;
        });
      }
    }

    function pause() {
      pausedRef.current = true;
    }
    function resume() {
      pausedRef.current = false;
    }

    updateActiveIndex();
    container.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("pointerdown", pause);
    container.addEventListener("pointerup", resume);
    container.addEventListener("pointercancel", resume);
    return () => {
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("pointerdown", pause);
      container.removeEventListener("pointerup", resume);
      container.removeEventListener("pointercancel", resume);
    };
  }, []);

  function scrollToIndex(index) {
    const container = containerRef.current;
    const item = itemRefs.current[index];
    if (!container || !item) return;
    container.scrollTo({
      left: item.offsetLeft - (container.clientWidth - item.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      scrollToIndex((activeIndex + 1) % events.length);
    }, 4000);
    return () => clearInterval(id);
  }, [activeIndex, events.length]);

  return (
    <div>
      <div
        ref={containerRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-8rem)] py-4 sm:px-[calc(50%-9rem)]"
      >
        {events.map((event, index) => (
          <div
            key={event.image}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={`w-64 shrink-0 snap-center transition-all duration-300 sm:w-72 ${
              index === activeIndex ? "scale-100 opacity-100 blur-none" : "scale-90 opacity-50 blur-[1px]"
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-md">
              <Image
                src={event.image}
                alt={event.caption}
                fill
                sizes="288px"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center text-sm font-medium text-neutral-700">
              {event.caption}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-center gap-2">
        {events.map((event, index) => (
          <button
            key={event.image}
            type="button"
            onClick={() => scrollToIndex(index)}
            aria-label={event.caption}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === activeIndex ? "bg-orange-600" : "bg-neutral-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
