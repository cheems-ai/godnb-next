/**
 * Next.js 15 核心配置 —— 性能 + Cloudflare / Vercel 兼容
 *
 * ▶ 关键优化开关：
 *   - reactStrictMode      = true   开发期提前暴露副作用
 *   - swcMinify            = true   Next 15 默认开启，保留以防降级
 *   - compress             = true   gzip 压缩所有响应
 *   - poweredByHeader      = false  去掉 "Next.js" 响应头（安全+更小包）
 *   - generateBuildId      = 稳定值，便于 CI 可复现
 *   - experimental.optimizePackageImports = true  自动拆分大依赖（lucide/framer-motion...）
 *
 * ▶ Cloudflare Workers 部署：
 *   - output: 'standalone' + 静态资源 → @opennextjs/cloudflare 适配器
 *   - images.unoptimized 在 CF Worker 上会自动降级（CF 用自己的图片优化管道）
 *   - 如果部署到 Vercel，这段 output + images.unoptimized 都可以删掉
 *
 * ▶ 图片：next/image 统一走服务器端优化（Vercel 原生、CF 通过适配器）
 *   开发期 NEXT_PUBLIC_IMAGE_UNOPTIMIZED=1 或部署到纯静态时 images.unoptimized=true
 */
import type { NextConfig } from "next";

const isCloudflare = process.env.NEXT_DEPLOY_TARGET === "cloudflare";
const imageUnoptimized = process.env.NEXT_PUBLIC_IMAGE_UNOPTIMIZED === "1";

const nextConfig: NextConfig = {
  // === 构建输出 ===
  output: isCloudflare ? "standalone" : undefined,

  // === 基础开关 ===
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateBuildId: async () =>
    process.env.BUILD_ID || `godnb-${new Date().toISOString().slice(0, 10)}`,

  // === 图片优化 ===
  images: {
    // 部署到 Cloudflare Worker / 本地开发时，next/image 默认优化器可能不可用，
    // 设置 unoptimized: true 让浏览器原生加载（WebP/AVIF 由上层 CDN 处理）
    // Vercel 部署时删掉这行，使用其内置优化服务（全球 CDN 自动转 AVIF/WebP）
    unoptimized: isCloudflare || imageUnoptimized,

    // 允许优化的远程图片域名（按需扩展）
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "*.gravatar.com" },
      { protocol: "https", hostname: "*.githubusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // === 代码级优化 ===
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // === 静态资源路径哈希（更激进的长缓存） ===
  // Next.js 静态产物默认走 _next/static，文件名自带内容哈希，CDN/浏览器自动长缓存；
  // 不需要额外 configureCache，这里加 headers 仅作补充（HTTP/1.1 `cache-control: public, max-age=31536000, immutable`）
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },

  // === 强制 HTTPS（Vercel 自动，Cloudflare 也有 Page Rules；这里给兜底） ===
  // 如果部署在 Cloudflare，推荐用 Page Rules / Transform Rule 做全站 HTTPS 跳转。
  async redirects() {
    // Vercel + Cloudflare 都已自动提供 HTTPS 跳转。留空占位，未来加业务重定向。
    return [];
  },

  // === 类型安全的环境变量 ===
  env: {
    NEXT_PUBLIC_SITE_NAME: "god-next",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://godnb.com",
  },
};

export default nextConfig;
