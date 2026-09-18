/**
 * 登录页（最小示例，真实项目用 NextAuth v5 / Clerk）
 *
 * 纯 SSG —— 页面内容完全静态。表单提交 → 走 /api/auth/login Route Handler。
 */
export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7rem)] max-w-md items-center px-4">
      <div className="w-full rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">登录</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          真实项目接 NextAuth v5 + Route Handler
        </p>
        <form
          className="space-y-3"
          action="/api/auth/login"
          method="POST"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="邮箱"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="密码"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
