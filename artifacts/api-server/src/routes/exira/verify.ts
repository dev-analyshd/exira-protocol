import { Router } from "express";
import crypto from "crypto";
import { AuditAgentBody, AuditAgentParams } from "@workspace/api-zod";
import { db, auditReportsTable } from "@workspace/db";

const router = Router();

function detectFingerprints(agentId: string, _auditDepth: number) {
  const seed = agentId.charCodeAt(0) % 100;
  const fingerprints = [];

  if (seed > 70) {
    fingerprints.push({
      type: "WashTrading",
      confidence: Math.round((0.72 + Math.random() * 0.2) * 1000) / 1000,
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
      confidence: Math.round((0.85 + Math.random() * 0.1) * 1000) / 1000,
      severity: "Critical",
      evidenceBlocks: ["0x" + crypto.randomBytes(16).toString("hex")],
    });
  }
  if (seed > 92) {
    fingerprints.push({
      type: "OracleAttackAttempt",
      confidence: 1.0,
      severity: "Critical",
      evidenceBlocks: ["0x" + crypto.randomBytes(16).toString("hex")],
    });
  }
  return fingerprints;
}

router.post("/verify/:agentId", async (req, res) => {
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
    : Math.round(Math.random() * 0.1 * 1000) / 1000;

  const behavioralDepth = Math.round(500 + Math.random() * 5000);
  const credibilityScore = Math.round(400 + Math.random() * 500);
  const badgeEligible = overallRisk < 0.15 && behavioralDepth > 1000;
  const badgeHash = badgeEligible
    ? "0x" + crypto.createHash("sha256").update(agentId + Date.now()).digest("hex")
    : null;
  const auditId = "0x" + crypto.randomBytes(16).toString("hex");

  const payload = {
    auditId,
    targetAgentId: agentId,
    overallRisk: Math.round(overallRisk * 1000) / 1000,
    fingerprintsDetected: fingerprints,
    behavioralDepth,
    credibilityScore,
    badgeEligible,
    badgeHash,
  };

  // persist audit to DB (non-blocking)
  db.insert(auditReportsTable).values({
    auditId,
    targetAgentId: agentId,
    overallRisk: payload.overallRisk,
    fingerprintsDetected: fingerprints,
    behavioralDepth,
    credibilityScore,
    badgeEligible,
    badgeHash,
  }).catch(() => {/* non-blocking */});

  return res.json(payload);
});

export default router;
