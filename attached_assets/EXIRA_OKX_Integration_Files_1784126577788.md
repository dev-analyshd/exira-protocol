# OKX.AI Integration Files

This directory contains all files needed to register EXIRA as an ASP on OKX.AI.

## File Structure

```
okx-integration/
├── agent.json              # Main ASP manifest
├── skills/
│   ├── exira_finance.json  # Finance skill
│   ├── exira_verify.json   # Verify skill
│   ├── exira_bridge.json   # Bridge skill
│   ├── exira_guard.json    # Guard skill
│   ├── exira_social.json   # Social skill
│   ├── exira_learn.json    # Learn skill
│   └── exira_sense.json    # Sense skill
├── x402-config.json        # Payment configuration
└── register.sh             # Registration script
```

---

## agent.json

```json
{
  "name": "EXIRA",
  "description": "The Living Behavioral Cathedral — 7 integrated truth services for the agentic economy. EXIRA provides behavioral trading signals, security audits, cross-chain routing, ZK compliance, reputation scoring, autonomous skill learning, and privacy-preserving credentials.",
  "version": "1.0.0",
  "author": "EXIRA Protocol",
  "license": "CC0-1.0",
  "homepage": "https://exira.protocol",
  "repository": "https://github.com/exira-protocol/exira",
  "icon": "https://exira.protocol/assets/icon-512.png",
  "banner": "https://exira.protocol/assets/banner-1920x1080.png",
  "categories": ["finance", "utility", "social", "lifestyle", "art"],
  "tags": ["behavioral-truth", "zk-privacy", "cross-chain", "reputation", "security", "compliance", "autonomous-learning"],
  "chains": [195, 196],
  "skills": [
    "exira-finance",
    "exira-verify",
    "exira-bridge",
    "exira-guard",
    "exira-social",
    "exira-learn",
    "exira-sense"
  ],
  "payment": {
    "type": "x402",
    "chain_id": 195,
    "token": "0x...",
    "settlement_address": "0x..."
  },
  "contact": {
    "email": "builders@exira.protocol",
    "twitter": "@EXIRAProtocol",
    "discord": "https://discord.gg/exira",
    "github": "https://github.com/exira-protocol"
  }
}
```

---

## skills/exira_finance.json

```json
{
  "id": "exira-finance",
  "name": "EXIRA Finance",
  "description": "Behavioral trading signals with coherence-gated execution. EXIRA Finance only emits signals when five planes of behavioral evidence cohere to a threshold. 87% silence rate means we only speak when we know.",
  "version": "1.0.0",
  "category": "finance",
  "icon": "https://exira.protocol/assets/skills/finance.png",
  "endpoint": {
    "url": "https://api.exira.protocol/v1/finance",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "X-EXIRA-Version": "1.0.0"
    }
  },
  "pricing": {
    "model": "per_call",
    "amount": "0.001",
    "currency": "USDT",
    "min_amount": "0.001",
    "max_amount": "0.001"
  },
  "input": {
    "schema": {
      "type": "object",
      "properties": {
        "asset_pair": {
          "type": "string",
          "description": "Trading pair (e.g., 'BTC-USDT', 'ETH-USDC')",
          "examples": ["BTC-USDT", "ETH-USDC", "SOL-USDT"]
        },
        "timeframe": {
          "type": "string",
          "enum": ["1h", "4h", "1d", "1w"],
          "default": "1h",
          "description": "Analysis timeframe"
        },
        "risk_profile": {
          "type": "string",
          "enum": ["conservative", "balanced", "aggressive"],
          "default": "balanced",
          "description": "Risk tolerance for signal generation"
        }
      },
      "required": ["asset_pair"]
    }
  },
  "output": {
    "schema": {
      "type": "object",
      "properties": {
        "signal_id": {
          "type": "string",
          "description": "Unique signal identifier"
        },
        "direction": {
          "type": "string",
          "enum": ["Long", "Short", "Neutral", "Hedge", "Silence"],
          "description": "Trading direction or silence if coherence insufficient"
        },
        "confidence": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "description": "Signal confidence (0-1)"
        },
        "ci95_lower": {
          "type": "number",
          "description": "95% confidence interval lower bound"
        },
        "ci95_upper": {
          "type": "number",
          "description": "95% confidence interval upper bound"
        },
        "coherence": {
          "type": "number",
          "description": "Five-plane coherence score"
        },
        "threshold": {
          "type": "number",
          "description": "Dynamic threshold for signal emission"
        },
        "strategy": {
          "type": "string",
          "description": "Winning ADAPT-Ω strategy name"
        },
        "manipulation_risk": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "description": "Detected manipulation risk (0-1)"
        },
        "timestamp": {
          "type": "integer",
          "description": "Signal emission timestamp (Unix ms)"
        }
      }
    }
  },
  "examples": [
    {
      "input": {
        "asset_pair": "BTC-USDT",
        "timeframe": "4h",
        "risk_profile": "balanced"
      },
      "output": {
        "signal_id": "0x7a3f...9e2b",
        "direction": "Long",
        "confidence": 0.847,
        "ci95_lower": 0.823,
        "ci95_upper": 0.871,
        "coherence": 0.847,
        "threshold": 0.599,
        "strategy": "MomentumMeanReversion_v3",
        "manipulation_risk": 0.02,
        "timestamp": 1752604800000
      }
    },
    {
      "input": {
        "asset_pair": "ETH-USDC",
        "timeframe": "1h"
      },
      "output": {
        "signal_id": "0x9b2c...4f1a",
        "direction": "Silence",
        "confidence": 0,
        "coherence": 0.423,
        "threshold": 0.612,
        "strategy": "NONE",
        "manipulation_risk": 0.15,
        "timestamp": 1752604800000
      }
    }
  ]
}
```

