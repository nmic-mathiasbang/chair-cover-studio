"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export function StepLoading() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-[20px]">
      <Loader2 size={48} className="animate-spin text-[var(--primary)]" />
      <p className="ds-lead" style={{ color: "var(--ds-text-secondary)" }}>
        Generating your new furniture cover…
      </p>
      <p className="ds-caption" style={{ color: "var(--ds-text-tertiary)" }}>
        This may take up to a minute
      </p>
    </div>
  );
}
