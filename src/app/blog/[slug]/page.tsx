/**
 * 博客详情页 —— SSG generateStaticParams
 *
 * 为什么必须 generateStaticParams：
 *   - [slug] 是动态路由，Next 构建时需要知道该把哪些 slug 生成为静态文件
 *   - 返回 [{ slug: "a" }, { slug: "b" }] → 构建产物里就有 /blog/a.html、/blog/b.html
 *   - 访问不存在的 slug → 404（因为根本没生成它）
 *
 * 真实项目里：
 *   - generateStaticParams 里 fetch CMS 的所有 slug
 *   - 页面组件里 fetch 完整文章内容
 *   - 构建 → 发布 CDN → 用户访问直接命中静态 HTML
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getPostBySlug } from "@/lib/blog-data";
import { formatDate } from "@/lib/perf";
import { OptImage } from "@/components/ui/OptImage";

// 告诉 Next：构建时为这几个 slug 生成静态页面
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// metadata 动态生成（每个 slug 自己的 title/description）
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

// 显式标记 SSG（generateStaticParams 已经暗示了，再写一次更清楚）
export const dynamic = "force-static";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link
        href="/blog"
        className="mb-6 inline-flex text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回博客
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
        <div className="mt-3 text-xs text-muted-foreground">
          {formatDate(post.date)} · {post.author}
        </div>
      </header>

      {/* LCP 图 —— 详情页首屏最重要的图，priority */}
      <div className="mb-10 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
        <OptImage
          src={post.cover}
          alt={post.title}
          aspect="16/9"
          priority
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>

      {/* 正文（真实项目渲染 MDX） */}
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        {post.content.split("\n").map((line, i) =>
          line.startsWith("#") ? (
            <h2 key={i}>{line.replace(/^#+\s*/, "")}</h2>
          ) : line ? (
            <p key={i}>{line}</p>
          ) : null,
        )}
      </div>
    </article>
  );
}
