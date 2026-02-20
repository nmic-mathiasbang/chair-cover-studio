"use client";

import React, { ChangeEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StepUpload } from "../../components/step-upload";
import { FlowShell } from "../../components/flow-shell";
import { useFlow } from "../../components/flow-provider";
import { resizeImageFile } from "../../lib/client-resize";

const MAX_MAIN_FILE_SIZE = 10 * 1024 * 1024;

export default function UploadPage() {
  const router = useRouter();
  const { furniturePreviewUrl, setFurniture, clearResultImages } = useFlow();

  const handleFurnitureChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
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

      // Resize large photos client-side to stay within Vercel body limits.
      const resized = await resizeImageFile(file);

      clearResultImages();
      setFurniture(resized, URL.createObjectURL(resized));
    },
    [clearResultImages, setFurniture],
  );

  const handleContinue = useCallback(() => {
    if (!furniturePreviewUrl) return;
    router.push("/fabric");
  }, [furniturePreviewUrl, router]);

  return (
    <FlowShell step={1}>
      <StepUpload
        furniturePreviewUrl={furniturePreviewUrl}
        onFurnitureChange={handleFurnitureChange}
        onContinue={handleContinue}
      />
    </FlowShell>
  );
}
