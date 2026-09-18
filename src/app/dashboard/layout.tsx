/**
 * Dashboard Layout —— SaaS 动态渲染（SSR + 鉴权保护）
 *
 * 为什么用 SSR（强制动态渲染）：
 *   - 每个用户看到的内容不同（个性化数据）
 *   - 数据每请求都变（余额、订单、消息）
 *   - 需要鉴权 → 必须读取 cookies / headers，不能缓存
 *
 * 关键点：
 *   - export const dynamic = "force-dynamic" 禁止任何形式的缓存
 *   - cookies() / headers() 让 Next 自动标记这个路由为 dynamic
 *   - 鉴权失败 → 302 跳去登录页（Server Component 里 redirect() 就行）
 *
 * 真实项目里：
 *   - 登录用 NextAuth / Clerk / Auth.js v5
 *   - redirect 写在 middleware.ts 里全局拦截，layout 里只兜底
 *   - Edge Runtime 更快（~10ms 冷启动），Node Runtime 更全（数据库驱动）
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

// ===== 强制动态渲染 =====
// 两种写法二选一：
//   export const runtime = "edge"       // Edge Runtime（更快）
//   export const runtime = "nodejs"     // Node Runtime（全功能）
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 鉴权检查（真实项目换成 NextAuth / Clerk / 自实现 session）
  // cookies() 在 Next 15 是 async Server Action，必须 await
  const ck = await cookies();
  const sessionCookie = ck.get("app_session");
  if (!sessionCookie) redirect("/login");

  return (
    <div className="min-h-[calc(100dvh-7rem)] border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-10">
        {/* 侧边栏（Server Component，零客户端 JS） */}
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="space-y-1 text-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              工作台
            </h3>
            <Link
              href="/dashboard"
              className="block rounded-md bg-primary/10 px-3 py-2 font-medium text-primary"
            >
              概览
            </Link>
            <Link
              href="/dashboard/orders"
              className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              我的订单
            </Link>
            <Link
              href="/dashboard/settings"
              className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              账户设置
            </Link>
          </nav>
        </aside>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
