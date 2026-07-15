import { Router } from "express";
import crypto from "crypto";
import { GenerateProofBody } from "@workspace/api-zod";

const router = Router();

router.post("/sense/prove", (req, res) => {
  const parse = GenerateProofBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request", details: parse.error.issues });
  }

  const { propertyType, threshold } = parse.data;

  const proofId = "0x" + crypto.randomBytes(16).toString("hex");
  const zkProof = crypto.randomBytes(256).toString("hex");
  const publicCommitment = "0x" + crypto.createHash("sha256")
    .update(proofId + propertyType + String(threshold ?? 0))
    .digest("hex");

  // Simulate proof generation — 87% success rate
  const isValid = Math.random() > 0.13;

  return res.json({
    proofId,
    zkProof: `noir_behavioral_proof_${zkProof}`,
    publicCommitment,
    isValid,
  });
});

export default router;
