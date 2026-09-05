export type Product = {
  slug: string;
  name: string;
  category: string;
  price?: number;
  originalPrice?: number;
  shortDescription: string;
  longDescription: string;
  ingredients: string[];
  benefits: string[];
  packageLabel: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  boxImage: string;
  boxImageWidth: number;
  boxImageHeight: number;
  origin: string;
};

export const products: Product[] = [
  {
    slug: "tra-duong-tam-an-nhien",
    name: "Trà Dưỡng Tâm An Nhiên",
    category: "Trà thảo mộc",
    shortDescription: "Hương vị thanh lành từ vùng đất Cố Đô, phối trộn thảo mộc tự nhiên, dịu nhẹ và cân bằng.",
    longDescription:
      "Một công thức trà thảo mộc được phát triển để mang lại cảm giác thư thái, phù hợp cho nhịp sống hiện đại nhưng vẫn giữ tinh thần an nhiên của vùng nguyên liệu Việt Nam.",
    ingredients: ["Lạc tiên", "thảo quyết minh", "lá nếp", "cỏ ngọt", "vỏ long nhãn", "hoa cúc"],
    benefits: ["Hương vị dễ uống", "Phù hợp dùng mỗi ngày", "Tinh thần thư thái"],
    packageLabel: "Hộp 30 túi lọc x 3g/túi",
    image: "/products/duong-tam-an-nhien.jpg",
    imageWidth: 1402,
    imageHeight: 1122,
    boxImage: "/products/duong-tam-an-nhien-box.jpg",
    boxImageWidth: 1562,
    boxImageHeight: 1007,
    origin: "Cúc Phương, Ninh Bình",
  },
  {
    slug: "tra-thanh-nhiet-hoa-phuc",
    name: "Trà Thanh Nhiệt Hòa Phúc",
    category: "Trà thảo mộc",
    shortDescription: "Sắc trà tươi mát, cân bằng giữa thảo mộc và hương núi rừng Việt Nam.",
    longDescription:
      "Dành cho những khoảnh khắc cần làm dịu cơ thể và tinh thần, trà mang phong vị thanh mát với cấu trúc hương nhẹ, trong và sạch.",
    ingredients: ["Diệp hạ châu", "cà gai leo", "kim ngân", "cỏ ngọt", "hoa hòe", "bồ công anh", "thảo quyết minh", "hồng chi"],
    benefits: ["Cảm giác thanh nhẹ", "Hợp uống nóng hoặc lạnh", "Hương vị tự nhiên"],
    packageLabel: "Hộp 30 túi lọc x 3.5g/túi",
    image: "/products/thanh-nhiet-hoa-phuc.jpg",
    imageWidth: 1402,
    imageHeight: 1122,
    boxImage: "/products/thanh-nhiet-hoa-phuc.jpg",
    boxImageWidth: 1402,
    boxImageHeight: 1122,
    origin: "Ninh Bình",
  },
  {
    slug: "tra-gao-lut-la-sen",
    name: "Trà Gạo Lứt Lá Sen Hòa Phúc",
    category: "Dưỡng sinh",
    shortDescription: "Lớp vị ngũ cốc thanh và hậu vị sen nhẹ, phù hợp cho lối sống lành mạnh.",
    longDescription:
      "Kết hợp gạo lứt, lá sen và thảo mộc chọn lọc để tạo nên thức trà có chiều sâu vị giác, đậm cảm giác mộc mà vẫn thanh lịch.",
    ingredients: ["Gạo lứt", "lá sen", "thảo quyết minh", "cỏ ngọt", "hoa hòe"],
    benefits: ["Hậu vị dịu", "Dễ dùng hằng ngày", "Phù hợp phong cách sống cân bằng"],
    packageLabel: "Hộp 30 túi lọc x 3g/túi",
    image: "/products/gao-lut-la-sen.jpg",
    imageWidth: 1402,
    imageHeight: 1122,
    boxImage: "/products/gao-lut-la-sen-box.jpg",
    boxImageWidth: 1578,
    boxImageHeight: 1012,
    origin: "Việt Nam",
  },
  {
    slug: "tra-bat-bao-cuc-phuong",
    name: "Trà Bát Bảo Cúc Phương",
    category: "Đặc sản vùng miền",
    shortDescription: "Công thức bát bảo truyền thống theo ngôn ngữ hiện đại, cân bằng và giàu tầng hương.",
    longDescription:
      "Một phiên bản cao cấp của dòng trà bát bảo, khai thác chiều sâu thảo mộc và ngũ vị, gợi cảm giác ấm áp, tròn vị và tinh tế.",
    ingredients: ["Kê huyết đằng", "kim ngân", "rễ cỏ tranh", "hồng trà", "nhân trần", "cam thảo", "sâm dương quy", "nam dương sâm"],
    benefits: ["Vị trà đậm đà", "Biên độ hương phong phú", "Phù hợp quà biếu"],
    packageLabel: "Hộp 30 túi lọc x 3g/túi",
    image: "/products/bat-bao-hoa-phuc.jpg",
    imageWidth: 1402,
    imageHeight: 1122,
    boxImage: "/products/bat-bao-cuc-phuong-box.jpg",
    boxImageWidth: 1563,
    boxImageHeight: 1006,
    origin: "Cúc Phương, Ninh Bình",
  },
  {
    slug: "tra-thanh-nhiet-mat-gan",
    name: "Trà Thanh Nhiệt Mát Gan",
    category: "Trà thảo mộc",
    shortDescription: "Một lựa chọn gọn gàng, sạch vị, hướng tới trải nghiệm uống thường nhật.",
    longDescription:
      "Phối trộn thảo mộc theo tinh thần thanh lành, hỗ trợ cảm giác dễ chịu với cấu trúc hương rõ, mạch lạc và bền.",
    ingredients: ["Bồ công anh", "cà gai leo", "kim ngân", "diệp hạ châu", "thảo quyết minh", "mã đề"],
    benefits: ["Dễ uống", "Thích hợp dùng nóng", "Hương thơm tự nhiên"],
    packageLabel: "Hộp 30 túi lọc x 3g/túi",
    image: "/products/thanh-nhiet-mat-gan-box.jpg",
    imageWidth: 1563,
    imageHeight: 1006,
    boxImage: "/products/thanh-nhiet-mat-gan-box.jpg",
    boxImageWidth: 1563,
    boxImageHeight: 1006,
    origin: "Việt Nam",
  },
  {
    slug: "tra-gao-lut-la-sen-tui",
    name: "Trà Gạo Lứt Lá Sen Hòa Phúc - Túi",
    category: "Dưỡng sinh",
    shortDescription: "Phiên bản đóng gói gọn nhẹ với vị ngũ cốc thanh và hậu vị sen dịu.",
    longDescription:
      "Trà Gạo Lứt Lá Sen dạng túi phù hợp cho những ai muốn thưởng thức hương vị mộc lành trong một quy cách tiện mang theo.",
    ingredients: ["Gạo lứt", "lá sen", "thảo quyết minh", "cỏ ngọt", "hoa hòe"],
    benefits: ["Dễ mang theo", "Hậu vị dịu", "Phù hợp dùng hằng ngày"],
    packageLabel: "Hộp trà túi lọc",
    image: "/products/tra-gao-lut-la-sen-tui.svg",
    imageWidth: 1200,
    imageHeight: 900,
    boxImage: "/products/tra-gao-lut-la-sen-tui.svg",
    boxImageWidth: 1200,
    boxImageHeight: 900,
    origin: "Việt Nam",
  },
  {
    slug: "tra-duong-tam-an-nhien-tui",
    name: "Trà Dưỡng Tâm An Nhiên - Túi",
    category: "Trà thảo mộc",
    shortDescription: "Quy cách gọn nhẹ, hương trà dịu và cân bằng cho những khoảng nghỉ mỗi ngày.",
    longDescription:
      "Phiên bản túi của Trà Dưỡng Tâm An Nhiên mang đến trải nghiệm pha trà nhanh gọn, phù hợp mang theo hoặc làm quà tặng nhỏ.",
    ingredients: ["Lạc tiên", "thảo quyết minh", "lá nếp", "cỏ ngọt", "vỏ long nhãn", "hoa cúc"],
    benefits: ["Hương vị dễ uống", "Dễ mang theo", "Phù hợp dùng hằng ngày"],
    packageLabel: "Hộp trà túi lọc",
    image: "/products/tra-duong-tam-an-nhien-tui.svg",
    imageWidth: 1200,
    imageHeight: 900,
    boxImage: "/products/tra-duong-tam-an-nhien-tui.svg",
    boxImageWidth: 1200,
    boxImageHeight: 900,
    origin: "Cúc Phương, Ninh Bình",
  },
  {
    slug: "thao-duoc-ngam-chan",
    name: "Thảo dược ngâm chân",
    category: "Dưỡng sinh",
    shortDescription: "Lựa chọn tiện lợi cho một khoảng thư giãn nhẹ nhàng tại nhà.",
    longDescription:
      "Thảo dược ngâm chân Hòa Phúc được đóng gói gọn gàng, phù hợp sử dụng trong thói quen chăm sóc và thư giãn hằng ngày.",
    ingredients: ["Thảo dược tự nhiên"],
    benefits: ["Dễ sử dụng tại nhà", "Tiện lợi khi mang theo", "Phù hợp làm quà"],
    packageLabel: "Hộp",
    image: "/products/thao-duoc-ngam-chan.svg",
    imageWidth: 1200,
    imageHeight: 900,
    boxImage: "/products/thao-duoc-ngam-chan.svg",
    boxImageWidth: 1200,
    boxImageHeight: 900,
    origin: "Việt Nam",
  },
  {
    slug: "mat-ong-hoa-phuc",
    name: "Mật ong Hòa Phúc",
    category: "Đặc sản vùng miền",
    shortDescription: "Mật ong Hòa Phúc với vị ngọt tự nhiên, phù hợp dùng hằng ngày hoặc làm quà.",
    longDescription:
      "Mật ong Hòa Phúc là lựa chọn đặc sản gọn đẹp, phù hợp bổ sung vào gian bếp gia đình hoặc trao tặng người thân.",
    ingredients: ["Mật ong"],
    benefits: ["Vị ngọt tự nhiên", "Dễ dùng hằng ngày", "Phù hợp làm quà"],
    packageLabel: "Chai",
    image: "/products/mat-ong-hoa-phuc.svg",
    imageWidth: 1200,
    imageHeight: 900,
    boxImage: "/products/mat-ong-hoa-phuc.svg",
    boxImageWidth: 1200,
    boxImageHeight: 900,
    origin: "Việt Nam",
  },
];
