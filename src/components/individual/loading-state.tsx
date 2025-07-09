import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Skeleton className="h-[120px] w-full" />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[100px]" />
        ))}
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  );
}
