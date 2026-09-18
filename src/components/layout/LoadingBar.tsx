"use client";
/**
 * LoadingBar —— 路由切换进度条（顶部 2px 横条）
 *
 * 轻量实现：监听 Next.js App Router 的路由切换事件，
 * 在 URL 变化期间显示一条动画进度。不引入任何第三方包。
 *
 * Next.js 15 App Router 暴露的事件：
 *   - 路由开始切换 → 显示
 *   - 路由渲染完成 → 隐藏
 */
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(true), 50);
    const hide = setTimeout(() => setLoading(false), 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      clearTimeout(hide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden={!loading}
      className={[
        "pointer-events-none fixed left-0 top-0 z-[100] h-[2px] w-full overflow-hidden transition-opacity duration-200",
        loading ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div
        className="h-full w-[40%] animate-[loading-bar_600ms_ease-out_forwards] bg-gradient-to-r from-primary/30 via-primary to-primary/60 shadow-[0_0_10px_var(--color-primary)]"
      />
      {/*
        Tailwind v4 的任意值动画 + globals keyframes：
        这个 keyframes 写在全局 style 文件里（globals.css）。
        如果那里没写，退化成 CSS 动画不执行也不报错。
      */}
    </div>
  );
}
