/**
 * 通用工具函数：日期格式化、数字千分位等
 */
export function formatDate(iso: string, locale = "zh-CN") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function formatCurrency(cents: number, currency = "CNY") {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "CNY" ? 0 : 2,
  }).format(cents);
}

/**
 * 安全范围截断（防止 XSS 里被用在 innerHTML）
 * 这里只是展示字符串长度，纯文本用 textContent 或直接渲染即可。
 */
export function truncate(s: string, n = 120) {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}
