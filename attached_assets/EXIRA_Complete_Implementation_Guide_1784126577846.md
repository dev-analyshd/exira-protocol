# EXIRA — Complete Implementation Guide
## OKX.AI Genesis Hackathon — Build-Ready Specification
### Version 1.0 | July 15, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Repository Structure](#4-repository-structure)
5. [Smart Contracts](#5-smart-contracts)
6. [Core Services](#6-core-services)
7. [OKX.AI Integration](#7-okxai-integration)
8. [Database Schema](#8-database-schema)
9. [API Specification](#9-api-specification)
10. [Build Instructions](#10-build-instructions)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment Guide](#12-deployment-guide)
13. [Submission Checklist](#13-submission-checklist)

---

## 1. Executive Summary

EXIRA is a multi-pillar Agent Service Provider (ASP) on OKX.AI that provides behavioral truth services across 7 integrated categories. This document contains the complete technical specification for building EXIRA from existing codebase foundations.

**Key Principles:**
- All code is derived from existing repositories but renamed and restructured
- No references to TRION, RUMA, Sovereign-Ω, or Covenant in public-facing code
- All 7 pillars share one underlying behavioral truth engine
- x402 micropayments for all service calls
- X Layer testnet deployment for hackathon submission

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXIRA SERVICE LAYER                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Finance │ │ Verify  │ │ Bridge  │ │ Guard   │ │ Social  │ │ Learn   │  │
│  │         │ │         │ │         │ │         │ │         │ │         │  │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘  │
│       └─────────────┴─────────────┴─────────────┴─────────────┴────────┘    │
│                              │                                              │
│                    ┌─────────┴─────────┐                                    │
│                    │   COHERENCE GATE   │                                    │
│                    │     Ψ(t) ≥ Θ(t)    │                                    │
│                    └─────────┬─────────┘                                    │
│                              │                                              │
│  ┌───────────────────────────┴───────────────────────────────────────────┐  │
│  │                    BEHAVIORAL TRUTH ENGINE                              │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │  │
│  │  │  Physical   │ │   Mental    │ │  Spiritual  │ │     ANIMA       │  │  │
│  │  │   Layer     │ │   Layer     │ │   Layer     │ │   Intelligence  │  │  │
│  │  │   (Φ)       │ │   (M)       │ │   (Σ)       │ │                 │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              │                                              │
│                    ┌─────────┴─────────┐                                    │
│                    │   AKASHIC INDEX    │                                    │
│                    │  (TimescaleDB)     │                                    │
│                    └───────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Smart Contracts** | Solidity (Hardhat) | Signal publication, escrow, registry |
| **Core Protocol** | Rust (Tokio/Axum) | Behavioral hashing, indexing, consensus |
| **AI/ML** | Python (PyTorch/FAISS) | Model inference, archetype matching, NLP |
| **Networking** | Go (goroutines) | P2P validator mesh, ANIMA crawlers |
| **SDK** | TypeScript | Developer interface, type enforcement |
| **Database** | TimescaleDB | Append-only behavioral time-series |
| **ZK Proofs** | Noir | Compliance credentials, privacy proofs |
| **Frontend** | React/WebAssembly | Dashboard, real-time visualization |
| **Deployment** | Docker, Kubernetes | Container orchestration |

---

## 4. Repository Structure

```
exira-protocol/
├── contracts/                          # Solidity smart contracts
│   ├── EXIRAOracle.sol                 # Main signal publication
│   ├── EXIRARegistry.sol               # Agent identity & reputation
│   ├── EXIRAEscrow.sol                 # Two-state atomic escrow
│   ├── EXIRAVerify.sol                 # Verification badge system
│   ├── EXIRABridge.sol                 # Cross-chain routing
│   ├── EXIRAGuard.sol                  # ZK compliance storage
│   └── EXIRAToken.sol                  # Utility token (optional)
│
├── exira-core/                         # Rust core protocol
│   ├── src/
│   │   ├── main.rs                     # L0 daemon entry point
│   │   ├── behavioral_hash.rs          # Hash_DNA dual-strand
│   │   ├── entity_resolution.rs        # BEO 128-dim clustering
│   │   ├── coherence_engine.rs         # Five-plane C(t) computation
│   │   ├── manipulation_detector.rs    # 7 fingerprint types
│   │   ├── btcp_router.rs              # Intent routing engine
│   │   ├── btcp_proof_builder.rs       # Cross-chain proof construction
│   │   ├── netting_engine.rs           # Counterparty matching
│   │   ├── finality_normalizer.rs      # Cross-chain finality
│   │   ├── validator_mesh.rs           # P2P consensus networking
│   │   └── lib.rs                      # Public API
│   └── Cargo.toml
│
├── exira-oracle/                       # Axum API server
│   ├── src/
│   │   ├── main.rs                     # Axum HTTP server
│   │   ├── routes/
│   │   │   ├── signal.rs               # /api/v1/signal/:entity_id
│   │   │   ├── health.rs               # /api/v1/health
│   │   │   ├── verify.rs               # /api/v1/verify/:agent_id
│   │   │   ├── bridge.rs               # /api/v1/bridge/route
│   │   │   ├── reputation.rs           # /api/v1/reputation/:agent_id
│   │   │   └── learn.rs                # /api/v1/learn/skills
│   │   └── models/
│   │       ├── signal.rs               # EXIRASignal struct
│   │       ├── intent.rs               # Intent object
│   │       └── route.rs                # Route types
│   └── Cargo.toml
│
├── exira-ml/                           # Python ML pipeline
│   ├── src/
│   │   ├── anima_crawler.py            # 1000+ concurrent crawlers
│   │   ├── anima_nlp.py                # 50+ language NLP
│   │   ├── archetype_matcher.py        # FAISS similarity search
│   │   ├── manipulation_fingerprints.py # 7 types detection
│   │   ├── liquidity_score.py          # NL = LD × LO × LC × LS
│   │   ├── source_credibility.py       # CRED evolution
│   │   └── genesis_inference.py        # New asset pricing
│   └── requirements.txt
│
├── exira-sdk/                          # TypeScript developer SDK
│   ├── src/
│   │   ├── index.ts                    # Main exports
│   │   ├── EXIRA.ts                    # Core client
│   │   ├── types/
│   │   │   ├── signals.ts              # SignalType enum
│   │   │   ├── intents.ts              # Intent interfaces
│   │   │   └── routes.ts               # Route type definitions
│   │   └── utils/
│   │       ├── packSignal.ts           # Signal serialization
│   │       └── verifyProof.ts          # Proof verification
│   └── package.json
│
├── exira-zk/                           # Noir ZK circuits
│   ├── circuits/
│   │   ├── compliance_credential.nr    # KYC/AML ZK proof
│   │   ├── behavioral_coherence.nr     # Sensing Oracle proof
│   │   └── share_calculation.nr        # IAP privacy proof
│   └── Nargo.toml
│
├── exira-dashboard/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CoherenceChart.tsx      # Ψ(t) visualization
│   │   │   ├── PillarStatus.tsx        # 7-pillar health
│   │   │   ├── SignalFeed.tsx          # Live signal stream
│   │   │   └── ReputationLeader.tsx    # Agent leaderboard
│   │   └── App.tsx
│   └── package.json
│
├── database/
│   ├── schema.sql                      # Complete TimescaleDB schema
│   └── migrations/
│
├── okx-integration/                    # OKX.AI specific
│   ├── agent.json                      # ASP manifest
│   ├── skills/
│   │   ├── exira_finance.json          # Finance skill manifest
│   │   ├── exira_verify.json           # Verify skill manifest
│   │   ├── exira_bridge.json           # Bridge skill manifest
│   │   ├── exira_guard.json            # Guard skill manifest
│   │   ├── exira_social.json           # Social skill manifest
│   │   ├── exira_learn.json            # Learn skill manifest
│   │   └── exira_sense.json            # Sense skill manifest
│   └── x402-config.json                # Payment configuration
│
├── docker/
│   ├── Dockerfile.rust                 # Core container
│   ├── Dockerfile.python               # ML container
│   ├── Dockerfile.node                 # SDK container
│   └── docker-compose.yml              # Full stack orchestration
│
├── tests/                              # Comprehensive test suite
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                               # Documentation
│   └── API.md                          # Complete API reference
│
├── scripts/                            # Build & deployment
│   ├── deploy.sh                       # Contract deployment
│   ├── setup-db.sh                     # Database initialization
│   └── register-asp.sh                 # OKX.AI registration
│
├── .env.example                        # Environment template
├── .gitignore                          # Exclude secrets
├── hardhat.config.ts                   # Hardhat configuration
├── Cargo.toml                          # Workspace root
└── README.md                           # Public documentation
```

---

## 5. Smart Contracts

### 5.1 EXIRAOracle.sol

**Purpose:** Main signal publication contract. Emits signals when coherence threshold is met.

```solidity
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EXIRAOracle is Ownable {

    enum SignalType {
        VALUATION,
        SILENCE,
        LIQUIDITY_HEALTH,
        MANIPULATION_ALERT,
        EXIRA_FINANCE,
        EXIRA_VERIFY,
        EXIRA_BRIDGE,
        EXIRA_GUARD,
        EXIRA_SOCIAL,
        EXIRA_LEARN,
        EXIRA_SENSE,
        BTCP_ROUTE,
        BEHAVIORAL_TRUTH,
        LIQUIDITY_OCEAN,
        CONSENSUS_ADAPTATION,
        CHAIN_RELIABILITY
    }

    enum PlaneType {
        PHYSICAL,
        MENTAL,
        SPIRITUAL,
        CONSCIOUS,
        ANIMA
    }

    struct EXIRASignal {
        bytes32 signalId;
        SignalType signalType;
        bytes32 entityId;
        uint256 signalValue;
        uint256 ci95Lower;
        uint256 ci95Upper;
        uint256 coherence;
        uint256 threshold;
        uint256 margin;
        PlaneType limitingPlane;
        uint256 timestamp;
        uint256 blockNumber;
        bytes32 genomicSignature;
        bytes32[] provenance;
    }

    mapping(bytes32 => EXIRASignal) public signals;
    mapping(bytes32 => bool) public verifiedSignals;

    event SignalEmitted(
        bytes32 indexed signalId,
        SignalType indexed signalType,
        bytes32 indexed entityId,
        uint256 coherence,
        uint256 threshold
    );

    event SilenceEmitted(
        bytes32 indexed signalId,
        bytes32 indexed entityId,
        uint256 coherenceGap,
        PlaneType limitingPlane,
        uint256 eta
    );

    uint256 public constant THETA_MIN = 550; // 0.55 * 1000
    uint256 public constant THETA_MAX = 920; // 0.92 * 1000

    function emitSignal(EXIRASignal calldata signal) external onlyOwner {
        require(signal.coherence >= signal.threshold, "Coherence below threshold");
        signals[signal.signalId] = signal;
        emit SignalEmitted(
            signal.signalId,
            signal.signalType,
            signal.entityId,
            signal.coherence,
            signal.threshold
        );
    }

    function emitSilence(
        bytes32 signalId,
        bytes32 entityId,
        uint256 coherenceGap,
        PlaneType limitingPlane,
        uint256 eta
    ) external onlyOwner {
        emit SilenceEmitted(signalId, entityId, coherenceGap, limitingPlane, eta);
    }

    function verifyExecution(bytes32 signalId) external view returns (bool, uint256, uint256) {
        EXIRASignal memory signal = signals[signalId];
        bool isSafe = signal.coherence >= signal.threshold;
        return (isSafe, signal.coherence, signal.threshold);
    }
}
```

### 5.2 EXIRARegistry.sol

**Purpose:** Agent identity registration, reputation tracking, and verification badges.

```solidity
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.19;

contract EXIRARegistry {

    struct AgentProfile {
        bytes32 agentId;
        address owner;
        uint256 registrationTime;
        uint256 behavioralDepth;      // D(t)
        uint256 credibilityScore;     // CRED(t)
        uint256 reputationScore;      // Composite
        bool isVerified;
        bool isMonitored;
        bytes32 genomicKey;
        bytes32[] linkedWallets;      // BEO cluster
    }

    struct VerificationBadge {
        bytes32 badgeId;
        bytes32 agentId;
        uint256 issuedAt;
        uint256 expiresAt;
        uint8 manipulationRisk;       // 0-100
        bytes32 auditHash;
    }

    mapping(bytes32 => AgentProfile) public agents;
    mapping(bytes32 => VerificationBadge) public badges;
    mapping(address => bytes32) public ownerToAgent;

    event AgentRegistered(bytes32 indexed agentId, address owner);
    event BadgeIssued(bytes32 indexed badgeId, bytes32 indexed agentId);
    event ReputationUpdated(bytes32 indexed agentId, uint256 newScore);

    function registerAgent(bytes32 agentId, bytes32 genomicKey) external {
        require(agents[agentId].registrationTime == 0, "Agent exists");
        agents[agentId] = AgentProfile({
            agentId: agentId,
            owner: msg.sender,
            registrationTime: block.timestamp,
            behavioralDepth: 0,
            credibilityScore: 500, // Starting score
            reputationScore: 0,
            isVerified: false,
            isMonitored: false,
            genomicKey: genomicKey,
            linkedWallets: new bytes32[](0)
        });
        ownerToAgent[msg.sender] = agentId;
        emit AgentRegistered(agentId, msg.sender);
    }

    function issueBadge(
        bytes32 badgeId,
        bytes32 agentId,
        uint8 manipulationRisk,
        bytes32 auditHash
    ) external {
        badges[badgeId] = VerificationBadge({
            badgeId: badgeId,
            agentId: agentId,
            issuedAt: block.timestamp,
            expiresAt: block.timestamp + 90 days,
            manipulationRisk: manipulationRisk,
            auditHash: auditHash
        });
        agents[agentId].isVerified = true;
        emit BadgeIssued(badgeId, agentId);
    }

    function updateReputation(bytes32 agentId, uint256 delta) external {
        AgentProfile storage agent = agents[agentId];
        if (delta > 0) {
            agent.reputationScore += delta;
            agent.credibilityScore += delta / 2;
        } else {
            agent.reputationScore = agent.reputationScore > uint256(-delta) 
                ? agent.reputationScore + delta : 0;
            agent.credibilityScore = agent.credibilityScore > uint256(-delta) / 2
                ? agent.credibilityScore + delta / 2 : 0;
        }
        emit ReputationUpdated(agentId, agent.reputationScore);
    }
}
```

### 5.3 EXIRAEscrow.sol

**Purpose:** Two-state atomic escrow for cross-chain transactions.

```solidity
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.19;

interface IEXIRAOracle {
    function verifyExecution(bytes32 signalId) external view returns (bool, uint256, uint256);
}

contract EXIRAEscrow {

    enum EscrowState { IDLE, HOLDING, RELEASED, REVERTED }

    struct EscrowRecord {
        bytes32 intentHash;
        bytes32 entityId;
        uint256 amount;
        address token;
        uint256 lockBlock;
        uint256 timeoutBlocks;
        EscrowState state;
        address destination;
    }

    IEXIRAOracle public exiraOracle;
    mapping(bytes32 => EscrowRecord) public escrows;

    event EscrowLocked(bytes32 indexed escrowId, bytes32 entityId, uint256 amount, uint256 expiresBlock);
    event EscrowReleased(bytes32 indexed escrowId, bytes32 entityId, uint256 amount);
    event EscrowReverted(bytes32 indexed escrowId, bytes32 entityId, uint256 amount);

    constructor(address oracle) {
        exiraOracle = IEXIRAOracle(oracle);
    }

    function lock(
        bytes32 intentHash,
        bytes32 entityId,
        uint256 timeoutBlocks,
        address destination
    ) external payable returns (bytes32) {
        bytes32 escrowId = keccak256(abi.encodePacked(intentHash, entityId, block.timestamp));
        require(escrows[escrowId].state == EscrowState.IDLE, "Escrow exists");

        escrows[escrowId] = EscrowRecord({
            intentHash: intentHash,
            entityId: entityId,
            amount: msg.value,
            token: address(0),
            lockBlock: block.number,
            timeoutBlocks: timeoutBlocks,
            state: EscrowState.HOLDING,
            destination: destination
        });

        emit EscrowLocked(escrowId, entityId, msg.value, block.number + timeoutBlocks);
        return escrowId;
    }

    function release(bytes32 escrowId, bytes32 routeSignal) external {
        EscrowRecord storage record = escrows[escrowId];
        require(record.state == EscrowState.HOLDING, "Not holding");

        (bool isSafe, uint256 coherence, uint256 threshold) = exiraOracle.verifyExecution(routeSignal);
        require(isSafe, "Consensus invalid");
        require(coherence >= threshold, "Coherence below threshold");

        record.state = EscrowState.RELEASED;
        payable(record.destination).transfer(record.amount);
        emit EscrowReleased(escrowId, record.entityId, record.amount);
    }

    function revertOnTimeout(bytes32 escrowId) external {
        EscrowRecord storage record = escrows[escrowId];
        require(record.state == EscrowState.HOLDING, "Not holding");
        require(block.number > record.lockBlock + record.timeoutBlocks, "Timeout not reached");

        record.state = EscrowState.REVERTED;
        // Return to entity — implementation depends on entity address resolution
        emit EscrowReverted(escrowId, record.entityId, record.amount);
    }
}
```

---

## 6. Core Services

### 6.1 EXIRA Finance Service

**File:** `exira-oracle/src/routes/finance.rs`

```rust
use axum::{extract::Path, Json};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceSignalRequest {
    pub entity_id: String,
    pub asset_pair: String,
    pub timeframe: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceSignal {
    pub signal_id: String,
    pub direction: TradeDirection,
    pub confidence: f64,
    pub ci95_lower: f64,
    pub ci95_upper: f64,
    pub coherence: f64,
    pub threshold: f64,
    pub strategy_used: String,
    pub manipulation_risk: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum TradeDirection {
    Long,
    Short,
    Neutral,
    Hedge,
    Silence, // No signal — coherence insufficient
}

pub async fn get_finance_signal(
    Path(entity_id): Path<String>,
    Json(request): Json<FinanceSignalRequest>,
) -> Json<FinanceSignal> {
    // 1. Compute five-plane coherence
    let coherence = compute_coherence(&entity_id, &request.asset_pair).await;
    let threshold = dynamic_threshold();

    if coherence < threshold {
        return Json(FinanceSignal {
            signal_id: generate_signal_id(),
            direction: TradeDirection::Silence,
            confidence: 0.0,
            ci95_lower: 0.0,
            ci95_upper: 0.0,
            coherence,
            threshold,
            strategy_used: "NONE".to_string(),
            manipulation_risk: 0.0,
        });
    }

    // 2. Run ADAPT-Ω strategy competition
    let strategies = load_adapt_omega_strategies();
    let best_strategy = select_best_strategy(&strategies, &request).await;

    // 3. Bayesian Kelly sizing
    let (direction, confidence) = best_strategy.execute(&request).await;
    let (ci95_lower, ci95_upper) = compute_prediction_interval(&best_strategy);

    // 4. Check manipulation fingerprints
    let manipulation_risk = detect_manipulation_risk(&entity_id, &request.asset_pair).await;

    Json(FinanceSignal {
        signal_id: generate_signal_id(),
        direction,
        confidence,
        ci95_lower,
        ci95_upper,
        coherence,
        threshold,
        strategy_used: best_strategy.name,
        manipulation_risk,
    })
}

async fn compute_coherence(entity_id: &str, asset_pair: &str) -> f64 {
    // Φ: Physical layer (behavioral entropy)
    let phi = compute_physical_entropy(entity_id, asset_pair).await;
    let phi_adj = phi * (1.0 - manipulation_risk(entity_id, asset_pair).await);

    // M: Mental layer (AI confidence) — NOTE: stub for hackathon
    let m = 0.75; // Placeholder — full implementation requires trained models
    let m_adj = m * (1.0 - observer_effect(entity_id).await);

    // Σ: Spiritual layer (validator consensus) — NOTE: stub for hackathon
    let sigma = 0.80; // Placeholder

    // K: Conscious layer (human annotation) — NOTE: stub for hackathon
    let k = 0.70; // Placeholder

    // A: ANIMA layer (cross-domain intelligence) — NOTE: stub for hackathon
    let a = 0.72; // Placeholder

    // Five-plane coherence
    let coherence = 0.25 * phi_adj + 0.30 * m_adj + 0.25 * sigma + 0.10 * k + 0.10 * a;
    coherence
}

fn dynamic_threshold() -> f64 {
    let volatility = get_market_volatility();
    0.55 + (0.92 - 0.55) * volatility
}
```

### 6.2 EXIRA Verify Service

**File:** `exira-oracle/src/routes/verify.rs`

```rust
use axum::{extract::Path, Json};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AuditRequest {
    pub target_agent_id: String,
    pub audit_depth: u32, // Number of blocks to analyze
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuditReport {
    pub audit_id: String,
    pub target_agent_id: String,
    pub overall_risk: f64,           // 0.0 - 1.0
    pub fingerprints_detected: Vec<ManipulationFingerprint>,
    pub behavioral_depth: f64,       // D(t)
    pub credibility_score: f64,      // CRED(t)
    pub badge_eligible: bool,
    pub badge_hash: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ManipulationFingerprint {
    pub fingerprint_type: FingerprintType,
    pub confidence: f64,
    pub evidence_blocks: Vec<String>,
    pub severity: Severity,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum FingerprintType {
    WashTrading,
    CoordinatedPump,
    OracleAttackAttempt,
    SybilLiquidity,
    GovernanceCapture,
    MevExtractionSustained,
    FakeVolumeProtocol,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Severity {
    Low,
    Medium,
    High,
    Critical,
}

pub async fn audit_agent(
    Path(target_agent_id): Path<String>,
    Json(request): Json<AuditRequest>,
) -> Json<AuditReport> {
    // 1. Resolve BEO (Behavioral Entity Object)
    let beo = resolve_beo(&target_agent_id).await;

    // 2. Check all 7 manipulation fingerprints
    let mut fingerprints = Vec::new();

    if let Some(fp) = detect_wash_trading(&beo, request.audit_depth).await {
        fingerprints.push(fp);
    }
    if let Some(fp) = detect_coordinated_pump(&beo, request.audit_depth).await {
        fingerprints.push(fp);
    }
    if let Some(fp) = detect_oracle_attack_attempt(&beo).await {
        fingerprints.push(fp);
    }
    if let Some(fp) = detect_sybil_liquidity(&beo).await {
        fingerprints.push(fp);
    }
    if let Some(fp) = detect_governance_capture(&beo).await {
        fingerprints.push(fp);
    }
    if let Some(fp) = detect_mev_extraction(&beo, request.audit_depth).await {
        fingerprints.push(fp);
    }
    if let Some(fp) = detect_fake_volume(&beo, request.audit_depth).await {
        fingerprints.push(fp);
    }

    // 3. Compute overall risk
    let overall_risk = fingerprints.iter()
        .map(|fp| fp.confidence)
        .fold(0.0, f64::max);

    // 4. Check badge eligibility
    let badge_eligible = overall_risk < 0.15 && beo.behavioral_depth > 1000.0;
    let badge_hash = if badge_eligible {
        Some(generate_badge_hash(&target_agent_id, &fingerprints).await)
    } else {
        None
    };

    Json(AuditReport {
        audit_id: generate_audit_id(),
        target_agent_id,
        overall_risk,
        fingerprints_detected: fingerprints,
        behavioral_depth: beo.behavioral_depth,
        credibility_score: beo.credibility_score,
        badge_eligible,
        badge_hash,
    })
}

async fn detect_wash_trading(beo: &BEO, depth: u32) -> Option<ManipulationFingerprint> {
    let cyclic_flow_ratio = compute_cyclic_flow_ratio(beo, depth).await;
    let counterparty_count = count_unique_counterparties(beo, depth).await;

    if cyclic_flow_ratio > 0.60 && counterparty_count < 5 {
        Some(ManipulationFingerprint {
            fingerprint_type: FingerprintType::WashTrading,
            confidence: 0.70 * cyclic_flow_ratio,
            evidence_blocks: get_evidence_blocks(beo, depth).await,
            severity: if cyclic_flow_ratio > 0.80 { Severity::High } else { Severity::Medium },
        })
    } else {
        None
    }
}

async fn detect_coordinated_pump(beo: &BEO, depth: u32) -> Option<ManipulationFingerprint> {
    let sync_buy_ratio = compute_sync_buy_ratio(beo, depth).await;
    let cluster_size = detect_beo_cluster(beo).await.len();

    if sync_buy_ratio > 0.80 && cluster_size >= 3 {
        Some(ManipulationFingerprint {
            fingerprint_type: FingerprintType::CoordinatedPump,
            confidence: 0.85 * sync_buy_ratio,
            evidence_blocks: get_evidence_blocks(beo, depth).await,
            severity: Severity::Critical,
        })
    } else {
        None
    }
}

async fn detect_oracle_attack_attempt(beo: &BEO) -> Option<ManipulationFingerprint> {
    let spot_deviation = compute_spot_deviation(beo).await;
    let large_swap_proximity = check_large_swap_proximity(beo, 10).await;

    if spot_deviation > 0.15 && large_swap_proximity {
        Some(ManipulationFingerprint {
            fingerprint_type: FingerprintType::OracleAttackAttempt,
            confidence: 1.0,
            evidence_blocks: vec![get_latest_block_hash(beo).await],
            severity: Severity::Critical,
        })
    } else {
        None
    }
}
```

### 6.3 EXIRA Bridge Service

**File:** `exira-oracle/src/routes/bridge.rs`

```rust
use axum::Json;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct BridgeRequest {
    pub entity_id: String,
    pub asset_in: String,
    pub asset_out: String,
    pub amount: u128,
    pub source_chain: u64,
    pub target_chain: u64,
    pub deadline: u64,
    pub max_gas_usd: u128,
    pub privacy_mode: PrivacyMode,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum PrivacyMode {
    Public,
    ZkCredential,
    Invisible,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BridgeRoute {
    pub route_id: String,
    pub route_type: RouteType,
    pub source_chain: u64,
    pub target_chain: u64,
    pub btcp_score: f64,
    pub estimated_gas: u128,
    pub estimated_time: u64,
    pub nl_score: f64,
    pub beo_continuity: f64,
    pub cc_coherence: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum RouteType {
    SingleChain,
    Split { anchor: u64, execute: u64 },
    Netting { counterparty: String },
    Parallel(Vec<u64>),
    MultiHop { via: u64 },
    Deferred { optimal_window: u64 },
    Bitp { commitment_hash: String },
}

pub async fn compute_bridge_route(
    Json(request): Json<BridgeRequest>,
) -> Json<Vec<BridgeRoute>> {
    // 1. BIBL Analysis — read all integrated chains simultaneously
    let analyses = analyze_intent(&request).await;

    // 2. Compute BTCP score for each possible route
    let mut routes: Vec<BridgeRoute> = analyses.iter()
        .map(|analysis| compute_btcp_score(&request, analysis))
        .collect();

    // 3. Check for NETTING opportunity
    if let Some(counterparty) = find_netting_counterparty(&request).await {
        routes.push(BridgeRoute {
            route_id: generate_route_id(),
            route_type: RouteType::Netting { counterparty },
            source_chain: request.source_chain,
            target_chain: request.target_chain,
            btcp_score: 0.98,
            estimated_gas: 5000, // Minimal gas for netting
            estimated_time: 1,
            nl_score: 1.0,
            beo_continuity: 1.0,
            cc_coherence: 1.0,
        });
    }

    // 4. Sort by BTCP score descending
    routes.sort_by(|a, b| b.btcp_score.partial_cmp(&a.btcp_score).unwrap());

    Json(routes)
}

fn compute_btcp_score(request: &BridgeRequest, analysis: &BIBLAnalysis) -> BridgeRoute {
    let normalize_gas = (1.0 - analysis.gas_forecast.mean / analysis.gas_99th_percentile)
        .max(0.0);

    let score = (0.25 * analysis.nl_score
        + 0.20 * normalize_gas
        + 0.20 * analysis.finality_confidence
        + 0.15 * analysis.cc_coherence
        + 0.20 * analysis.beo_continuity)
        * (1.0 - analysis.manipulation_risk);

    BridgeRoute {
        route_id: generate_route_id(),
        route_type: determine_route_type(request, analysis),
        source_chain: request.source_chain,
        target_chain: request.target_chain,
        btcp_score: score,
        estimated_gas: analysis.gas_forecast.mean as u128,
        estimated_time: analysis.finality_time,
        nl_score: analysis.nl_score,
        beo_continuity: analysis.beo_continuity,
        cc_coherence: analysis.cc_coherence,
    }
}

async fn find_netting_counterparty(request: &BridgeRequest) -> Option<String> {
    // Query Akashic Index for opposite intent
    let opposite_intents = query_opposite_intents(
        &request.asset_in,
        &request.asset_out,
        request.amount,
    ).await;

    // Find best match by BTCP score × behavioral health
    opposite_intents.into_iter()
        .max_by(|a, b| {
            let score_a = a.btcp_score * a.behavioral_health;
            let score_b = b.btcp_score * b.behavioral_health;
            score_a.partial_cmp(&score_b).unwrap()
        })
        .map(|intent| intent.entity_id)
}
```

---

## 7. OKX.AI Integration

### 7.1 ASP Manifest (agent.json)

```json
{
  "name": "EXIRA",
  "description": "The Living Behavioral Cathedral — 7 integrated truth services for the agentic economy",
  "version": "1.0.0",
  "author": "EXIRA Protocol",
  "category": ["finance", "utility", "social", "lifestyle"],
  "icon": "https://exira.protocol/icon.png",
  "homepage": "https://exira.protocol",
  "repository": "https://github.com/exira-protocol/exira",
  "license": "CC0-1.0",
  "skills": [
    {
      "id": "exira-finance",
      "name": "EXIRA Finance",
      "description": "Behavioral trading signals with coherence-gated execution",
      "endpoint": "https://api.exira.protocol/v1/finance",
      "pricing": {
        "type": "per_call",
        "amount": "0.001",
        "currency": "USDT"
      },
      "input_schema": {
        "type": "object",
        "properties": {
          "asset_pair": { "type": "string" },
          "timeframe": { "type": "string", "enum": ["1h", "4h", "1d"] }
        },
        "required": ["asset_pair"]
      },
      "output_schema": {
        "type": "object",
        "properties": {
          "direction": { "type": "string", "enum": ["Long", "Short", "Neutral", "Hedge", "Silence"] },
          "confidence": { "type": "number" },
          "coherence": { "type": "number" }
        }
      }
    },
    {
      "id": "exira-verify",
      "name": "EXIRA Verify",
      "description": "Behavioral security audit for agents",
      "endpoint": "https://api.exira.protocol/v1/verify",
      "pricing": {
        "type": "per_call",
        "amount": "0.50",
        "currency": "USDT"
      }
    },
    {
      "id": "exira-bridge",
      "name": "EXIRA Bridge",
      "description": "Behavioral cross-chain routing without bridges",
      "endpoint": "https://api.exira.protocol/v1/bridge",
      "pricing": {
        "type": "percentage",
        "amount": "0.1",
        "currency": "USDT"
      }
    },
    {
      "id": "exira-guard",
      "name": "EXIRA Guard",
      "description": "ZK-verifiable compliance credentials",
      "endpoint": "https://api.exira.protocol/v1/guard",
      "pricing": {
        "type": "per_call",
        "amount": "2.00",
        "currency": "USDT"
      }
    },
    {
      "id": "exira-social",
      "name": "EXIRA Social",
      "description": "Behavioral reputation engine",
      "endpoint": "https://api.exira.protocol/v1/social",
      "pricing": {
        "type": "per_call",
        "amount": "0.01",
        "currency": "USDT"
      }
    },
    {
      "id": "exira-learn",
      "name": "EXIRA Learn",
      "description": "Autonomous skill acquisition",
      "endpoint": "https://api.exira.protocol/v1/learn",
      "pricing": {
        "type": "per_call",
        "amount": "5.00",
        "currency": "USDT"
      }
    },
    {
      "id": "exira-sense",
      "name": "EXIRA Sense",
      "description": "Privacy-preserving behavioral credentials",
      "endpoint": "https://api.exira.protocol/v1/sense",
      "pricing": {
        "type": "per_call",
        "amount": "1.00",
        "currency": "USDT"
      }
    }
  ],
  "payment": {
    "type": "x402",
    "chain_id": 195, // X Layer testnet
    "token": "0x..." // USDT contract address
  }
}
```

### 7.2 x402 Payment Configuration

```json
{
  "version": "1.0",
  "payment_methods": ["x402"],
  "x402": {
    "network": "xlayer-testnet",
    "chain_id": 195,
    "accepted_tokens": [
      {
        "symbol": "USDT",
        "address": "0x...",
        "decimals": 6
      }
    ],
    "settlement_address": "0x...",
    "webhook_url": "https://api.exira.protocol/webhooks/payment"
  }
}
```

---

## 8. Database Schema

### 8.1 Complete TimescaleDB Schema

```sql
-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- ============================================================
-- CORE TABLES
-- ============================================================

-- Behavioral Events ( hypertable )
CREATE TABLE behavioral_events (
    time TIMESTAMPTZ NOT NULL,
    entity_id BYTEA NOT NULL,
    event_type TEXT NOT NULL,
    magnitude NUMERIC NOT NULL,
    currency_id TEXT,
    chain_id BIGINT NOT NULL,
    block_number BIGINT NOT NULL,
    block_hash BYTEA NOT NULL,
    counterparty_id BYTEA,
    protocol_id BYTEA,
    context_hash BYTEA,
    behavioral_hash BYTEA NOT NULL,
    sense_strand BYTEA NOT NULL,
    antisense_strand BYTEA NOT NULL,
    PRIMARY KEY (time, behavioral_hash)
);

SELECT create_hypertable('behavioral_events', 'time');
CREATE INDEX idx_behavioral_events_entity ON behavioral_events (entity_id, time DESC);
CREATE INDEX idx_behavioral_events_type ON behavioral_events (event_type, time DESC);
CREATE INDEX idx_behavioral_events_chain ON behavioral_events (chain_id, block_number);

-- Agents (EXIRA Registry)
CREATE TABLE exira_agents (
    agent_id BYTEA PRIMARY KEY,
    owner_address BYTEA NOT NULL,
    registration_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    behavioral_depth DOUBLE PRECISION DEFAULT 0,
    credibility_score DOUBLE PRECISION DEFAULT 500,
    reputation_score DOUBLE PRECISION DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_monitored BOOLEAN DEFAULT FALSE,
    genomic_key BYTEA,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agent Wallet Links (BEO Clustering)
CREATE TABLE agent_wallets (
    id SERIAL PRIMARY KEY,
    agent_id BYTEA REFERENCES exira_agents(agent_id),
    wallet_address BYTEA NOT NULL,
    link_confidence DOUBLE PRECISION NOT NULL,
    link_type TEXT NOT NULL, -- 'funding', 'timing', 'ownership', 'pattern'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Verification Badges
CREATE TABLE verification_badges (
    badge_id BYTEA PRIMARY KEY,
    agent_id BYTEA REFERENCES exira_agents(agent_id),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    manipulation_risk INTEGER NOT NULL, -- 0-100
    audit_hash BYTEA NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- SIGNAL TABLES
-- ============================================================

-- EXIRA Signals
CREATE TABLE exira_signals (
    time TIMESTAMPTZ NOT NULL,
    signal_id BYTEA NOT NULL,
    signal_type TEXT NOT NULL,
    entity_id BYTEA NOT NULL,
    signal_value DOUBLE PRECISION,
    ci95_lower DOUBLE PRECISION,
    ci95_upper DOUBLE PRECISION,
    coherence DOUBLE PRECISION NOT NULL,
    threshold DOUBLE PRECISION NOT NULL,
    margin DOUBLE PRECISION NOT NULL,
    limiting_plane TEXT,
    genomic_signature BYTEA,
    validator_count INTEGER,
    validator_hhi DOUBLE PRECISION,
    PRIMARY KEY (time, signal_id)
);

SELECT create_hypertable('exira_signals', 'time');
CREATE INDEX idx_signals_entity ON exira_signals (entity_id, time DESC);
CREATE INDEX idx_signals_type ON exira_signals (signal_type, time DESC);

-- Silence Signals
CREATE TABLE silence_signals (
    time TIMESTAMPTZ NOT NULL,
    signal_id BYTEA NOT NULL,
    entity_id BYTEA NOT NULL,
    coherence_gap DOUBLE PRECISION NOT NULL,
    limiting_plane TEXT NOT NULL,
    trend TEXT NOT NULL, -- 'RISING', 'FALLING', 'STABLE'
    eta_seconds INTEGER,
    PRIMARY KEY (time, signal_id)
);

SELECT create_hypertable('silence_signals', 'time');

-- ============================================================
-- BTCP TABLES
-- ============================================================

-- Intent Registry
CREATE TABLE btcp_intents (
    intent_hash BYTEA PRIMARY KEY,
    entity_id BYTEA NOT NULL REFERENCES exira_agents(agent_id),
    action TEXT NOT NULL,
    asset_in BYTEA,
    asset_out BYTEA,
    magnitude NUMERIC NOT NULL,
    deadline BIGINT NOT NULL,
    max_gas_usd NUMERIC,
    privacy_mode TEXT DEFAULT 'PUBLIC',
    btcp_version TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    route_selected TEXT,
    status TEXT DEFAULT 'PENDING'
);

-- Routes
CREATE TABLE btcp_routes (
    route_id BYTEA PRIMARY KEY,
    intent_hash BYTEA REFERENCES btcp_intents(intent_hash),
    anchor_bh BYTEA NOT NULL,
    execution_bh BYTEA,
    anchor_chain BIGINT NOT NULL,
    execution_chain BIGINT NOT NULL,
    entity_id BYTEA NOT NULL,
    gas_saved_vs_bridge NUMERIC,
    beo_continuity_score DOUBLE PRECISION,
    cc_coherence DOUBLE PRECISION,
    route_type TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finalized_at TIMESTAMPTZ
);

-- Escrow States
CREATE TABLE btcp_escrows (
    escrow_id BYTEA PRIMARY KEY,
    route_id BYTEA REFERENCES btcp_routes(route_id),
    entity_id BYTEA NOT NULL,
    amount NUMERIC NOT NULL,
    lock_block BIGINT NOT NULL,
    timeout_blocks BIGINT NOT NULL,
    state TEXT DEFAULT 'HOLDING', -- 'HOLDING', 'RELEASED', 'REVERTED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- BITP Clipboard
CREATE TABLE bitp_clipboard (
    commitment_hash BYTEA PRIMARY KEY,
    entity_id BYTEA NOT NULL,
    asset_x BYTEA NOT NULL,
    asset_y BYTEA NOT NULL,
    chain_a BIGINT NOT NULL,
    chain_b BIGINT NOT NULL,
    magnitude NUMERIC NOT NULL,
    behavioral_proof_root BYTEA,
    status TEXT DEFAULT 'POSTED', -- 'POSTED', 'MATCHED', 'FILLED', 'EXPIRED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    matched_at TIMESTAMPTZ,
    counterparty_hash BYTEA
);

-- Behavioral Limit Orders
CREATE TABLE blo_orders (
    commitment_hash BYTEA PRIMARY KEY,
    entity_id BYTEA NOT NULL,
    intent_hash BYTEA NOT NULL,
    asset_in BYTEA NOT NULL,
    asset_out BYTEA NOT NULL,
    magnitude NUMERIC NOT NULL,
    filled_amount NUMERIC DEFAULT 0,
    expiry_block BIGINT NOT NULL,
    status TEXT DEFAULT 'OPEN', -- 'OPEN', 'PARTIALLY_FILLED', 'FILLED', 'EXPIRED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    akashic_depth DOUBLE PRECISION,
    behavioral_proof_root BYTEA
);

-- ============================================================
-- REPUTATION TABLES
-- ============================================================

-- Credibility Events
CREATE TABLE credibility_events (
    time TIMESTAMPTZ NOT NULL,
    source_id BYTEA NOT NULL,
    event_type TEXT NOT NULL, -- 'verification', 'falsification', 'manipulation', 'conflict'
    delta DOUBLE PRECISION NOT NULL,
    new_score DOUBLE PRECISION NOT NULL,
    evidence BYTEA,
    PRIMARY KEY (time, source_id, event_type)
);

SELECT create_hypertable('credibility_events', 'time');

-- Reputation Transactions
CREATE TABLE reputation_transactions (
    time TIMESTAMPTZ NOT NULL,
    agent_id BYTEA NOT NULL,
    transaction_type TEXT NOT NULL, -- 'work_completed', 'dispute_won', 'dispute_lost', 'verification'
    delta DOUBLE PRECISION NOT NULL,
    counterparty_id BYTEA,
    task_hash BYTEA,
    PRIMARY KEY (time, agent_id, transaction_type)
);

SELECT create_hypertable('reputation_transactions', 'time');

-- ============================================================
-- MANIPULATION DETECTION
-- ============================================================

-- Manipulation Fingerprints
CREATE TABLE manipulation_fingerprints (
    time TIMESTAMPTZ NOT NULL,
    fingerprint_id BYTEA NOT NULL,
    fingerprint_type TEXT NOT NULL,
    entity_id BYTEA NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    severity TEXT NOT NULL,
    evidence_start_block BIGINT,
    evidence_end_block BIGINT,
    is_resolved BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (time, fingerprint_id)
);

SELECT create_hypertable('manipulation_fingerprints', 'time');

-- ============================================================
-- ANIMA TABLES
-- ============================================================

-- Crawler Sources
CREATE TABLE anima_sources (
    source_id SERIAL PRIMARY KEY,
    source_type TEXT NOT NULL, -- 'onchain', 'sec_edgar', 'github', 'news', 'ecological'
    source_url TEXT NOT NULL,
    source_name TEXT NOT NULL,
    language TEXT,
    credibility_score DOUBLE PRECISION DEFAULT 500,
    last_crawled TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- Crawled Data
CREATE TABLE anima_data (
    time TIMESTAMPTZ NOT NULL,
    data_id BYTEA NOT NULL,
    source_id INTEGER REFERENCES anima_sources(source_id),
    content_hash BYTEA NOT NULL,
    sentiment_score DOUBLE PRECISION,
    relevance_score DOUBLE PRECISION,
    entity_mentions BYTEA[],
    PRIMARY KEY (time, data_id)
);

SELECT create_hypertable('anima_data', 'time');

-- ============================================================
-- AUDIT TABLES
-- ============================================================

-- Audit Logs
CREATE TABLE audit_logs (
    time TIMESTAMPTZ NOT NULL,
    audit_id BYTEA NOT NULL,
    target_agent_id BYTEA NOT NULL,
    auditor_id BYTEA NOT NULL,
    overall_risk DOUBLE PRECISION NOT NULL,
    badge_issued BOOLEAN DEFAULT FALSE,
    badge_hash BYTEA,
    report_ipfs_hash TEXT,
    PRIMARY KEY (time, audit_id)
);

SELECT create_hypertable('audit_logs', 'time');

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Update agent reputation
CREATE OR REPLACE FUNCTION update_agent_reputation(
    p_agent_id BYTEA,
    p_delta DOUBLE PRECISION
) RETURNS VOID AS $$
BEGIN
    UPDATE exira_agents
    SET 
        reputation_score = GREATEST(0, reputation_score + p_delta),
        credibility_score = GREATEST(0, credibility_score + p_delta / 2),
        updated_at = NOW()
    WHERE agent_id = p_agent_id;
END;
$$ LANGUAGE plpgsql;

-- Get agent reputation
CREATE OR REPLACE FUNCTION get_agent_reputation(
    p_agent_id BYTEA
) RETURNS TABLE (
    reputation_score DOUBLE PRECISION,
    credibility_score DOUBLE PRECISION,
    behavioral_depth DOUBLE PRECISION,
    is_verified BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.reputation_score,
        a.credibility_score,
        a.behavioral_depth,
        a.is_verified
    FROM exira_agents a
    WHERE a.agent_id = p_agent_id;
END;
$$ LANGUAGE plpgsql;

-- Calculate BTCP score
CREATE OR REPLACE FUNCTION calculate_btcp_score(
    p_nl_score DOUBLE PRECISION,
    p_gas_normalized DOUBLE PRECISION,
    p_finality_conf DOUBLE PRECISION,
    p_cc_coherence DOUBLE PRECISION,
    p_beo_continuity DOUBLE PRECISION,
    p_mf_score DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
BEGIN
    RETURN (0.25 * p_nl_score 
        + 0.20 * p_gas_normalized 
        + 0.20 * p_finality_conf 
        + 0.15 * p_cc_coherence 
        + 0.20 * p_beo_continuity)
        * (1.0 - p_mf_score);
END;
$$ LANGUAGE plpgsql;
```

---

## 9. API Specification

### 9.1 REST API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/health` | Service health check | None |
| GET | `/api/v1/signal/:entity_id` | Get current signal for entity | x402 |
| POST | `/api/v1/finance` | Request trading signal | x402 |
| POST | `/api/v1/verify/:agent_id` | Audit agent | x402 |
| POST | `/api/v1/bridge/route` | Compute cross-chain route | x402 |
| POST | `/api/v1/guard/credential` | Issue ZK compliance credential | x402 |
| GET | `/api/v1/social/reputation/:agent_id` | Get agent reputation | x402 |
| GET | `/api/v1/learn/skills` | List available skills | x402 |
| POST | `/api/v1/sense/prove` | Generate ZK behavioral proof | x402 |
| GET | `/api/v1/agents/:agent_id` | Get agent profile | x402 |
| POST | `/api/v1/agents/register` | Register new agent | x402 |
| GET | `/api/v1/dashboard/coherence` | Real-time coherence metrics | API Key |
| GET | `/api/v1/dashboard/pillars` | 7-pillar status | API Key |

### 9.2 WebSocket Events

```javascript
// Subscribe to real-time signals
const ws = new WebSocket('wss://api.exira.protocol/v1/ws');

ws.send(JSON.stringify({
    action: 'subscribe',
    channel: 'signals',
    entity_id: '0x...',
    min_coherence: 0.70
}));

// Receive signal
ws.onmessage = (event) => {
    const signal = JSON.parse(event.data);
    // {
    //     type: 'SIGNAL',
    //     signal_id: '...',
    //     signal_type: 'EXIRA_FINANCE',
    //     coherence: 0.847,
    //     threshold: 0.599,
    //     margin: 0.248,
    //     data: { ... }
    // }
};

// Subscribe to silence
ws.send(JSON.stringify({
    action: 'subscribe',
    channel: 'silence',
    entity_id: '0x...'
}));

// Receive silence (also informative)
ws.onmessage = (event) => {
    const silence = JSON.parse(event.data);
    // {
    //     type: 'SILENCE',
    //     coherence_gap: 0.153,
    //     limiting_plane: 'MENTAL',
    //     trend: 'RISING',
    //     eta_seconds: 3600
    // }
};
```

---

## 10. Build Instructions

### 10.1 Prerequisites

```bash
# System dependencies
sudo apt-get update
sudo apt-get install -y     build-essential     pkg-config     libssl-dev     postgresql-14     postgresql-14-timescaledb     nodejs-20     npm     python3.11     python3.11-venv     cargo     rustc     docker.io     docker-compose

# Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup target add wasm32-unknown-unknown

# Noir (ZK circuits)
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup

# Node.js
npm install -g hardhat
npm install -g typescript
```

### 10.2 Environment Setup

```bash
# Clone repository
git clone https://github.com/exira-protocol/exira.git
cd exira

# Copy environment template
cp .env.example .env

# Edit .env with your values:
# DATABASE_URL=postgresql://user:pass@localhost:5432/exira
# X_LAYER_RPC=https://testrpc.xlayer.tech
# PRIVATE_KEY=0x... (testnet only!)
# OKX_API_KEY=...
# OKX_API_SECRET=...
```

### 10.3 Database Setup

```bash
# Start PostgreSQL with TimescaleDB
sudo service postgresql start

# Create database
sudo -u postgres createdb exira
sudo -u postgres psql -d exira -f database/schema.sql

# Verify hypertables
sudo -u postgres psql -d exira -c "SELECT * FROM timescaledb_information.hypertables;"
```

### 10.4 Smart Contract Deployment

```bash
cd contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to X Layer testnet
npx hardhat run scripts/deploy.ts --network xlayer-testnet

# Verify contracts
npx hardhat verify --network xlayer-testnet DEPLOYED_ADDRESS

# Output: Save contract addresses to .env
```

### 10.5 Core Protocol Build

```bash
cd exira-core

# Build Rust core
cargo build --release

# Run tests
cargo test --all

# Start L0 daemon
cargo run --release --bin exira-daemon
```

### 10.6 Oracle API Build

```bash
cd exira-oracle

# Build Axum server
cargo build --release

# Run with hot reload (development)
cargo watch -x run

# Production
cargo run --release --bin exira-api
```

### 10.7 ML Pipeline Setup

```bash
cd exira-ml

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download FAISS index (or build from scratch)
wget https://exira.protocol/models/archetype_index.faiss

# Start ML service
python src/server.py
```

### 10.8 SDK Build

```bash
cd exira-sdk

# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Publish (after hackathon)
npm publish --access public
```

### 10.9 Dashboard Build

```bash
cd exira-dashboard

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Serve static files
npm run serve
```

### 10.10 Docker Deployment

```bash
# Build all containers
docker-compose -f docker/docker-compose.yml build

# Start full stack
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose logs -f exira-api

# Scale ML workers
docker-compose up -d --scale exira-ml=3
```

---

## 11. Testing Strategy

### 11.1 Unit Tests

```bash
# Rust core tests
cd exira-core && cargo test --lib

# Contract tests
cd contracts && npx hardhat test

# SDK tests
cd exira-sdk && npm test
```

### 11.2 Integration Tests

```bash
# Full stack integration test
cd tests/integration
pytest test_end_to_end.py

# Cross-chain routing test
pytest test_btcp_routing.py

# ZK proof verification test
pytest test_zk_verification.py
```

### 11.3 Load Testing

```bash
# Install k6
sudo apt-get install k6

# Run load test
k6 run tests/load/api_load_test.js

# Target: 1000 RPS sustained, <100ms p99 latency
```

### 11.4 Security Testing

```bash
# Contract audit (Slither)
pip install slither-analyzer
slither contracts/EXIRAOracle.sol

# Fuzzing (Echidna)
echidna contracts/EXIRAOracle.sol --contract EXIRAOracle
```

---

## 12. Deployment Guide

### 12.1 X Layer Testnet Deployment

```bash
# 1. Get testnet X Layer tokens from faucet
# https://www.okx.com/xlayer/faucet

# 2. Configure hardhat.config.ts
networks: {
    'xlayer-testnet': {
        url: 'https://testrpc.xlayer.tech',
        chainId: 195,
        accounts: [process.env.PRIVATE_KEY]
    }
}

# 3. Deploy contracts
npx hardhat run scripts/deploy-all.ts --network xlayer-testnet

# Expected output:
# EXIRAOracle: 0x...
# EXIRARegistry: 0x...
# EXIRAEscrow: 0x...
# EXIRAVerify: 0x...
# EXIRABridge: 0x...
# EXIRAGuard: 0x...
```

### 12.2 OKX.AI Marketplace Registration

```bash
# 1. Register ASP via OKX.AI API
curl -X POST https://api.okx.ai/v1/asp/register   -H "Authorization: Bearer $OKX_API_KEY"   -H "Content-Type: application/json"   -d @okx-integration/agent.json

# 2. Submit for review
# Wait for OKX.AI internal review (typically 24-48 hours)

# 3. Go live
# ASP must be live before hackathon submission deadline
```

### 12.3 Production Checklist

- [ ] All contracts deployed and verified on X Layer explorer
- [ ] Database initialized with complete schema
- [ ] All 7 skill manifests submitted to OKX.AI
- [ ] x402 payment flow tested end-to-end
- [ ] API health checks passing
- [ ] WebSocket real-time feeds operational
- [ ] Dashboard accessible and responsive
- [ ] 90-second demo video recorded and edited
- [ ] X post with #OKXAI published
- [ ] Google Form submission completed

---

## 13. Submission Checklist

### 13.1 OKX.AI Genesis Hackathon Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| ASP built and functional | ☐ | Must pass OKX.AI internal review |
| ASP listed on OKX.AI | ☐ | Must go live before deadline |
| X post with #OKXAI | ☐ | Include demo/walkthrough, ≤90 seconds |
| Google Form submitted | ☐ | Before July 17, 23:59 UTC |
| Demo video | ☐ | ≤90 seconds, clear use case |

### 13.2 Multi-Category Submission

Submit EXIRA for ALL eligible categories:

- [ ] **Best Product** ($10K) — Complete 7-pillar ASP
- [ ] **Creative Genius** ($10K) — EXIRA Learn (self-improving ASP)
- [ ] **Revenue Rocket** ($10K) — Revenue model + network effects
- [ ] **Finance Copilot** ($2.5K) — EXIRA Finance
- [ ] **Software Utility** ($2.5K) — EXIRA Verify + Guard
- [ ] **Lifestyle Companion** ($2.5K) — EXIRA Sense
- [ ] **Social Buzz** ($1K × 10) — EXIRA Social

### 13.3 Final Verification

```bash
# Run complete verification suite
./scripts/verify-submission.sh

# Expected output:
# ✓ Contracts deployed on X Layer testnet
# ✓ All 7 skills registered on OKX.AI
# ✓ x402 payments working
# ✓ API responding <100ms
# ✓ WebSocket feeds active
# ✓ Dashboard accessible
# ✓ Demo video under 90 seconds
# ✓ X post published with #OKXAI
# ✓ Google Form submitted
# 
# EXIRA is ready for submission!
```

---

## Appendix A: Key Formulas Reference

### Five-Plane Coherence
```
C(t) = 0.25·Φ_adj(t) + 0.30·M_adj(t) + 0.25·Σ(t) + 0.10·K(t) + 0.10·A(t)

Φ_adj = Φ(t) × (1 - MF_score(t))
M_adj = M(t) × (1 - OE_factor(t))
```

### Dynamic Threshold
```
Θ(t) = 0.55 + (0.92 - 0.55) × V(t)
```

### BTCP Score
```
BTCP_score = [0.25×NL + 0.20×normalize_gas + 0.20×finality_conf
            + 0.15×CC_coherence + 0.20×BEO_continuity] × (1 - MF_score)
```

### Natural Liquidity Score
```
NL = LD × LO × LC × LS

LD = Liquidity Depth Entropy
LO = 1 - Sybil_LP_ratio
LC = corr(LD_current, LD_90d_baseline)
LS = LD(during_stress) / LD(normal)
```

### Coordination Collapse
```
d_j = 1 - corr(M_j, M̄)
w_j_effective = s_j · d_j
lim(coordination→1) Σ_Byzantine s_j·d_j = 0
```

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **ASP** | Agent Service Provider — an AI agent that offers services on OKX.AI |
| **BEO** | Behavioral Entity Object — resolved multi-wallet identity |
| **BH** | Behavioral Hash — dual-strand DNA-mimetic hash |
| **BIBL** | Behavioral Inter-Block Layer — active intelligence between blocks |
| **BITP** | Behavioral Intent Transaction Protocol — illiquid pair matching |
| **BLO** | Behavioral Limit Order — persistent intent-based orders |
| **BRT** | Biological Rhythm Timer — circadian/ultradian/lunar/seasonal |
| **BTCP** | Behavioral Transaction Continuity Protocol — cross-chain routing |
| **CI_95** | 95% Confidence Interval — always present in signals |
| **CRISPR** | Pre-execution attack signature neutralization |
| **IAP** | Intent Aggregation Protocol — batch execution |
| **NL** | Natural Liquidity Score — liquidity quality measure |
| **OOA** | Observation-Only Anchoring — permissionless chain reading |
| **Ψ-gate** | Coherence threshold gate — Ψ(t) ≥ Θ(t) required |
| **SILENCE** | Structured null signal — carries failure information |
| **ZK** | Zero-Knowledge proof — privacy-preserving verification |

---

*Document Version: 1.0*
*Last Updated: July 15, 2026*
*License: CC0-1.0*
