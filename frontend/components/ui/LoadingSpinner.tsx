import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="space-y-3 p-1">
      <Skeleton className="h-[180px] w-full rounded-xl" />
      <div className="flex gap-3">
        <Skeleton className="h-5 w-1/3 rounded" />
        <Skeleton className="h-5 w-1/4 rounded" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
