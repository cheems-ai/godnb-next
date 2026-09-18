/**
 * 商品详情页 —— ISR + generateStaticParams（首屏预生成 + 增量更新）
 *
 * 高级玩法：generateStaticParams 返回 Top N 热商品 ID（构建时预生成，用户首次访问秒开）
 * + revalidate 让冷门商品在第一次访问后也会被缓存、后续自动刷新。
 * 这样冷门商品也能 SWR 模式被后台更新，不需要强制 SSR。
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProducts, getProductById } from "@/lib/shop-data";
import { formatCurrency } from "@/lib/perf";
import { OptImage } from "@/components/ui/OptImage";

// 预生成：构建时为这几个热 ID 生成静态详情页
export function generateStaticParams() {
  // 真实项目里这里只返回 Top N 热商品（减少 build 耗时）
  return getAllProducts().map((p) => ({ id: p.id }));
}

// ISR：每 30 分钟刷新一次（首次访问走 SSR、之后 30 分钟内命中 SSG）
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = getProductById(id);
  if (!p) return {};
  return {
    title: p.name,
    description: p.description,
    openGraph: { title: p.name, images: [p.image] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = getProductById(id);
  if (!p) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <Link
        href="/shop"
        className="mb-6 inline-flex text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回商城
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* LCP 主图 —— priority 让预加载优先命中 */}
        <div className="aspect-square overflow-hidden rounded-2xl bg-muted shadow-lg">
          <OptImage
            src={p.image}
            alt={p.name}
            aspect="1/1"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <div className="mb-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs">
            {p.category}
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{p.name}</h1>
          <div className="mt-3 text-3xl font-bold text-primary">
            {formatCurrency(p.price)}
          </div>
          <p className="mt-6 text-muted-foreground">{p.description}</p>

          <div className="mt-8 flex gap-3">
            <button className="rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-sm hover:opacity-90">
              加入购物车
            </button>
            <button className="rounded-md border bg-background px-5 py-2.5 font-medium hover:bg-accent">
              立即购买
            </button>
          </div>

          {/* 开发探针：让你在浏览器上肉眼看到是哪个渲染模式 */}
          <p className="mt-10 text-xs text-muted-foreground">
            渲染模式：ISR（revalidate = {revalidate}s）· 构建时预生成 · 首次访问后 30 分钟增量刷新
          </p>
        </div>
      </div>
    </div>
  );
}
