export enum SignalType {
  VALUATION = "VALUATION",
  SILENCE = "SILENCE",
  LIQUIDITY_HEALTH = "LIQUIDITY_HEALTH",
  MANIPULATION_ALERT = "MANIPULATION_ALERT",
  EXIRA_FINANCE = "EXIRA_FINANCE",
  EXIRA_VERIFY = "EXIRA_VERIFY",
  EXIRA_BRIDGE = "EXIRA_BRIDGE",
  EXIRA_GUARD = "EXIRA_GUARD",
  EXIRA_SOCIAL = "EXIRA_SOCIAL",
  EXIRA_LEARN = "EXIRA_LEARN",
  EXIRA_SENSE = "EXIRA_SENSE",
  BTCP_ROUTE = "BTCP_ROUTE",
  BEHAVIORAL_TRUTH = "BEHAVIORAL_TRUTH",
  LIQUIDITY_OCEAN = "LIQUIDITY_OCEAN",
  CONSENSUS_ADAPTATION = "CONSENSUS_ADAPTATION",
  CHAIN_RELIABILITY = "CHAIN_RELIABILITY",
}

export enum TradeDirection {
  Long = "Long",
  Short = "Short",
  Neutral = "Neutral",
  Hedge = "Hedge",
  Silence = "Silence",
}

export enum PlaneType {
  PHYSICAL = "PHYSICAL",
  MENTAL = "MENTAL",
  SPIRITUAL = "SPIRITUAL",
  CONSCIOUS = "CONSCIOUS",
  ANIMA = "ANIMA",
}

export interface FinanceSignalRequest {
  assetPair: string;
  timeframe?: "1h" | "4h" | "1d" | "1w";
  riskProfile?: "conservative" | "balanced" | "aggressive";
}

export interface FinanceSignal {
  signalId: string;
  direction: TradeDirection;
  confidence: number;
  ci95Lower: number;
  ci95Upper: number;
  coherence: number;
  threshold: number;
  strategy: string;
  manipulationRisk: number;
  timestamp: number;
}

export interface ManipulationFingerprint {
  type:
    | "WashTrading"
    | "CoordinatedPump"
    | "OracleAttackAttempt"
    | "SybilLiquidity"
    | "GovernanceCapture"
    | "MevExtractionSustained"
    | "FakeVolumeProtocol";
  confidence: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  evidenceBlocks?: string[];
}

export interface AuditReport {
  auditId: string;
  targetAgentId: string;
  overallRisk: number;
  fingerprintsDetected: ManipulationFingerprint[];
  behavioralDepth: number;
  credibilityScore: number;
  badgeEligible: boolean;
  badgeHash: string | null;
}

export interface ZKCredential {
  credentialId: string;
  zkProof: string;
  verifierAddress: string;
  expiresAt: number;
}

export interface ZKProof {
  proofId: string;
  zkProof: string;
  publicCommitment: string;
  isValid: boolean;
}

export interface ReputationProfile {
  agentId: string;
  reputationScore: number;
  credibilityScore: number;
  behavioralDepth: number;
  isVerified: boolean;
  badgeHash: string | null;
  crossChainContinuity: number;
}
