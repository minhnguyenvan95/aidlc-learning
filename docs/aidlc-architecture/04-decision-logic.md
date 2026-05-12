# AI-DLC - Logic Quyết Định & Branching

## Mục đích

Tài liệu này mô tả các điểm quyết định (decision points) trong workflow AI-DLC — nơi hệ thống phân nhánh dựa trên điều kiện cụ thể.

## Decision Tree Tổng Quan

```mermaid
flowchart TD
    REQ(["User Request"])

    D1{"Workspace có<br/>code hiện tại?"}
    D2{"RE artifacts<br/>tồn tại & current?"}
    D3{"Request<br/>complexity?"}
    D4{"User-facing<br/>changes?"}
    D5{"New components<br/>needed?"}
    D6{"Multiple units<br/>needed?"}
    D7{"NFR requirements<br/>exist?"}
    D8{"Infrastructure<br/>changes?"}

    A1["Brownfield Path<br/>→ Reverse Engineering"]
    A2["Greenfield Path<br/>→ Requirements Analysis"]
    A3["Load existing RE<br/>→ Requirements Analysis"]
    A4["Minimal depth"]
    A5["Standard depth"]
    A6["Comprehensive depth"]
    A7["Execute User Stories"]
    A8["Skip User Stories"]
    A9["Execute App Design"]
    A10["Skip App Design"]
    A11["Execute Units Gen"]
    A12["Skip Units Gen<br/>(single unit)"]
    A13["Execute NFR stages"]
    A14["Skip NFR stages"]
    A15["Execute Infra Design"]
    A16["Skip Infra Design"]

    REQ --> D1
    D1 -->|Yes| D2
    D1 -->|No| A2
    D2 -->|No/Stale| A1
    D2 -->|Yes/Current| A3

    A1 & A2 & A3 --> D3
    D3 -->|Simple & clear| A4
    D3 -->|Normal| A5
    D3 -->|Complex & high-risk| A6

    A4 & A5 & A6 --> D4
    D4 -->|Yes| A7
    D4 -->|No| A8

    A7 & A8 --> D5
    D5 -->|Yes| A9
    D5 -->|No| A10

    A9 & A10 --> D6
    D6 -->|Yes| A11
    D6 -->|No| A12

    A11 & A12 --> D7
    D7 -->|Yes| A13
    D7 -->|No| A14

    A13 & A14 --> D8
    D8 -->|Yes| A15
    D8 -->|No| A16

    style REQ fill:#CE93D8,stroke:#6A1B9A,stroke-width:3px,color:#000
    style D1 fill:#FFECB3,stroke:#FF8F00,stroke-width:2px,color:#000
    style D2 fill:#FFECB3,stroke:#FF8F00,stroke-width:2px,color:#000
    style D3 fill:#FFECB3,stroke:#FF8F00,stroke-width:2px,color:#000
    style D4 fill:#FFECB3,stroke:#FF8F00,stroke-width:2px,color:#000
    style D5 fill:#FFECB3,stroke:#FF8F00,stroke-width:2px,color:#000
    style D6 fill:#FFECB3,stroke:#FF8F00,stroke-width:2px,color:#000
    style D7 fill:#FFECB3,stroke:#FF8F00,stroke-width:2px,color:#000
    style D8 fill:#FFECB3,stroke:#FF8F00,stroke-width:2px,color:#000
```

## Adaptive Depth Decision

```mermaid
flowchart LR
    subgraph FACTORS["Yếu tố đánh giá"]
        F1["Request Clarity"]
        F2["Problem Complexity"]
        F3["Scope"]
        F4["Risk Level"]
        F5["Available Context"]
        F6["User Preferences"]
    end

    subgraph DEPTH["Depth Level"]
        D_MIN["MINIMAL<br/>- Simple, clear request<br/>- Single file change<br/>- Low risk"]
        D_STD["STANDARD<br/>- Normal complexity<br/>- Multiple components<br/>- Medium risk"]
        D_COMP["COMPREHENSIVE<br/>- Complex/high-risk<br/>- System-wide<br/>- Multiple stakeholders"]
    end

    F1 & F2 & F3 & F4 & F5 & F6 --> D_MIN
    F1 & F2 & F3 & F4 & F5 & F6 --> D_STD
    F1 & F2 & F3 & F4 & F5 & F6 --> D_COMP

    style FACTORS fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#000
    style DEPTH fill:#FFF3E0,stroke:#E65100,stroke-width:2px,color:#000
```

## User Stories Assessment Logic

