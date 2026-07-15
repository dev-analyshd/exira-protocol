export interface BridgeRequest {
  assetIn: string;
  assetOut: string;
  amount: string;
  sourceChain: number;
  targetChain: number;
  deadline?: number;
  maxGasUsd?: string;
  privacyMode?: "Public" | "ZkCredential" | "Invisible";
}

export interface AgentInput {
  agentId: string;
  genomicKey: string;
  ownerAddress?: string;
}

export interface AgentProfile {
  agentId: string;
  ownerAddress: string;
  registrationTime: string;
  behavioralDepth: number;
  credibilityScore: number;
  reputationScore: number;
  isVerified: boolean;
  genomicKey: string | null;
}

export interface CredentialInput {
  credentialType: "kyc" | "aml" | "sanctions" | "travel_rule";
  jurisdiction?: string;
  disclosureHash?: string;
}

export interface ProofInput {
  propertyType: "task_count" | "satisfaction_rate" | "dispute_free" | "manipulation_free";
  threshold?: number;
}
