<div align="center">

# godnb-next

**Next.js 15 + Tailwind v4 + shadcn/ui 商业底座** — 覆盖博客 / 电商 / SaaS 三类业务，三种渲染策略按场景匹配，生产构建 First Load JS ≤ 112 kB。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcheems-ai%2Fgodnb-next&project-name=godnb-next&repository-name=godnb-next)
![Build](https://img.shields.io/badge/build-passing-brightgreen) ![Next.js](https://img.shields.io/badge/next-15-black) ![Tailwind](https://img.shields.io/badge/tailwind-v4-blue) ![pnpm](https://img.shields.io/badge/pnpm-10-orange)

</div>

---

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | **Next.js 15**（App Router + React 19 + TypeScript） |
| 样式 | **Tailwind CSS v4**（`@import "tailwindcss"` + `@theme inline` 桥接 shadcn 变量） |
| 组件库 | **shadcn/ui**（手动迁移 new-york 风格） |
| 包管理 | **pnpm 10**（`packageManager` 锁版本） |
| 字体 | **Inter**（next/font self-host，display:swap，零网络请求） |
| 部署 | **Vercel**（首选）/ Cloudflare Workers（`@opennextjs/cloudflare` 适配） |

## 渲染策略（生产 build 输出）

```
○ /                 SSG 首页                    1.51 kB   112 kB
● /blog             SSG + force-static         189 B     111 kB
● /blog/[slug]      SSG + generateStaticParams  189 B     111 kB   (3 篇预生成)
○ /shop             ISR revalidate=1800        189 B     111 kB   30m / 1y
● /shop/[id]        ISR + generateStaticParams  189 B     111 kB   30m / 1y
ƒ /dashboard        SSR force-dynamic          138 B     102 kB   (cookies 鉴权)
○ /login            SSG                        138 B     102 kB
───────────────────────────────────────────────────────────────────
  共享 First Load JS（所有页面复用）：        102 kB
```

| 策略 | 适用场景 | 本项目中 | 标记方式 |
|---|---|---|---|
| **SSG** | 极低频更新、SEO 优先 | 博客首页、博客详情、登录 | `dynamic = "force-static"` + `generateStaticParams` |
| **ISR** | 小时级更新、兼顾新鲜度与性能 | 电商列表 / 详情 | `revalidate = 1800` + `generateStaticParams` 预生成热商品 |
| **SSR** | 实时数据、鉴权保护、个性化 | Dashboard | `dynamic = "force-dynamic"` + `runtime = "nodejs"` + `cookies()` 鉴权 |

## 目录结构

```
src/
├── app/                           # App Router
│   ├── layout.tsx                 # 根布局（metadata / preconnect / Suspense + LoadingBar）
│   ├── globals.css                # Tailwind v4 + shadcn CSS 变量 + shimmer keyframes
│   ├── page.tsx                   # 首页（SSG）
│   ├── login/page.tsx
│   ├── blog/                      # SSG
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── shop/                      # ISR
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── dashboard/                 # SSR（鉴权保护）
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # 响应式导航 + 移动端滑出 + 毛玻璃滚动效果
│   │   ├── Footer.tsx             # 纯 Server Component，零客户端 JS
│   │   └── LoadingBar.tsx         # 路由切换进度条（usePathname + Suspense）
│   └── ui/
│       ├── Skeleton.tsx           # 骨架屏 + shimmer 动画（纯 CSS）
│       └── OptImage.tsx           # next/image 封装（priority / lazy / sizes / aspect）
└── lib/
    ├── utils.ts                   # cn() clsx + tailwind-merge
    ├── perf.ts                    # formatDate / formatCurrency / truncate
    ├── blog-data.ts               # 博客数据源（SSG generateStaticParams 消费）
    └── shop-data.ts               # 商品数据源（ISR generateStaticParams 消费）
```

## 本地开发

```powershell
# Windows PowerShell（Node 便携版路径）
$env:Path = "C:\Users\刘成\.local\node-v24.21.0-win-x64;" + $env:Path
Set-Location "c:\path\to\godnb-next"

# 依赖（首次）
& "...\node.exe" "...\npx.cmd" --yes pnpm@10.33.0 install

# 开发（Turbopack 默认开启）
& "...\node.exe" "...\npx.cmd" --yes pnpm@10.33.0 run dev
# → http://localhost:3000

# 生产构建 + 本地启动
& "...\node.exe" "...\npx.cmd" --yes pnpm@10.33.0 run build
& "...\node.exe" "...\npx.cmd" --yes pnpm@10.33.0 run start
```

## 部署

### Vercel（推荐，零配置）

1. 浏览器打开 https://vercel.com/new → Import 选 `cheems-ai/godnb-next`
2. Vercel 自动识别 Next.js → Framework 预设正确
3. 环境变量（在 Vercel 控制台设置）：

| Key | 值 | 说明 |
|---|---|---|
| `NEXT_PUBLIC_SITE_NAME` | godnb-next | 站点名称（metadata 用） |
| `NEXT_PUBLIC_SITE_URL` | https://godnb-next.vercel.app | 站点 URL |
| `NEXT_DEPLOY_TARGET` | vercel | 告诉 next.config.ts 走 Vercel 分支 |

4. Deploy → 构建完成后自动分配 `*.vercel.app` 域名
5. 绑定自定义域名 → Settings → Domains → 输入你的域名 → Configure DNS（按 Vercel 提示加 CNAME）

### Cloudflare Workers（备选）

```toml
# wrangler.toml（放在项目根）
name = "godnb-next"
main = ".open-next/workers/worker.js"
compatibility_date = "2025-01-01"

[assets]
directory = ".open-next/assets"
```

```bash
pnpm add @opennextjs/cloudflare -D
NEXT_DEPLOY_TARGET=cloudflare pnpm build
# 会生成 .open-next/ 目录
npx wrangler deploy
```

> Cloudflare 部署时 `next.config.ts` 会自动设 `images.unoptimized=true`（Cloudflare 没有 Next Image Optimization），建议把图片交给 Cloudflare Images 或走外部 CDN。

## 环境变量

复制 `.env.example` 到 `.env.local`（不要进 git）：

```
NEXT_PUBLIC_SITE_NAME=godnb-next
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_DEPLOY_TARGET=vercel      # vercel | cloudflare
NEXT_PUBLIC_IMAGE_UNOPTIMIZED=false  # true 时 OptImage 退化为原生 <img>
```

## 性能要点

| 项 | 实现位置 |
|---|---|
| LCP 关键图 priority | `OptImage.tsx`，首页 Hero / 博客封面 / 商品主图 |
| CLS 零偏移 | OptImage 强制 `aspect` + `fill` / `width,height` |
| 骨架屏占位 | `Skeleton.tsx` + shimmer keyframes（`globals.css`） |
| 字体零网络请求 | next/font Inter display:swap + preload |
| 静态资源不可变缓存 | `next.config.ts` headers `/_next/static` → `max-age=31536000, immutable` |
| Tailwind 任意值动画 | `LoadingBar.tsx` `animate-[loading-bar_600ms...]` + globals keyframes |
| 包体积优化 | `experimental.optimizePackageImports(["framer-motion","lucide-react"])` |
| Navbar / Footer | Server Component，零客户端 JS |
| Suspense 边界 | `layout.tsx` 包裹 LoadingBar（`useSearchParams` 要求） |
