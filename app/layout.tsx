import type { Metadata } from "next";
import { Cormorant_Garamond, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { ToastProvider } from "@/components/toast";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo";
import { brand } from "@/data/site";

const display = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.website),
  title: {
    default: "Nông Sản Hòa Phúc | Trà thảo mộc, mật ong, bột sắn dây và tinh bột nghệ",
    template: "%s | Nông Sản Hòa Phúc",
  },
  description: `${brand.legalName} (MST ${brand.taxId}) - ${brand.description}`,
  keywords: [
    "Nông Sản Hòa Phúc",
    "trà thảo mộc",
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
    title: "Nông Sản Hòa Phúc | Nông sản sạch từ thiên nhiên",
    description: `${brand.legalName} (MST ${brand.taxId}). ${brand.description} Đồng bộ với fanpage ${brand.displayName}.`,
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
    description: `${brand.legalName} (MST ${brand.taxId}), đồng bộ với fanpage chính thức.`,
    images: ["/media/video-tra-hoa-phuc-thumb.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable}`}>
      <body>
        <ToastProvider>
          <OrganizationJsonLd />
          <WebSiteJsonLd />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
