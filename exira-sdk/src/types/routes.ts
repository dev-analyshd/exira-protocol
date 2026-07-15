export type RouteType =
  | "SingleChain"
  | "Split"
  | "Netting"
  | "Parallel"
  | "MultiHop"
  | "Deferred"
  | "Bitp";

export interface BridgeRoute {
  routeId: string;
  routeType: RouteType;
  sourceChain: number;
  targetChain: number;
  btcpScore: number;
  estimatedGas: string;
  estimatedTime: number;
  nlScore: number;
  beoContruinity: number;
  ccCoherence: number;
}

export interface SkillEntry {
  skillId: string;
  skillName: string;
  description: string;
  complexity: "simple" | "medium" | "complex";
  iqScore: number;
  isAvailable: boolean;
}

export interface CoherenceMetrics {
  overallCoherence: number;
  threshold: number;
  physicalPlane: number;
  mentalPlane: number;
  spiritualPlane: number;
  consciousPlane: number;
  animaPlane: number;
  history: Array<{ timestamp: string; value: number }>;
}

export interface SignalEvent {
  signalId: string;
  signalType: string;
  entityId: string;
  coherence: number;
  threshold: number;
  margin: number;
  direction: string | null;
  timestamp: string;
}
