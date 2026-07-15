import { Router } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { exiraAgentsTable, insertAgentSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { ListAgentsQueryParams, GetAgentParams, RegisterAgentBody } from "@workspace/api-zod";

const router = Router();

router.get("/agents", async (req, res) => {
  try {
    const parse = ListAgentsQueryParams.safeParse(req.query);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid query params" });
    }

    const { limit = 20, verified } = parse.data;

    let agents = await db.select().from(exiraAgentsTable).orderBy(desc(exiraAgentsTable.reputationScore)).limit(limit);

    if (verified !== undefined) {
      agents = agents.filter(a => a.isVerified === verified);
    }

    return res.json(agents.map(a => ({
      agentId: a.agentId,
      ownerAddress: a.ownerAddress,
      registrationTime: a.registrationTime,
      behavioralDepth: a.behavioralDepth,
      credibilityScore: a.credibilityScore,
      reputationScore: a.reputationScore,
      isVerified: a.isVerified,
      genomicKey: a.genomicKey,
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing agents");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/agents/register", async (req, res) => {
  try {
    const parse = RegisterAgentBody.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid request", details: parse.error.issues });
    }

    const { agentId, genomicKey, ownerAddress } = parse.data;

    const existing = await db.select().from(exiraAgentsTable).where(eq(exiraAgentsTable.agentId, agentId)).limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Agent already registered" });
    }

    const [agent] = await db.insert(exiraAgentsTable).values({
      agentId,
      ownerAddress: ownerAddress ?? "0x" + crypto.randomBytes(20).toString("hex"),
      genomicKey,
    }).returning();

    return res.status(201).json({
      agentId: agent.agentId,
      ownerAddress: agent.ownerAddress,
      registrationTime: agent.registrationTime,
      behavioralDepth: agent.behavioralDepth,
      credibilityScore: agent.credibilityScore,
      reputationScore: agent.reputationScore,
      isVerified: agent.isVerified,
      genomicKey: agent.genomicKey,
    });
  } catch (err) {
    req.log.error({ err }, "Error registering agent");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/agents/:agentId", async (req, res) => {
  try {
    const parse = GetAgentParams.safeParse(req.params);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid agent ID" });
    }

    const { agentId } = parse.data;
    const agents = await db.select().from(exiraAgentsTable).where(eq(exiraAgentsTable.agentId, agentId)).limit(1);

    if (agents.length === 0) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const a = agents[0];
    return res.json({
      agentId: a.agentId,
      ownerAddress: a.ownerAddress,
      registrationTime: a.registrationTime,
      behavioralDepth: a.behavioralDepth,
      credibilityScore: a.credibilityScore,
      reputationScore: a.reputationScore,
      isVerified: a.isVerified,
      genomicKey: a.genomicKey,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting agent");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
