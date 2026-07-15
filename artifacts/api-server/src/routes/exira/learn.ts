import { Router } from "express";
import { ListSkillsQueryParams } from "@workspace/api-zod";

const router = Router();

const SKILLS_DB = [
  { skillId: "skill_behavioral_hash", skillName: "Behavioral Hash Computation", description: "Compute dual-strand behavioral DNA hash for any entity", complexity: "complex", iqScore: 142, isAvailable: true, category: "core" },
  { skillId: "skill_manipulation_detect", skillName: "Manipulation Fingerprint Detection", description: "Detect 7 types of market manipulation from behavioral patterns", complexity: "complex", iqScore: 138, isAvailable: true, category: "verify" },
  { skillId: "skill_coherence_engine", skillName: "Five-Plane Coherence Engine", description: "Compute Ψ(t) coherence across Physical, Mental, Spiritual, Conscious, ANIMA planes", complexity: "complex", iqScore: 156, isAvailable: true, category: "core" },
  { skillId: "skill_btcp_routing", skillName: "BTCP Intent Routing", description: "Route cross-chain intents without moving assets between chains", complexity: "complex", iqScore: 144, isAvailable: true, category: "bridge" },
  { skillId: "skill_netting_engine", skillName: "Counterparty Netting", description: "Match opposite intents for zero-movement settlement", complexity: "medium", iqScore: 129, isAvailable: true, category: "bridge" },
  { skillId: "skill_beo_cluster", skillName: "BEO Entity Resolution", description: "128-dim behavioral clustering to resolve multi-wallet identities", complexity: "complex", iqScore: 151, isAvailable: true, category: "social" },
  { skillId: "skill_adapt_omega", skillName: "ADAPT-Ω Strategy Selection", description: "Autonomous strategy competition for behavioral trading signals", complexity: "complex", iqScore: 148, isAvailable: true, category: "finance" },
  { skillId: "skill_bayesian_kelly", skillName: "Bayesian Kelly Sizing", description: "Probability-weighted position sizing with behavioral coherence gate", complexity: "medium", iqScore: 133, isAvailable: true, category: "finance" },
  { skillId: "skill_zk_compliance", skillName: "ZK Compliance Credential", description: "Issue KYC/AML/sanctions credentials without revealing identity", complexity: "complex", iqScore: 147, isAvailable: true, category: "guard" },
  { skillId: "skill_anima_crawl", skillName: "ANIMA Intelligence Crawlers", description: "1000+ concurrent cross-domain intelligence crawlers in 50+ languages", complexity: "complex", iqScore: 161, isAvailable: false, category: "learn" },
  { skillId: "skill_source_credibility", skillName: "Source Credibility Evolution", description: "Bayesian credibility scoring that evolves with each verification event", complexity: "medium", iqScore: 127, isAvailable: true, category: "social" },
  { skillId: "skill_genesis_pricing", skillName: "Genesis Asset Pricing", description: "Price newly launched assets with no history using archetype matching", complexity: "complex", iqScore: 139, isAvailable: true, category: "finance" },
  { skillId: "skill_sense_oracle", skillName: "Sensing Oracle Proof", description: "Generate ZK behavioral proofs for privacy-preserving credential claims", complexity: "medium", iqScore: 135, isAvailable: true, category: "sense" },
  { skillId: "skill_validator_mesh", skillName: "P2P Validator Mesh", description: "Decentralized consensus network for behavioral signal validation", complexity: "complex", iqScore: 143, isAvailable: false, category: "core" },
  { skillId: "skill_liquidity_score", skillName: "Liquidity Scoring NL", description: "Compute NL = LD × LO × LC × LS composite liquidity health score", complexity: "simple", iqScore: 112, isAvailable: true, category: "finance" },
];

router.get("/learn/skills", (req, res) => {
  const parse = ListSkillsQueryParams.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }

  let skills = [...SKILLS_DB];

  if (parse.data.category) {
    skills = skills.filter(s => s.category === parse.data.category);
  }

  if (parse.data.complexity) {
    skills = skills.filter(s => s.complexity === parse.data.complexity);
  }

  return res.json({
    skills,
    totalCount: skills.length,
  });
});

export default router;
