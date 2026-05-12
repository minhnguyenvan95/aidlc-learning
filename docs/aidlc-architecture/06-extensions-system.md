# AI-DLC - Extensions System

## Mục đích

Extensions là hệ thống mở rộng cho phép thêm các quy tắc bắt buộc (blocking constraints) vào workflow AI-DLC. Hiện tại có 2 extensions: Security Baseline và Property-Based Testing.

## Extension Loading Mechanism

```mermaid
flowchart TD
    START(["Workflow Start"])

    SCAN["Scan extensions/ directory<br/>recursively"]
    FIND["Tìm tất cả *.opt-in.md files"]
    LOAD_LIGHT["Load ONLY opt-in files<br/>(lightweight, save context)"]

    RA(["Requirements Analysis Stage"])
    PRESENT["Present opt-in questions<br/>to user"]

    USER_CHOICE{"User choice?"}

    OPT_IN["User opts IN"]
    OPT_OUT["User opts OUT"]

    LOAD_FULL["Load full rules file<br/>(e.g., security-baseline.md)"]
    NEVER_LOAD["NEVER load full rules file<br/>→ Save context"]

    RECORD["Record in aidlc-state.md:<br/>Extension Configuration table"]

    ENFORCE["Enforce rules as<br/>BLOCKING constraints<br/>at applicable stages"]

    START --> SCAN
    SCAN --> FIND
    FIND --> LOAD_LIGHT
    LOAD_LIGHT --> RA
    RA --> PRESENT
    PRESENT --> USER_CHOICE
    USER_CHOICE -->|"A) Yes"| OPT_IN
    USER_CHOICE -->|"B/C) No"| OPT_OUT
    OPT_IN --> LOAD_FULL
    OPT_OUT --> NEVER_LOAD
    LOAD_FULL --> RECORD
    NEVER_LOAD --> RECORD
    RECORD --> ENFORCE

    style START fill:#7E57C2,stroke:#4527A0,stroke-width:3px,color:#fff
    style LOAD_LIGHT fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#000
    style LOAD_FULL fill:#FFCDD2,stroke:#C62828,stroke-width:2px,color:#000
    style NEVER_LOAD fill:#E0E0E0,stroke:#424242,stroke-width:2px,color:#000
```

## Security Baseline Extension

```mermaid
flowchart TD
    SEC_START(["Security Baseline<br/>Enabled"])

    subgraph RULES["15 SECURITY Rules (All Blocking)"]
        direction TB
        S01["SECURITY-01<br/>Encryption at Rest & Transit"]
        S02["SECURITY-02<br/>Access Logging on<br/>Network Intermediaries"]
        S03["SECURITY-03<br/>Application-Level Logging"]
        S04["SECURITY-04<br/>HTTP Security Headers"]
        S05["SECURITY-05<br/>Input Validation"]
        S06["SECURITY-06<br/>Least-Privilege Access"]
        S07["SECURITY-07<br/>Restrictive Network Config"]
        S08["SECURITY-08<br/>Application Access Control"]
        S09["SECURITY-09<br/>Security Hardening"]
        S10["SECURITY-10<br/>Supply Chain Security"]
        S11["SECURITY-11<br/>Secure Design Principles"]
        S12["SECURITY-12<br/>Auth & Credential Mgmt"]
        S13["SECURITY-13<br/>Software & Data Integrity"]
        S14["SECURITY-14<br/>Alerting & Monitoring"]
        S15["SECURITY-15<br/>Exception Handling &<br/>Fail-Safe Defaults"]
    end

    STAGE_CHECK["At each applicable stage:<br/>Evaluate verification criteria"]
    COMPLIANT{"All rules<br/>compliant?"}
    PASS["Include Security Compliance<br/>section in completion message<br/>→ Allow 'Continue'"]
    BLOCK["BLOCKING FINDING<br/>- List in completion message<br/>- Log in audit.md<br/>- ONLY show 'Request Changes'<br/>- Cannot proceed"]

    SEC_START --> RULES
    RULES --> STAGE_CHECK
    STAGE_CHECK --> COMPLIANT
    COMPLIANT -->|Yes| PASS
    COMPLIANT -->|No| BLOCK

    style SEC_START fill:#F44336,stroke:#B71C1C,stroke-width:3px,color:#fff
    style BLOCK fill:#D32F2F,stroke:#B71C1C,stroke-width:3px,color:#fff
    style PASS fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
    style RULES fill:#FFEBEE,stroke:#C62828,stroke-width:2px,color:#000
```

## Property-Based Testing Extension

