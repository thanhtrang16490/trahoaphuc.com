import "server-only";

import { blogPosts, type BlogPost } from "@/data/blog";
import { createClient } from "@/lib/supabase/server";

type NewsRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string | null;
  read_time: string;
  cover_image: string;
  source_url: string | null;
  source_name: string | null;
  content: unknown;
};

function mapPost(row: NewsRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.published_at ?? new Date().toISOString().slice(0, 10),
    readTime: row.read_time,
    coverImage: row.cover_image,
    sourceUrl: row.source_url ?? undefined,
    sourceName: row.source_name ?? undefined,
    content: Array.isArray(row.content) ? row.content.filter((item): item is string => typeof item === "string") : [],
  };
}

export async function getNewsPosts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("news_posts").select("slug, title, excerpt, category, published_at, read_time, cover_image, source_url, source_name, content").eq("status", "published").order("published_at", { ascending: false });
    if (error || !data?.length) return blogPosts;
    return (data as NewsRow[]).map(mapPost);
  } catch {
    return blogPosts;
  }
}

export async function getNewsPostBySlug(slug: string) {
  const posts = await getNewsPosts();
  return posts.find((post) => post.slug === slug);
}
