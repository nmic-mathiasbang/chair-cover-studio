"use client";

import React, { ChangeEvent, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StepUpload } from "../../components/step-upload";
import { FlowShell } from "../../components/flow-shell";
import { useFlow } from "../../components/flow-provider";
import { resizeImageFile } from "../../lib/client-resize";

const MAX_MAIN_FILE_SIZE = 10 * 1024 * 1024;

export default function UploadPage() {
  const router = useRouter();
  const {
    furnitureFile,
    furniturePreviewUrl,
    setFurniture,
    setOriginalImageUrl,
    clearResultImages,
  } = useFlow();
  const [uploading, setUploading] = useState(false);

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

      const resized = await resizeImageFile(file);

      clearResultImages();
      setFurniture(resized, URL.createObjectURL(resized));
    },
    [clearResultImages, setFurniture],
  );

  // Upload, crop, and persist the image when user clicks Continue
  const handleContinue = useCallback(async () => {
    if (!furnitureFile) return;
    setUploading(true);

    try {
      const fd = new FormData();
      fd.set("furnitureFile", furnitureFile);

      const res = await fetch("/api/upload", { method: "POST", body: fd });

      const ct = res.headers.get("content-type") ?? "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(text || `Upload error (${res.status})`);
      }

      const data = (await res.json()) as
        | { success: true; originalImageUrl: string }
        | { success: false; error: string };

      if (!res.ok || !data.success) {
        throw new Error("error" in data ? data.error : "Upload failed.");
      }

      setOriginalImageUrl(data.originalImageUrl);
      router.push("/fabric");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }, [furnitureFile, router, setOriginalImageUrl]);

  return (
    <FlowShell step={1}>
      <StepUpload
        furniturePreviewUrl={furniturePreviewUrl}
        onFurnitureChange={handleFurnitureChange}
        onContinue={handleContinue}
        uploading={uploading}
      />
    </FlowShell>
  );
}
