import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ToastProvider } from "@/components/toast";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo";
import { brand } from "@/data/site";
import { MobileShell } from "@/components/mobile-shell";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  metadataBase: new URL(brand.website),
  icons: {
    icon: "/brand/hoaphuc-logo.svg",
    shortcut: "/brand/hoaphuc-logo.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hòa Phúc",
  },
  title: {
    default: "Trà thảo mộc Việt & quà biếu Cố đô | Hòa Phúc",
    template: "%s | Nông Sản Hòa Phúc",
  },
  description: "Trà thảo mộc và nông sản Việt từ Cúc Phương, Ninh Bình. Bao bì tinh tế, phù hợp dùng hằng ngày và làm quà biếu.",
  keywords: [
    "Nông Sản Hòa Phúc",
    "trà thảo mộc",
    "quà biếu Ninh Bình",
    "trà thảo mộc làm quà",
    "mật ong Hòa Phúc",
    "bột sắn dây",
    "tinh bột nghệ",
    "Nho Quan",
    "Cúc Phương",
    "Ninh Bình",
    "2700963962",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Trà thảo mộc Việt & quà biếu Cố đô | Hòa Phúc",
    description: "Trà thảo mộc và nông sản Việt từ Cúc Phương, Ninh Bình. Bao bì tinh tế, phù hợp dùng hằng ngày và làm quà biếu.",
    url: brand.website,
    siteName: brand.displayName,
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/media/video-tra-hoa-phuc-thumb.jpg",
        width: 1280,
        height: 720,
        alt: "Hòa Phúc - Nông sản sạch từ thiên nhiên",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.displayName,
    description: "Trà thảo mộc và nông sản Việt từ Cúc Phương, Ninh Bình, phù hợp dùng hằng ngày và làm quà biếu.",
    images: ["/media/video-tra-hoa-phuc-thumb.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f4d32",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <ToastProvider>
          <OrganizationJsonLd />
          <WebSiteJsonLd />
          <Header />
          <MobileShell>{children}</MobileShell>
          <Footer />
          <PwaRegister />
        </ToastProvider>
      </body>
    </html>
  );
}
