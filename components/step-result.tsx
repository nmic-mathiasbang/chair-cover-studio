"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Download, RotateCcw, Sparkles } from "lucide-react";

type StepResultProps = {
  originalImageUrl: string | null;
  generatedImageUrl: string | null;
  onTryAgain: () => void;
};

export function StepResult({
  originalImageUrl,
  generatedImageUrl,
  onTryAgain,
}: StepResultProps) {
  const [showingAfter, setShowingAfter] = useState(true);
  const hasBoth = originalImageUrl && generatedImageUrl;

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="ds-card flex flex-col gap-[15px]">
        <div className="flex items-center gap-[10px]">
          <Sparkles size={20} className="text-[var(--primary)]" />
          <h2 className="text-[18px] font-semibold leading-[1.1] tracking-[-0.01em]">
            Your result
          </h2>
        </div>
        <p className="ds-caption" style={{ color: "var(--ds-text-secondary)" }}>
          Download your AI-generated furniture preview or try again with different fabric.
        </p>

        <div className="flex flex-col gap-[10px]">
          {hasBoth && (
            <div className="flex gap-0" style={{ borderBottom: "1px solid var(--ds-border-divider)" }}>
              <button
                type="button"
                onClick={() => setShowingAfter(false)}
                className="ds-overline px-[20px] py-[10px] transition-colors duration-[60ms]"
                style={{
                  color: !showingAfter ? "var(--primary)" : "var(--ds-text-tertiary)",
                  borderBottom: !showingAfter ? "2px solid var(--primary)" : "2px solid transparent",
                  background: "transparent",
                }}
              >
                Before
              </button>
              <button
                type="button"
                onClick={() => setShowingAfter(true)}
                className="ds-overline px-[20px] py-[10px] transition-colors duration-[60ms]"
                style={{
                  color: showingAfter ? "var(--primary)" : "var(--ds-text-tertiary)",
                  borderBottom: showingAfter ? "2px solid var(--primary)" : "2px solid transparent",
                  background: "transparent",
                }}
              >
                After
              </button>
            </div>
          )}

          <div
            className="relative w-full overflow-hidden border border-[var(--ds-border-base)]"
            style={{ aspectRatio: "2/3" }}
          >
            {originalImageUrl && (!showingAfter || !generatedImageUrl) && (
              <Image
                src={originalImageUrl}
                alt="Original upload"
                fill
                className="object-cover"
              />
            )}
            {generatedImageUrl && (showingAfter || !originalImageUrl) && (
              <Image
                src={generatedImageUrl}
                alt="Generated cover"
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-[10px] pt-[10px]">
          <button type="button" onClick={onTryAgain} className="ds-btn ds-btn-secondary">
            <RotateCcw size={16} />
            Try again
          </button>
          <a
            href={generatedImageUrl ?? "#"}
            download
            className="ds-btn ds-btn-primary"
            style={{
              pointerEvents: !generatedImageUrl ? "none" : "auto",
              opacity: !generatedImageUrl ? 0.4 : 1,
            }}
          >
            <Download size={16} />
            Download image
          </a>
        </div>
      </div>
    </div>
  );
}
