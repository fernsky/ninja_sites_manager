import { Skeleton } from "@/components/ui/skeleton";

export function BuildingLoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-[400px] rounded-lg" />
    </div>
  );
}

export function BusinessLoadingState() {
  return (
    <div className="space-y-6">
      {/* Stats Skeletons */}
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>

      {/* Action Bar Skeleton */}
      <Skeleton className="h-16" />

      {/* Image Skeleton */}
      <Skeleton className="aspect-video w-full" />

      {/* Info Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    </div>
  );
}
