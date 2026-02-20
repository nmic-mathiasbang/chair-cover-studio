"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepFabric } from "../../components/step-fabric";
import { FlowShell } from "../../components/flow-shell";
import { useFlow } from "../../components/flow-provider";

export default function FabricPage() {
  const router = useRouter();
  const { originalImageUrl, selectedFabricId, setSelectedFabricId } = useFlow();

  useEffect(() => {
    // Guard: the image must have been uploaded and processed first
    if (!originalImageUrl) {
      router.replace("/upload");
    }
  }, [originalImageUrl, router]);

  return (
    <FlowShell step={2}>
      <StepFabric
        selectedFabricId={selectedFabricId}
        onSelectFabric={setSelectedFabricId}
        onGenerate={() => router.push("/generating")}
        onBack={() => router.push("/upload")}
      />
    </FlowShell>
  );
}
