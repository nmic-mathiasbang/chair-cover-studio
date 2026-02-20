"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FlowShell } from "../../components/flow-shell";
import { StepLoading } from "../../components/step-loading";
import { useFlow } from "../../components/flow-provider";

export default function GeneratingPage() {
  const router = useRouter();
  const { originalImageUrl, selectedFabricId, setResultImages } = useFlow();

  useEffect(() => {
    // Abort in-flight request when leaving the page or when React Strict Mode
    // re-runs effects during development.
    const controller = new AbortController();

    async function runGeneration() {
      // Guard: the image must already be uploaded
      if (!originalImageUrl) {
        router.replace("/upload");
        return;
      }

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ originalImageUrl, selectedFabricId }),
        });

        const ct = res.headers.get("content-type") ?? "";
        if (!ct.includes("application/json")) {
          const text = await res.text();
          throw new Error(text || `Server error (${res.status})`);
        }

        const data = (await res.json()) as
          | {
              success: true;
              generatedImageUrl: string;
              originalImageUrl: string;
            }
          | { success: false; error: string };

        if (!res.ok || !data.success) {
          throw new Error(
            "error" in data ? data.error : "Generation failed.",
          );
        }

        setResultImages(data.originalImageUrl, data.generatedImageUrl);
        router.replace("/result");
      } catch (err) {
        // Ignore intentional aborts during cleanup.
        if (err instanceof Error && err.name === "AbortError") return;
        toast.error(err instanceof Error ? err.message : "Unexpected error");
        router.replace("/fabric");
      }
    }

    runGeneration();

    return () => {
      controller.abort();
    };
  }, [originalImageUrl, router, selectedFabricId, setResultImages]);

  return (
    <FlowShell step={3}>
      <StepLoading />
    </FlowShell>
  );
}
