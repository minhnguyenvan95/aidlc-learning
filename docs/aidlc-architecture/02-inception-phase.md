# AI-DLC - INCEPTION PHASE (Chi tiết)

## Mục đích

Phase INCEPTION tập trung vào việc xác định **CÁI GÌ** cần xây dựng và **TẠI SAO**. Bao gồm phân tích yêu cầu, thiết kế kiến trúc ứng dụng, và lập kế hoạch thực thi.

## Luồng xử lý chi tiết

```mermaid
flowchart TD
    Start(["User Request"])

    %% Workspace Detection
    subgraph WD_DETAIL["Stage 1: Workspace Detection (ALWAYS)"]
        WD1["Log user request<br/>vào audit.md"]
        WD2{"aidlc-state.md<br/>tồn tại?"}
        WD3["Resume từ<br/>session trước"]
        WD4["Scan workspace<br/>cho source code"]
        WD5{"Có code<br/>hiện tại?"}
        WD6["brownfield = true"]
        WD7["brownfield = false"]
        WD8{"RE artifacts<br/>tồn tại & current?"}
        WD9["Tạo aidlc-state.md"]
    end

    Start --> WD1
    WD1 --> WD2
    WD2 -->|Yes| WD3
    WD2 -->|No| WD4
    WD4 --> WD5
    WD5 -->|Yes| WD6
    WD5 -->|No| WD7
    WD6 --> WD8
    WD7 --> WD9

    %% Decision after WD
    WD8 -->|"Yes (current)"| SKIP_RE["Skip RE<br/>→ Requirements Analysis"]
    WD8 -->|"No / Stale"| GO_RE["→ Reverse Engineering"]
    WD9 --> GO_RA["→ Requirements Analysis"]

    style Start fill:#CE93D8,stroke:#6A1B9A,stroke-width:3px,color:#000
    style WD_DETAIL fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#000
    style SKIP_RE fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
    style GO_RE fill:#FFA726,stroke:#E65100,stroke-width:2px,color:#000
    style GO_RA fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

## Reverse Engineering (Brownfield Only)

```mermaid
flowchart TD
    RE_START(["Reverse Engineering Start"])

    RE1["Multi-Package Discovery<br/>Scan tất cả packages"]
    RE2["Business Context<br/>Hiểu business transactions"]
    RE3["Infrastructure Discovery<br/>CDK/Terraform/CloudFormation"]
    RE4["Service Architecture<br/>Lambda/Container/API"]
    RE5["Code Quality Analysis"]

    RE6["Generate Artifacts"]
    RE7["business-overview.md"]
    RE8["architecture.md"]
    RE9["code-structure.md"]
    RE10["api-documentation.md"]
    RE11["component-inventory.md"]
    RE12["technology-stack.md"]
    RE13["dependencies.md"]

    RE14{"User Approval?"}
    RE15["✅ Proceed to<br/>Requirements Analysis"]
    RE16["🔧 Request Changes"]

    RE_START --> RE1
    RE1 --> RE2
    RE2 --> RE3
    RE3 --> RE4
    RE4 --> RE5
    RE5 --> RE6
    RE6 --> RE7
    RE6 --> RE8
    RE6 --> RE9
    RE6 --> RE10
    RE6 --> RE11
    RE6 --> RE12
    RE6 --> RE13
    RE7 & RE8 & RE9 & RE10 & RE11 & RE12 & RE13 --> RE14
    RE14 -->|Approve| RE15
    RE14 -->|Changes| RE16
    RE16 --> RE6

    style RE_START fill:#FFA726,stroke:#E65100,stroke-width:3px,color:#000
    style RE15 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

## Requirements Analysis (ALWAYS - Adaptive Depth)

