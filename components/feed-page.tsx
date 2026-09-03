"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChatCircle, DotsThreeVertical, Heart, Pause, Play, ShareNetwork, ShoppingBagOpen, SpeakerHigh, SpeakerSlash, UserPlus } from "@phosphor-icons/react";

type FeedItem = {
  id: string;
  type: "video" | "image";
  segment: "for-you" | "latest" | "gift";
  src: string;
  poster?: string;
  eyebrow: string;
  title: string;
  copy: string;
  href: string;
  cta: string;
  likes?: string;
  comments?: string;
  shares?: string;
  hashtags?: string[];
};

const feedTabs = [
  { id: "for-you", label: "Dành cho bạn" },
  { id: "latest", label: "Mới nhất" },
  { id: "gift", label: "Quà biếu" },
] as const;

const feedItems: FeedItem[] = [
  {
    id: "story",
    type: "video",
    segment: "for-you",
    src: "/media/video-tra-hoa-phuc-optimized.mp4",
    poster: "/media/video-tra-hoa-phuc-thumb.jpg",
    eyebrow: "Câu chuyện Hòa Phúc",
    title: "Một khoảng nghỉ mang hương vị Việt.",
    copy: "Chậm lại một chút cùng những dòng trà thảo mộc và nông sản khởi nguồn từ Cúc Phương.",
    href: "/gioi-thieu",
    cta: "Về Hòa Phúc",
  },
  {
    id: "gift",
    type: "image",
    segment: "gift",
    src: "/hero-hoaphuc.webp",
    eyebrow: "Gợi ý quà biếu",
    title: "Một món quà đẹp bắt đầu từ câu chuyện thật.",
    copy: "Trà Bát Bảo Cúc Phương với diện mạo chỉn chu, phù hợp cho những lần thăm hỏi và tri ân.",
    href: "/san-pham/tra-bat-bao-cuc-phuong",
    cta: "Xem sản phẩm",
  },
  {
    id: "calm",
    type: "image",
    segment: "for-you",
    src: "/products/duong-tam-an-nhien.jpg",
    eyebrow: "Trà thảo mộc",
    title: "Giữ lại một nhịp an nhiên trong ngày.",
    copy: "Trà Dưỡng Tâm An Nhiên có hương vị thanh lành, dễ thưởng thức trong những khoảng nghỉ quen thuộc.",
    href: "/san-pham/tra-duong-tam-an-nhien",
    cta: "Khám phá vị trà",
  },
  {
    id: "grain",
    type: "image",
    segment: "latest",
    src: "/products/gao-lut-la-sen.jpg",
    eyebrow: "Dưỡng sinh",
    title: "Vị ngũ cốc thanh, hậu sen dịu.",
    copy: "Một lựa chọn mộc lành cho người yêu những hương vị nhẹ nhàng và cân bằng.",
    href: "/san-pham/tra-gao-lut-la-sen",
    cta: "Xem trà Gạo Lứt",
  },
  {
    id: "read",
    type: "image",
    segment: "gift",
    src: "/products/bat-bao-hoa-phuc.jpg",
    eyebrow: "Tạp chí Hòa Phúc",
    title: "Chọn trà làm quà: đẹp, đúng dịp và dễ trao.",
    copy: "Đọc thêm những gợi ý nhỏ để chọn một món quà vừa tinh tế vừa có giá trị sử dụng.",
    href: "/tin-tuc/cach-chon-tra-lam-qua-bieu",
    cta: "Đọc bài viết",
  },
  {
    id: "unbox",
    type: "image",
    segment: "latest",
    src: "/products/duong-tam-an-nhien-box.jpg",
    eyebrow: "Mở hộp cùng Hòa Phúc",
    title: "Chỉn chu từ chiếc hộp đầu tiên.",
    copy: "Cùng nhìn kỹ hơn quy cách hộp trà và những chi tiết tạo nên một món quà dễ nhớ.",
    href: "/san-pham/tra-duong-tam-an-nhien",
    cta: "Xem hộp trà",
  },
  {
    id: "cool",
    type: "image",
    segment: "for-you",
    src: "/products/thanh-nhiet-hoa-phuc.jpg",
    eyebrow: "Một vị trà trong ngày",
    title: "Thanh nhẹ, dễ bắt đầu.",
    copy: "Trà Thanh Nhiệt Hòa Phúc cho những ai yêu cấu trúc vị trong và cảm giác tươi mát.",
    href: "/san-pham/tra-thanh-nhiet-hoa-phuc",
    cta: "Khám phá sản phẩm",
  },
  {
    id: "thank-you",
    type: "image",
    segment: "gift",
    src: "/products/gao-lut-la-sen-box.jpg",
    eyebrow: "Quà tặng có câu chuyện",
    title: "Trao một chút tinh tế.",
    copy: "Một hộp trà mang hương vị Việt, phù hợp gửi lời cảm ơn và lời chúc chân thành.",
    href: "/tin-tuc/cach-chon-tra-lam-qua-bieu",
    cta: "Xem gợi ý quà",
  },
  {
    id: "slow-tea",
    type: "image",
    segment: "latest",
    src: "/products/bat-bao-hoa-phuc.jpg",
    eyebrow: "Nhịp sống Hòa Phúc",
    title: "Pha một ấm, chậm một nhịp.",
    copy: "Thưởng trà không cần cầu kỳ, chỉ cần một khoảng thời gian đủ yên để cảm nhận hương vị.",
    href: "/tin-tuc/mot-ngum-tra-thanh-cho-an-nhien-den",
    cta: "Đọc thêm",
  },
];

