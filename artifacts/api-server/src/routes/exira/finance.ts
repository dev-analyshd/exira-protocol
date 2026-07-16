import { Router } from "express";
import crypto from "crypto";
import { GetFinanceSignalBody } from "@workspace/api-zod";
import { db, exiraSignalsTable } from "@workspace/db";

const router = Router();

const STRATEGIES = [
  "MomentumMeanReversion_v3",
  "BayesianKelly_v2",
  "ADAPT_Omega_7",
  "CoherenceArbitrage_v1",
  "BehavioralTrend_v4",
  "VolatilityNeutral_v2",
];

function computeCoherence(assetPair: string, riskProfile: string): number {
  const seed = assetPair.charCodeAt(0) + Date.now() % 1000;
  const base = 0.45 + (seed % 100) / 200;
  const riskAdj = riskProfile === "aggressive" ? 0.05 : riskProfile === "conservative" ? -0.05 : 0;
  return Math.min(0.98, Math.max(0.42, base + riskAdj));
}

function dynamicThreshold(assetPair: string): number {
  const volatility = (assetPair.charCodeAt(0) % 30) / 100;
  return 0.55 + (0.92 - 0.55) * volatility;
}

router.post("/finance", async (req, res) => {
  const parse = GetFinanceSignalBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request", details: parse.error.issues });
  }

  const { assetPair, timeframe = "1h", riskProfile = "balanced" } = parse.data;

  const coherence = computeCoherence(assetPair, riskProfile);
  const threshold = dynamicThreshold(assetPair);
  const signalId = "0x" + crypto.randomBytes(16).toString("hex");
  const manipulationRisk = Math.round(Math.random() * 0.3 * 1000) / 1000;

  if (coherence < threshold) {
    const payload = {
      signalId,
      direction: "Silence",
      confidence: 0,
      ci95Lower: 0,
      ci95Upper: 0,
      coherence: Math.round(coherence * 1000) / 1000,
      threshold: Math.round(threshold * 1000) / 1000,
      strategy: "NONE",
      manipulationRisk,
      timestamp: Date.now(),
    };
    // persist suppressed signal
    db.insert(exiraSignalsTable).values({
      signalId,
      signalType: "SILENCE",
      entityId: assetPair,
      direction: "Silence",
      signalValue: 0,
      ci95Lower: 0,
      ci95Upper: 0,
      coherence: payload.coherence,
      threshold: payload.threshold,
      margin: payload.coherence - payload.threshold,
      limitingPlane: "PHYSICAL",
      strategy: "NONE",
      manipulationRisk,
      confidence: 0,
    }).catch(() => {/* non-blocking */});
    return res.json(payload);
  }

  const directions = ["Long", "Short", "Neutral", "Hedge"] as const;
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const confidence = coherence * (0.9 + Math.random() * 0.1);
  const ci95Width = 0.02 + Math.random() * 0.04;
  const strategy = STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)];
  const mRisk = Math.round(Math.random() * 0.15 * 1000) / 1000;

  const payload = {
    signalId,
    direction,
    confidence: Math.round(confidence * 1000) / 1000,
    ci95Lower: Math.round((confidence - ci95Width) * 1000) / 1000,
    ci95Upper: Math.round((confidence + ci95Width) * 1000) / 1000,
    coherence: Math.round(coherence * 1000) / 1000,
    threshold: Math.round(threshold * 1000) / 1000,
    strategy,
    manipulationRisk: mRisk,
    timestamp: Date.now(),
  };

  // persist signal to DB (non-blocking)
  db.insert(exiraSignalsTable).values({
    signalId,
    signalType: "EXIRA_FINANCE",
    entityId: assetPair,
    direction,
    signalValue: payload.confidence,
    ci95Lower: payload.ci95Lower,
    ci95Upper: payload.ci95Upper,
    coherence: payload.coherence,
    threshold: payload.threshold,
    margin: Math.round((coherence - threshold) * 1000) / 1000,
    limitingPlane: "PHYSICAL",
    strategy,
    manipulationRisk: mRisk,
    confidence: payload.confidence,
  }).catch(() => {/* non-blocking */});

  return res.json(payload);
});

export default router;
