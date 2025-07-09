import Image from "next/image";

interface BuildingMediaSectionProps {
  selfieUrl?: string;
  compact?: boolean;
}

export function BuildingMediaSection({
  selfieUrl,
  compact = false,
}: BuildingMediaSectionProps) {
  if (!selfieUrl) return null;

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden flex flex-col h-full">
      <div className="border-b bg-muted/50 px-3 py-2">
        <h3 className="text-sm font-medium">Enumerator Selfie</h3>
      </div>
      <div className="flex-1 p-3">
        <div className="relative w-full h-full min-h-[200px] md:min-h-0 overflow-hidden rounded-md border">
          <Image
            src={selfieUrl}
            alt="Enumerator Selfie"
            fill
            className="object-cover transition-all hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      </div>
    </div>
  );
}
