export const vietnamProvinces = [
  "An Giang", "Bắc Ninh", "Cao Bằng", "Cà Mau", "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp",
  "Gia Lai", "Hà Tĩnh", "Hưng Yên", "Khánh Hòa", "Lai Châu", "Lạng Sơn", "Lào Cai", "Lâm Đồng",
  "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh",
  "Thái Nguyên", "Thanh Hóa", "Tuyên Quang", "Vĩnh Long", "Hà Nội", "Hải Phòng", "Huế", "Đà Nẵng", "Cần Thơ", "Hồ Chí Minh",
] as const;

export type VietnamProvince = (typeof vietnamProvinces)[number];
