"use client";

import Image from "next/image";
import React from "react";
import { Download, RotateCcw, Sparkles } from "lucide-react";
import { BeforeAfterSlider } from "./before-after-slider";

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

        {hasBoth ? (
          <div className="flex flex-col gap-[10px]">
            <span className="ds-overline" style={{ color: "var(--ds-text-tertiary)" }}>
              Drag the slider to compare before and after (2:3)
            </span>
            <BeforeAfterSlider
              beforeSrc={originalImageUrl}
              afterSrc={generatedImageUrl}
              beforeLabel="Original"
              afterLabel="Generated"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-2">
            {originalImageUrl && (
              <div className="flex flex-col gap-[5px]">
                <span className="ds-overline" style={{ color: "var(--ds-text-tertiary)" }}>
                  Original
                </span>
                <div
                  className="relative w-full overflow-hidden border border-[var(--ds-border-base)]"
                  style={{ aspectRatio: "2/3" }}
                >
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
                <div
                  className="relative w-full overflow-hidden border border-[var(--ds-border-base)]"
                  style={{ aspectRatio: "2/3" }}
                >
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
