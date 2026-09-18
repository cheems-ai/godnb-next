"use client";
/**
 * Navbar —— 响应式导航栏
 *
 * 客户端组件（usePathname / useState / 移动端汉堡菜单）。
 * 导航项、logo、按钮全走 Server Component 会更省 JS，
 * 但 pathname 激活态必须客户端才能算，所以整体定为 "use client"。
 *
 * 性能要点：
 *   - 所有图标用 lucide-react，next.config.ts 已配置 optimizePackageImports
 *     自动按需 tree-shake（不要 import * as lucide）
 *   - 移动端菜单从 translate-x 滑出，用 transform 而非 display toggle
 *     避免触发 reflow
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Zap, ShoppingCart, BookOpen, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/blog",  label: "博客",  icon: BookOpen },
  { href: "/shop",  label: "商城",  icon: ShoppingCart },
  { href: "/dashboard", label: "工作台", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // 滚动时给导航加毛玻璃
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由切换时自动关闭移动端菜单（LCP / 键盘可达性）
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-200",
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-background/40 backdrop-blur-sm border-transparent",
      )}
    >
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16"
        aria-label="主导航"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 font-bold text-lg">
          <span className="rounded-md bg-gradient-to-br from-primary to-violet-400 p-1 text-white shadow-sm">
            <Zap className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">{process.env.NEXT_PUBLIC_SITE_NAME}</span>
        </Link>

        {/* 桌面端导航 */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname === href || pathname?.startsWith(href + "/")
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA（两端对齐，和汉堡占位） */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden md:inline-flex rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            登录
          </Link>
          <button
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* 移动端滑出菜单（transform translate-x 避免 reflow） */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-t transition-[max-height,opacity] duration-200",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-transparent",
        )}
      >
        <ul className="space-y-0.5 px-4 py-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                  pathname === href || pathname?.startsWith(href + "/")
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
