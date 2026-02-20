"use client";

import React from "react";
import Image from "next/image";
import { Palette } from "lucide-react";
import { FABRIC_OPTIONS } from "../lib/fabrics";

type FabricPickerProps = {
  selectedFabricId: string;
  onSelect: (fabricId: string) => void;
};

export function FabricPicker({ selectedFabricId, onSelect }: FabricPickerProps) {
  return (
    <div className="ds-card flex flex-col gap-[15px]">
      <div className="flex items-center gap-[10px]">
        <Palette size={20} className="text-[var(--primary)]" />
        <h2 className="text-[18px] font-semibold leading-[1.1] tracking-[-0.01em]">
          Choose a fabric
        </h2>
      </div>
      <p className="ds-caption" style={{ color: "var(--ds-text-secondary)" }}>
        Select one of the preset swatches below.
      </p>

      <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3">
        {FABRIC_OPTIONS.map((fabric) => {
          const isSelected = selectedFabricId === fabric.id;
          return (
            <button
              key={fabric.id}
              type="button"
              onClick={() => onSelect(fabric.id)}
              className="group flex flex-col gap-[8px] p-[10px] text-left outline-none transition-[border-color,transform] duration-[60ms]"
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
    </div>
  );
}
