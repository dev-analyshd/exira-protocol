import {
  pgTable,
  text,
  boolean,
  doublePrecision,
  timestamp,
  serial,
  integer,
  bigint,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ============================================================
// AGENTS
// ============================================================

export const exiraAgentsTable = pgTable("exira_agents", {
  id: serial("id").primaryKey(),
  agentId: text("agent_id").notNull().unique(),
  ownerAddress: text("owner_address").notNull(),
  registrationTime: timestamp("registration_time").notNull().defaultNow(),
  behavioralDepth: doublePrecision("behavioral_depth").notNull().default(0),
  credibilityScore: doublePrecision("credibility_score").notNull().default(500),
  reputationScore: doublePrecision("reputation_score").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  isMonitored: boolean("is_monitored").notNull().default(false),
  genomicKey: text("genomic_key"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAgentSchema = createInsertSchema(exiraAgentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  registrationTime: true,
});
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof exiraAgentsTable.$inferSelect;

// ============================================================
// SIGNALS
// ============================================================

export const exiraSignalsTable = pgTable("exira_signals", {
  id: serial("id").primaryKey(),
  signalId: text("signal_id").notNull().unique(),
  signalType: text("signal_type").notNull(),
  entityId: text("entity_id").notNull(),
  direction: text("direction"),
  signalValue: doublePrecision("signal_value"),
  ci95Lower: doublePrecision("ci95_lower"),
  ci95Upper: doublePrecision("ci95_upper"),
  coherence: doublePrecision("coherence").notNull(),
  threshold: doublePrecision("threshold").notNull(),
  margin: doublePrecision("margin").notNull().default(0),
  limitingPlane: text("limiting_plane"),
  strategy: text("strategy"),
  manipulationRisk: doublePrecision("manipulation_risk"),
  confidence: doublePrecision("confidence"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSignalSchema = createInsertSchema(exiraSignalsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type Signal = typeof exiraSignalsTable.$inferSelect;

// ============================================================
// AUDIT REPORTS
// ============================================================

export const auditReportsTable = pgTable("audit_reports", {
  id: serial("id").primaryKey(),
  auditId: text("audit_id").notNull().unique(),
  targetAgentId: text("target_agent_id").notNull(),
  overallRisk: doublePrecision("overall_risk").notNull(),
  fingerprintsDetected: jsonb("fingerprints_detected").$type<Array<{
    type: string;
    confidence: number;
    severity: string;
    evidenceBlocks?: string[];
  }>>().notNull().default([]),
  behavioralDepth: doublePrecision("behavioral_depth").notNull(),
  credibilityScore: doublePrecision("credibility_score").notNull(),
  badgeEligible: boolean("badge_eligible").notNull().default(false),
  badgeHash: text("badge_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAuditSchema = createInsertSchema(auditReportsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type AuditReport = typeof auditReportsTable.$inferSelect;

// ============================================================
// BRIDGE ROUTES
// ============================================================

export const bridgeRoutesTable = pgTable("bridge_routes", {
  id: serial("id").primaryKey(),
  routeId: text("route_id").notNull().unique(),
  entityId: text("entity_id"),
  assetIn: text("asset_in").notNull(),
  assetOut: text("asset_out").notNull(),
  amount: text("amount").notNull(),
  sourceChain: integer("source_chain").notNull(),
  targetChain: integer("target_chain").notNull(),
  routeType: text("route_type").notNull(),
  btcpScore: doublePrecision("btcp_score").notNull(),
  estimatedGas: text("estimated_gas").notNull(),
  estimatedTime: integer("estimated_time").notNull(),
  nlScore: doublePrecision("nl_score").notNull(),
  ccCoherence: doublePrecision("cc_coherence").notNull(),
  status: text("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBridgeRouteSchema = createInsertSchema(bridgeRoutesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertBridgeRoute = z.infer<typeof insertBridgeRouteSchema>;
export type BridgeRoute = typeof bridgeRoutesTable.$inferSelect;

// ============================================================
// ZK CREDENTIALS
// ============================================================

export const zkCredentialsTable = pgTable("zk_credentials", {
  id: serial("id").primaryKey(),
  credentialId: text("credential_id").notNull().unique(),
  credentialType: text("credential_type").notNull(),
  jurisdiction: text("jurisdiction"),
  zkProof: text("zk_proof").notNull(),
  verifierAddress: text("verifier_address").notNull(),
  expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertZkCredentialSchema = createInsertSchema(zkCredentialsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertZkCredential = z.infer<typeof insertZkCredentialSchema>;
export type ZkCredential = typeof zkCredentialsTable.$inferSelect;

// ============================================================
// SKILLS
// ============================================================

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  skillId: text("skill_id").notNull().unique(),
  skillName: text("skill_name").notNull(),
  description: text("description").notNull(),
  complexity: text("complexity").notNull(),
  iqScore: doublePrecision("iq_score").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  category: text("category"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSkillSchema = createInsertSchema(skillsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skillsTable.$inferSelect;
