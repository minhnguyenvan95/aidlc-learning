# AI-DLC - Cross-Cutting Concerns & Cơ chế hỗ trợ

## Mục đích

Tài liệu này mô tả các cơ chế xuyên suốt (cross-cutting) áp dụng cho toàn bộ workflow AI-DLC: question format, session continuity, error handling, content validation, và audit logging.

## Question & Answer Flow

```mermaid
flowchart TD
    STAGE(["Bất kỳ Stage nào"])

    Q1["Tạo question file<br/>{phase}-questions.md"]
    Q2["Format: Multiple choice<br/>A, B, C, D...<br/>X) Other (MANDATORY)"]
    Q3["Embed [Answer]: tags"]
    Q4["Thông báo user<br/>chờ trả lời"]
    Q5["⛔ GATE: Chờ user<br/>hoàn thành"]
    Q6["Read & extract answers"]
    Q7{"Validate<br/>completeness?"}
    Q8["Yêu cầu trả lời<br/>câu còn thiếu"]
    Q9["Analyze for<br/>contradictions &<br/>ambiguities"]
    Q10{"Issues found?"}
    Q11["Tạo clarification<br/>questions file"]
    Q12["✅ Proceed with<br/>validated answers"]

    STAGE --> Q1
    Q1 --> Q2
    Q2 --> Q3
    Q3 --> Q4
    Q4 --> Q5
    Q5 --> Q6
    Q6 --> Q7
    Q7 -->|Missing| Q8
    Q8 --> Q5
    Q7 -->|Complete| Q9
    Q9 --> Q10
    Q10 -->|Yes| Q11
    Q11 --> Q5
    Q10 -->|No| Q12

    style STAGE fill:#CE93D8,stroke:#6A1B9A,stroke-width:2px,color:#000
    style Q5 fill:#F44336,stroke:#B71C1C,stroke-width:3px,color:#fff
    style Q12 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

## Session Continuity Flow

```mermaid
flowchart TD
    RETURN(["User quay lại"])

    SC1{"aidlc-state.md<br/>tồn tại?"}
    SC2["New project<br/>→ Start fresh"]
    SC3["Read aidlc-state.md<br/>Parse current status"]
    SC4["Load previous<br/>stage artifacts"]
    SC5["Present Welcome Back:<br/>- Project name<br/>- Current Phase<br/>- Current Stage<br/>- Last completed<br/>- Next step"]
    SC6{"User choice?"}
    SC7["Continue where<br/>left off"]
    SC8["Review previous<br/>stage"]
    SC9["Log continuity<br/>in audit.md"]

    RETURN --> SC1
    SC1 -->|No| SC2
    SC1 -->|Yes| SC3
    SC3 --> SC4
    SC4 --> SC5
    SC5 --> SC6
    SC6 -->|"A) Continue"| SC7
    SC6 -->|"B) Review"| SC8
    SC7 --> SC9
    SC8 --> SC9

    style RETURN fill:#CE93D8,stroke:#6A1B9A,stroke-width:3px,color:#000
    style SC2 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

## Smart Context Loading by Stage

```mermaid
flowchart LR
    subgraph EARLY["Early Stages"]
        E1["Workspace Detection<br/>Reverse Engineering"]
        E2["Load: workspace analysis"]
    end

    subgraph MID["Mid Stages"]
        M1["Requirements<br/>User Stories"]
        M2["Load: RE artifacts<br/>+ requirements"]
    end

    subgraph DESIGN["Design Stages"]
        D1["App Design<br/>Units Generation"]
        D2["Load: requirements<br/>+ stories<br/>+ architecture<br/>+ design artifacts"]
    end

    subgraph CODE["Code Stages"]
        C1["Code Generation<br/>Build & Test"]
        C2["Load: ALL artifacts<br/>+ existing code files"]
    end

    E1 --> E2
    M1 --> M2
    D1 --> D2
    C1 --> C2

    style EARLY fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#000
    style MID fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#000
    style DESIGN fill:#FFF3E0,stroke:#E65100,stroke-width:2px,color:#000
    style CODE fill:#FCE4EC,stroke:#C62828,stroke-width:2px,color:#000
```

