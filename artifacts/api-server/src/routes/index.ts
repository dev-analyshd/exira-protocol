import { Router, type IRouter } from "express";
import healthRouter from "./health";
import financeRouter from "./exira/finance";
import verifyRouter from "./exira/verify";
import bridgeRouter from "./exira/bridge";
import guardRouter from "./exira/guard";
import socialRouter from "./exira/social";
import learnRouter from "./exira/learn";
import senseRouter from "./exira/sense";
import agentsRouter from "./exira/agents";
import dashboardRouter from "./exira/dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/v1", financeRouter);
router.use("/v1", verifyRouter);
router.use("/v1", bridgeRouter);
router.use("/v1", guardRouter);
router.use("/v1", socialRouter);
router.use("/v1", learnRouter);
router.use("/v1", senseRouter);
router.use("/v1", agentsRouter);
router.use("/v1", dashboardRouter);

export default router;
