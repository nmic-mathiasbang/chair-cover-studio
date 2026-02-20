"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FlowShell } from "../../components/flow-shell";
import { StepLoading } from "../../components/step-loading";
import { useFlow } from "../../components/flow-provider";

export default function GeneratingPage() {
  const router = useRouter();
  const { furnitureFile, selectedFabricId, setResultImages } = useFlow();

  useEffect(() => {
    let cancelled = false;

    async function runGeneration() {
      if (!furnitureFile) {
        router.replace("/upload");
        return;
      }

      try {
        const fd = new FormData();
        fd.set("furnitureFile", furnitureFile);
        fd.set("selectedFabricId", selectedFabricId);

        const res = await fetch("/api/generate", { method: "POST", body: fd });

        // Handle non-JSON error responses (e.g. Vercel 413 "Request Entity Too Large")
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(text || `Server error (${res.status})`);
        }

        const data = (await res.json()) as
          | { success: true; generatedImageUrl: string; originalImageUrl: string }
          | { success: false; error: string };

        if (!res.ok || !data.success) {
          throw new Error("error" in data ? data.error : "Generation failed.");
        }

        if (!cancelled) {
          setResultImages(data.originalImageUrl, data.generatedImageUrl);
          router.replace("/result");
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Unexpected error");
          router.replace("/fabric");
        }
      }
    }

    runGeneration();

    return () => {
      cancelled = true;
    };
  }, [furnitureFile, router, selectedFabricId, setResultImages]);

  return (
    <FlowShell step={3}>
      <StepLoading />
    </FlowShell>
  );
}