## Error Handling & Recovery

```mermaid
flowchart TD
    ERROR(["Error xảy ra"])

    SEV{"Severity?"}

    CRITICAL["CRITICAL<br/>Workflow cannot continue<br/>- Missing required files<br/>- Invalid user input<br/>- System errors"]
    HIGH["HIGH<br/>Stage cannot complete<br/>- Incomplete answers<br/>- Contradictory responses<br/>- Missing dependencies"]
    MEDIUM["MEDIUM<br/>Can continue with workaround<br/>- Optional artifacts missing<br/>- Non-critical validation fails"]
    LOW["LOW<br/>Minor issues<br/>- Formatting inconsistencies<br/>- Optional info missing"]

    REC1["Recovery: Partial Stage"]
    REC1_STEPS["1. Load stage plan<br/>2. Find last [x] step<br/>3. Resume from next step<br/>4. Verify prior steps<br/>5. Continue normally"]

    REC2["Recovery: Corrupted State"]
    REC2_STEPS["1. Backup aidlc-state.md<br/>2. Ask user current stage<br/>3. Regenerate state file<br/>4. Mark completed stages<br/>5. Resume"]

    REC3["Recovery: Missing Artifacts"]
    REC3_STEPS["1. Identify missing artifacts<br/>2. Can regenerate?<br/>3. Yes → Return to stage<br/>4. No → Ask user manually<br/>5. Document gap in audit.md"]

    ERROR --> SEV
    SEV --> CRITICAL
    SEV --> HIGH
    SEV --> MEDIUM
    SEV --> LOW

    CRITICAL --> REC2
    HIGH --> REC1
    MEDIUM --> REC3
    REC1 --> REC1_STEPS
    REC2 --> REC2_STEPS
    REC3 --> REC3_STEPS

    style ERROR fill:#F44336,stroke:#B71C1C,stroke-width:3px,color:#fff
    style CRITICAL fill:#D32F2F,stroke:#B71C1C,stroke-width:2px,color:#fff
    style HIGH fill:#FF5722,stroke:#BF360C,stroke-width:2px,color:#fff
    style MEDIUM fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#000
    style LOW fill:#FFC107,stroke:#FF8F00,stroke-width:2px,color:#000
```

## Audit Logging Flow

```mermaid
flowchart TD
    ANY_INTERACTION(["Bất kỳ interaction nào"])

    LOG1["Log user input<br/>COMPLETE RAW INPUT<br/>(never summarize)"]
    LOG2["Log AI response<br/>or action taken"]
    LOG3["Include:<br/>- ISO 8601 timestamp<br/>- Stage context<br/>- Approval status"]
    LOG4["APPEND to audit.md<br/>(NEVER overwrite)"]

    APPROVAL(["Approval Gate"])
    AP1["Log approval PROMPT<br/>before asking"]
    AP2["Present to user"]
    AP3["Log user RESPONSE<br/>after receiving"]

    ANY_INTERACTION --> LOG1
    LOG1 --> LOG2
    LOG2 --> LOG3
    LOG3 --> LOG4

    APPROVAL --> AP1
    AP1 --> AP2
    AP2 --> AP3
    AP3 --> LOG4

    style ANY_INTERACTION fill:#CE93D8,stroke:#6A1B9A,stroke-width:2px,color:#000
    style APPROVAL fill:#7E57C2,stroke:#4527A0,stroke-width:2px,color:#fff
    style LOG4 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

## Overconfidence Prevention Pattern

```mermaid
flowchart TD
    QUESTION(["Cần hỏi user?"])

    PRINCIPLE["Nguyên tắc:<br/>When in doubt, ASK"]

    CHECK1{"Có ambiguity<br/>nào không?"}
    CHECK2{"Missing detail<br/>ảnh hưởng quality?"}
    CHECK3{"User response<br/>vague?"}

    VAGUE_SIGNALS["Tín hiệu vague:<br/>- 'depends'<br/>- 'maybe'<br/>- 'not sure'<br/>- 'mix of'<br/>- 'somewhere between'<br/>- 'standard'<br/>- 'probably'"]

    ASK["✅ HỎI câu hỏi"]
    PROCEED["✅ Proceed<br/>(chỉ khi rõ ràng 100%)"]
    FOLLOWUP["Tạo follow-up<br/>clarification questions"]

    QUESTION --> PRINCIPLE
    PRINCIPLE --> CHECK1
    CHECK1 -->|Yes| ASK
    CHECK1 -->|No| CHECK2
    CHECK2 -->|Yes| ASK
    CHECK2 -->|No| PROCEED

    ASK --> CHECK3
    CHECK3 -->|Yes| VAGUE_SIGNALS
    VAGUE_SIGNALS --> FOLLOWUP
    FOLLOWUP --> ASK
    CHECK3 -->|No| PROCEED

    style QUESTION fill:#CE93D8,stroke:#6A1B9A,stroke-width:2px,color:#000
    style ASK fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
    style PROCEED fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
    style VAGUE_SIGNALS fill:#FFECB3,stroke:#FF8F00,stroke-width:2px,color:#000
