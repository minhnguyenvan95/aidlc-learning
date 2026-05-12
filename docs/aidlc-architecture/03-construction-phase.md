# AI-DLC - CONSTRUCTION PHASE (Chi tiết)

## Mục đích

Phase CONSTRUCTION tập trung vào **CÁCH** xây dựng. Bao gồm thiết kế chi tiết, sinh code, và kiểm thử. Mỗi unit of work được xử lý hoàn chỉnh (design → code) trước khi chuyển sang unit tiếp theo.

## Luồng Per-Unit Loop

```mermaid
flowchart TD
    CONST_START(["CONSTRUCTION PHASE Start"])

    UNIT_LOOP["Lấy Unit tiếp theo<br/>từ unit-of-work.md"]

    subgraph PER_UNIT["🔄 Per-Unit Loop"]
        direction TB
        FD{"Functional Design<br/>needed?"}
        FD_EXEC["Functional Design<br/>- business-logic-model.md<br/>- business-rules.md<br/>- domain-entities.md"]
        FD_APPROVE{"Approval?"}

        NFR_REQ{"NFR Requirements<br/>needed?"}
        NFR_REQ_EXEC["NFR Requirements<br/>- nfr-requirements.md<br/>- tech-stack-decisions.md"]
        NFR_REQ_APPROVE{"Approval?"}

        NFR_DES{"NFR Design<br/>needed?"}
        NFR_DES_EXEC["NFR Design<br/>- nfr-design-patterns.md<br/>- logical-components.md"]
        NFR_DES_APPROVE{"Approval?"}

        INFRA{"Infrastructure Design<br/>needed?"}
        INFRA_EXEC["Infrastructure Design<br/>- infrastructure-design.md<br/>- deployment-architecture.md"]
        INFRA_APPROVE{"Approval?"}

        CG["Code Generation<br/>(ALWAYS)"]
        CG_PLAN["Part 1: Planning<br/>code-generation-plan.md"]
        CG_GEN["Part 2: Generation<br/>Execute plan step-by-step"]
        CG_APPROVE{"Approval?"}
    end

    MORE_UNITS{"Còn unit<br/>khác?"}
    BT["Build and Test<br/>(ALWAYS)"]
    BT_EXEC["Generate test instructions:<br/>- build-instructions.md<br/>- unit-test-instructions.md<br/>- integration-test-instructions.md<br/>- performance-test-instructions.md"]
    BT_APPROVE{"Approval?"}
    DONE(["✅ CONSTRUCTION Complete"])

    CONST_START --> UNIT_LOOP
    UNIT_LOOP --> FD

    FD -->|Yes| FD_EXEC
    FD -->|Skip| NFR_REQ
    FD_EXEC --> FD_APPROVE
    FD_APPROVE -->|Approve| NFR_REQ
    FD_APPROVE -->|Changes| FD_EXEC

    NFR_REQ -->|Yes| NFR_REQ_EXEC
    NFR_REQ -->|Skip| NFR_DES
    NFR_REQ_EXEC --> NFR_REQ_APPROVE
    NFR_REQ_APPROVE -->|Approve| NFR_DES
    NFR_REQ_APPROVE -->|Changes| NFR_REQ_EXEC

    NFR_DES -->|Yes| NFR_DES_EXEC
    NFR_DES -->|Skip| INFRA
    NFR_DES_EXEC --> NFR_DES_APPROVE
    NFR_DES_APPROVE -->|Approve| INFRA
    NFR_DES_APPROVE -->|Changes| NFR_DES_EXEC

    INFRA -->|Yes| INFRA_EXEC
    INFRA -->|Skip| CG
    INFRA_EXEC --> INFRA_APPROVE
    INFRA_APPROVE -->|Approve| CG
    INFRA_APPROVE -->|Changes| INFRA_EXEC

    CG --> CG_PLAN
    CG_PLAN --> CG_GEN
    CG_GEN --> CG_APPROVE
    CG_APPROVE -->|Approve| MORE_UNITS
    CG_APPROVE -->|Changes| CG_GEN

    MORE_UNITS -->|Yes| UNIT_LOOP
    MORE_UNITS -->|No| BT
    BT --> BT_EXEC
    BT_EXEC --> BT_APPROVE
    BT_APPROVE -->|Approve| DONE
    BT_APPROVE -->|Changes| BT_EXEC

    style CONST_START fill:#C8E6C9,stroke:#2E7D32,stroke-width:3px,color:#000
    style DONE fill:#CE93D8,stroke:#6A1B9A,stroke-width:3px,color:#000
    style CG fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style BT fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style PER_UNIT fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#000
```

## Code Generation - Chi tiết 2 phần

