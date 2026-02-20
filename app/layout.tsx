import type { Metadata } from "next";
import React from "react";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";
import { FlowProvider } from "../components/flow-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Chair Cover Studio",
  description: "AI-powered furniture fabric preview tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <FlowProvider>{children}</FlowProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
