"use client";

import Image from "next/image";
import React from "react";
import { Download, RotateCcw, Sparkles } from "lucide-react";

type ResultPanelProps = {
  originalImageUrl: string | null;
  generatedImageUrl: string | null;
  isLoading: boolean;
  onReset: () => void;
};

export function ResultPanel({
  originalImageUrl,
  generatedImageUrl,
  isLoading,
  onReset,
}: ResultPanelProps) {
  const hasResult = originalImageUrl || generatedImageUrl;

  return (
    <div className="ds-card flex flex-col gap-[15px]">
      <div className="flex items-center gap-[10px]">
        <Sparkles size={20} className="text-[var(--primary)]" />
        <h2 className="text-[18px] font-semibold leading-[1.1] tracking-[-0.01em]">
          Result
        </h2>
      </div>
      <p className="ds-caption" style={{ color: "var(--ds-text-secondary)" }}>
        Your AI-generated furniture preview will appear here.
      </p>

      {hasResult && (
        <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-2">
          {originalImageUrl && (
            <div className="flex flex-col gap-[5px]">
              <span className="ds-overline" style={{ color: "var(--ds-text-tertiary)" }}>
                Original
              </span>
              <div className="relative aspect-square w-full overflow-hidden border border-[var(--ds-border-base)]">
                <Image
                  src={originalImageUrl}
                  alt="Original upload"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {generatedImageUrl && (
            <div className="flex flex-col gap-[5px]">
              <span className="ds-overline" style={{ color: "var(--ds-text-tertiary)" }}>
                Generated
              </span>
              <div className="relative aspect-square w-full overflow-hidden border border-[var(--ds-border-base)]">
                <Image
                  src={generatedImageUrl}
                  alt="Generated cover"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-[10px]">
        <button
          type="button"
          onClick={onReset}
          className="ds-btn ds-btn-secondary"
        >
          <RotateCcw size={16} />
          Generate again
        </button>
        <a
          href={generatedImageUrl ?? "#"}
          download
          className="ds-btn ds-btn-primary"
          aria-disabled={!generatedImageUrl || isLoading}
          style={{
            pointerEvents: !generatedImageUrl || isLoading ? "none" : "auto",
            opacity: !generatedImageUrl || isLoading ? 0.4 : 1,
          }}
        >
          <Download size={16} />
          Download image
        </a>
      </div>
    </div>
  );
}
