/**
 * 根布局 —— 全站骨架 / 字体 / 元数据 / Loading Bar / 导航页脚
 *
 * Next.js Layout 必须是 Server Component，所有"交互"都下沉到子组件。
 * 性能要点：
 *   1. next/font 零网络开销加载字体（Google Fonts 替换方案）
 *   2. preconnect 预连接静态资源域名
 *   3. 禁止在根布局加载任何重 JS（analytics 用异步脚本）
 *   4. metadata（title/description/OG/Twitter）必须在服务器端生成
 *
 * 运行时 Web Vitals 监控：
 *   - 开发期 next 已内置 Telemetry，生产用 @vercel/analytics
 *   - 这里留一个 placeholder 脚本入口，线上接入时把 <script> 换掉即可
 */
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingBar } from "@/components/layout/LoadingBar";

/* ---------- 字体（零网络请求加载） ----------
 * next/font 自动 self-host，不阻塞 LCP。
 * display: swap 保证 FOIT → FOUT，避免白屏。 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

/* ---------- 全局元数据（SEO + 社交分享） ----------
 * 继承到所有子页面；子页面用 generateMetadata 覆盖。 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://godnb.com"),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || "God Next",
    template: "%s · " + (process.env.NEXT_PUBLIC_SITE_NAME || "God Next"),
  },
  description:
    "基于 Next.js 15 + Tailwind + shadcn/ui 的一体化商业架构 —— 电商 / 博客 / SaaS，性能优先。",
  keywords: ["Next.js", "Tailwind", "shadcn", "电商", "博客", "SaaS", "TypeScript"],
  authors: [{ name: "God NB", url: "https://godnb.com" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME,
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "God Next · Next.js 15 商业底座",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_SITE_NAME,
    description:
      "基于 Next.js 15 + Tailwind + shadcn/ui 的一体化商业架构 —— 电商 / 博客 / SaaS。",
    images: ["/og-cover.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

/* ---------- 视口配置（必须单独导出） ---------- */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,       // 允许用户缩放（无障碍）
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
};

/* ---------- 页面渲染 ----------
 * Navbar / Footer 是独立组件；LoadingBar 用 "use client" 内部处理。 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 预连接静态资源域名 —— 减少 DNS + TLS 握手 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* 图标预加载（favicon 小，不阻塞渲染） */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.variable} antialiased min-h-dvh flex flex-col`}
      >
        {/* 路由切换进度条（客户端组件，useSearchParams 要求 Suspense 包裹） */}
        <Suspense fallback={null}>
          <LoadingBar />
        </Suspense>

        {/* 全站头部 / 底部（Server Component，零客户端 JS） */}
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
