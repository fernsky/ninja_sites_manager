import { CustomAudioPlayer } from "../ui/audio-player";
import Image from "next/image";

interface FamilyMediaSectionProps {
  selfieUrl?: string;
  audioUrl?: string;
}

export function FamilyMediaSection({
  selfieUrl,
  audioUrl,
}: FamilyMediaSectionProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {selfieUrl && (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="border-b bg-muted/50 p-4">
            <h3 className="font-semibold">Enumerator Selfie</h3>
            <p className="text-xs text-muted-foreground">
              Photo taken during survey
            </p>
          </div>
          <div className="p-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border">
              <Image
                src={selfieUrl}
                alt="Enumerator Selfie"
                fill
                className="object-cover transition-all hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      )}

      {audioUrl && (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="border-b bg-muted/50 p-4">
            <h3 className="font-semibold">Survey Audio Recording</h3>
            <p className="text-xs text-muted-foreground">
              Audio monitoring of survey process
            </p>
          </div>
          <div className="p-4">
            <div className="rounded-lg border bg-card/50 p-4">
              <CustomAudioPlayer src={audioUrl} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
