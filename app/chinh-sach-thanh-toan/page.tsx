import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Chính sách thanh toán",
  description: "Chính sách thanh toán của Nông Sản Hòa Phúc cho các đơn hàng trên website.",
};

export default function PaymentPolicyPage() {
  return (
    <PolicyPage
      title="Chính sách thanh toán"
      slug="chinh-sach-thanh-toan"
      intro="Chính sách này giúp khách hàng hiểu rõ các phương thức thanh toán đang được áp dụng trên website."
      sections={[
        {
          title: "Phương thức thanh toán",
          content: [
            "Khách hàng có thể thanh toán theo hình thức thỏa thuận trực tiếp khi chốt đơn, chuyển khoản hoặc COD tùy vào khu vực giao hàng.",
            "Trong trường hợp có thay đổi về phương thức thanh toán, chúng tôi sẽ cập nhật ngay trên website hoặc kênh bán hàng chính thức.",
          ],
        },
        {
          title: "Xác nhận đơn",
          content: [
            "Đơn hàng chỉ được xử lý sau khi khách hàng cung cấp đầy đủ thông tin cần thiết và xác nhận phương thức thanh toán phù hợp.",
            "Với các đơn hàng giá trị lớn hoặc yêu cầu riêng, chúng tôi có thể liên hệ lại để xác nhận trước khi gửi đi.",
          ],
        },
        {
          title: "Chứng từ và thông tin",
          content: [
            "Khi cần, khách hàng có thể yêu cầu thông tin đơn hàng để đối chiếu và theo dõi quá trình xử lý.",
            "Nếu phát sinh sai lệch trong quá trình thanh toán, vui lòng liên hệ sớm để chúng tôi kiểm tra và hỗ trợ.",
          ],
        },
        {
          title: "Lưu ý",
          content: [
            "Các nội dung thanh toán hiện tại áp dụng theo mô hình bán hàng trực tiếp của thương hiệu và có thể được mở rộng sau này.",
            "Khi tích hợp cổng thanh toán chính thức, trang này sẽ được cập nhật để phản ánh chính sách mới.",
          ],
        },
      ]}
    />
  );
}

