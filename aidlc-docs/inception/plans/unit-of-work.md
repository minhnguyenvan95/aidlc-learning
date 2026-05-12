# Units of Work — AI-DLC Interactive Walkthrough

## Đơn vị Công việc

### Unit 1: index.html
- **Trách nhiệm**: Cấu trúc trang, sidebar navigation, main content area
- **Phụ thuộc**: Không (tệp gốc)
- **Vị trí**: Workspace root (`/index.html`)
- **Kích thước**: ~45 dòng

### Unit 2: styles.css
- **Trách nhiệm**: Toàn bộ giao diện — layout, colors, animations (clip-path typewriter), responsive
- **Phụ thuộc**: index.html (class names)
- **Vị trí**: Workspace root (`/styles.css`)
- **Kích thước**: ~154 dòng

### Unit 3: app.js
- **Trách nhiệm**: Logic tương tác — scenarios, step data, IO data, rendering, navigation, visited tracking
- **Phụ thuộc**: index.html (DOM elements), styles.css (CSS classes)
- **Vị trí**: Workspace root (`/app.js`)
- **Kích thước**: ~342 dòng

## Dependency Map

```
index.html ← styles.css
index.html ← app.js
app.js → DOM (#contentBody, #prevBtn, #nextBtn, #progressFill, .phase-btn)
app.js → CSS classes (.think, .sys, .gate-card, .approval-btn, .io-file, ...)
```

## Vị trí theo Spec AI-DLC
- Mã nguồn ứng dụng: **Workspace root** (`/index.html`, `/styles.css`, `/app.js`)
- Tài liệu quy trình: **aidlc-docs/** (requirements, plans, audit, state)
- Tài liệu tham khảo: **docs/aidlc-architecture/** (Mermaid diagrams)

## Thứ tự Thực thi
1. index.html (cấu trúc trước)
2. styles.css (giao diện)
3. app.js (logic — cần DOM đã sẵn sàng)