---

## skills/exira_verify.json

```json
{
  "id": "exira-verify",
  "name": "EXIRA Verify",
  "description": "Behavioral security audit for agents. Before you hire any agent, EXIRA reads their behavioral history and detects manipulation fingerprints. CRISPR Defense neutralizes malicious agents before escrow locks.",
  "version": "1.0.0",
  "category": "utility",
  "icon": "https://exira.protocol/assets/skills/verify.png",
  "endpoint": {
    "url": "https://api.exira.protocol/v1/verify/{agent_id}",
    "method": "POST"
  },
  "pricing": {
    "model": "per_call",
    "amount": "0.50",
    "currency": "USDT"
  },
  "input": {
    "schema": {
      "type": "object",
      "properties": {
        "agent_id": {
          "type": "string",
          "description": "Target agent to audit"
        },
        "audit_depth": {
          "type": "integer",
          "minimum": 100,
          "maximum": 10000,
          "default": 1000,
          "description": "Number of blocks to analyze"
        }
      },
      "required": ["agent_id"]
    }
  },
  "output": {
    "schema": {
      "type": "object",
      "properties": {
        "audit_id": { "type": "string" },
        "overall_risk": { "type": "number", "minimum": 0, "maximum": 1 },
        "fingerprints_detected": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": { "type": "string" },
              "confidence": { "type": "number" },
              "severity": { "type": "string", "enum": ["Low", "Medium", "High", "Critical"] }
            }
          }
        },
        "behavioral_depth": { "type": "number" },
        "credibility_score": { "type": "number" },
        "badge_eligible": { "type": "boolean" },
        "badge_hash": { "type": "string" }
      }
    }
  }
}
```

---

## skills/exira_bridge.json

```json
{
  "id": "exira-bridge",
  "name": "EXIRA Bridge",
  "description": "Behavioral cross-chain routing without bridges. Move value between chains via intent-based routing. NETTING finds opposite intents for zero-movement settlement. Assets never leave native chains.",
  "version": "1.0.0",
  "category": "finance",
  "icon": "https://exira.protocol/assets/skills/bridge.png",
  "endpoint": {
    "url": "https://api.exira.protocol/v1/bridge/route",
    "method": "POST"
  },
  "pricing": {
    "model": "percentage",
    "amount": "0.1",
    "currency": "USDT",
    "min_amount": "0.01"
  },
  "input": {
    "schema": {
      "type": "object",
      "properties": {
        "asset_in": { "type": "string" },
        "asset_out": { "type": "string" },
        "amount": { "type": "string" },
        "source_chain": { "type": "integer" },
        "target_chain": { "type": "integer" },
        "deadline": { "type": "integer" },
        "max_gas_usd": { "type": "string" }
      },
      "required": ["asset_in", "asset_out", "amount", "source_chain", "target_chain"]
    }
  },
  "output": {
    "schema": {
      "type": "object",
      "properties": {
        "routes": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "route_id": { "type": "string" },
              "route_type": { "type": "string" },
              "btcp_score": { "type": "number" },
              "estimated_gas": { "type": "string" },
              "estimated_time": { "type": "integer" }
            }
          }
        }
      }
    }
  }
}
```

---

## skills/exira_guard.json

