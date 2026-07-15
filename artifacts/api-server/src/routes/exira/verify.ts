import { Router } from "express";
import crypto from "crypto";
import { AuditAgentBody, AuditAgentParams } from "@workspace/api-zod";

const router = Router();

const FINGERPRINT_TYPES = [
  "WashTrading",
  "CoordinatedPump",
  "OracleAttackAttempt",
  "SybilLiquidity",
  "GovernanceCapture",
  "MevExtractionSustained",
  "FakeVolumeProtocol",
] as const;

const SEVERITIES = ["Low", "Medium", "High", "Critical"] as const;

function detectFingerprints(agentId: string, auditDepth: number) {
  const seed = agentId.charCodeAt(0) % 100;
  const fingerprints = [];

  if (seed > 70) {
    fingerprints.push({
      type: "WashTrading",
      confidence: 0.72 + Math.random() * 0.2,
      severity: "High",
      evidenceBlocks: [
        "0x" + crypto.randomBytes(16).toString("hex"),
        "0x" + crypto.randomBytes(16).toString("hex"),
      ],
    });
  }

  if (seed > 85) {
    fingerprints.push({
      type: "CoordinatedPump",
      confidence: 0.85 + Math.random() * 0.1,
      severity: "Critical",
      evidenceBlocks: [
        "0x" + crypto.randomBytes(16).toString("hex"),
      ],
    });
  }

  if (seed > 92) {
    fingerprints.push({
      type: "OracleAttackAttempt",
      confidence: 1.0,
      severity: "Critical",
      evidenceBlocks: [
        "0x" + crypto.randomBytes(16).toString("hex"),
      ],
    });
  }

  return fingerprints;
}

router.post("/verify/:agentId", (req, res) => {
  const paramsResult = AuditAgentParams.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: "Invalid agent ID" });
  }

  const bodyResult = AuditAgentBody.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: "Invalid request body", details: bodyResult.error.issues });
  }

  const { agentId } = paramsResult.data;
  const { auditDepth = 1000 } = bodyResult.data;

  const fingerprints = detectFingerprints(agentId, auditDepth);
  const overallRisk = fingerprints.length > 0
    ? fingerprints.reduce((max, fp) => Math.max(max, fp.confidence), 0)
    : Math.random() * 0.1;

  const behavioralDepth = 500 + Math.random() * 5000;
  const credibilityScore = 400 + Math.random() * 500;
  const badgeEligible = overallRisk < 0.15 && behavioralDepth > 1000;
  const badgeHash = badgeEligible
    ? "0x" + crypto.createHash("sha256").update(agentId + Date.now()).digest("hex")
    : null;

  return res.json({
    auditId: "0x" + crypto.randomBytes(16).toString("hex"),
    targetAgentId: agentId,
    overallRisk: Math.round(overallRisk * 1000) / 1000,
    fingerprintsDetected: fingerprints,
    behavioralDepth: Math.round(behavioralDepth),
    credibilityScore: Math.round(credibilityScore),
    badgeEligible,
    badgeHash,
  });
});

export default router;
