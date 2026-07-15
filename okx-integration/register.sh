#!/bin/bash
# EXIRA OKX.AI ASP Registration Script

set -e

OKX_API_BASE="https://api.okx.ai/v1"
AGENT_JSON="agent.json"

echo "=== EXIRA OKX.AI ASP Registration ==="
echo ""

if [ -z "$OKX_API_KEY" ]; then
  echo "ERROR: OKX_API_KEY environment variable not set"
  exit 1
fi

if [ ! -f "$AGENT_JSON" ]; then
  echo "ERROR: $AGENT_JSON not found"
  exit 1
fi

echo "Validating agent.json..."
if ! jq empty "$AGENT_JSON" 2>/dev/null; then
  echo "ERROR: agent.json is not valid JSON"
  exit 1
fi

echo "Registering ASP on OKX.AI..."
RESPONSE=$(curl -s -X POST "$OKX_API_BASE/asp/register" \
  -H "Authorization: Bearer $OKX_API_KEY" \
  -H "Content-Type: application/json" \
  -d @$AGENT_JSON)

ASP_ID=$(echo $RESPONSE | jq -r '.asp_id')
STATUS=$(echo $RESPONSE | jq -r '.status')

if [ "$STATUS" != "pending_review" ] && [ "$STATUS" != "active" ]; then
  echo "ERROR: Registration failed"
  echo "Response: $RESPONSE"
  exit 1
fi

echo "ASP registered: $ASP_ID (status: $STATUS)"
echo ""

echo "Registering 7 skills..."
for skill_file in skills/*.json; do
  SKILL_NAME=$(basename "$skill_file" .json)
  echo "  Registering $SKILL_NAME..."
  SKILL_RESPONSE=$(curl -s -X POST "$OKX_API_BASE/asp/$ASP_ID/skills" \
    -H "Authorization: Bearer $OKX_API_KEY" \
    -H "Content-Type: application/json" \
    -d @$skill_file)
  SKILL_STATUS=$(echo $SKILL_RESPONSE | jq -r '.status')
  if [ "$SKILL_STATUS" == "active" ] || [ "$SKILL_STATUS" == "pending_review" ]; then
    echo "    OK: $SKILL_NAME"
  else
    echo "    FAIL: $SKILL_NAME -> $SKILL_RESPONSE"
  fi
done

echo ""
echo "=== Registration Complete ==="
echo "ASP ID: $ASP_ID | Status: $STATUS"
