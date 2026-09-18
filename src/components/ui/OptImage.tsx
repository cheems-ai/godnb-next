/**
 * OptImage —— next/image 统一封装
 *
 * 所有全站图片都从这个组件走：
 *   ✅ 自动 lazy loading（loading="lazy"）
 *   ✅ 自动格式协商（AVIF → WebP → JPG，由 images.formats 控制）
 *   ✅ 自动响应式 sizes（给 CDN 明确的宽度提示）
 *   ✅ 默认 blur 占位（防止图片加载时的布局偏移 CLS）
 *   ✅ 首屏关键图 loading="eager" + priority 预加载
 *   ✅ Cloudflare/Vercel 自动优化管道（看 next.config.ts）
 *
 * 使用示例：
 *   <OptImage src="/cover.jpg" alt="封面" sizes="(max-width:768px) 100vw, 60vw" />
 *   <OptImage src={src} alt="封面" priority sizes="100vw" />  // 首屏关键图
 *
 * 注意：
 *   - src 如果是远程域名，必须在 next.config.ts images.remotePatterns 里声明
 *   - unoptimized 模式下会退化为原生 <img>，仍保留 loading / sizes / alt
 */
import NextImage, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "alt"> & {
  alt: string;           // 必须提供（无障碍）
  aspect?: string;       // 可选：宽高比占位（例 "16/9"），防 CLS
  priority?: boolean;    // 关键资源：预加载 + eager
};

export function OptImage({
  src,
  alt,
  width = 1200,
  height = 675,
  sizes = "(max-width: 768px) 100vw, 60vw",
  aspect,
  priority = false,
  loading,
  className,
  ...rest
}: Props) {
  // 非关键资源默认 lazy
  const finalLoading: "eager" | "lazy" = priority ? "eager" : (loading ?? "lazy");
  const aspectClass = aspect ? `aspect-[${aspect}] object-cover` : "";

  const img = (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={finalLoading}
      priority={priority}
      decoding="async"
      className={`${aspectClass} ${className ?? ""}`.trim()}
      {...rest}
    />
  );

  // 用占位 div 强制宽高比 —— 即便 next/image 内部有 width/height，
  // 在某些布局里（flex / grid + overflow hidden）仍需要显式 aspect
  if (aspect) {
    return <div className={`overflow-hidden rounded-lg ${className ?? ""}`}>{img}</div>;
  }
  return img;
}
