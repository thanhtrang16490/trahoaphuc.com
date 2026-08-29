export type HomeSectionKey =
  | "hero"
  | "brandStory"
  | "categoryRail"
  | "featuredProducts"
  | "brandProof"
  | "blogTeaser"
  | "story";

export const homePageSections: Record<HomeSectionKey, boolean> = {
  hero: true,
  brandStory: true,
  categoryRail: true,
  featuredProducts: true,
  brandProof: true,
  blogTeaser: true,
  story: true,
};

