/**
 * Skeleton —— 骨架屏占位（shadcn/ui 基础组件）
 *
 * 用 background shimmer 动画；不加载任何额外 JS。
 * 所有未来的骨架屏组件（CardSkeleton / ProductSkeleton / BlogSkeleton）
 * 都可以在自己内部用 <Skeleton className="h-16 w-32" /> 组合出来。
 */
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

/* ---------- 组合骨架屏示例 ---------- */

export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <Skeleton className="h-48 w-full rounded-lg mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function BlogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}
