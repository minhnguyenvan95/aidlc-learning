# aidlc-walkthrough

> **[🚀 Xem Demo Trực Tiếp](https://aidlc-walkthrough.netlify.app)**

Trang web tương tác giúp bạn hiểu quy trình **AI-DLC (AI-Driven Development Life Cycle)** bằng cách đi qua từng bước với bài toán thực tế.

## Demo

👉 **https://aidlc-walkthrough.netlify.app**

Hoặc mở `aidlc-docs/index.html` trong trình duyệt — không cần cài đặt gì.

## AI-DLC là gì?

AI-DLC là quy trình phát triển phần mềm có cấu trúc, trong đó AI đề xuất quyết định ở mỗi bước và **con người phê duyệt** trước khi tiến tới. Quy trình tự điều chỉnh (adaptive) theo độ phức tạp của yêu cầu.

```
AI-DLC = 3 Pha × Độ Sâu Thích Ứng × Phần Mở Rộng

Pha Khởi Đầu (7 stages) → Pha Xây Dựng (6 stages/unit) → Pha Vận Hành
     CÁI GÌ & TẠI SAO              NHƯ THẾ NÀO                TRIỂN KHAI & GIÁM SÁT
```

## Cách sử dụng

1. Mở `aidlc-docs/index.html`
2. Chọn 1 trong 3 bài toán mẫu:
   - **Todo App (Greenfield)** — xây dựng từ đầu, độ phức tạp trung bình
   - **Payment E-commerce (Brownfield)** — tích hợp vào hệ thống có sẵn, phức tạp cao
   - **Bugfix API chậm** — sửa lỗi đơn giản, tối thiểu
3. Đi qua 13 giai đoạn — mỗi bước hệ thống phân tích và đề xuất
4. Bạn đóng vai **người phê duyệt**: chấp nhận hoặc yêu cầu thay đổi
5. Sau mỗi quyết định, xem chi tiết Input/Output (file nào được đọc, file nào được tạo)

## Tính năng

- 3 kịch bản với nội dung phân tích khác nhau hoàn toàn
- Giai đoạn bị bỏ qua hiển thị rõ lý do (adaptive workflow)
- Animation typewriter khi hệ thống "suy nghĩ" (chỉ lần đầu)
- Input/Output chi tiết theo spec `.aidlc/core-workflow.md`
- Sidebar hiển thị trạng thái: hoàn thành ✓, bỏ qua, đang xem
- Điều hướng bàn phím (←→)
- Responsive (mobile-friendly)
- Không framework, không build step — HTML/CSS/JS thuần

## Cấu trúc thư mục

```
.
├── .aidlc/                          # Quy tắc AI-DLC (engine)
│   └── aws-aidlc-rule-details/      # Rule files cho từng stage
├── aidlc-docs/                      # Sản phẩm + tài liệu quy trình
│   ├── index.html                   # Trang demo (mở trong browser)
│   ├── styles.css                   # Giao diện
│   ├── app.js                       # Logic tương tác
│   ├── aidlc-state.md               # Trạng thái quy trình
│   ├── audit.md                     # Nhật ký kiểm toán
│   ├── inception/                   # Tài liệu Pha Khởi Đầu
│   │   ├── requirements/            # Yêu cầu chức năng + phi chức năng
│   │   ├── user-stories/            # Câu chuyện người dùng
│   │   ├── plans/                   # Kế hoạch thực thi + đơn vị công việc
│   │   ├── application-design/      # Thiết kế kiến trúc
│   │   └── reverse-engineering/     # (Bỏ qua — Greenfield)
│   ├── construction/                # Tài liệu Pha Xây Dựng
│   │   ├── plans/                   # Kế hoạch sinh mã + thiết kế chức năng
│   │   └── build-and-test/          # Hướng dẫn kiểm thử
│   └── operations/                  # Tài liệu Pha Vận Hành
└── docs/aidlc-architecture/         # Tài liệu phân tích kiến trúc AI-DLC (Mermaid diagrams)
```

## Dự án này được xây dựng bằng AI-DLC

Toàn bộ quá trình phát triển trang web này đi theo đúng quy trình AI-DLC:

1. **Workspace Detection** → Greenfield
2. **Requirements Analysis** → 17 yêu cầu chức năng, 5 phi chức năng
3. **User Stories** → 5 câu chuyện với tiêu chí chấp nhận
4. **Workflow Planning** → Skip RE, NFR, Infra. Execute 8/13 stages.
5. **Application Design** → SPA thuần HTML/CSS/JS
6. **Units Generation** → 3 đơn vị (html, css, js)
7. **Functional Design** → Data model, render flow, navigation
8. **Code Generation** → 9 iterations theo feedback
9. **Build & Test** → 12 test cases thủ công
10. **Operations** → Static hosting, không cần server

Xem chi tiết trong `aidlc-docs/aidlc-state.md` và `aidlc-docs/audit.md`.

## Tech Stack

- HTML5 + CSS3 + Vanilla JavaScript
- Không dependencies, không build tools
- Mở trực tiếp trong browser

## License

MIT
