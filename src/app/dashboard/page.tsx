/**
 * Dashboard 概览页 —— SSR 动态内容
 *
 * 这个页面**每个请求都会重新渲染**（没有任何缓存），因为：
 *   - cookies() 强制动态（layout 里已调）
 *   - headers() 每次都要读
 *   - fetch 没加 cache: "force-cache"（默认就是 no-store + 请求头里加 Cache-Control: no-store）
 *
 * 实时数据（余额 / 今日订单 / 未读消息）不应该被缓存。
 * 如果将来需要"部分内容实时 + 部分内容缓存"，用 <Suspense> + 拆分 Component：
 *   - 页面顶层 async fetch（动态）→ 实时部分
 *   - 子组件 export const revalidate = 300 → 半静态部分
 */
import { headers } from "next/headers";
import { formatCurrency } from "@/lib/perf";

// 强制动态（layout 已经标记了，这里再写一次更明确）
export const dynamic = "force-dynamic";

// 告诉 Next 不要给这个页面加任何 HTTP 缓存头
export async function generateMetadata() {
  return {
    title: "工作台",
    // 通过 headers API 设置 Cache-Control
    other: { "Cache-Control": "no-store" },
  };
}

// 模拟"每次请求都会变"的数据源
async function fetchLiveStats() {
  // 真实项目里这里是 fetch() API 或调 DB
  // fetch("https://api.yoursite.com/stats", { cache: "no-store" })
  await new Promise((r) => setTimeout(r, 200));
  return {
    balance: 3280 + Math.floor(Math.random() * 50),
    ordersToday: 12 + Math.floor(Math.random() * 8),
    notifications: 3 + Math.floor(Math.random() * 5),
    lastUpdate: new Date().toISOString(),
  };
}

export default async function DashboardPage() {
  // 读一个只在服务端可见的请求头（示例）
  const hdrs = await headers();
  const country = hdrs.get("x-vercel-ip-country") || hdrs.get("cf-ipcountry") || "未知";

  const stats = await fetchLiveStats();
  const updatedAt = new Date(stats.lastUpdate).toLocaleTimeString("zh-CN");

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          工作台概览
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          SSR 动态渲染 · 数据每请求更新 · 不缓存
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="账户余额" value={formatCurrency(stats.balance)} />
        <StatCard label="今日订单" value={String(stats.ordersToday)} />
        <StatCard label="未读消息" value={String(stats.notifications)} />
      </div>

      <div className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
          环境探针（仅本地开发有用，生产删掉）
        </h2>
        <pre className="overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed">
{JSON.stringify(
  {
    renderMode: "SSR (force-dynamic)",
    country,
    updatedAt,
    runtime: process.env.NEXT_DEPLOY_TARGET || "vercel (Edge Node)",
  },
  null,
  2,
)}
        </pre>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
