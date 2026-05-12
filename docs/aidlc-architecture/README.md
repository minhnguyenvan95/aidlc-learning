# AI-DLC Architecture Documentation

Tài liệu phân tích kiến trúc và luồng xử lý của AI-DLC (AI-Driven Development Life Cycle), sử dụng Mermaid diagrams để trực quan hóa.

## Danh sách tài liệu

| File | Nội dung |
|------|----------|
| [01-overall-workflow.md](./01-overall-workflow.md) | Tổng quan 3 phase, sơ đồ workflow chính |
| [02-inception-phase.md](./02-inception-phase.md) | Chi tiết INCEPTION: Workspace Detection, Reverse Engineering, Requirements Analysis, User Stories, Workflow Planning, Application Design, Units Generation |
| [03-construction-phase.md](./03-construction-phase.md) | Chi tiết CONSTRUCTION: Per-Unit Loop, Functional Design, NFR, Infrastructure, Code Generation, Build & Test |
| [04-decision-logic.md](./04-decision-logic.md) | Logic quyết định: Decision tree, Adaptive depth, User Stories assessment, Extension opt-in, Mid-workflow changes |
| [05-cross-cutting-concerns.md](./05-cross-cutting-concerns.md) | Cơ chế xuyên suốt: Q&A flow, Session continuity, Error handling, Audit logging, Overconfidence prevention |
| [06-extensions-system.md](./06-extensions-system.md) | Hệ thống Extensions: Security Baseline (15 rules), Property-Based Testing (10 rules), Blocking behavior |

## Cách đọc

1. Bắt đầu với **01-overall-workflow.md** để hiểu bức tranh tổng thể
2. Đọc **02** và **03** để hiểu chi tiết từng phase
3. Đọc **04** để hiểu logic phân nhánh và quyết định
4. Đọc **05** để hiểu các cơ chế hỗ trợ xuyên suốt
5. Đọc **06** nếu quan tâm đến Security và Testing extensions

## Tóm tắt kiến trúc

```
AI-DLC = 3 Phases × Adaptive Depth × Extensions

INCEPTION (7 stages)  →  CONSTRUCTION (6 stages per-unit)  →  OPERATIONS (placeholder)
     ↓                          ↓
  WHAT & WHY                   HOW
     ↓                          ↓
  Requirements              Design → Code → Test
  Architecture              (loop per unit of work)
  Planning
```

## Nguyên tắc cốt lõi

- **Adaptive**: Workflow tự điều chỉnh theo độ phức tạp
- **Gate-based**: Mỗi stage có approval gate — không tự động tiến tới
- **Auditable**: Mọi interaction được log trong audit.md
- **Extensible**: Extensions thêm blocking constraints
- **Overconfidence Prevention**: Khi nghi ngờ → HỎI, không giả định