```

## Directory Structure

```mermaid
flowchart TD
    ROOT["WORKSPACE ROOT<br/>(Application Code HERE)"]

    subgraph AIDLC_DOCS["aidlc-docs/ (Documentation ONLY)"]
        direction TB
        subgraph INCEPTION_DIR["inception/"]
            I_PLANS["plans/"]
            I_RE["reverse-engineering/"]
            I_REQ["requirements/"]
            I_US["user-stories/"]
            I_AD["application-design/"]
        end

        subgraph CONSTRUCTION_DIR["construction/"]
            C_PLANS["plans/"]
            C_UNIT["unit-name/"]
            C_FD["  functional-design/"]
            C_NFR_REQ["  nfr-requirements/"]
            C_NFR_DES["  nfr-design/"]
            C_INFRA["  infrastructure-design/"]
            C_CODE["  code/ (markdown only)"]
            C_BT["build-and-test/"]
        end

        subgraph OPS_DIR["operations/"]
            O_PLACEHOLDER["(placeholder)"]
        end

        STATE["aidlc-state.md"]
        AUDIT["audit.md"]
    end

    ROOT --> AIDLC_DOCS

    style ROOT fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style AIDLC_DOCS fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#000
    style INCEPTION_DIR fill:#BBDEFB,stroke:#1565C0,stroke-width:1px,color:#000
    style CONSTRUCTION_DIR fill:#C8E6C9,stroke:#2E7D32,stroke-width:1px,color:#000
    style OPS_DIR fill:#FFF59D,stroke:#F57F17,stroke-width:1px,color:#000
```

## Checkpoint Pattern (Approval Gates)

```mermaid
flowchart LR
    WORK["Stage thực hiện<br/>công việc"]
    PRESENT["Present completion<br/>message"]
    GATE{"⛔ User<br/>Approval?"}
    APPROVE["✅ Continue to<br/>Next Stage"]
    CHANGES["🔧 Request Changes<br/>→ Loop back"]

    WORK --> PRESENT
    PRESENT --> GATE
    GATE -->|Approve| APPROVE
    GATE -->|Changes| CHANGES
    CHANGES --> WORK

    style GATE fill:#F44336,stroke:#B71C1C,stroke-width:3px,color:#fff
    style APPROVE fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

Mỗi stage trong CONSTRUCTION phase sử dụng **standardized 2-option completion message**:
1. 🔧 **Request Changes** — quay lại sửa
2. ✅ **Continue to Next Stage** — approve và tiến tới stage tiếp theo
