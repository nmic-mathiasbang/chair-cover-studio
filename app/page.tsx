"use client";

import React, { ChangeEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { StepUpload } from "../components/step-upload";
import { StepFabric } from "../components/step-fabric";
import { StepLoading } from "../components/step-loading";
import { StepResult } from "../components/step-result";

const MAX_MAIN_FILE_SIZE = 10 * 1024 * 1024;
const MAX_REF_FILE_SIZE = 5 * 1024 * 1024;
const STEPS = ["Upload", "Fabric", "Generating", "Result"] as const;
type Step = 1 | 2 | 3 | 4;

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [furnitureFile, setFurnitureFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [selectedFabricId, setSelectedFabricId] = useState("anholt-02");
  const [furniturePreviewUrl, setFurniturePreviewUrl] = useState<string | null>(null);
  const [referencePreviewUrl, setReferencePreviewUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleFurnitureChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Upload a valid image file.");
      return;
    }
    if (file.size > MAX_MAIN_FILE_SIZE) {
      toast.error("Image must be 10 MB or less.");
      return;
    }
    setFurnitureFile(file);
    setFurniturePreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleReferenceChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setReferenceFile(null);
      setReferencePreviewUrl(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Reference must be an image.");
      return;
    }
    if (file.size > MAX_REF_FILE_SIZE) {
      toast.error("Reference must be 5 MB or less.");
      return;
    }
    setReferenceFile(file);
    setReferencePreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleContinueFromUpload = useCallback(() => {
    setStep(2);
  }, []);

  const handleBackFromFabric = useCallback(() => {
    setStep(1);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!furnitureFile) return;
    if (!selectedFabricId && !referenceFile) {
      toast.error("Pick a fabric swatch or upload a reference image.");
      return;
    }

    setStep(3);

    try {
      const fd = new FormData();
      fd.set("furnitureFile", furnitureFile);
      fd.set("selectedFabricId", selectedFabricId);
      if (referenceFile) fd.set("referenceFile", referenceFile);

      const res = await fetch("/api/generate", { method: "POST", body: fd });
      const data = (await res.json()) as
        | { success: true; generatedImageUrl: string; originalImageUrl: string }
        | { success: false; error: string };

      if (!res.ok || !data.success) {
        throw new Error("error" in data ? data.error : "Generation failed.");
      }

      setGeneratedImageUrl(data.generatedImageUrl);
      setOriginalImageUrl(data.originalImageUrl);
      setStep(4);
      toast.success("New cover generated successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
      setStep(2);
    }
  }, [furnitureFile, referenceFile, selectedFabricId]);

  const handleTryAgain = useCallback(() => {
    setStep(1);
    setFurnitureFile(null);
    setReferenceFile(null);
    setFurniturePreviewUrl(null);
    setReferencePreviewUrl(null);
    setOriginalImageUrl(null);
    setGeneratedImageUrl(null);
  }, []);

  return (
    <div
      className="mx-auto flex min-h-screen w-full flex-col"
      style={{ maxWidth: 1280, padding: "0 20px" }}
    >
      {/* Header */}
      <header
        className="flex flex-col gap-[5px]"
        style={{ paddingTop: 60, paddingBottom: 30 }}
      >
        <h1 className="ds-title">Chair Cover Studio</h1>
        <p className="ds-lead" style={{ color: "var(--ds-text-secondary)" }}>
          Upload your furniture, pick a new fabric, and let AI visualize the result.
        </p>
      </header>

      {/* Step indicator */}
      <div
        className="flex items-center gap-[8px]"
        style={{ marginBottom: 30 }}
      >
        {STEPS.map((label, i) => {
          const stepNum = (i + 1) as Step;
          const isActive = step === stepNum;
          const isPast = step > stepNum;
          return (
            <React.Fragment key={label}>
              <span
                className="ds-overline transition-opacity duration-[60ms]"
                style={{
                  color: isActive || isPast ? "var(--primary)" : "var(--ds-text-tertiary)",
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

      {/* Step content */}
      <main style={{ paddingBottom: 60 }}>
        {step === 1 && (
          <StepUpload
            furniturePreviewUrl={furniturePreviewUrl}
            onFurnitureChange={handleFurnitureChange}
            onContinue={handleContinueFromUpload}
          />
        )}

        {step === 2 && (
          <StepFabric
            furniturePreviewUrl={furniturePreviewUrl}
            referencePreviewUrl={referencePreviewUrl}
            selectedFabricId={selectedFabricId}
            onSelectFabric={setSelectedFabricId}
            onReferenceChange={handleReferenceChange}
            onGenerate={handleGenerate}
            onBack={handleBackFromFabric}
          />
        )}

        {step === 3 && <StepLoading />}

        {step === 4 && (
          <StepResult
            originalImageUrl={originalImageUrl}
            generatedImageUrl={generatedImageUrl}
            onTryAgain={handleTryAgain}
          />
        )}
      </main>
    </div>
  );
}
