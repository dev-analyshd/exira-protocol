import { Router } from "express";
import crypto from "crypto";
import { GetRecentSignalsQueryParams } from "@workspace/api-zod";

const router = Router();

const PILLARS = [
  { name: "Finance", category: "finance" },
  { name: "Verify", category: "verify" },
  { name: "Bridge", category: "bridge" },
  { name: "Guard", category: "guard" },
  { name: "Social", category: "social" },
  { name: "Learn", category: "learn" },
  { name: "Sense", category: "sense" },
];

const SIGNAL_TYPES = [
  "EXIRA_FINANCE",
  "EXIRA_VERIFY",
  "EXIRA_BRIDGE",
  "EXIRA_GUARD",
  "EXIRA_SOCIAL",
  "EXIRA_LEARN",
  "EXIRA_SENSE",
  "BEHAVIORAL_TRUTH",
  "MANIPULATION_ALERT",
  "BTCP_ROUTE",
];

// Simulated live coherence — drifts over time
function getCoherence() {
  const base = 0.72;
  const noise = Math.sin(Date.now() / 60000) * 0.08 + Math.random() * 0.04;
  return Math.min(0.98, Math.max(0.55, base + noise));
}

function getPlaneCoherence(offset: number) {
  const base = 0.65 + offset;
  const noise = Math.random() * 0.1 - 0.05;
  return Math.min(0.98, Math.max(0.50, base + noise));
}

router.get("/dashboard/coherence", (req, res) => {
  const now = Date.now();
  const overall = getCoherence();
  const threshold = 0.63;

  // Generate 24 history points (last 24 hours)
  const history = [];
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now - i * 3600000);
    const v = 0.55 + Math.random() * 0.4;
    history.push({
      timestamp: t.toISOString(),
      value: Math.round(v * 1000) / 1000,
    });
  }

  return res.json({
    overallCoherence: Math.round(overall * 1000) / 1000,
    threshold,
    physicalPlane: Math.round(getPlaneCoherence(0.05) * 1000) / 1000,
    mentalPlane: Math.round(getPlaneCoherence(0.0) * 1000) / 1000,
    spiritualPlane: Math.round(getPlaneCoherence(0.1) * 1000) / 1000,
    consciousPlane: Math.round(getPlaneCoherence(-0.05) * 1000) / 1000,
    animaPlane: Math.round(getPlaneCoherence(0.03) * 1000) / 1000,
    history,
  });
});

router.get("/dashboard/pillars", (req, res) => {
  const pillars = PILLARS.map(p => ({
    name: p.name,
    status: Math.random() > 0.1 ? "active" : "degraded",
    requestsToday: Math.floor(1000 + Math.random() * 50000),
    avgResponseMs: Math.round(20 + Math.random() * 80),
    uptime: Math.round((99 + Math.random() * 0.9) * 100) / 100,
  }));

  const totalRequestsToday = pillars.reduce((sum, p) => sum + p.requestsToday, 0);

  return res.json({
    pillars,
    totalRequestsToday,
    systemCoherence: Math.round(getCoherence() * 1000) / 1000,
  });
});

router.get("/dashboard/signals", (req, res) => {
  const parse = GetRecentSignalsQueryParams.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }

  const { limit = 20 } = parse.data;
  const now = Date.now();

  const signals = [];
  for (let i = 0; i < Math.min(limit, 50); i++) {
    const coherence = 0.45 + Math.random() * 0.53;
    const threshold = 0.55 + Math.random() * 0.2;
    const fired = coherence >= threshold;
    const signalType = SIGNAL_TYPES[Math.floor(Math.random() * SIGNAL_TYPES.length)];

    signals.push({
      signalId: "0x" + crypto.randomBytes(8).toString("hex"),
      signalType,
      entityId: "0x" + crypto.randomBytes(20).toString("hex"),
      coherence: Math.round(coherence * 1000) / 1000,
      threshold: Math.round(threshold * 1000) / 1000,
      margin: Math.round((coherence - threshold) * 1000) / 1000,
      direction: fired ? ["Long", "Short", "Neutral", "Hedge", "Silence"][Math.floor(Math.random() * 5)] : null,
      timestamp: new Date(now - i * 45000 - Math.random() * 30000).toISOString(),
    });
  }

  // Sort by timestamp desc
  signals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return res.json(signals);
});

export default router;
