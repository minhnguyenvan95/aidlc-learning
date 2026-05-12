# Requirements — AI-DLC Interactive Walkthrough

## Tóm tắt Yêu cầu
Xây dựng trang web tĩnh (UI-only) để hướng dẫn tương tác kỹ thuật AI-DLC, cho phép người dùng đi qua từng bước từ đầu đến cuối với bài toán cụ thể.

## Yêu cầu Chức năng

| ID | Yêu cầu | Mức ưu tiên |
|----|---------|-------------|
| FR-01 | Hiển thị 3 bài toán mẫu (Greenfield, Brownfield, Bugfix) để người dùng chọn | Cao |
| FR-02 | Đi qua 13 giai đoạn AI-DLC tuần tự (12 giai đoạn + 1 Pha Vận hành) với nút Trước/Tiếp | Cao |
| FR-03 | Mỗi giai đoạn hiển thị phân tích của hệ thống phù hợp với bài toán đã chọn | Cao |
| FR-04 | Mỗi giai đoạn có Cổng Phê duyệt — người dùng phải chọn option trước khi tiếp | Cao |
| FR-05 | Options lựa chọn khác nhau theo từng bài toán (không generic) | Cao |
| FR-06 | Giai đoạn bị bỏ qua hiển thị rõ lý do và cho phép ghi đè | Trung bình |
| FR-07 | Sau khi phê duyệt, hiển thị Input/Output chi tiết (file đọc, file tạo, rules) | Cao |
| FR-08 | Sidebar hiển thị trạng thái: đang chạy, hoàn thành, bỏ qua | Trung bình |
| FR-09 | Hỗ trợ điều hướng bàn phím (←→) | Thấp |
| FR-10 | Không tự động chuyển trang khi chọn option — phải nhấn "Tiếp" thủ công | Cao |
| FR-11 | Animation chỉ chạy lần đầu vào step — quay lại step đã xem thì hiện ngay | Cao |
| FR-12 | Khi chọn option, chỉ append kết quả — không re-render toàn bộ trang | Cao |
| FR-13 | Hiển thị Pha Vận hành (Operations) sau Build & Test — giải thích đây là placeholder với nội dung tương lai (deployment, monitoring, incident response) | Trung bình |
| FR-14 | Pha Vận hành hiển thị khác biệt (trạng thái "placeholder") và không có Cổng Phê duyệt — chỉ thông tin | Trung bình |
| FR-15 | Pha Vận hành chia thành 5 mục chi tiết theo từng case: Deployment, Monitoring, Incident Response, Maintenance, Production Readiness Checklist | Cao |
| FR-16 | Mỗi mục trong Pha Vận hành có nội dung cụ thể cho bài toán đã chọn (Bugfix: rollback plan, Greenfield: go-live checklist, Brownfield: PCI-DSS audit) | Cao |
| FR-17 | Hiển thị timeline/roadmap đề xuất sau khi code hoàn tất (ngày 0: deploy, ngày 1-7: monitor, tháng 1: retrospective) | Trung bình |
| FR-18 | Footer credit với link đến source code GitHub | Thấp |
| FR-19 | Sidebar header có link "Tài liệu tham khảo" đến docs/aidlc-architecture trên GitHub | Thấp |

## Yêu cầu Phi Chức năng

| ID | Yêu cầu |
|----|---------|
| NFR-01 | Toàn bộ nội dung bằng tiếng Việt có dấu, thuật ngữ kỹ thuật giữ tiếng Anh trong ngoặc |
| NFR-02 | Không dùng framework — HTML/CSS/JS thuần, mở trực tiếp trong browser |
| NFR-03 | Màu sắc tối giản: xanh dương (primary), xám (muted), tím nhạt (gate) |
| NFR-04 | Animation typewriter (clip-path reveal) cho các block nội dung, chỉ chạy lần đầu |
| NFR-05 | Responsive — ẩn sidebar trên mobile |

## Ràng buộc
- Không cần backend/server
- Không cần database
- Dữ liệu Input/Output phải khớp với spec trong `.aidlc/aws-aidlc-rules/core-workflow.md`
- Mã nguồn ứng dụng (html, css, js) nằm ở workspace root — KHÔNG trong aidlc-docs/
- aidlc-docs/ chỉ chứa tài liệu quy trình
