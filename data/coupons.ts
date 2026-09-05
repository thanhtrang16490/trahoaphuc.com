export type CouponType = "percent" | "fixed" | "shipping";

export type CouponOffer = {
  label: string;
  type: CouponType;
  value: number;
  minSubtotal: number;
  note: string;
  source: string;
};

export type CouponCatalog = Record<string, CouponOffer>;

export const couponCatalog: CouponCatalog = {
  HOAPHUC5: {
    label: "Giảm 5%",
    type: "percent",
    value: 0.05,
    minSubtotal: 0,
    note: "Áp dụng cho mọi đơn hàng",
    source: "Mã dành cho khách mới",
  },
  FREESHIP200: {
    label: "Miễn phí ship",
    type: "shipping",
    value: 30000,
    minSubtotal: 200000,
    note: "Đơn từ 200.000đ",
    source: "Mã vận chuyển của Hòa Phúc",
  },
  HOAPHUC10: {
    label: "Giảm 10%",
    type: "percent",
    value: 0.1,
    minSubtotal: 1000000,
    note: "Đơn từ 1.000.000đ",
    source: "Mã thành viên thân thiết",
  },
  HOAPHUC15: {
    label: "Giảm 15%",
    type: "percent",
    value: 0.15,
    minSubtotal: 1500000,
    note: "Ưu đãi thành viên, đơn từ 1.500.000đ",
    source: "Mã thành viên thân thiết",
  },
  HOAPHUC100: {
    label: "Giảm 100.000đ",
    type: "fixed",
    value: 100000,
    minSubtotal: 500000,
    note: "Đơn từ 500.000đ",
    source: "Voucher quà tặng từ vòng quay",
  },
  HOAPHUCBI: {
    label: "Giảm 50.000đ",
    type: "fixed",
    value: 50000,
    minSubtotal: 300000,
    note: "Đơn từ 300.000đ",
    source: "Mã bí mật từ vòng quay",
  },
};