```mermaid
flowchart TD
    RA_START(["Requirements Analysis Start"])

    RA1["Load RE artifacts<br/>(nếu brownfield)"]
    RA2["Phân tích User Request<br/>- Clarity<br/>- Type<br/>- Scope<br/>- Complexity"]
    RA3{"Xác định Depth"}
    RA4["Minimal<br/>Simple & clear"]
    RA5["Standard<br/>Normal complexity"]
    RA6["Comprehensive<br/>Complex & high-risk"]

    RA7["Extension Opt-In<br/>Security? PBT?"]
    RA8["Tạo requirement-<br/>verification-questions.md"]
    RA9["⛔ GATE: Chờ<br/>User trả lời"]
    RA10["Phân tích answers<br/>cho ambiguity"]
    RA11{"Có ambiguity?"}
    RA12["Tạo clarification<br/>questions"]
    RA13["Generate<br/>requirements.md"]
    RA14{"User Approval?"}
    RA15["✅ Proceed"]

    RA_START --> RA1
    RA1 --> RA2
    RA2 --> RA3
    RA3 --> RA4
    RA3 --> RA5
    RA3 --> RA6
    RA4 & RA5 & RA6 --> RA7
    RA7 --> RA8
    RA8 --> RA9
    RA9 --> RA10
    RA10 --> RA11
    RA11 -->|Yes| RA12
    RA12 --> RA9
    RA11 -->|No| RA13
    RA13 --> RA14
    RA14 -->|Approve| RA15
    RA14 -->|Changes| RA8

    style RA_START fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style RA9 fill:#F44336,stroke:#B71C1C,stroke-width:3px,color:#fff
    style RA15 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

## User Stories (CONDITIONAL)

```mermaid
flowchart TD
    US_START(["User Stories Assessment"])

    US1{"Multi-factor<br/>Assessment"}
    US2["HIGH Priority<br/>- New user features<br/>- UX changes<br/>- Multi-persona<br/>- Complex business logic"]
    US3["MEDIUM Priority<br/>- Backend user impact<br/>- Performance improvements<br/>- Integration work"]
    US4["SKIP<br/>- Pure refactoring<br/>- Simple bug fix<br/>- Infrastructure only"]

    US5["Part 1: PLANNING"]
    US6["Tạo story plan<br/>với questions"]
    US7["Chờ user answers"]
    US8["Analyze answers<br/>for ambiguity"]
    US9{"Approval?"}

    US10["Part 2: GENERATION"]
    US11["Execute plan<br/>step-by-step"]
    US12["Generate<br/>stories.md"]
    US13["Generate<br/>personas.md"]
    US14{"Final Approval?"}
    US15["✅ Proceed to<br/>Workflow Planning"]

    US_START --> US1
    US1 -->|Always Execute| US2
    US1 -->|Assess Complexity| US3
    US1 -->|Skip| US4
    US2 --> US5
    US3 --> US5
    US5 --> US6
    US6 --> US7
    US7 --> US8
    US8 --> US9
    US9 -->|Approve| US10
    US9 -->|Changes| US6
    US10 --> US11
    US11 --> US12
    US11 --> US13
    US12 & US13 --> US14
    US14 -->|Approve| US15
    US14 -->|Changes| US11

    style US_START fill:#FFA726,stroke:#E65100,stroke-width:3px,color:#000
    style US4 fill:#BDBDBD,stroke:#424242,stroke-width:2px,color:#000
    style US15 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

## Workflow Planning (ALWAYS)

```mermaid
flowchart TD
    WP_START(["Workflow Planning Start"])

    WP1["Load ALL prior context<br/>RE + Requirements + Stories"]
    WP2["Detailed Scope &<br/>Impact Analysis"]
    WP3["Phase Determination<br/>EXECUTE vs SKIP cho mỗi stage"]
    WP4["Multi-Module Coordination<br/>(brownfield only)"]
    WP5["Generate Mermaid<br/>Workflow Visualization"]
    WP6["Tạo execution-plan.md"]
    WP7["Update aidlc-state.md"]
    WP8{"User Approval?"}
    WP9["✅ Proceed to<br/>next stage"]
    WP10["🔧 Adjust plan"]

    WP_START --> WP1
    WP1 --> WP2
    WP2 --> WP3
    WP3 --> WP4
    WP4 --> WP5
    WP5 --> WP6
    WP6 --> WP7
    WP7 --> WP8
    WP8 -->|Approve| WP9
    WP8 -->|Changes| WP10
    WP10 --> WP3

    style WP_START fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style WP9 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

## Application Design & Units Generation (CONDITIONAL)

```mermaid
flowchart TD
    AD_START{"Application Design<br/>needed?"}

    AD1["Analyze requirements<br/>& stories"]
    AD2["Create design plan<br/>with questions"]
    AD3["Chờ user answers"]
    AD4["Generate artifacts:<br/>- components.md<br/>- component-methods.md<br/>- services.md<br/>- component-dependency.md"]
    AD5{"Approval?"}

    UG_START{"Units Generation<br/>needed?"}
    UG1["Part 1: Planning<br/>Decompose system"]
    UG2["Part 2: Generation<br/>- unit-of-work.md<br/>- unit-of-work-dependency.md<br/>- unit-of-work-story-map.md"]
    UG3{"Approval?"}
    UG4["✅ → CONSTRUCTION PHASE"]

    AD_START -->|Yes| AD1
    AD_START -->|No/Skip| UG_START
    AD1 --> AD2
    AD2 --> AD3
    AD3 --> AD4
    AD4 --> AD5
    AD5 -->|Approve| UG_START
    AD5 -->|Changes| AD2

    UG_START -->|Yes| UG1
    UG_START -->|No/Skip| UG4
    UG1 --> UG2
    UG2 --> UG3
    UG3 -->|Approve| UG4
    UG3 -->|Changes| UG1

    style AD_START fill:#FFA726,stroke:#E65100,stroke-width:3px,color:#000
    style UG_START fill:#FFA726,stroke:#E65100,stroke-width:3px,color:#000
    style UG4 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```