```mermaid
flowchart TD
    CG_START(["Code Generation Start"])

    subgraph PART1["Part 1: PLANNING"]
        P1["Analyze Unit Context<br/>Read design artifacts"]
        P2["Determine code location<br/>Brownfield: existing structure<br/>Greenfield: new structure"]
        P3["Create detailed plan<br/>with numbered steps:<br/>- Project Structure<br/>- Business Logic<br/>- API Layer<br/>- Repository Layer<br/>- Frontend (if applicable)<br/>- DB Migrations<br/>- Documentation<br/>- Deployment Artifacts"]
        P4["Save plan:<br/>code-generation-plan.md"]
        P5{"User approves<br/>plan?"}
    end

    subgraph PART2["Part 2: GENERATION"]
        G1["Load plan<br/>Find next [ ] step"]
        G2["Execute current step"]
        G3{"Brownfield?"}
        G4["Check if file exists<br/>→ Modify in-place"]
        G5["Create new file"]
        G6["Mark step [x]<br/>Update progress"]
        G7{"More steps?"}
    end

    G8["Present completion<br/>message"]
    G9{"User Approval?"}
    G10["✅ Unit Complete"]

    CG_START --> P1
    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> P5
    P5 -->|Approve| G1
    P5 -->|Changes| P3

    G1 --> G2
    G2 --> G3
    G3 -->|Yes| G4
    G3 -->|No| G5
    G4 --> G6
    G5 --> G6
    G6 --> G7
    G7 -->|Yes| G1
    G7 -->|No| G8
    G8 --> G9
    G9 -->|Approve| G10
    G9 -->|Changes| G1

    style CG_START fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style G10 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
    style PART1 fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#000
    style PART2 fill:#FFF3E0,stroke:#E65100,stroke-width:2px,color:#000
```

## Functional Design - Chi tiết

```mermaid
flowchart TD
    FD_START(["Functional Design Start"])

    FD1["Read unit definition<br/>& assigned stories"]
    FD2["Create functional<br/>design plan"]
    FD3["Generate questions:<br/>- Business Logic Modeling<br/>- Domain Model<br/>- Business Rules<br/>- Data Flow<br/>- Integration Points<br/>- Error Handling<br/>- Business Scenarios<br/>- Frontend Components"]
    FD4["Save plan:<br/>functional-design-plan.md"]
    FD5["⛔ Chờ user answers"]
    FD6["Analyze answers"]
    FD7{"Ambiguity?"}
    FD8["Follow-up questions"]
    FD9["Generate artifacts:<br/>- business-logic-model.md<br/>- business-rules.md<br/>- domain-entities.md<br/>- frontend-components.md (opt)"]
    FD10{"Approval?"}
    FD11["✅ Next stage"]

    FD_START --> FD1
    FD1 --> FD2
    FD2 --> FD3
    FD3 --> FD4
    FD4 --> FD5
    FD5 --> FD6
    FD6 --> FD7
    FD7 -->|Yes| FD8
    FD8 --> FD5
    FD7 -->|No| FD9
    FD9 --> FD10
    FD10 -->|Approve| FD11
    FD10 -->|Changes| FD2

    style FD_START fill:#FFA726,stroke:#E65100,stroke-width:3px,color:#000
    style FD5 fill:#F44336,stroke:#B71C1C,stroke-width:2px,color:#fff
    style FD11 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

## Build and Test - Chi tiết

```mermaid
flowchart TD
    BT_START(["Build and Test Start"])

    BT1["Analyze testing requirements"]
    BT2["Generate build-instructions.md<br/>- Prerequisites<br/>- Install dependencies<br/>- Configure environment<br/>- Build all units"]
    BT3["Generate unit-test-instructions.md<br/>- Run all unit tests<br/>- Review results<br/>- Fix failures"]
    BT4["Generate integration-test-instructions.md<br/>- Setup test environment<br/>- Test service interactions<br/>- Cleanup"]
    BT5["Generate performance-test-instructions.md<br/>(if applicable)<br/>- Load tests<br/>- Stress tests<br/>- Analyze results"]
    BT6["Generate additional tests<br/>(as needed):<br/>- Contract tests<br/>- Security tests<br/>- E2E tests"]
    BT7["Generate build-and-test-summary.md"]
    BT8{"User Approval?"}
    BT9["✅ → OPERATIONS"]

    BT_START --> BT1
    BT1 --> BT2
    BT2 --> BT3
    BT3 --> BT4
    BT4 --> BT5
    BT5 --> BT6
    BT6 --> BT7
    BT7 --> BT8
    BT8 -->|Approve| BT9
    BT8 -->|Changes| BT2

    style BT_START fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style BT9 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```
