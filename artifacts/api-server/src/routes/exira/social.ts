import { Router } from "express";
import crypto from "crypto";
import { GetReputationParams } from "@workspace/api-zod";

const router = Router();

router.get("/social/reputation/:agentId", (req, res) => {
  const parse = GetReputationParams.safeParse(req.params);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid agent ID" });
  }

  const { agentId } = parse.data;
  const seed = agentId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const reputationScore = 100 + (seed % 800);
  const credibilityScore = 300 + (seed % 600);
  const behavioralDepth = 200 + (seed % 9000);
  const isVerified = seed % 3 !== 0;
  const badgeHash = isVerified
    ? "0x" + crypto.createHash("sha256").update(agentId).digest("hex")
    : null;

  return res.json({
    agentId,
    reputationScore,
    credibilityScore,
    behavioralDepth: Math.round(behavioralDepth),
    isVerified,
    badgeHash,
    crossChainContinuity: Math.round((0.6 + Math.random() * 0.39) * 1000) / 1000,
  });
});

export default router;