```json
{
  "id": "exira-guard",
  "name": "EXIRA Guard",
  "description": "ZK-verifiable compliance credentials. Prove KYC/AML/sanctions clearance without revealing identity. Chameleon Protocol auto-adapts to regulatory changes. Privacy + compliance simultaneously.",
  "version": "1.0.0",
  "category": "utility",
  "icon": "https://exira.protocol/assets/skills/guard.png",
  "endpoint": {
    "url": "https://api.exira.protocol/v1/guard/credential",
    "method": "POST"
  },
  "pricing": {
    "model": "per_call",
    "amount": "2.00",
    "currency": "USDT"
  },
  "input": {
    "schema": {
      "type": "object",
      "properties": {
        "credential_type": {
          "type": "string",
          "enum": ["kyc", "aml", "sanctions", "travel_rule"]
        },
        "jurisdiction": { "type": "string" },
        "disclosure_hash": { "type": "string" }
      },
      "required": ["credential_type"]
    }
  },
  "output": {
    "schema": {
      "type": "object",
      "properties": {
        "credential_id": { "type": "string" },
        "zk_proof": { "type": "string" },
        "verifier_address": { "type": "string" },
        "expires_at": { "type": "integer" }
      }
    }
  }
}
```

---

## skills/exira_social.json

```json
{
  "id": "exira-social",
  "name": "EXIRA Social",
  "description": "Behavioral reputation engine for agents. Multi-wallet entity resolution, source credibility evolution, and cross-chain reputation. The 'Behaviorally Verified' badge becomes the trust standard of OKX.AI.",
  "version": "1.0.0",
  "category": "social",
  "icon": "https://exira.protocol/assets/skills/social.png",
  "endpoint": {
    "url": "https://api.exira.protocol/v1/social/reputation/{agent_id}",
    "method": "GET"
  },
  "pricing": {
    "model": "per_call",
    "amount": "0.01",
    "currency": "USDT"
  },
  "input": {
    "schema": {
      "type": "object",
      "properties": {
        "agent_id": { "type": "string" }
      },
      "required": ["agent_id"]
    }
  },
  "output": {
    "schema": {
      "type": "object",
      "properties": {
        "agent_id": { "type": "string" },
        "reputation_score": { "type": "number" },
        "credibility_score": { "type": "number" },
        "behavioral_depth": { "type": "number" },
        "is_verified": { "type": "boolean" },
        "badge_hash": { "type": "string" },
        "cross_chain_continuity": { "type": "number" }
      }
    }
  }
}
```

---

## skills/exira_learn.json

```json
{
  "id": "exira-learn",
  "name": "EXIRA Learn",
  "description": "Autonomous skill acquisition agent. EXIRA Learn observes the marketplace, detects new skill demands, trains itself, and lists new services. The cathedral builds itself.",
  "version": "1.0.0",
  "category": "creative",
  "icon": "https://exira.protocol/assets/skills/learn.png",
  "endpoint": {
    "url": "https://api.exira.protocol/v1/learn/skills",
    "method": "GET"
  },
  "pricing": {
    "model": "per_call",
    "amount": "5.00",
    "currency": "USDT"
  },
  "input": {
    "schema": {
      "type": "object",
      "properties": {
        "category": { "type": "string" },
        "complexity": { "type": "string", "enum": ["simple", "medium", "complex"] }
      }
    }
  },
  "output": {
    "schema": {
      "type": "object",
      "properties": {
        "skills": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "skill_id": { "type": "string" },
              "skill_name": { "type": "string" },
              "description": { "type": "string" },
              "complexity": { "type": "string" },
              "iq_score": { "type": "number" },
              "is_available": { "type": "boolean" }
            }
          }
        }
      }
    }
  }
}
```

---

## skills/exira_sense.json

```json
{
  "id": "exira-sense",
  "name": "EXIRA Sense",
  "description": "Privacy-preserving behavioral credentials. Prove properties about yourself without revealing data. 'I have completed 100+ tasks with 98% satisfaction' — proven via ZK, not claimed.",
  "version": "1.0.0",
  "category": "lifestyle",
  "icon": "https://exira.protocol/assets/skills/sense.png",
  "endpoint": {
    "url": "https://api.exira.protocol/v1/sense/prove",
    "method": "POST"
  },
  "pricing": {
    "model": "per_call",
    "amount": "1.00",
    "currency": "USDT"
  },
  "input": {
    "schema": {
      "type": "object",
      "properties": {
        "property_type": {
          "type": "string",
          "enum": ["task_count", "satisfaction_rate", "dispute_free", "manipulation_free"]
        },
        "threshold": { "type": "number" }
      },
      "required": ["property_type"]
    }
  },
  "output": {
    "schema": {
      "type": "object",
      "properties": {
        "proof_id": { "type": "string" },
        "zk_proof": { "type": "string" },
        "public_commitment": { "type": "string" },
        "is_valid": { "type": "boolean" }
      }
    }
  }
}
```

