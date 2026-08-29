import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Chính sách đổi trả",
  description: "Chính sách đổi trả và xử lý khiếu nại đơn hàng của Nông Sản Hòa Phúc.",
};

export default function ReturnPolicyPage() {
  return (
    <PolicyPage
      title="Chính sách đổi trả"
      slug="chinh-sach-doi-tra"
      intro="Trang này mô tả nguyên tắc đổi trả hàng hóa để khách hàng nắm rõ trước khi đặt mua."
      sections={[
        {
          title: "Trường hợp hỗ trợ đổi trả",
          content: [
            "Sản phẩm giao sai mẫu, sai số lượng hoặc có lỗi phát sinh trong quá trình vận chuyển có thể được xem xét hỗ trợ.",
            "Vui lòng phản hồi sớm sau khi nhận hàng kèm hình ảnh thực tế để việc xử lý được nhanh và chính xác hơn.",
          ],
        },
        {
          title: "Điều kiện áp dụng",
          content: [
            "Sản phẩm nên còn nguyên tình trạng ban đầu, chưa qua sử dụng và giữ được bao bì, phụ kiện đi kèm nếu có.",
            "Một số trường hợp đặc thù liên quan đến thực phẩm hoặc hàng đã mở niêm phong có thể cần xem xét riêng theo từng đơn hàng.",
          ],
        },
        {
          title: "Cách gửi yêu cầu",
          content: [
            "Khách hàng có thể liên hệ qua trang liên hệ, fanpage hoặc Zalo để cung cấp mã đơn hàng, mô tả vấn đề và hình ảnh minh họa.",
            "Sau khi tiếp nhận, chúng tôi sẽ phản hồi hướng xử lý phù hợp tùy vào tình huống thực tế.",
          ],
        },
        {
          title: "Lưu ý",
          content: [
            "Chính sách này có thể được điều chỉnh theo thực tế vận hành để phù hợp hơn với quy trình bán hàng của thương hiệu.",
            "Bạn nên kiểm tra lại nội dung trước khi đặt hàng nếu sản phẩm được mua cho mục đích biếu tặng hoặc sự kiện quan trọng.",
          ],
        },
      ]}
    />
  );
}