```mermaid
flowchart TD
    ASSESS(["User Stories Assessment"])

    HIGH["HIGH PRIORITY<br/>(Always Execute)"]
    HIGH_CRIT["- New user features<br/>- UX changes<br/>- Multi-persona systems<br/>- Customer-facing APIs<br/>- Complex business logic<br/>- Cross-team projects"]

    MED["MEDIUM PRIORITY<br/>(Assess Complexity)"]
    MED_CRIT["- Backend user impact<br/>- Performance improvements<br/>- Integration work<br/>- Data changes<br/>- Security enhancements"]

    MED_CHECK{"Complexity<br/>factors?"}
    MED_FACTORS["- Spans multiple components?<br/>- Multiple user touchpoints?<br/>- High business impact?<br/>- Multiple stakeholders?<br/>- UAT required?<br/>- Multiple approaches?"]

    LOW["SKIP<br/>(Simple Cases Only)"]
    LOW_CRIT["- Pure refactoring<br/>- Isolated bug fixes<br/>- Infrastructure only<br/>- Developer tooling<br/>- Documentation only"]

    EXEC["✅ Execute User Stories"]
    SKIP["⏭️ Skip User Stories"]

    ASSESS --> HIGH
    ASSESS --> MED
    ASSESS --> LOW

    HIGH --> HIGH_CRIT --> EXEC
    MED --> MED_CRIT --> MED_CHECK
    MED_CHECK -->|"ANY factor = Yes"| EXEC
    MED_CHECK -->|"ALL factors = No"| SKIP
    MED_CHECK --> MED_FACTORS
    LOW --> LOW_CRIT --> SKIP

    style ASSESS fill:#FFA726,stroke:#E65100,stroke-width:3px,color:#000
    style EXEC fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
    style SKIP fill:#BDBDBD,stroke:#424242,stroke-width:2px,color:#000
```

## Extension Opt-In Decision Flow

```mermaid
flowchart TD
    EXT_START(["Extensions Loading"])

    SCAN["Scan extensions/ directory"]
    LOAD_OPT["Load *.opt-in.md files<br/>(lightweight)"]
    PRESENT["Present opt-in questions<br/>during Requirements Analysis"]

    SEC{"Security<br/>Baseline?"}
    SEC_YES["Load security-baseline.md<br/>15 SECURITY rules<br/>All blocking"]
    SEC_NO["Skip security rules<br/>Never load full file"]

    PBT{"Property-Based<br/>Testing?"}
    PBT_FULL["Full enforcement<br/>10 PBT rules blocking"]
    PBT_PARTIAL["Partial enforcement<br/>Only PBT-02,03,07,08,09"]
    PBT_NO["Skip PBT rules"]

    RECORD["Record in aidlc-state.md<br/>Extension Configuration table"]

    EXT_START --> SCAN
    SCAN --> LOAD_OPT
    LOAD_OPT --> PRESENT

    PRESENT --> SEC
    SEC -->|"A) Yes"| SEC_YES
    SEC -->|"B) No"| SEC_NO

    PRESENT --> PBT
    PBT -->|"A) Yes"| PBT_FULL
    PBT -->|"B) Partial"| PBT_PARTIAL
    PBT -->|"C) No"| PBT_NO

    SEC_YES & SEC_NO & PBT_FULL & PBT_PARTIAL & PBT_NO --> RECORD

    style EXT_START fill:#7E57C2,stroke:#4527A0,stroke-width:3px,color:#fff
    style SEC_YES fill:#F44336,stroke:#B71C1C,stroke-width:2px,color:#fff
    style PBT_FULL fill:#F44336,stroke:#B71C1C,stroke-width:2px,color:#fff
```

## Mid-Workflow Change Decision Tree

```mermaid
flowchart TD
    CHANGE(["User requests change"])

    Q1{"Current stage?"}
    Q2{"Completed stage?"}
    Q3{"Adding skipped<br/>stage?"}
    Q4{"Skipping planned<br/>stage?"}
    Q5{"Changing depth?"}

    A1["Modify or restart<br/>current stage"]
    A2_LOW["Low impact:<br/>Modify & update dependents"]
    A2_HIGH["High impact:<br/>Restart from that stage<br/>Redo all dependents"]
    A3["Check prerequisites<br/>Add to plan<br/>Execute"]
    A4["Warn about impact<br/>Get confirmation<br/>Mark SKIPPED"]
    A5["Update plan<br/>Adjust approach"]
    A6["Clarify request<br/>with user"]

    IMPACT{"Impact level?"}

    CHANGE --> Q1
    Q1 -->|Yes| A1
    Q1 -->|No| Q2
    Q2 -->|Yes| IMPACT
    IMPACT -->|Low| A2_LOW
    IMPACT -->|High| A2_HIGH
    Q2 -->|No| Q3
    Q3 -->|Yes| A3
    Q3 -->|No| Q4
    Q4 -->|Yes| A4
    Q4 -->|No| Q5
    Q5 -->|Yes| A5
    Q5 -->|No| A6

    style CHANGE fill:#CE93D8,stroke:#6A1B9A,stroke-width:3px,color:#000
    style A2_HIGH fill:#F44336,stroke:#B71C1C,stroke-width:2px,color:#fff
```
