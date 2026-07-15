import { Router } from "express";
import crypto from "crypto";
import { ComputeBridgeRouteBody } from "@workspace/api-zod";

const router = Router();

const ROUTE_TYPES = ["SingleChain", "Split", "Netting", "Parallel", "MultiHop", "Deferred", "Bitp"] as const;

function computeRoutes(sourceChain: number, targetChain: number, amount: string) {
  const numRoutes = 2 + Math.floor(Math.random() * 4);
  const routes = [];

  for (let i = 0; i < numRoutes; i++) {
    const routeType = ROUTE_TYPES[Math.floor(Math.random() * ROUTE_TYPES.length)];
    const btcpScore = 0.6 + Math.random() * 0.39;
    const isNetting = routeType === "Netting";

    routes.push({
      routeId: "0x" + crypto.randomBytes(12).toString("hex"),
      routeType,
      sourceChain,
      targetChain,
      btcpScore: Math.round(btcpScore * 1000) / 1000,
      estimatedGas: isNetting
        ? String(Math.floor(1000 + Math.random() * 5000))
        : String(Math.floor(20000 + Math.random() * 100000)),
      estimatedTime: isNetting ? 1 : Math.floor(30 + Math.random() * 300),
      nlScore: Math.round((0.7 + Math.random() * 0.29) * 1000) / 1000,
      beoContruinity: Math.round((0.8 + Math.random() * 0.19) * 1000) / 1000,
      ccCoherence: Math.round((0.65 + Math.random() * 0.34) * 1000) / 1000,
    });
  }

  // Sort by BTCP score descending
  routes.sort((a, b) => b.btcpScore - a.btcpScore);
  return routes;
}

router.post("/bridge/route", (req, res) => {
  const parse = ComputeBridgeRouteBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request", details: parse.error.issues });
  }

  const { assetIn, assetOut, amount, sourceChain, targetChain } = parse.data;
  const routes = computeRoutes(sourceChain, targetChain, amount);

  return res.json(routes);
});

export default router;
