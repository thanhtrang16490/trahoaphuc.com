import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Chính sách giao hàng",
  description: "Chính sách giao hàng và thời gian xử lý đơn hàng của Nông Sản Hòa Phúc.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Chính sách giao hàng"
      slug="chinh-sach-giao-hang"
      intro="Chính sách dưới đây giúp khách hàng hiểu rõ cách chúng tôi xử lý, đóng gói và giao các đơn hàng từ website."
      sections={[
        {
          title: "Phạm vi giao hàng",
          content: [
            "Chúng tôi hỗ trợ giao hàng trên toàn quốc thông qua các đơn vị vận chuyển phù hợp theo từng khu vực.",
            "Với khu vực gần điểm kinh doanh, chúng tôi có thể chủ động sắp xếp giao nhanh theo thỏa thuận trước khi chốt đơn.",
          ],
        },
        {
          title: "Thời gian xử lý",
          content: [
            "Đơn hàng thường được xác nhận trong giờ làm việc. Thời gian chuẩn bị hàng phụ thuộc vào số lượng sản phẩm và tình trạng đóng gói thực tế.",
            "Khi cần xử lý gấp, bạn nên nhắn trực tiếp qua fanpage hoặc Zalo để được hỗ trợ nhanh hơn.",
          ],
        },
        {
          title: "Phí vận chuyển",
          content: [
            "Phí ship sẽ được thông báo trước khi hoàn tất đơn hàng và có thể thay đổi theo khu vực, trọng lượng và phương thức giao.",
            "Các chương trình hỗ trợ phí vận chuyển hoặc freeship nếu có sẽ được công bố rõ trên website hoặc fanpage chính thức.",
          ],
        },
        {
          title: "Nhận hàng",
          content: [
            "Khi nhận hàng, vui lòng kiểm tra tình trạng gói hàng và liên hệ ngay nếu có dấu hiệu móp méo, hư hỏng hoặc giao sai sản phẩm.",
            "Việc phản hồi sớm giúp chúng tôi xử lý nhanh hơn và đảm bảo quyền lợi cho khách hàng.",
          ],
        },
      ]}
    />
  );
}

