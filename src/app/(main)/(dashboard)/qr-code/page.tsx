"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Download, ScanBarcode, Share2 } from "lucide-react";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function QRCodePage() {
  const handleDownload = async () => {
    try {
      const response = await fetch("/images/enumerator-qr-code.png");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "enumerator-qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch("/images/enumerator-qr-code.png");
      const blob = await response.blob();
      const file = new File([blob], "enumerator-qr-code.png", {
        type: "image/png",
      });

      if (navigator.share) {
        await navigator.share({
          title: "Enumerator QR Code",
          text: "My enumerator QR code for survey identification",
          files: [file],
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "enumerator-qr-code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
    }
  };

  return (
    <ContentLayout title="QR Code">
      <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your Enumerator QR Code
          </h1>
          <p className="text-muted-foreground">
            Use this QR code to quickly identify yourself during the survey
            process
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <ScanBarcode className="h-5 w-5 text-primary" />
              <CardTitle>Digital Identity Card</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-8">
              {/* QR Code Container with fancy border */}
              <div className="relative p-1 rounded-2xl bg-gradient-to-r from-primary/20 via-primary to-primary/20">
                <div className="bg-white p-4 rounded-xl">
                  <div className="relative w-[280px] h-[280px]">
                    <Image
                      src="/images/enumerator-qr-code.png"
                      alt="Enumerator QR Code"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download QR
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share Code
                </Button>
              </div>

              {/* Instructions */}
              <div className="mt-6 rounded-lg bg-muted p-6 text-sm">
                <h3 className="font-semibold mb-3">How to use your QR code:</h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Keep this QR code readily accessible on your device</li>
                  <li>
                    Present it when requested by supervisors or team members
                  </li>
                  <li>
                    Use it to quickly validate your identity during field
                    surveys
                  </li>
                  <li>Download a copy for offline access</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Notice */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            🔒 This QR code is unique to you. Do not share it with unauthorized
            personnel.
          </p>
        </div>
      </div>
    </ContentLayout>
  );
}
