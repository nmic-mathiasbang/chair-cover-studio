"use client";

import Image from "next/image";
import React, { ChangeEvent } from "react";
import { Palette } from "lucide-react";
import { FABRIC_OPTIONS } from "../lib/fabrics";

type StepFabricProps = {
  furniturePreviewUrl: string | null;
  referencePreviewUrl: string | null;
  selectedFabricId: string;
  onSelectFabric: (id: string) => void;
  onReferenceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
  onBack: () => void;
};

export function StepFabric({
  furniturePreviewUrl,
  referencePreviewUrl,
  selectedFabricId,
  onSelectFabric,
  onReferenceChange,
  onGenerate,
  onBack,
}: StepFabricProps) {
  return (
    <div className="flex flex-col gap-[20px]">
      {/* Preview of uploaded furniture */}
      {furniturePreviewUrl && (
        <div className="ds-card flex flex-col gap-[8px]">
          <span className="ds-overline" style={{ color: "var(--ds-text-tertiary)" }}>
            Your furniture
          </span>
          <div className="relative w-full overflow-hidden border border-[var(--ds-border-base)]" style={{ aspectRatio: "2/3" }}>
            <Image
              src={furniturePreviewUrl}
              alt="Furniture"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Fabric picker */}
      <div className="ds-card flex flex-col gap-[15px]">
        <div className="flex items-center gap-[10px]">
          <Palette size={20} className="text-[var(--primary)]" />
          <h2 className="text-[18px] font-semibold leading-[1.1] tracking-[-0.01em]">
            Choose a fabric
          </h2>
        </div>
        <p className="ds-caption" style={{ color: "var(--ds-text-secondary)" }}>
          Pick a preset swatch or upload your own fabric reference.
        </p>

        <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3">
          {FABRIC_OPTIONS.map((fabric) => {
            const isSelected = selectedFabricId === fabric.id;
            return (
              <button
                key={fabric.id}
                type="button"
                onClick={() => onSelectFabric(fabric.id)}
                className="flex flex-col gap-[8px] p-[10px] text-left outline-none transition-[border-color] duration-[60ms]"
                style={{
                  background: "var(--ds-surface-2)",
                  border: isSelected
                    ? "2px solid var(--primary)"
                    : "1px solid var(--ds-border-base)",
                  borderRadius: 0,
                }}
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={fabric.swatchPath}
                    alt={fabric.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span
                  className="ds-caption font-medium"
                  style={{ color: "var(--ds-text-primary)" }}
                >
                  {fabric.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="referenceFile"
            className="ds-overline"
            style={{ color: "var(--ds-text-secondary)" }}
          >
            Or upload custom fabric reference
          </label>
          <input
            id="referenceFile"
            name="referenceFile"
            type="file"
            accept="image/*"
            onChange={onReferenceChange}
            className="ds-input"
          />
          {referencePreviewUrl && (
            <div className="relative mt-[5px] aspect-[4/3] w-full max-w-[200px] overflow-hidden border border-[var(--ds-border-base)]">
              <Image
                src={referencePreviewUrl}
                alt="Custom reference"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-[10px]">
        <button type="button" onClick={onBack} className="ds-btn ds-btn-secondary">
          Back
        </button>
        <button type="button" onClick={onGenerate} className="ds-btn ds-btn-primary">
          Generate
        </button>
      </div>
    </div>
  );
}
