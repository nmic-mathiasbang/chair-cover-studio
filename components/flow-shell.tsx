"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

type FlowStep = 1 | 2 | 3 | 4;

const STEPS = ["Upload", "Fabric", "Generating", "Result"] as const;

export function FlowShell({
  step,
  children,
}: {
  step: FlowStep;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mx-auto flex min-h-screen w-full flex-col"
      style={{ maxWidth: 1280, padding: "0 20px" }}
    >
      {/* Shared header for all step pages */}
      <header
        className="flex flex-col gap-[5px]"
        style={{ paddingTop: 60, paddingBottom: 30 }}
      >
        <h1 className="ds-title">Chair Cover Studio</h1>
        <p className="ds-lead" style={{ color: "var(--ds-text-secondary)" }}>
          Upload your furniture, pick a new fabric, and let AI visualize the
          result.
        </p>
      </header>

      {/* Shared progress indicator */}
      <div className="flex items-center gap-[8px]" style={{ marginBottom: 30 }}>
        {STEPS.map((label, i) => {
          const stepNum = (i + 1) as FlowStep;
          const isActive = step === stepNum;
          const isPast = step > stepNum;
          return (
            <React.Fragment key={label}>
              <span
                className="ds-overline transition-opacity duration-[60ms]"
                style={{
                  color:
                    isActive || isPast
                      ? "var(--primary)"
                      : "var(--ds-text-tertiary)",
                  opacity: isActive ? 1 : isPast ? 0.7 : 0.5,
                }}
              >
                {stepNum}. {label}
              </span>
              {i < STEPS.length - 1 && (
                <ChevronRight
                  size={14}
                  className="text-[var(--ds-text-tertiary)]"
                  style={{ opacity: 0.6 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <main style={{ paddingBottom: 60 }}>{children}</main>
    </div>
  );
}
