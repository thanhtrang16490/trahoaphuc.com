import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Chính sách bảo mật thông tin khách hàng của Nông Sản Hòa Phúc.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Chính sách bảo mật"
      slug="chinh-sach-bao-mat"
      intro="Trang này mô tả cách website Nông Sản Hòa Phúc thu thập, sử dụng và bảo vệ thông tin của khách hàng khi mua hàng hoặc để lại liên hệ."
      sections={[
        {
          title: "Thông tin chúng tôi có thể thu thập",
          content: [
            "Họ tên, số điện thoại, địa chỉ nhận hàng, ghi chú đơn hàng và các thông tin cần thiết để xử lý giao dịch.",
            "Thông tin liên hệ được gửi qua form, cuộc gọi, tin nhắn fanpage hoặc Zalo khi bạn chủ động tương tác với chúng tôi.",
          ],
        },
        {
          title: "Mục đích sử dụng",
          content: [
            "Xử lý đơn hàng, liên hệ xác nhận thông tin, giao hàng, chăm sóc khách hàng và hỗ trợ sau bán hàng.",
            "Cải thiện trải nghiệm mua hàng, tối ưu nội dung website và đo lường hiệu quả vận hành ở mức cần thiết.",
          ],
        },
        {
          title: "Bảo vệ dữ liệu",
          content: [
            "Chúng tôi chỉ lưu trữ dữ liệu trong phạm vi phục vụ hoạt động kinh doanh và hạn chế truy cập nội bộ theo nhu cầu công việc.",
            "Trong trường hợp kết nối với các dịch vụ bên thứ ba ở tương lai, chúng tôi sẽ cập nhật nội dung tương ứng để minh bạch hơn với khách hàng.",
          ],
        },
        {
          title: "Quyền của khách hàng",
          content: [
            "Bạn có thể liên hệ để yêu cầu kiểm tra, điều chỉnh hoặc xóa thông tin cá nhân đã cung cấp nếu phù hợp với tình huống sử dụng thực tế.",
            "Nếu bạn không muốn nhận thêm thông tin quảng bá, có thể phản hồi trực tiếp qua kênh liên hệ chính thức.",
          ],
        },
      ]}
    />
  );
}

