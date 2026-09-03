import type { Metadata } from "next";
import { FeedPage } from "@/components/feed-page";

export const metadata: Metadata = {
  title: "Feed Hòa Phúc",
  description: "Khám phá video, hình ảnh và câu chuyện ngắn về trà thảo mộc, quà biếu và nông sản Hòa Phúc.",
  alternates: { canonical: "/feed" },
  openGraph: {
    title: "Feed Hòa Phúc",
    description: "Khám phá những câu chuyện ngắn về trà thảo mộc và nông sản Việt.",
    url: "https://hoaphucfarm.com/feed",
  },
};

export default function FeedRoute() {
  return <FeedPage />;
}
