"use client";

import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const clamp = (value: number) => Math.max(0, Math.min(100, value));

  const updatePosition = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setPosition(clamp(pct));
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isDraggingRef.current = true;
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition],
  );

  React.useEffect(() => {
    if (!isDraggingRef.current) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden border border-[var(--ds-border-base)]"
      style={{ aspectRatio: "2/3" }}
    >
      {/* Before — full background */}
      <div className="absolute inset-0">
        <Image
          src={beforeSrc}
          alt={beforeLabel}
          fill
          className="object-cover"
        />
      </div>

      {/* After — clipped to left portion by position */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={afterSrc}
          alt={afterLabel}
          fill
          className="object-cover"
        />
      </div>

      {/* Slider handle — draggable divider */}
      <div
        role="slider"
        tabIndex={0}
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Compare before and after. Position: ${Math.round(position)}%`}
        className="group absolute top-0 bottom-0 z-10 flex w-11 cursor-ew-resize items-center justify-center"
        style={{ left: `${position}%`, marginLeft: -22 }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className="absolute inset-y-0 w-[4px] bg-[var(--primary)] transition-colors duration-[60ms]"
          style={{ left: "50%", marginLeft: -2 }}
        />
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center border-2 border-[var(--primary)] bg-[var(--ds-surface-1)]"
          style={{ borderRadius: 0 }}
        >
          <ChevronsLeftRight size={16} />
        </div>
      </div>

      {/* Labels */}
      <span
        className="ds-overline absolute bottom-2 left-2 z-20 bg-black/60 px-2 py-1"
        style={{ color: "white" }}
      >
        {beforeLabel}
      </span>
      <span
        className="ds-overline absolute bottom-2 right-2 z-20 bg-black/60 px-2 py-1"
        style={{ color: "white" }}
      >
        {afterLabel}
      </span>
    </div>
  );
}
