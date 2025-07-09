"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { IdCardDetails } from "@/types/idCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import idCardSvg from "@/lib/assets/Kerabari-id-card.svg";
import { PDFDocument, rgb } from "pdf-lib";
import { useState } from "react";
import React from "react";
import { api } from "@/trpc/react";
import { useIdCardStore } from "@/store/id-card-store";

const getBase64FromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface IdCardGeneratorProps {
  userId: string;
  className?: string;
}

export function IdCardGenerator({ userId, className }: IdCardGeneratorProps) {
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  // Get avatar URL directly
  const { data: avatarUrl } = api.enumerator.getAvatarUrl.useQuery(userId, {
    enabled: true,
    staleTime: Infinity, // Cache the URL indefinitely
  });

  // Get details from store with safe default
  const details = useIdCardStore((state) => state.details) || {
    nepaliName: null,
    nepaliAddress: null,
    nepaliPhone: null,
  };

  // Validate if all required fields are present with safe access
  const isValid = Boolean(
    details?.nepaliName && details?.nepaliAddress && details?.nepaliPhone,
  );

  const generateSvg = async () => {
    setIsPreviewLoading(true);
    if (!isValid || isGenerating || !details) return null;
    setIsGenerating(true);

    try {
      const response = await fetch(idCardSvg.src);
      if (!response.ok) throw new Error("Failed to load SVG template");

      let svgContent = await response.text();

      // Replace placeholders with actual data
      svgContent = svgContent.replace(/@नाम/g, details.nepaliName || "");
      svgContent = svgContent.replace(/@ठेगाना/g, details.nepaliAddress || "");
      svgContent = svgContent.replace(
        /@सम्पर्क नं\./g,
        details.nepaliPhone || "",
      );

      // Replace photo layer with avatar image if available
      if (avatarUrl) {
        try {
          const base64Image = await getBase64FromUrl(avatarUrl);
          const photoLayerRegex = /<rect[^>]*id="photo-layer"[^>]*\/>/;
          const imageElement = `<image id="photo-layer" x="114" y="179" width="135" height="155" href="${base64Image}" preserveAspectRatio="xMidYMid slice"/>`;
          svgContent = svgContent.replace(photoLayerRegex, imageElement);
        } catch (avatarErr) {
          console.error("Failed to load avatar:", avatarErr);
          // Continue without avatar if it fails to load
        }
      }

      // Create preview URL
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      setPreviewUrl(url);

      setIsPreviewLoading(false);
      return svgContent;
    } catch (err) {
      console.error("SVG generation error:", err);
      setError("Failed to generate ID card template");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate preview on mount and when details change
  React.useEffect(() => {
    generateSvg();
    return () => {
      // Cleanup preview URL when component unmounts
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [
    details.nepaliName,
    details.nepaliAddress,
    details.nepaliPhone,
    avatarUrl,
  ]);

  // Clean up URLs when component unmounts or key props change
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [
    avatarUrl,
    details.nepaliName,
    details.nepaliAddress,
    details.nepaliPhone,
  ]);

  const convertSvgToPng = async (svgString: string): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svg = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svg);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Increase canvas size for better quality (2x)
        canvas.width = 359 * 2;
        canvas.height = 493 * 2;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Enable high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Scale up the image for better quality
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to convert canvas to blob"));
              return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
              if (reader.result instanceof ArrayBuffer) {
                resolve(reader.result);
              } else {
                reject(new Error("Failed to convert blob to array buffer"));
              }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
            URL.revokeObjectURL(url);
          },
          "image/png",
          1.0, // Maximum quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load SVG"));
      };

      img.src = url;
    });
  };

  const handleDownload = async () => {
    try {
      if (!isValid) {
        setError("All fields must be filled to generate ID card");
        return;
      }

      const svg = await generateSvg();
      if (!svg) return;

      // Convert SVG to high-quality PNG
      const pngArrayBuffer = await convertSvgToPng(svg);

      // Create PDF document with higher DPI
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([359, 493]);

      // Embed PNG in PDF
      const pngImage = await pdfDoc.embedPng(pngArrayBuffer);
      const { width, height } = pngImage.scale(1);

      // Draw image maintaining aspect ratio and high quality
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
        opacity: 1,
      });

      // Save PDF with better compression
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: false,
      });

      // Save and download PDF
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `id-card-${details.nepaliName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);
      setError(null);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  if (!isValid) {
    return (
      <div className="p-4 bg-white rounded-lg">
        <Alert variant="destructive">
          <AlertDescription>
            Please fill in all Nepali details first to preview your ID card
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Your ID Card</h3>
          <Button
            onClick={handleDownload}
            className="gap-2"
            disabled={isPreviewLoading}
            size="sm"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="p-4">
        <div className="relative w-full rounded-lg overflow-hidden">
          {isPreviewLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground animate-pulse">
                  Updating preview...
                </p>
              </div>
            </div>
          )}
          <img
            src={previewUrl || idCardSvg.src}
            alt="ID Card Preview"
            className="w-full h-auto object-contain transition-opacity duration-300 rounded-lg"
            style={{
              maxHeight: "calc(100vh - 400px)",
              opacity: isPreviewLoading ? 0.5 : 1,
            }}
          />
        </div>
      </div>
    </div>
  );
}
