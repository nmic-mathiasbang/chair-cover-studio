"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepFabric } from "../../components/step-fabric";
import { FlowShell } from "../../components/flow-shell";
import { useFlow } from "../../components/flow-provider";

export default function FabricPage() {
  const router = useRouter();
  const {
    furnitureFile,
    furniturePreviewUrl,
    selectedFabricId,
    setSelectedFabricId,
  } = useFlow();

  useEffect(() => {
    // Direct access guard: upload step must come first.
    if (!furnitureFile || !furniturePreviewUrl) {
      router.replace("/upload");
    }
  }, [furnitureFile, furniturePreviewUrl, router]);

  return (
    <FlowShell step={2}>
      <StepFabric
        furniturePreviewUrl={furniturePreviewUrl}
        selectedFabricId={selectedFabricId}
        onSelectFabric={setSelectedFabricId}
        onGenerate={() => router.push("/generating")}
        onBack={() => router.push("/upload")}
      />
    </FlowShell>
  );
}