```mermaid
flowchart TD
    PBT_START(["PBT Extension"])

    MODE{"Enforcement<br/>Mode?"}

    FULL["FULL Enforcement<br/>All 10 rules blocking"]
    PARTIAL["PARTIAL Enforcement<br/>Only PBT-02, 03, 07, 08, 09"]
    DISABLED["DISABLED<br/>No PBT rules"]

    subgraph PBT_RULES["10 PBT Rules"]
        direction TB
        P01["PBT-01: Property Identification<br/>During Design"]
        P02["PBT-02: Round-Trip Properties<br/>serialize/deserialize = identity"]
        P03["PBT-03: Invariant Properties<br/>size preservation, ordering"]
        P04["PBT-04: Idempotency Properties<br/>f(f(x)) = f(x)"]
        P05["PBT-05: Oracle & Model-Based<br/>Testing"]
        P06["PBT-06: Stateful Property<br/>Testing"]
        P07["PBT-07: Generator Quality<br/>Domain-specific generators"]
        P08["PBT-08: Shrinking &<br/>Reproducibility"]
        P09["PBT-09: Framework Selection"]
        P10["PBT-10: Complementary<br/>Testing Strategy"]
    end

    subgraph STAGES["Applicable Stages"]
        FD_STAGE["Functional Design<br/>→ PBT-01"]
        NFR_STAGE["NFR Requirements<br/>→ PBT-09"]
        CG_PLAN["Code Gen Planning<br/>→ PBT-01 to PBT-10"]
        CG_GEN["Code Gen Generation<br/>→ PBT-02 to PBT-08, PBT-10"]
        BT_STAGE["Build & Test<br/>→ PBT-08"]
    end

    PBT_START --> MODE
    MODE -->|"A) Yes"| FULL
    MODE -->|"B) Partial"| PARTIAL
    MODE -->|"C) No"| DISABLED

    FULL --> PBT_RULES
    PARTIAL --> P02
    PARTIAL --> P03
    PARTIAL --> P07
    PARTIAL --> P08
    PARTIAL --> P09

    PBT_RULES --> STAGES

    style PBT_START fill:#7E57C2,stroke:#4527A0,stroke-width:3px,color:#fff
    style FULL fill:#F44336,stroke:#B71C1C,stroke-width:2px,color:#fff
    style PARTIAL fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#000
    style DISABLED fill:#BDBDBD,stroke:#424242,stroke-width:2px,color:#000
    style PBT_RULES fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px,color:#000
    style STAGES fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#000
```

## Blocking Finding Behavior

```mermaid
flowchart TD
    FINDING(["Non-compliant rule<br/>detected"])

    F1["List finding in stage<br/>completion message"]
    F2["Include rule ID<br/>& description"]
    F3["Log in audit.md<br/>with stage context"]
    F4["REMOVE 'Continue to<br/>Next Stage' option"]
    F5["Show ONLY<br/>'Request Changes'"]
    F6["User fixes issue"]
    F7["Re-evaluate<br/>compliance"]
    F8{"Now compliant?"}
    F9["✅ Allow 'Continue<br/>to Next Stage'"]

    FINDING --> F1
    F1 --> F2
    F2 --> F3
    F3 --> F4
    F4 --> F5
    F5 --> F6
    F6 --> F7
    F7 --> F8
    F8 -->|Yes| F9
    F8 -->|No| F5

    style FINDING fill:#D32F2F,stroke:#B71C1C,stroke-width:3px,color:#fff
    style F5 fill:#FF5722,stroke:#BF360C,stroke-width:2px,color:#fff
    style F9 fill:#4CAF50,stroke:#1B5E20,stroke-width:2px,color:#fff
```

## OWASP Mapping (Security Extension)

```mermaid
flowchart LR
    subgraph SECURITY["SECURITY Rules"]
        S08["SECURITY-08"]
        S09["SECURITY-09"]
        S10["SECURITY-10"]
        S11["SECURITY-11"]
        S12["SECURITY-12"]
        S13["SECURITY-13"]
        S14["SECURITY-14"]
        S15["SECURITY-15"]
    end

    subgraph OWASP["OWASP Top 10"]
        A01["A01: Broken Access Control"]
        A02["A02: Security Misconfiguration"]
        A03["A03: Supply Chain Failures"]
        A06["A06: Insecure Design"]
        A07["A07: Authentication Failures"]
        A08["A08: Integrity Failures"]
        A09["A09: Logging & Alerting"]
        A10["A10: Exception Handling"]
    end

    S08 --> A01
    S09 --> A02
    S10 --> A03
    S11 --> A06
    S12 --> A07
    S13 --> A08
    S14 --> A09
    S15 --> A10

    style SECURITY fill:#FFEBEE,stroke:#C62828,stroke-width:2px,color:#000
    style OWASP fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#000
```
