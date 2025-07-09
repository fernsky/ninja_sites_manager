import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomAudioPlayer } from "@/components/ui/audio-player";

type MediaItem = {
  url: string;
  type: "image" | "audio" | "video";
  label: string;
};

export function HouseholdMedia({ media }: { media: MediaItem[] }) {
  if (!media || media.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 bg-muted/20 rounded-md">
            <p className="text-sm text-muted-foreground">No media available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  console.log("HouseholdMedia", media);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {media.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="text-xs text-muted-foreground">{item.label}</div>
            {item.type === "image" && item.url ? (
              <div className="rounded-md overflow-hidden border">
                <img
                  src={item.url}
                  alt={item.label}
                  className="w-full object-contain max-h-[150px]"
                />
              </div>
            ) : item.type === "audio" && item.url ? (
              <CustomAudioPlayer src={item.url} />
            ) : (
              <div className="flex items-center justify-center h-20 bg-muted/20 rounded-md border">
                <p className="text-sm text-muted-foreground">
                  Media unavailable
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
