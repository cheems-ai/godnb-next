/**
 * 商品列表页 —— ISR 增量刷新
 *
 * 为什么用 ISR（而不是纯 SSG 或纯 SSR）：
 *   - 商品库存、价格、上下架状态偶尔变（一天几次）
 *   - 纯 SSG → 变了就要手动触发全量重建（贵、慢）
 *   - 纯 SSR → 每个请求拉 DB（读多写少，太浪费）
 *   - ISR 两全其美：
 *       ① 第一次访问 → 构建时没生成 → 实时拉 DB 渲染（像 SSR）
 *       ② 30 分钟内再来 → 直接返回上次缓存的 HTML（像 SSG）
 *       ③ 30 分钟后再来 → 后台重新拉 DB 刷新缓存，用户还是拿得到旧 HTML（Stale-While-Revalidate）
 *
 * 这就是 Next 的"增量静态再生成"——只有被访问到的页面才会被重建。
 */
import Link from "next/link";
import { getAllProducts } from "@/lib/shop-data";
import { formatCurrency } from "@/lib/perf";
import { OptImage } from "@/components/ui/OptImage";

// ===== ISR 核心：revalidate 秒数 =====
// 30 分钟 = 1800 秒。按需调整：库存变化频繁 → 300（5 分钟），不常变 → 3600（1 小时）
export const revalidate = 1800;

export const metadata = {
  title: "商城",
  description: "God Next 示例商城",
};

export default function ShopPage() {
  const products = getAllProducts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">商城</h1>
        <p className="mt-2 text-muted-foreground">
          ISR 增量刷新 · {revalidate}s 自动过期 · Stale-While-Revalidate
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/shop/${p.id}`}
            className="group overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="aspect-square overflow-hidden bg-muted">
              <OptImage
                src={p.image}
                alt={p.name}
                aspect="1/1"
                sizes="(max-width: 768px) 50vw, 33vw"
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h2 className="font-semibold group-hover:text-primary">{p.name}</h2>
              <div className="mt-1 text-xs text-muted-foreground">{p.category}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(p.price)}
                </span>
                <span
                  className={`text-xs ${
                    p.stock > 10
                      ? "text-muted-foreground"
                      : p.stock > 0
                      ? "text-orange-500"
                      : "text-destructive"
                  }`}
                >
                  {p.stock === 0 ? "缺货" : `剩 ${p.stock} 件`}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
