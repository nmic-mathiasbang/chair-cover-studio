"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type FlowState = {
  furnitureFile: File | null;
  furniturePreviewUrl: string | null;
  selectedFabricId: string;
  originalImageUrl: string | null;
  generatedImageUrl: string | null;
  setFurniture: (file: File | null, previewUrl: string | null) => void;
  setSelectedFabricId: (id: string) => void;
  setOriginalImageUrl: (url: string) => void;
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
  const [originalImageUrl, setOriginalImageUrlState] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Stable function references — React state setters are stable, so useCallback
  // with empty deps produces refs that never change between renders.
  const setFurniture = useCallback(
    (file: File | null, previewUrl: string | null) => {
      setFurnitureFile(file);
      setFurniturePreviewUrl(previewUrl);
    },
    [],
  );

  const setOriginalImageUrl = useCallback((url: string) => {
    setOriginalImageUrlState(url);
  }, []);

  const setResultImages = useCallback(
    (originalUrl: string, generatedUrl: string) => {
      setOriginalImageUrlState(originalUrl);
      setGeneratedImageUrl(generatedUrl);
    },
    [],
  );

  const clearResultImages = useCallback(() => {
    setOriginalImageUrlState(null);
    setGeneratedImageUrl(null);
  }, []);

  const resetFlow = useCallback(() => {
    setFurnitureFile(null);
    setFurniturePreviewUrl(null);
    setSelectedFabricId(DEFAULT_FABRIC_ID);
    setOriginalImageUrlState(null);
    setGeneratedImageUrl(null);
  }, []);

  const value = useMemo(
    () => ({
      furnitureFile,
      furniturePreviewUrl,
      selectedFabricId,
      originalImageUrl,
      generatedImageUrl,
      setFurniture,
      setSelectedFabricId,
      setOriginalImageUrl,
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
      setFurniture,
      setOriginalImageUrl,
      setResultImages,
      clearResultImages,
      resetFlow,
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
