# Build & Test Summary — AI-DLC Interactive Walkthrough

## Hướng dẫn Xây dựng

### Điều kiện tiên quyết
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Không cần cài đặt gì thêm

### Cách chạy
```bash
# Mở trực tiếp trong browser
open aidlc-docs/index.html

# Hoặc dùng live server (tùy chọn)
npx serve aidlc-docs/
```

## Kiểm thử

### Kiểm tra Cú pháp
- **Phương pháp**: IDE diagnostics (getDiagnostics)
- **Kết quả**: ✅ Không có lỗi cho cả 3 tệp (app.js, index.html, styles.css)

### Kiểm tra Chức năng (Thủ công)

| # | Test Case | Kết quả |
|---|-----------|---------|
| 1 | Mở index.html trong browser | ✅ Trang hiển thị đúng |
| 2 | Click chọn 1 trong 3 bài toán | ✅ Card highlight, nút Tiếp enabled |
| 3 | Nhấn Tiếp → hiển thị GĐ 1 | ✅ Animation typewriter chạy, phân tích đúng scenario |
| 4 | Click option phê duyệt | ✅ Append kết quả + IO summary, KHÔNG re-render, KHÔNG animation lại |
| 5 | Nhấn Tiếp → GĐ 2 (skip nếu greenfield) | ✅ Skip notice hiển thị đúng |
| 6 | Sidebar hiển thị trạng thái done/skipped | ✅ Checkmark và italic |
| 7 | Keyboard ←→ điều hướng | ✅ Hoạt động |
| 8 | Đổi bài toán → reset decisions + visited | ✅ Quay lại trang chọn, xóa hết, animation chạy lại |
| 9 | Options khác nhau giữa 3 bài toán | ✅ Nội dung cụ thể (entities, code, test cases) |
| 10 | IO summary hiển thị đường dẫn đúng spec | ✅ Khớp với .aidlc/core-workflow.md |
| 11 | Click sidebar quay lại step đã xem | ✅ Hiện ngay, KHÔNG chạy animation lại |
| 12 | Nội dung card sys hiển thị đầy đủ (không bị cắt) | ✅ clip-path không giới hạn chiều cao |
| 13 | Hamburger mở sidebar trên mobile, nút ✕ đóng lại | ✅ toggle class open |
| 14 | Câu hỏi random 3 từ pool, có radio + "Khác" input | ✅ shuffleAndPick, quiz UI |
| 15 | Click phê duyệt → spinner 1.5s → output typewriter | ✅ ai-loading → typeOutputNodes |
| 16 | Nút "Tiếp tục →" hiện sau output + ở trang chọn bài toán | ✅ inline-next |

### Không áp dụng
- Unit tests (không có test framework — static site)
- Integration tests (không có backend)
- Performance tests (không có yêu cầu)
