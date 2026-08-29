export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  coverImage: string;
  sourceUrl?: string;
  sourceName?: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "tra-thao-moc-nen-uong-luc-nao",
    title: "Trà thảo mộc nên uống lúc nào để cảm nhận hương vị rõ nhất?",
    excerpt:
      "Gợi ý thời điểm uống trà trong ngày để tận hưởng trọn vẹn hương vị và sự thư thái mà các dòng trà Hòa Phúc mang lại.",
    category: "Trà thảo mộc",
    date: "2026-08-29",
    readTime: "4 phút đọc",
    coverImage: "/products/duong-tam-an-nhien.jpg",
    sourceUrl: "https://www.facebook.com/nongsanhoaphucnb/posts/122114805099381663/",
    sourceName: "Facebook fanpage",
    content: [
      "Trà thảo mộc thường phù hợp vào những thời điểm cơ thể cần sự thư giãn nhẹ. Buổi sáng sau khi bắt đầu ngày mới, buổi chiều giữa nhịp làm việc hoặc buổi tối trước khi nghỉ ngơi là ba khoảng thời gian phổ biến nhất.",
      "Với phong cách thưởng trà hiện đại, bạn có thể pha trà nóng để cảm nhận mùi thơm rõ hơn hoặc ủ lạnh để dùng như một thức uống thanh nhẹ trong ngày.",
      "Điều quan trọng nhất là chọn loại trà phù hợp với khẩu vị và thói quen sinh hoạt của bạn. Khi đó, trà không chỉ là đồ uống mà còn là một khoảng lặng dễ chịu trong ngày.",
    ],
  },
  {
    slug: "cach-chon-tra-lam-qua-bieu",
    title: "Cách chọn trà làm quà biếu vừa đẹp vừa tinh tế",
    excerpt:
      "Một vài tiêu chí đơn giản để chọn quà trà phù hợp cho dịp lễ, Tết hoặc những lần thăm hỏi quan trọng.",
    category: "Quà biếu",
    date: "2026-08-28",
    readTime: "5 phút đọc",
    coverImage: "/products/bat-bao-hoa-phuc.jpg",
    sourceUrl: "https://www.facebook.com/nongsanhoaphucnb/posts/122115934773381663/",
    sourceName: "Facebook fanpage",
    content: [
      "Quà biếu trà nên cân bằng giữa hình thức, hương vị và câu chuyện thương hiệu. Một hộp trà đẹp sẽ tạo ấn tượng tốt ngay từ lần mở đầu tiên.",
      "Ngoài thiết kế, bạn cũng nên ưu tiên các dòng trà có quy cách rõ ràng, dễ sử dụng và phù hợp với nhiều đối tượng nhận quà khác nhau.",
      "Với Hòa Phúc, các dòng trà hộp kraft và thiết kế mang cảm hứng vùng miền là lựa chọn hợp lý khi muốn vừa sang trọng vừa gần gũi.",
    ],
  },
  {
    slug: "vi-sao-nen-chon-san-pham-lam-qua-bieu",
    title: "Vì sao sản phẩm nông sản sạch ngày càng được chọn làm quà biếu?",
    excerpt:
      "Những lý do khiến nông sản sạch, trà thảo mộc và đặc sản vùng miền trở thành quà biếu được yêu thích.",
    category: "Xu hướng",
    date: "2026-08-27",
    readTime: "4 phút đọc",
    coverImage: "/products/gao-lut-la-sen.jpg",
    sourceUrl: "https://www.facebook.com/nongsanhoaphucnb/posts/122116730565381663/",
    sourceName: "Facebook fanpage",
    content: [
      "Người nhận quà ngày càng quan tâm đến nguồn gốc và giá trị sử dụng của sản phẩm. Những món quà gắn với nông sản sạch vì thế có ý nghĩa hơn một sản phẩm mang tính trưng bày đơn thuần.",
      "Các sản phẩm như trà thảo mộc, mật ong hay ngũ cốc luôn tạo cảm giác an tâm khi tặng vì vừa đẹp mắt vừa có thể dùng thường xuyên.",
      "Xu hướng quà biếu hiện đại đang ưu tiên những thứ kể được câu chuyện thương hiệu, và đó cũng là hướng mà Hòa Phúc đang theo đuổi.",
    ],
  },
  {
    slug: "hanh-trinh-cua-mot-goi-tra-hoa-phuc",
    title: "Hành trình của một gói trà Hòa Phúc",
    excerpt:
      "Bài viết kể về sự tận tâm trong từng gói trà, từ tem thương hiệu tới cách đóng gói và gửi đến khách hàng.",
    category: "Câu chuyện thương hiệu",
    date: "2026-08-29",
    readTime: "4 phút đọc",
    coverImage: "/products/duong-tam-an-nhien-box.jpg",
    sourceUrl: "https://www.facebook.com/nongsanhoaphucnb/posts/122115934773381663/",
    sourceName: "Facebook fanpage",
    content: [
      "Mỗi gói trà Hòa Phúc không chỉ là một sản phẩm, mà còn là lời hứa về chất lượng và sự tận tâm gửi đến khách hàng.",
      "Từ chiếc tem thương hiệu đến cách đóng gói, từng chi tiết đều được chăm chút để người nhận cảm thấy chỉn chu ngay từ lần mở hộp đầu tiên.",
      "Đây cũng là tinh thần mà Hòa Phúc muốn giữ trong toàn bộ trải nghiệm mua hàng: rõ ràng, gần gũi và đáng tin.",
    ],
  },
  {
    slug: "mot-ngum-tra-thanh-cho-an-nhien-den",
    title: "Một ngụm trà thanh, chờ an nhiên đến",
    excerpt:
      "Gợi ý nhịp thưởng trà chậm rãi để thư giãn sau ngày dài và tận hưởng hương vị thanh nhẹ hơn.",
    category: "Lối sống",
    date: "2026-08-29",
    readTime: "4 phút đọc",
    coverImage: "/products/thanh-nhiet-hoa-phuc.jpg",
    sourceUrl: "https://www.facebook.com/nongsanhoaphucnb/posts/122116317123381663/",
    sourceName: "Facebook fanpage",
    content: [
      "Có những lúc chỉ cần một ngụm trà thanh là đủ để đổi nhịp cho cả ngày dài.",
      "Thưởng trà chậm lại một chút, để mùi hương và vị trà mở ra dần, sẽ giúp trải nghiệm trở nên nhẹ nhàng hơn.",
      "Đó là cách Hòa Phúc kể câu chuyện về sự an nhiên: đơn giản, vừa đủ và dễ nhớ.",
    ],
  },
  {
    slug: "thao-duoc-ngam-chan-hoa-phuc",
    title: "Thảo dược ngâm chân Hòa Phúc - thư giãn sâu từ gốc",
    excerpt:
      "Bài đăng giới thiệu sản phẩm ngâm chân thảo dược như một thói quen chăm sóc sức khỏe sau ngày dài.",
    category: "Chăm sóc",
    date: "2026-08-29",
    readTime: "4 phút đọc",
    coverImage: "/products/bat-bao-hoa-phuc.jpg",
    sourceUrl: "https://www.facebook.com/nongsanhoaphucnb/posts/122118330687381663/",
    sourceName: "Facebook fanpage",
    content: [
      "Ngâm chân cùng thảo dược là một thói quen đơn giản nhưng dễ mang lại cảm giác thư giãn sau một ngày bận rộn.",
      "Hòa Phúc phát triển nội dung này như một hướng chăm sóc sức khỏe từ gốc, gần gũi và dễ áp dụng tại nhà.",
      "Từ sản phẩm đến cách kể chuyện, tinh thần vẫn là giữ mọi thứ chân thật, mộc mạc và dễ hiểu.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