export function FeedPage() {
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [playingId, setPlayingId] = useState<string | null>("story");
  const [activeTab, setActiveTab] = useState<(typeof feedTabs)[number]["id"]>("for-you");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const visibleItems = feedItems.filter((item) => activeTab === "for-you" || item.segment === activeTab);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            void video.play();
            setPlayingId(video.dataset.feedId ?? null);
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.7] },
    );

    videoRefs.current.filter(Boolean).forEach((video) => observer.observe(video as HTMLVideoElement));
    return () => observer.disconnect();
  }, [activeTab]);

  const toggleVideo = (video: HTMLVideoElement, itemId: string) => {
    if (video.paused) {
      void video.play();
      setPlayingId(itemId);
    } else {
      video.pause();
      setPlayingId(null);
    }
  };

  const toggleLike = (itemId: string) => {
    setLikedIds((current) => {
      const next = new Set(current);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const toggleMute = () => {
    setIsMuted((muted) => !muted);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = !isMuted;
    });
  };

  const shareFeed = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Feed Hòa Phúc", url: window.location.href });
      } catch {
        return;
      }
      setShareStatus("Đã chia sẻ");
      window.setTimeout(() => setShareStatus(null), 1800);
      return;
    }
    await navigator.clipboard?.writeText(window.location.href);
    setShareStatus("Đã sao chép liên kết");
    window.setTimeout(() => setShareStatus(null), 1800);
  };

  return (
    <main className="relative min-h-dvh bg-[#071b13] pb-0 md:pb-8">
      <div className="mx-auto flex max-w-none flex-col gap-3 px-0 pt-0 md:max-w-[520px] md:gap-5 md:px-4 md:pt-5">
        <div className="fixed inset-x-0 top-0 z-30 flex items-center bg-gradient-to-b from-black/45 via-black/15 to-transparent px-3 py-2 backdrop-blur-[2px] md:sticky md:-mx-2 md:bg-[#071b13]/95 md:backdrop-blur-xl">
          <nav aria-label="Bộ lọc feed" role="tablist" className="flex w-full min-w-0 items-center justify-center gap-4 sm:gap-6">
            {feedTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} type="button" role="tab" aria-selected={isActive} onClick={() => setActiveTab(tab.id)} className="relative whitespace-nowrap px-1 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white">
                  {tab.label}
                </button>
              );
            })}
          </nav>
          <Link href="/tim-kiem" aria-label="Tìm kiếm trong Hòa Phúc" className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
            <span className="text-lg">⌕</span>
          </Link>
        </div>

        <div className="h-[100dvh] snap-y snap-mandatory scroll-pb-[calc(env(safe-area-inset-bottom)+96px)] space-y-0 overflow-y-scroll overscroll-none scroll-smooth touch-pan-y md:h-auto md:space-y-5 md:overflow-visible md:overscroll-contain">
          {visibleItems.map((item, index) => (
            <article key={item.id} className="relative h-[100dvh] snap-always snap-start overflow-hidden rounded-none bg-[#18382a] shadow-none md:h-[min(780px,calc(100vh-170px))] md:rounded-[28px] md:shadow-[0_18px_50px_rgba(0,0,0,0.25)]" style={{ contentVisibility: "auto", containIntrinsicSize: "100dvh" }}>
              {item.type === "video" ? (
                <video
                  ref={(node) => { videoRefs.current[index] = node; }}
                  className="absolute inset-0 h-full w-full object-cover"
                  poster={item.poster}
                  muted={isMuted}
                  loop
                  playsInline
                  preload="none"
                  onClick={(event) => toggleVideo(event.currentTarget, item.id)}
                  data-feed-id={item.id}
                  aria-label={item.title}
                >
                  <source src={item.src} type="video/mp4" />
                </video>
              ) : (
                <Image src={item.src} alt={item.title} fill sizes="(max-width: 640px) 100vw, 520px" className="object-cover" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,transparent_38%,rgba(0,0,0,0.82)_100%)]" aria-hidden="true" />

              <div className="absolute left-5 top-[calc(env(safe-area-inset-top)+68px)] flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 md:top-5">
                <span className="h-2 w-2 rounded-full bg-[#c9ef63]" />
                {item.eyebrow}
              </div>

              <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+88px)] left-5 right-[78px] text-white md:bottom-7 md:left-7">
                <div className="mb-3 flex items-center gap-2">
                  <Image src="/brand/hoaphuc-logo.svg" alt="" width={30} height={30} className="rounded-full bg-white p-1" />
                  <span className="text-sm font-semibold">@hoaphuc</span>
                  <button type="button" onClick={() => setFollowed((current) => !current)} className="ml-1 inline-flex items-center gap-1 rounded-full border border-white/35 px-2 py-1 text-[11px] font-semibold text-white">
                    <UserPlus size={12} weight="bold" /> {followed ? "Đã theo dõi" : "Theo dõi"}
                  </button>
                </div>
                <h2 className="max-w-[18ch] font-display text-[clamp(1.75rem,7vw,3.5rem)] leading-[0.98] tracking-[-0.05em]">{item.title}</h2>
                <p className="mt-2 max-w-[38ch] text-sm leading-5 text-white/82">{item.copy}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-white/75">
                  {(item.hashtags ?? ["#hoaphuc", "#traViet"]).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <Link href={item.href} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] !text-[#0f4d32] transition-transform hover:-translate-y-0.5">{item.cta} <span aria-hidden="true">→</span></Link>
              </div>

              <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+92px)] right-4 flex flex-col items-center gap-4 text-white md:bottom-7 md:right-6">
                <button type="button" onClick={toggleMute} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/20 backdrop-blur" aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}>{isMuted ? <SpeakerSlash size={20} weight="bold" /> : <SpeakerHigh size={20} weight="bold" />}</button>
                {item.type === "video" ? <button type="button" onClick={(event) => toggleVideo(event.currentTarget.closest("article")?.querySelector("video") as HTMLVideoElement, item.id)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/20 backdrop-blur" aria-label={playingId === item.id ? "Tạm dừng video" : "Phát video"}>{playingId === item.id ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}</button> : null}
                <Link href={item.href} className="flex flex-col items-center gap-1 text-[10px]" aria-label="Xem nội dung liên quan"><span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/20 backdrop-blur"><ShoppingBagOpen size={20} weight="bold" /></span><span>{item.likes ?? "Mua"}</span></Link>
                <button type="button" onClick={() => toggleLike(item.id)} className="flex flex-col items-center gap-1 text-[10px]" aria-label="Thích nội dung"><span className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/20 backdrop-blur ${likedIds.has(item.id) ? "text-[#ff6f75]" : ""}`}><Heart size={20} weight={likedIds.has(item.id) ? "fill" : "bold"} /></span><span>{item.likes ?? "Thích"}</span></button>
                <Link href="/tin-tuc" className="flex flex-col items-center gap-1 text-[10px]" aria-label="Đọc thêm tin tức"><span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/20 backdrop-blur"><ChatCircle size={20} weight="bold" /></span><span>{item.comments ?? "Đọc"}</span></Link>
                <button type="button" onClick={() => void shareFeed()} className="flex flex-col items-center gap-1 text-[10px]" aria-label="Chia sẻ feed"><span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/20 backdrop-blur"><ShareNetwork size={20} weight="bold" /></span><span>{item.shares ?? "Chia sẻ"}</span></button>
                <DotsThreeVertical size={22} weight="bold" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
      {shareStatus ? <div role="status" className="fixed bottom-[calc(env(safe-area-inset-bottom)+88px)] left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-xs font-semibold text-white backdrop-blur">{shareStatus}</div> : null}
    </main>
  );
}
