import type { BreadcrumbItem } from "@/data/site";
import type { Product } from "@/data/products";

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CÔNG TY TNHH NÔNG SẢN HOÀ PHÚC",
    alternateName: "Nông Sản Hòa Phúc | Nho Quan",
    url: "https://hoaphucfarm.com",
    logo: "https://hoaphucfarm.com/icon.png",
    sameAs: ["https://www.facebook.com/nongsanhoaphucnb/"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+84 36 669 7135",
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: ["vi"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ngã 3, thôn Nga 2, Xã Cúc Phương, Huyện Nho quan, Tỉnh Ninh Bình, Việt Nam",
      addressLocality: "Ninh Bình",
      addressCountry: "VN",
    },
    description:
      "Nông sản sạch từ thiên nhiên, đồng bộ cho website, app và mini app. Trà thảo mộc, mật ong, bột sắn dây và tinh bột nghệ.",
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nông Sản Hòa Phúc",
    url: "https://hoaphucfarm.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://hoaphucfarm.com/san-pham?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function ProductJsonLd({
  product,
  price,
  url,
}: {
  product: Product;
  price: number;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: [product.image, product.boxImage],
    brand: {
      "@type": "Brand",
      name: "Nông Sản Hòa Phúc",
    },
    category: product.category,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price,
      availability: "https://schema.org/InStock",
      url,
      priceValidUntil: "2027-12-31",
      seller: {
        "@type": "Organization",
        name: "CÔNG TY TNHH NÔNG SẢN HOÀ PHÚC",
      },
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: authorName,
      logo: {
        "@type": "ImageObject",
        url: "https://hoaphucfarm.com/icon.png",
      },
    },
    mainEntityOfPage: url,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function FAQJsonLd({ questions }: { questions: Array<{ question: string; answer: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
