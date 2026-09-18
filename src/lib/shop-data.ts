/**
 * 商品数据源 —— ISR 示例
 *
 * 真实项目里这会是 fetch() CMS / 查 DB / 读 Redis。
 * 为了让 revalidate = 30 生效（真的 ISR 增量刷新），
 * 生产里把这个文件换成 fetch() 远程 API 即可。
 */
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  description: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "极简无线耳机 Pro",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    category: "数码",
    stock: 42,
    description:
      "30dB 主动降噪 · 40 小时续航 · IPX5 防水 · 自适应 EQ，适合通勤与运动。",
  },
  {
    id: "p2",
    name: "机械键盘（青轴 · 三模）",
    price: 429,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    category: "外设",
    stock: 18,
    description:
      "Gasket 结构 · 可编程宏 · 蓝牙 / 2.4G / 有线三模 · 热插拔轴座。",
  },
  {
    id: "p3",
    name: "真皮机械表",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
    category: "配饰",
    stock: 7,
    description: "蓝宝石玻璃 · 50 米防水 · 自动机芯 · 316L 精钢表壳。",
  },
];

export function getAllProducts() {
  return products;
}
export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}
