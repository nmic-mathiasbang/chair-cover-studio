"use client";

import Image from "next/image";
import React, { ChangeEvent } from "react";
import { Camera, ImagePlus } from "lucide-react";

type UploadPanelProps = {
  furniturePreviewUrl: string | null;
  referencePreviewUrl: string | null;
  onFurnitureChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onReferenceChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function UploadPanel({
  furniturePreviewUrl,
  referencePreviewUrl,
  onFurnitureChange,
  onReferenceChange,
}: UploadPanelProps) {
  return (
    <div className="ds-card flex flex-col gap-[15px]">
      <div className="flex items-center gap-[10px]">
        <Camera size={20} className="text-[var(--primary)]" />
        <h2 className="text-[18px] font-semibold leading-[1.1] tracking-[-0.01em]">
          Upload your furniture
        </h2>
      </div>
      <p className="ds-caption" style={{ color: "var(--ds-text-secondary)" }}>
        Take a photo with your phone or select an existing image.
      </p>

      {/* Main furniture upload */}
      <div className="flex flex-col gap-[8px]">
        <label
          htmlFor="furnitureFile"
          className="ds-overline"
          style={{ color: "var(--ds-text-secondary)" }}
        >
          Chair / furniture image
        </label>
        <input
          id="furnitureFile"
          name="furnitureFile"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFurnitureChange}
          className="ds-input"
        />
      </div>

      {/* Optional reference upload */}
      <div className="flex flex-col gap-[8px]">
        <label
          htmlFor="referenceFile"
          className="ds-overline"
          style={{ color: "var(--ds-text-secondary)" }}
        >
          Custom fabric reference (optional)
        </label>
        <input
          id="referenceFile"
          name="referenceFile"
          type="file"
          accept="image/*"
          onChange={onReferenceChange}
          className="ds-input"
        />
      </div>

      {/* Preview grid */}
      {(furniturePreviewUrl || referencePreviewUrl) && (
        <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-2">
          {furniturePreviewUrl && (
            <div className="flex flex-col gap-[5px]">
              <span className="ds-overline" style={{ color: "var(--ds-text-tertiary)" }}>
                Furniture preview
              </span>
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--ds-border-base)]">
                <Image
                  src={furniturePreviewUrl}
                  alt="Furniture preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {referencePreviewUrl && (
            <div className="flex flex-col gap-[5px]">
              <span className="ds-overline" style={{ color: "var(--ds-text-tertiary)" }}>
                <ImagePlus size={12} className="mr-1 inline" />
                Reference preview
              </span>
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--ds-border-base)]">
                <Image
                  src={referencePreviewUrl}
                  alt="Fabric reference preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
