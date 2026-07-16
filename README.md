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
| Smart Contracts | Solidity (Hardhat) — X Layer testnet (chainId: 1952) |
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

### Deployed — X Layer Testnet (chainId: 1952)

| Contract | Address | Explorer |
|----------|---------|---------|
| EXIRAOracle | `0x708193f93Fb897fbeA72e7e7D19237770F19E969` | [view](https://www.oklink.com/xlayer-test/address/0x708193f93Fb897fbeA72e7e7D19237770F19E969) |
| EXIRARegistry | `0x6EAB7862385329BdaaD32f2b9587a66E768018Ba` | [view](https://www.oklink.com/xlayer-test/address/0x6EAB7862385329BdaaD32f2b9587a66E768018Ba) |
| EXIRAEscrow | `0x0962f369536e9AA292109840d45C0E23ee6fB382` | [view](https://www.oklink.com/xlayer-test/address/0x0962f369536e9AA292109840d45C0E23ee6fB382) |
| EXIRAToken | `0xAbC106D943a6Aff91A0B29f4a77E4009323d7A66` | [view](https://www.oklink.com/xlayer-test/address/0xAbC106D943a6Aff91A0B29f4a77E4009323d7A66) |

Deployer: `0xdBbf66CAD621dA3Ec186D18b29a135d2A5d42d20`  
Full deployment manifest: [`contracts/deployments/xlayer-testnet.json`](./contracts/deployments/xlayer-testnet.json)

### Build & Test

```bash
cd contracts
npm install

# Compile (Solidity 0.8.20 + OpenZeppelin v5)
npx hardhat compile

# Run local tests (12 passing)
npx hardhat test

# Deploy to X Layer testnet
PRIVATE_KEY=0x... X_LAYER_RPC=https://testrpc.xlayer.tech \
  npx hardhat run scripts/deploy.ts --network xlayer-testnet

# Run on-chain e2e verification
PRIVATE_KEY=0x... X_LAYER_RPC=https://testrpc.xlayer.tech \
  npx hardhat run scripts/e2e-testnet.ts --network xlayer-testnet
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
