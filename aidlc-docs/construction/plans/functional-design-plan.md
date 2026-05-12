# Functional Design Plan — app.js

## Mô hình Logic

### 1. Dữ liệu Kịch bản (scenarios)
Object chứa 3 kịch bản, mỗi kịch bản có:
- `id`, `name`, `short`, `desc` — thông tin hiển thị
- `type` — greenfield/brownfield
- `complexity` — minimal/standard/comprehensive
- `userFacing`, `multiUnit`, `needsNFR`, `needsInfra`, `needsAppDesign` — flags quyết định stages

### 2. Dữ liệu Bước (getData)
Hàm nhận `(stepId, scenario)`, trả về object:
- `analysis` — HTML phân tích của hệ thống
- `decision` — đề xuất (optional)
- `questions` — mảng câu hỏi (optional)
- `stories` — mảng user stories (optional)
- `plan` — mảng {stage, dec, why} (optional)
- `units` — mảng {n, d} (optional)
- `artifacts` — mảng tên file (optional)
- `options` — mảng {id, label, t} cho approval gate
- `skip` — boolean, `skipReason` — lý do bỏ qua
- `placeholder` — boolean, nếu true thì hiển thị dạng thông tin (không có approval gate)
- `futureScope` — mảng string mô tả nội dung tương lai (cho Operations)
- `opsSections` — mảng {icon, title, items[]} — 5 mục chi tiết Operations (Deployment, Monitoring, Incident, Maintenance, Readiness)
- `timeline` — mảng {when, what} — roadmap sau khi code hoàn tất

### 3. Dữ liệu IO (getIO)
Hàm nhận `(stepId, scenario)`, trả về:
- `inputs` — mảng đường dẫn file đầu vào
- `outputs` — mảng đường dẫn file đầu ra
- `rules` — mảng đường dẫn rule files

### 4. Trạng thái
- `selected` — scenario đã chọn (null ban đầu)
- `idx` — index bước hiện tại
- `decisions` — object {stepId: decisionId}
- `visited` — object {stepId: true} — track bước đã xem (animation chỉ chạy lần đầu)

### 5. Luồng Render
```
render() → step.id === 'select' ? renderSelect() : renderStep(step)
         → đánh dấu visited[step.id] = true sau khi render
renderStep() → getData() → check visited → nếu chưa: class "think" (animation), nếu rồi: không class
decide() → KHÔNG gọi render() → chỉ append kết quả vào DOM hiện tại
renderResult() → getIO() → hiển thị IO summary
```

### 6. Navigation
- `next()` / `prev()` — thay đổi idx, gọi render()
- `goTo(i)` — nhảy đến bước i
- Keyboard: ArrowLeft/Right
- updateUI() — cập nhật sidebar states, progress bar, button disabled
