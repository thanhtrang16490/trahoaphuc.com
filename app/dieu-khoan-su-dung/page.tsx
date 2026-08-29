import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Điều khoản sử dụng website Nông Sản Hòa Phúc.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Điều khoản sử dụng"
      slug="dieu-khoan-su-dung"
      intro="Điều khoản sử dụng quy định các nguyên tắc cơ bản khi truy cập và sử dụng website Nông Sản Hòa Phúc."
      sections={[
        {
          title: "Phạm vi áp dụng",
          content: [
            "Khi truy cập website, bạn đồng ý với những nội dung được mô tả tại đây và các cập nhật hợp lý trong tương lai.",
            "Website phục vụ mục đích giới thiệu sản phẩm, hỗ trợ mua hàng và truyền tải thông tin thương hiệu.",
          ],
        },
        {
          title: "Trách nhiệm người dùng",
          content: [
            "Người dùng cần cung cấp thông tin trung thực khi đặt hàng hoặc gửi yêu cầu liên hệ.",
            "Không sử dụng website vào mục đích gây gián đoạn, phát tán nội dung sai lệch hoặc ảnh hưởng đến hoạt động kinh doanh của thương hiệu.",
          ],
        },
        {
          title: "Quyền của thương hiệu",
          content: [
            "Nông Sản Hòa Phúc có quyền cập nhật, chỉnh sửa hoặc tạm ngưng một phần nội dung website khi cần thiết để phục vụ vận hành.",
            "Hình ảnh, nội dung và nhận diện trên website thuộc hệ thống thương hiệu, không dùng lại khi chưa có sự đồng ý phù hợp.",
          ],
        },
        {
          title: "Cập nhật điều khoản",
          content: [
            "Các điều khoản này có thể được điều chỉnh theo từng giai đoạn phát triển của website và hoạt động bán hàng.",
            "Khi có thay đổi lớn, chúng tôi sẽ cố gắng thể hiện thông tin rõ ràng ngay trên website để người dùng dễ theo dõi.",
          ],
        },
      ]}
    />
  );
}

