import axios, { AxiosInstance } from "axios";
import type {
  FinanceSignalRequest,
  FinanceSignal,
  AuditReport,
  ZKCredential,
  ZKProof,
  ReputationProfile,
} from "./types/signals";
import type {
  BridgeRequest,
  AgentInput,
  AgentProfile,
  CredentialInput,
  ProofInput,
} from "./types/intents";
import type {
  BridgeRoute,
  SkillEntry,
  CoherenceMetrics,
  SignalEvent,
} from "./types/routes";

export interface EXIRAConfig {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
}

export interface SkillCatalog {
  skills: SkillEntry[];
  totalCount: number;
}

/**
 * EXIRA Protocol Client
 * The Living Behavioral Cathedral — 7-pillar behavioral truth ASP
 * 
 * @example
 * const exira = new EXIRAClient({ baseUrl: "https://api.exira.protocol" });
 * const signal = await exira.finance.getSignal({ assetPair: "BTC-USDT" });
 * console.log(signal.direction, signal.coherence);
 */
export class EXIRAClient {
  private http: AxiosInstance;

  public readonly finance: FinancePillar;
  public readonly verify: VerifyPillar;
  public readonly bridge: BridgePillar;
  public readonly guard: GuardPillar;
  public readonly social: SocialPillar;
  public readonly learn: LearnPillar;
  public readonly sense: SensePillar;
  public readonly agents: AgentsPillar;
  public readonly dashboard: DashboardPillar;

  constructor(config: EXIRAConfig = {}) {
    this.http = axios.create({
      baseURL: config.baseUrl ?? "https://api.exira.protocol",
      timeout: config.timeout ?? 30000,
      headers: {
        "Content-Type": "application/json",
        "X-EXIRA-Version": "1.0.0",
        ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
      },
    });

    this.finance = new FinancePillar(this.http);
    this.verify = new VerifyPillar(this.http);
    this.bridge = new BridgePillar(this.http);
    this.guard = new GuardPillar(this.http);
    this.social = new SocialPillar(this.http);
    this.learn = new LearnPillar(this.http);
    this.sense = new SensePillar(this.http);
    this.agents = new AgentsPillar(this.http);
    this.dashboard = new DashboardPillar(this.http);
  }
}

class FinancePillar {
  constructor(private http: AxiosInstance) {}

  async getSignal(request: FinanceSignalRequest): Promise<FinanceSignal> {
    const { data } = await this.http.post<FinanceSignal>("/api/v1/finance", request);
    return data;
  }
}

class VerifyPillar {
  constructor(private http: AxiosInstance) {}

  async auditAgent(agentId: string, auditDepth = 1000): Promise<AuditReport> {
    const { data } = await this.http.post<AuditReport>(`/api/v1/verify/${agentId}`, { auditDepth });
    return data;
  }
}

class BridgePillar {
  constructor(private http: AxiosInstance) {}

  async computeRoutes(request: BridgeRequest): Promise<BridgeRoute[]> {
    const { data } = await this.http.post<BridgeRoute[]>("/api/v1/bridge/route", request);
    return data;
  }
}

class GuardPillar {
  constructor(private http: AxiosInstance) {}

  async issueCredential(input: CredentialInput): Promise<ZKCredential> {
    const { data } = await this.http.post<ZKCredential>("/api/v1/guard/credential", input);
    return data;
  }
}

class SocialPillar {
  constructor(private http: AxiosInstance) {}

  async getReputation(agentId: string): Promise<ReputationProfile> {
    const { data } = await this.http.get<ReputationProfile>(`/api/v1/social/reputation/${agentId}`);
    return data;
  }
}

class LearnPillar {
  constructor(private http: AxiosInstance) {}

  async listSkills(params?: { category?: string; complexity?: string }): Promise<SkillCatalog> {
    const { data } = await this.http.get<SkillCatalog>("/api/v1/learn/skills", { params });
    return data;
  }
}

class SensePillar {
  constructor(private http: AxiosInstance) {}

  async generateProof(input: ProofInput): Promise<ZKProof> {
    const { data } = await this.http.post<ZKProof>("/api/v1/sense/prove", input);
    return data;
  }
}

class AgentsPillar {
  constructor(private http: AxiosInstance) {}

  async list(params?: { verified?: boolean; limit?: number }): Promise<AgentProfile[]> {
    const { data } = await this.http.get<AgentProfile[]>("/api/v1/agents", { params });
    return data;
  }

  async register(input: AgentInput): Promise<AgentProfile> {
    const { data } = await this.http.post<AgentProfile>("/api/v1/agents/register", input);
    return data;
  }

  async get(agentId: string): Promise<AgentProfile> {
    const { data } = await this.http.get<AgentProfile>(`/api/v1/agents/${agentId}`);
    return data;
  }
}

class DashboardPillar {
  constructor(private http: AxiosInstance) {}

  async getCoherenceMetrics(): Promise<CoherenceMetrics> {
    const { data } = await this.http.get<CoherenceMetrics>("/api/v1/dashboard/coherence");
    return data;
  }

  async getRecentSignals(limit = 20): Promise<SignalEvent[]> {
    const { data } = await this.http.get<SignalEvent[]>("/api/v1/dashboard/signals", {
      params: { limit },
    });
    return data;
  }
}
