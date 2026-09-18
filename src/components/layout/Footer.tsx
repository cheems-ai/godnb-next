/**
 * Footer —— 全站页脚（Server Component，零客户端 JS）
 *
 * 纯静态内容。未来改成从 CMS 拉数据时，加 fetch() 即可。
 */
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold">God Next</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              基于 Next.js 15 · Tailwind · shadcn/ui 的一体化商业底座。
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-medium">产品</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shop"    className="hover:text-foreground">电商商城</Link></li>
              <li><Link href="/blog"    className="hover:text-foreground">博客系统</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">SaaS 工作台</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-medium">开发</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/api" className="hover:text-foreground">API 文档</Link></li>
              <li><Link href="/docs" className="hover:text-foreground">部署指南</Link></li>
              <li><Link href="/status" className="hover:text-foreground">服务状态</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-medium">联系</h4>
            <p className="text-sm text-muted-foreground">
              <a href="mailto:hello@godnb.com" className="hover:text-foreground">
                hello@godnb.com
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME} · Built with Next.js 15
        </div>
      </div>
    </footer>
  );
}
