"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FlowShell } from "../../components/flow-shell";
import { StepResult } from "../../components/step-result";
import { useFlow } from "../../components/flow-provider";

export default function ResultPage() {
  const router = useRouter();
  const { originalImageUrl, generatedImageUrl, resetFlow } = useFlow();

  useEffect(() => {
    // Direct access guard: require generated output first.
    if (!generatedImageUrl) {
      router.replace("/upload");
    }
  }, [generatedImageUrl, router]);

  return (
    <FlowShell step={4}>
      <StepResult
        originalImageUrl={originalImageUrl}
        generatedImageUrl={generatedImageUrl}
        onTryAgain={() => {
          resetFlow();
          router.push("/upload");
        }}
      />
    </FlowShell>
  );
}
