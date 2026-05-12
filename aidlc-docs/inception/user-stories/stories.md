# User Stories — AI-DLC Interactive Walkthrough

## Persona
**Người học AI-DLC** — Developer hoặc tech lead muốn hiểu quy trình AI-DLC trước khi áp dụng vào dự án thực tế.

## Câu chuyện

### US-01: Chọn bài toán phù hợp
> Là người học, tôi muốn chọn 1 trong 3 bài toán mẫu (đơn giản/trung bình/phức tạp) để thấy AI-DLC xử lý khác nhau tùy độ phức tạp.

**Tiêu chí chấp nhận:**
- Hiển thị 3 card với mô tả rõ ràng
- Click chọn → highlight card
- Nhấn "Tiếp" mới chuyển sang bước 1

### US-02: Hiểu quyết định của hệ thống
> Là người học, tôi muốn thấy hệ thống phân tích và đưa ra đề xuất ở mỗi bước để hiểu logic quyết định.

**Tiêu chí chấp nhận:**
- Mỗi bước hiển thị phân tích cụ thể cho bài toán đã chọn
- Có animation "thinking" để mô phỏng quá trình suy nghĩ
- Đề xuất rõ ràng (ví dụ: "Đề xuất độ sâu TIÊU CHUẨN")

### US-03: Đóng vai người phê duyệt
> Là người học, tôi muốn phê duyệt hoặc từ chối đề xuất của hệ thống để hiểu vai trò kiểm soát của con người trong AI-DLC.

**Tiêu chí chấp nhận:**
- Cổng phê duyệt với options cụ thể (không generic)
- Không tự động chuyển trang — tôi quyết định khi nào tiếp
- Kết quả hiển thị rõ: đã phê duyệt hay yêu cầu thay đổi

### US-04: Biết file nào được đọc/tạo
> Là người học, tôi muốn thấy Input/Output chi tiết (đường dẫn file) ở mỗi bước để hiểu cấu trúc tài liệu AI-DLC tạo ra.

**Tiêu chí chấp nhận:**
- Sau khi phê duyệt, hiển thị: file đầu vào, file đầu ra, rule files
- Đường dẫn khớp với spec thực tế trong `.aidlc/core-workflow.md`

### US-05: Hiểu giai đoạn nào bị bỏ qua và tại sao
> Là người học, tôi muốn thấy rõ giai đoạn nào bị bỏ qua với lý do cụ thể để hiểu tính adaptive của AI-DLC.

**Tiêu chí chấp nhận:**
- Giai đoạn skip hiển thị khác biệt (mờ, gạch ngang trên sidebar)
- Lý do bỏ qua liên quan đến bài toán đã chọn
- Có option "Ghi đè" nếu muốn thực thi
