/**
 * 首页 —— 三大业务入口（SSG 纯静态，首屏 < 1.2s）
 *
 * 这是纯 Server Component（默认），fetch 任何数据会在构建时拉完、
 * 直接把 HTML 注入静态产物里。路由缓存 = 永久（除非手动 revalidateTag）。
 *
 * LCP 策略：Hero 主图用 priority + sizes="100vw" 让 CDN 直接返回最优尺寸
 */
import Link from "next/link";
import { Zap, ShoppingCart, BookOpen, BarChart3, ArrowRight } from "lucide-react";
import { OptImage } from "@/components/ui/OptImage";

const FEATURES = [
  {
    href: "/blog",
    icon: BookOpen,
    title: "博客内容体系",
    desc: "SSG 静态生成 · 秒开体验 · Markdown 原生",
    color: "from-rose-500 to-orange-400",
  },
  {
    href: "/shop",
    icon: ShoppingCart,
    title: "电商商城",
    desc: "ISR 增量更新 · 30 分钟自动刷 · 支持搜索",
    color: "from-violet-500 to-indigo-500",
  },
  {
    href: "/dashboard",
    icon: BarChart3,
    title: "SaaS 工作台",
    desc: "SSR 动态渲染 · 实时数据 · 鉴权保护",
    color: "from-emerald-500 to-teal-400",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      {/* Hero 区 —— LCP 区域，必须足够显眼且首屏可见 */}
      <section className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Zap className="h-3.5 w-3.5" />
            Next.js 15 · Tailwind · shadcn/ui
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            一套底座，承载
            <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
              电商 · 博客 · SaaS
            </span>
          </h1>
          <p className="mb-8 max-w-xl text-lg text-muted-foreground">
            性能优先的商业化架构。博客 SSG 秒开、电商 ISR 增量刷新、SaaS
            SSR 动态渲染——每个业务用最优策略。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              浏览博客
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-md border bg-background px-5 py-2.5 font-medium hover:bg-accent"
            >
              进入商城
            </Link>
          </div>
        </div>

        {/* LCP 主图 —— priority + eager 预加载 */}
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-xl">
            <OptImage
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
              alt="商业仪表盘示意"
              aspect="4/3"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 三大业务入口 */}
      <section className="mt-20">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight md:text-3xl">
          覆盖三类典型业务场景
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ href, icon: Icon, title, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="group relative rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${color} p-3 text-white shadow-sm`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
              <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
