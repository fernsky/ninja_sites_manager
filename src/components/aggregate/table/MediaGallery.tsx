import React from "react";
import { CustomAudioPlayer } from "@/components/ui/audio-player";

type MediaItem = {
  url: string;
  type: "image" | "audio" | "video";
  label: string;
};

export function MediaGallery({ media }: { media: MediaItem[] }) {
  if (!media || media.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border rounded-md bg-muted/20">
        <p className="text-sm text-muted-foreground">No media available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {media.map((item, index) => (
        <div key={index} className="border rounded-md overflow-hidden bg-card">
          <div className="px-3 py-2 bg-muted/30 border-b">
            <h5 className="text-sm font-medium">{item.label}</h5>
          </div>

          <div className="p-2">
            {item.type === "image" && item.url && (
              <div className="flex justify-center">
                <img
                  src={item.url}
                  alt={item.label}
                  className="max-h-48 rounded object-contain"
                />
              </div>
            )}

            {item.type === "audio" && item.url && (
              <CustomAudioPlayer src={item.url} />
            )}

            {item.type === "video" && item.url && (
              <video controls className="w-full max-h-48">
                <source src={item.url} />
                Your browser does not support the video element.
              </video>
            )}

            {!item.url && (
              <div className="py-4 text-center text-muted-foreground text-sm">
                Media unavailable
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
