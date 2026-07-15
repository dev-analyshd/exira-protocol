import { Router } from "express";
import crypto from "crypto";
import { IssueCredentialBody } from "@workspace/api-zod";

const router = Router();

const VERIFIER_ADDRESSES: Record<string, string> = {
  kyc: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  aml: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
  sanctions: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
  travel_rule: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
};

router.post("/guard/credential", (req, res) => {
  const parse = IssueCredentialBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request", details: parse.error.issues });
  }

  const { credentialType, jurisdiction = "GLOBAL", disclosureHash } = parse.data;

  const credentialId = "0x" + crypto.randomBytes(20).toString("hex");
  const proof = crypto.randomBytes(128).toString("hex");
  const verifierAddress = VERIFIER_ADDRESSES[credentialType] ?? "0x0000000000000000000000000000000000000000";
  const expiresAt = Math.floor(Date.now() / 1000) + 90 * 24 * 3600; // 90 days

  return res.status(201).json({
    credentialId,
    zkProof: `noir_proof_${proof}`,
    verifierAddress,
    expiresAt,
  });
});

export default router;
