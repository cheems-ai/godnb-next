/**
 * shadcn/ui 配套工具函数：合并 Tailwind class + 变量（cva） + clsx
 * 所有 shadcn/ui 生成的组件都会 import 这个文件。
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
