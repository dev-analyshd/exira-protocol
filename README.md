# EXIRA Protocol

**The Living Behavioral Cathedral** — A 7-pillar Agent Service Provider (ASP) for the OKX.AI agentic economy.

EXIRA provides behavioral truth services across 7 integrated categories, all gated by a five-plane coherence score (Ψ(t) ≥ Θ(t)). Only signals that cohere across Physical, Mental, Spiritual, Conscious, and ANIMA planes are emitted. The 87% silence rate is not a bug — it is the product.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    EXIRA SERVICE LAYER                   │
│  Finance │ Verify │ Bridge │ Guard │ Social │ Learn │ Sense │
│                         │                               │
│                  COHERENCE GATE                         │
│                  Ψ(t) ≥ Θ(t)                           │
│                         │                               │
│              BEHAVIORAL TRUTH ENGINE                    │
│   Physical(Φ) │ Mental(M) │ Spiritual(Σ) │ ANIMA       │
│                         │                               │
│               AKASHIC INDEX (PostgreSQL)                │
└─────────────────────────────────────────────────────────┘
```

## The 7 Pillars

| Pillar | Description | Price |
|--------|-------------|-------|
| **Finance** | Behavioral trading signals with ADAPT-Ω strategy selection | $0.001/call |
| **Verify** | 7-fingerprint manipulation detection + verification badges | $0.50/call |
| **Bridge** | BTCP intent routing — cross-chain without bridges | 0.1% fee |
| **Guard** | ZK compliance credentials (KYC/AML/sanctions) via Noir | $2.00/call |
| **Social** | BEO entity resolution + behavioral reputation engine | $0.01/call |
| **Learn** | Autonomous skill catalog — the cathedral builds itself | $5.00/call |
| **Sense** | Privacy-preserving behavioral proofs | $1.00/call |

## Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Solidity (Hardhat) — X Layer testnet (chainId: 195) |
| API Server | TypeScript / Express 5 |
| Database | PostgreSQL + Drizzle ORM |
| Frontend | React + Vite + Recharts |
| ZK Proofs | Noir (circuit stubs) |
| SDK | TypeScript (`@exira/sdk`) |
| Payments | x402 micropayments on X Layer |

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push DB schema
pnpm --filter @workspace/db run push

# Start API server
pnpm --filter @workspace/api-server run dev

# Start dashboard
pnpm --filter @workspace/exira-dashboard run dev
```

## Smart Contracts

```bash
cd contracts
npm install

# Compile
npx hardhat compile

# Deploy to X Layer testnet
npx hardhat run scripts/deploy.ts --network xlayer-testnet

# Run tests
npx hardhat test
```

## OKX.AI Registration

```bash
cd okx-integration
export OKX_API_KEY="your-key"
chmod +x register.sh
./register.sh
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/healthz` | Health check |
| POST | `/api/v1/finance` | Trading signal |
| POST | `/api/v1/verify/:agentId` | Security audit |
| POST | `/api/v1/bridge/route` | Cross-chain routing |
| POST | `/api/v1/guard/credential` | ZK credential |
| GET | `/api/v1/social/reputation/:agentId` | Reputation |
| GET | `/api/v1/learn/skills` | Skill catalog |
| POST | `/api/v1/sense/prove` | Behavioral proof |
| GET/POST | `/api/v1/agents` | Agent registry |
| GET | `/api/v1/dashboard/coherence` | Live coherence |
| GET | `/api/v1/dashboard/pillars` | Pillar status |
| GET | `/api/v1/dashboard/signals` | Signal feed |

## SDK Usage

```typescript
import { EXIRAClient } from "@exira/sdk";

const exira = new EXIRAClient({ baseUrl: "https://api.exira.protocol" });

// Get trading signal
const signal = await exira.finance.getSignal({ assetPair: "BTC-USDT" });
if (signal.direction !== "Silence") {
  console.log(`${signal.direction} @ coherence ${signal.coherence}`);
}

// Audit an agent before hiring
const audit = await exira.verify.auditAgent("0x...");
if (!audit.badgeEligible) throw new Error("Agent failed behavioral audit");

// Cross-chain routing
const routes = await exira.bridge.computeRoutes({
  assetIn: "USDT", assetOut: "ETH",
  amount: "1000", sourceChain: 195, targetChain: 1
});
console.log(`Best route: ${routes[0].routeType} (BTCP: ${routes[0].btcpScore})`);
```

## License

CC0-1.0 — Public Domain
