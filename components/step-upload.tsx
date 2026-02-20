"use client";

import Image from "next/image";
import React, { ChangeEvent } from "react";
import { Camera, Loader2 } from "lucide-react";

type StepUploadProps = {
  furniturePreviewUrl: string | null;
  onFurnitureChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
  /** Show a spinner on the Continue button while the image is being processed */
  uploading?: boolean;
};

export function StepUpload({
  furniturePreviewUrl,
  onFurnitureChange,
  onContinue,
  uploading = false,
}: StepUploadProps) {
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

      <div className="flex flex-col gap-[8px]">
        <span
          className="ds-overline"
          style={{ color: "var(--ds-text-secondary)" }}
        >
          Chair / furniture image
        </span>

        <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
          <label
            htmlFor="furnitureCameraFile"
            className="ds-btn ds-btn-secondary cursor-pointer text-center"
          >
            Take photo
          </label>
          <label
            htmlFor="furnitureLibraryFile"
            className="ds-btn ds-btn-secondary cursor-pointer text-center"
          >
            Choose from photos
          </label>
        </div>

        <input
          id="furnitureCameraFile"
          name="furnitureCameraFile"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFurnitureChange}
          className="hidden"
        />
        <input
          id="furnitureLibraryFile"
          name="furnitureLibraryFile"
          type="file"
          accept="image/*"
          onChange={onFurnitureChange}
          className="hidden"
        />
      </div>

      {furniturePreviewUrl && (
        <div className="flex flex-col gap-[5px]">
          <span className="ds-overline" style={{ color: "var(--ds-text-tertiary)" }}>
            Preview
          </span>
          <div className="relative w-full overflow-hidden border border-[var(--ds-border-base)]" style={{ aspectRatio: "2/3" }}>
            <Image
              src={furniturePreviewUrl}
              alt="Furniture preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onContinue}
        disabled={!furniturePreviewUrl || uploading}
        className="ds-btn ds-btn-primary mt-[10px] w-full"
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-[8px]">
            <Loader2 size={16} className="animate-spin" />
            Processing…
          </span>
        ) : (
          "Continue"
        )}
      </button>
    </div>
  );
}
