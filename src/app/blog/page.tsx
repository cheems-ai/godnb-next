/**
 * 博客列表页 —— SSG 静态生成（首屏 < 1s）
 *
 * 为什么用 SSG：
 *   - 博客内容更新频率低（一天/一周一次），每请求拉一次 DB 纯属浪费
 *   - 所有内容在 build 时就变成纯 HTML 放进 /_next/static 里
 *   - 用户访问 → 直接从 CDN 拿文件（TLS 握手 + 静态文件 = ~100ms）
 *   - 路由缓存 = 永久，除非手动 revalidatePath / revalidateTag
 *
 * 如果内容偶尔变：
 *   - 改 CMS → 调一个 /api/revalidate/[tag] 用 revalidateTag("blog") 批量失效
 *
 * 关键字：export const dynamic = "force-static" / export const revalidate = false
 *   写一个就够。两者都是让这个路由变成纯 SSG。
 */
import Link from "next/link";
import { getAllPosts } from "@/lib/blog-data";
import { formatDate } from "@/lib/perf";
import { OptImage } from "@/components/ui/OptImage";

// ===== SSG 标记（显式） =====
export const dynamic = "force-static";
// 也可以用：export const revalidate = false;

export const metadata = {
  title: "博客",
  description: "God Next 的技术与产品笔记",
};

export default function BlogListPage() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">博客</h1>
        <p className="mt-2 text-muted-foreground">
          SSG 静态生成 · 秒开 · 构建时写入 HTML
        </p>
      </header>

      <ul className="divide-y">
        {posts.map((p) => (
          <li key={p.slug} className="py-6">
            <Link
              href={`/blog/${p.slug}`}
              className="group grid gap-4 md:grid-cols-[240px_1fr]"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-lg bg-muted">
                <OptImage
                  src={p.cover}
                  alt={p.title}
                  aspect="16/10"
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h2 className="mb-1.5 text-lg font-semibold group-hover:text-primary md:text-xl">
                  {p.title}
                </h2>
                <p className="mb-2 text-sm text-muted-foreground line-clamp-3">
                  {p.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(p.date)}</span>
                  <span>· {p.author}</span>
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-muted px-2 py-0.5 text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
