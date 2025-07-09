import Image from "next/image";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface BusinessMediaSectionProps {
  selfieUrl?: string;
  audioUrl?: string;
}

export function BusinessMediaSection({
  selfieUrl,
  audioUrl,
}: BusinessMediaSectionProps) {
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
            <div className="rounded-lg border bg-card/50 p-3">
              <AudioPlayer
                src={audioUrl}
                autoPlayAfterSrcChange={false}
                customProgressBarSection={[
                  RHAP_UI.CURRENT_TIME,
                  RHAP_UI.PROGRESS_BAR,
                  RHAP_UI.DURATION,
                ]}
                customControlsSection={[RHAP_UI.MAIN_CONTROLS, RHAP_UI.VOLUME]}
                style={{
                  background: "transparent",
                  boxShadow: "none",
                }}
                className="[&_.rhap_progress-section]:!mx-4 [&_.rhap_controls-section]:!mx-4 [&_.rhap_main-controls-button]:!text-primary [&_.rhap_progress-bar]:!bg-primary/20 [&_.rhap_progress-filled]:!bg-primary [&_.rhap_progress-indicator]:!bg-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
