"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface StepLoadingProps {
  /** Optional status message shown below the spinner */
  status?: string;
}

export function StepLoading({ status }: StepLoadingProps) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-[20px]">
      <Loader2 size={48} className="animate-spin text-[var(--primary)]" />
      <p className="ds-lead" style={{ color: "var(--ds-text-secondary)" }}>
        {status || "Generating your new furniture cover…"}
      </p>
      <p className="ds-caption" style={{ color: "var(--ds-text-tertiary)" }}>
        This may take up to a minute
      </p>
    </div>
  );
}