---

## x402-config.json

```json
{
  "version": "1.0.0",
  "protocol": "x402",
  "networks": {
    "xlayer-testnet": {
      "chain_id": 195,
      "rpc_url": "https://testrpc.xlayer.tech",
      "explorer": "https://www.oklink.com/xlayer-test",
      "tokens": [
        {
          "symbol": "USDT",
          "address": "0x...",
          "decimals": 6,
          "is_native": false
        }
      ]
    },
    "xlayer-mainnet": {
      "chain_id": 196,
      "rpc_url": "https://rpc.xlayer.tech",
      "explorer": "https://www.oklink.com/xlayer",
      "tokens": [
        {
          "symbol": "USDT",
          "address": "0x...",
          "decimals": 6,
          "is_native": false
        }
      ]
    }
  },
  "settlement": {
    "address": "0x...",
    "webhook_url": "https://api.exira.protocol/webhooks/payment",
    "webhook_secret": "${WEBHOOK_SECRET}"
  },
  "pricing": {
    "default_token": "USDT",
    "min_amount": "0.001",
    "max_amount": "10000"
  }
}
```

---

## register.sh

```bash
#!/bin/bash
# EXIRA OKX.AI ASP Registration Script

set -e

OKX_API_BASE="https://api.okx.ai/v1"
AGENT_JSON="agent.json"

echo "=== EXIRA OKX.AI ASP Registration ==="
echo ""

# Check prerequisites
if [ -z "$OKX_API_KEY" ]; then
    echo "ERROR: OKX_API_KEY environment variable not set"
    exit 1
fi

if [ ! -f "$AGENT_JSON" ]; then
    echo "ERROR: $AGENT_JSON not found"
    exit 1
fi

# Validate agent.json
echo "Validating agent.json..."
if ! jq empty "$AGENT_JSON" 2>/dev/null; then
    echo "ERROR: agent.json is not valid JSON"
    exit 1
fi

# Register ASP
echo "Registering ASP on OKX.AI..."
RESPONSE=$(curl -s -X POST "$OKX_API_BASE/asp/register"     -H "Authorization: Bearer $OKX_API_KEY"     -H "Content-Type: application/json"     -d @$AGENT_JSON)

ASP_ID=$(echo $RESPONSE | jq -r '.asp_id')
STATUS=$(echo $RESPONSE | jq -r '.status')

if [ "$STATUS" != "pending_review" ]; then
    echo "ERROR: Registration failed"
    echo "Response: $RESPONSE"
    exit 1
fi

echo "✓ ASP registered successfully"
echo "  ASP ID: $ASP_ID"
echo "  Status: $STATUS"
echo ""

# Register skills
echo "Registering skills..."
for skill_file in skills/*.json; do
    SKILL_NAME=$(basename "$skill_file" .json)
    echo "  Registering $SKILL_NAME..."

    SKILL_RESPONSE=$(curl -s -X POST "$OKX_API_BASE/asp/$ASP_ID/skills"         -H "Authorization: Bearer $OKX_API_KEY"         -H "Content-Type: application/json"         -d @$skill_file)

    SKILL_STATUS=$(echo $SKILL_RESPONSE | jq -r '.status')
    if [ "$SKILL_STATUS" == "active" ] || [ "$SKILL_STATUS" == "pending_review" ]; then
        echo "    ✓ $SKILL_NAME registered"
    else
        echo "    ✗ $SKILL_NAME failed: $SKILL_RESPONSE"
    fi
done

echo ""
echo "=== Registration Complete ==="
echo "ASP ID: $ASP_ID"
echo "Review Status: $STATUS"
echo ""
echo "Next steps:"
echo "1. Wait for OKX.AI internal review (24-48 hours)"
echo "2. ASP must go live before hackathon deadline"
echo "3. Test all 7 skills end-to-end"
echo "4. Submit hackathon entry"
```

---

## Usage

```bash
# 1. Set environment variables
export OKX_API_KEY="your-api-key"
export WEBHOOK_SECRET="your-webhook-secret"

# 2. Make registration script executable
chmod +x register.sh

# 3. Run registration
./register.sh

# 4. Check ASP status
curl -H "Authorization: Bearer $OKX_API_KEY"   https://api.okx.ai/v1/asp/{asp_id}/status
```
