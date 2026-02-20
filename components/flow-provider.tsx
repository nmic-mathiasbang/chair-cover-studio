"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type FlowState = {
  furnitureFile: File | null;
  furniturePreviewUrl: string | null;
  selectedFabricId: string;
  originalImageUrl: string | null;
  generatedImageUrl: string | null;
  setFurniture: (file: File | null, previewUrl: string | null) => void;
  setSelectedFabricId: (id: string) => void;
  setResultImages: (originalUrl: string, generatedUrl: string) => void;
  clearResultImages: () => void;
  resetFlow: () => void;
};

const DEFAULT_FABRIC_ID = "anholt-02";

const FlowContext = createContext<FlowState | null>(null);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [furnitureFile, setFurnitureFile] = useState<File | null>(null);
  const [furniturePreviewUrl, setFurniturePreviewUrl] = useState<string | null>(
    null,
  );
  const [selectedFabricId, setSelectedFabricId] =
    useState<string>(DEFAULT_FABRIC_ID);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Keep a small helper to update upload state together.
  const setFurniture = (file: File | null, previewUrl: string | null) => {
    setFurnitureFile(file);
    setFurniturePreviewUrl(previewUrl);
  };

  const setResultImages = (originalUrl: string, generatedUrl: string) => {
    setOriginalImageUrl(originalUrl);
    setGeneratedImageUrl(generatedUrl);
  };

  const clearResultImages = () => {
    setOriginalImageUrl(null);
    setGeneratedImageUrl(null);
  };

  const resetFlow = () => {
    setFurnitureFile(null);
    setFurniturePreviewUrl(null);
    setSelectedFabricId(DEFAULT_FABRIC_ID);
    setOriginalImageUrl(null);
    setGeneratedImageUrl(null);
  };

  const value = useMemo(
    () => ({
      furnitureFile,
      furniturePreviewUrl,
      selectedFabricId,
      originalImageUrl,
      generatedImageUrl,
      setFurniture,
      setSelectedFabricId,
      setResultImages,
      clearResultImages,
      resetFlow,
    }),
    [
      furnitureFile,
      furniturePreviewUrl,
      selectedFabricId,
      originalImageUrl,
      generatedImageUrl,
    ],
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used inside FlowProvider");
  }
  return context;
}
