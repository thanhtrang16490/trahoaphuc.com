import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nông Sản Hòa Phúc",
    short_name: "Hòa Phúc",
    description: "Trà thảo mộc và nông sản Việt từ Cúc Phương, Ninh Bình.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f6f1e7",
    theme_color: "#0f4d32",
    lang: "vi-VN",
    categories: ["shopping", "food", "lifestyle"],
    icons: [
      { src: "/brand/pwa-icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/brand/pwa-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Sản phẩm", short_name: "Sản phẩm", url: "/san-pham", icons: [{ src: "/brand/pwa-icon-192.png", sizes: "192x192" }] },
      { name: "Giỏ hàng", short_name: "Giỏ hàng", url: "/gio-hang", icons: [{ src: "/brand/pwa-icon-192.png", sizes: "192x192" }] },
    ],
  };
}
