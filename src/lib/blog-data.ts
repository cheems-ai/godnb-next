/**
 * 本地博客数据源 —— SSG 示例
 *
 * 真实项目里这里会是 fetch() CMS / 读 MDX 文件 / 查 DB。
 * 这里用硬编码数组，演示"纯 SSG 首屏渲染"的写法。
 * 所有用到的数据在 generateStaticParams + 页面组件里都被静态引用，
 * Next 构建时直接把它们编译到产物 HTML 里（零运行时开销）。
 */
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  date: string;     // ISO 日期
  author: string;
  tags: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "nextjs-15-performance",
    title: "Next.js 15 性能优化实战：从 2.8s 到 0.9s 的 20 个技巧",
    excerpt:
      "字体、图片、React Server Components、Edge Runtime、客户端 hydration……每一项 30ms，凑起来就能让博客首屏在一秒内渲染完毕。",
    content:
      "（这里是 Markdown 正文。真实项目用 next-mdx-remote 或 @next/mdx 渲染。）\n\n# 一、字体优化\n\n用 next/font 加载字体，自动 self-host + display: swap，避免 FOIT。\n\n# 二、图片优化\n\nnext/image 默认启用 AVIF/WebP 自动转换，CDN 根据设备能力返回最优格式。",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    date: "2025-01-12T08:00:00Z",
    author: "God NB",
    tags: ["Next.js", "性能", "前端"],
  },
  {
    slug: "shadcn-vs-radix",
    title: "shadcn/ui 和 Radix UI 到底什么关系？选哪个？",
    excerpt:
      "shadcn/ui 不是组件库，是可复制粘贴的代码。Radix 是底层 Headless 原语。两者一起用才是真·零黑箱。",
    content:
      "# 结论\n\nshadcn 把 Radix 封装成好看的 Tailwind 组件，拷贝到你的仓库里，改什么都看得见。",
    cover:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    date: "2025-01-08T09:30:00Z",
    author: "God NB",
    tags: ["shadcn", "Radix", "Tailwind"],
  },
  {
    slug: "isr-vs-ssr-vs-ssg",
    title: "ISR / SSR / SSG / PPR 四种渲染模式怎么选",
    excerpt:
      "博客、电商商品页、SaaS 工作台——用同一个 Next.js 底座，每个业务配不同的缓存策略。",
    content:
      "# 一句话记忆\n\n- 常更新但读多写少 → ISR\n- 变化极慢 → SSG\n- 每请求都变 → SSR",
    cover:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    date: "2025-01-04T15:00:00Z",
    author: "God NB",
    tags: ["渲染", "架构"],
  },
];

export function getAllPosts() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}
export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}
export function getAllSlugs() {
  return posts.map((p) => p.slug);
}
