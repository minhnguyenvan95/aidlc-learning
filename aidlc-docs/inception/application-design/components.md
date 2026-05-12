# Application Design — Components

## Kiến trúc Tổng quan
Single Page Application (SPA) thuần HTML/CSS/JS, không framework.

## Thành phần

### 1. Sidebar Navigation
- Hiển thị 14 bước (1 chọn bài toán + 12 giai đoạn + 1 Operations)
- Trạng thái: active, done, skipped
- Phase labels: Pha Khởi Đầu, Pha Xây Dựng, Pha Vận Hành
- Badges: LUÔN, ĐK (điều kiện)
- Link "Tài liệu tham khảo" → GitHub docs/aidlc-architecture

### 2. Content Area
- Step header (phase tag, title, scenario name)
- Thinking animation blocks (clip-path typewriter, chỉ lần đầu vào step)
- System analysis card (nội dung chi tiết: entities, code snippets, state machines)
- Context-specific content (questions, stories, plan table, units)
- Approval gate card (options cụ thể theo từng scenario)
- Decision result + IO summary (append vào DOM, không re-render)

### 3. Navigation Controls
- Nút Trước/Tiếp
- Progress bar
- Keyboard arrows (←→)

### 4. Footer
- Credit link đến source code GitHub

## Vị trí File
- Mã nguồn: workspace root (`/index.html`, `/styles.css`, `/app.js`)
- Tài liệu: `aidlc-docs/`

## Dữ liệu (Data Layer)

### scenarios object
3 kịch bản: greenfield, brownfield, bugfix. Mỗi kịch bản có flags quyết định stages nào chạy.

### steps array
13 phần tử, mỗi phần tử có id, title, phase, always flag.

### getData(stepId, scenario)
Trả về phân tích, câu hỏi, stories, plan, units, options — tất cả phụ thuộc vào scenario đã chọn.

### getIO(stepId, scenario)
Trả về inputs, outputs, rules — đường dẫn file theo spec `.aidlc/core-workflow.md`.

## Tech Stack
- **HTML5**: Cấu trúc semantic
- **CSS3**: Custom properties, animations, grid/flex
- **Vanilla JS**: DOM manipulation, event handling
- **Không có**: framework, bundler, package manager, server
