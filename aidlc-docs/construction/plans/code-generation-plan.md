# Code Generation Plan — AI-DLC Interactive Walkthrough

## Kế hoạch Sinh mã

### Unit 1: index.html
- [x] Tạo cấu trúc HTML5 với lang="vi"
- [x] Sidebar: header + phase-nav với 13 buttons
- [x] Main: content-header (nav buttons + progress) + content-body
- [x] Link styles.css và app.js

### Unit 2: styles.css
- [x] CSS variables (palette: pri, ok, mut, gate)
- [x] Sidebar styles (fixed, dark background)
- [x] Content area (flex layout, sticky header)
- [x] Card styles (border-radius, padding)
- [x] Thinking animation (clip-path typewriter, staggered delays)
- [x] Dots pulse animation
- [x] Approval gate styles (purple border)
- [x] Decision result styles (green/blue background)
- [x] IO summary styles (file list)
- [x] Skip notice styles (dashed border, muted)
- [x] Plan table, units list, question list, story list
- [x] Scenario cards (selectable)
- [x] Responsive (hide sidebar on mobile)

### Unit 3: app.js
- [x] scenarios object (3 kịch bản với flags)
- [x] steps array (13 bước)
- [x] getIO() — input/output/rules theo spec
- [x] getData() — phân tích chi tiết + options cụ thể theo từng kịch bản
- [x] render() — dispatcher, đánh dấu visited
- [x] renderSelect() — scenario cards
- [x] renderStep() — thinking blocks (chỉ lần đầu) + approval gate
- [x] renderSkip() — skip notice + override option
- [x] renderPlaceholder() — hiển thị dạng thông tin cho Operations với:
  - 5 sections chi tiết (Deployment, Monitoring, Incident, Maintenance, Readiness)
  - Timeline/roadmap sau khi code hoàn tất
  - Nội dung cụ thể theo từng scenario (bugfix/greenfield/brownfield)
- [x] renderResult() — decision + IO summary (append, không re-render)
- [x] pick(), decide() — user actions (KHÔNG auto-navigate, KHÔNG re-render toàn bộ)
- [x] visited tracking — animation chỉ chạy lần đầu, quay lại thì hiện ngay
- [x] Navigation: next(), prev(), goTo(), updateUI()
- [x] Event listeners: buttons, sidebar, keyboard

## Iterations
1. **v1**: Cấu trúc cơ bản, 3 scenarios, 12 steps
2. **v2**: Tiếng Việt có dấu, thuật ngữ
3. **v3**: Thinking animation, options khác nhau theo scenario, palette giảm
4. **v4**: Không auto-navigate, IO summary, chuẩn hóa thư mục
5. **v5**: Fix animation chạy lại khi decide (append thay vì re-render)
6. **v6**: Đổi animation sang clip-path typewriter, thêm visited tracking
7. **v7**: Nội dung chi tiết hơn cho từng case (entities, code snippets, test cases cụ thể)
8. **v8**: Thêm Pha Vận hành (Operations) — step 13, placeholder, không gate
9. **v9**: Mở rộng Operations với 5 sections chi tiết + timeline theo từng case
10. **v10**: Di chuyển code ra workspace root (theo spec: app code NEVER in aidlc-docs/)
11. **v11**: Thêm footer credit (link GitHub) + sidebar link tài liệu tham khảo
