import { useState } from "react";
import { useAuditAgent } from "@workspace/api-client-react";
import { Shield, Search, Fingerprint, AlertTriangle, CheckCircle2, ShieldCheck, BadgeCheck, ShieldAlert } from "lucide-react";

export default function Verify() {
  const [agentId, setAgentId] = useState("");
  const [auditDepth, setAuditDepth] = useState(1000);

  const auditAgent = useAuditAgent();

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId) return;
    auditAgent.mutate({
      agentId,
      data: {
        auditDepth
      }
    });
  };

  const report = auditAgent.data;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-3xl font-bold tracking-widest uppercase flex items-center gap-3">
          <Shield className="text-primary w-8 h-8" />
          Agent Auditor
        </h1>
        <p className="text-muted-foreground font-mono mt-3 max-w-2xl text-sm">
          Deep behavioral scan for manipulation fingerprints. 
          Verifies historical action continuity and identifies sybil patterns, wash trading, and coordinated attacks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Panel */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleAudit} className="bg-card border border-border/50 p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-foreground">Target Agent ID</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text"
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-background border border-border pl-10 pr-4 py-2 font-mono text-sm focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase text-foreground">Audit Depth (Blocks)</label>
                  <span className="text-xs font-mono text-secondary">{auditDepth}</span>
                </div>
                <input 
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={auditDepth}
                  onChange={(e) => setAuditDepth(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={auditAgent.isPending}
              className="w-full bg-background border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 px-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {auditAgent.isPending ? 'Scanning...' : 'Execute Audit'}
            </button>
          </form>

          {report && (
            <div className="bg-card border border-border/50 p-6 font-mono">
               <h3 className="text-xs text-muted-foreground uppercase mb-4 tracking-widest">Metadata</h3>
               <div className="space-y-3 text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-1">Audit ID</span>
                    <span className="break-all">{report.auditId}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-1">Target</span>
                    <span className="break-all text-secondary">{report.targetAgentId}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground mb-1">Behav. Depth</span>
                    <span>{report.behavioralDepth} interactions</span>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {auditAgent.isPending ? (
            <div className="h-[400px] border border-border/50 bg-card/20 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
               <div className="absolute inset-0 bg-primary/5 animate-pulse" />
               <Fingerprint className="w-16 h-16 text-primary opacity-50 animate-bounce" />
               <div className="font-mono text-sm text-primary uppercase tracking-widest z-10">
                 Analyzing Behavioral Fingerprints...
               </div>
            </div>
          ) : !report ? (
             <div className="h-full min-h-[400px] border border-border/50 border-dashed flex items-center justify-center">
               <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest opacity-50">Provide an Agent ID to begin</p>
             </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              {/* Score Header */}
              <div className="grid grid-cols-2 gap-4">
                 <div className={`p-6 border ${report.overallRisk > 0.6 ? 'bg-destructive/10 border-destructive/50' : 'bg-card border-border/50'}`}>
                    <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Overall Risk</div>
                    <div className={`text-4xl font-bold font-mono ${report.overallRisk > 0.6 ? 'text-destructive' : 'text-foreground'}`}>
                      {(report.overallRisk * 100).toFixed(1)}%
                    </div>
                 </div>
                 <div className="p-6 border border-border/50 bg-card">
                    <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Credibility Score</div>
                    <div className="text-4xl font-bold font-mono text-secondary">
                      {report.credibilityScore}
                    </div>
                 </div>
              </div>

              {/* Badge Eligibility */}
              <div className={`p-4 border font-mono flex items-center justify-between
                ${report.badgeEligible ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-background'}
              `}>
                <div className="flex items-center gap-3">
                  {report.badgeEligible ? <BadgeCheck className="text-primary w-5 h-5" /> : <AlertTriangle className="text-muted-foreground w-5 h-5" />}
                  <span className="text-sm uppercase tracking-wide">
                    {report.badgeEligible ? 'Eligible for Verification Badge' : 'Not Eligible for Verification'}
                  </span>
                </div>
                {report.badgeHash && (
                  <span className="text-[10px] text-muted-foreground px-2 py-1 bg-background border border-border">
                    {report.badgeHash.substring(0, 16)}...
                  </span>
                )}
              </div>

              {/* Fingerprints */}
              <div>
                <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-4 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" /> Detected Fingerprints
                </h3>
                
                {report.fingerprintsDetected.length === 0 ? (
                  <div className="border border-border/50 bg-card p-8 flex flex-col items-center justify-center text-center">
                    <CheckCircle2 className="w-10 h-10 text-primary mb-3" />
                    <p className="font-mono text-sm text-foreground uppercase">No Manipulation Detected</p>
                    <p className="font-mono text-xs text-muted-foreground mt-2">Behavior aligns with organic baselines.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {report.fingerprintsDetected.map((fp, i) => (
                      <div key={i} className={`border border-border/50 bg-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4
                         ${fp.severity === 'Critical' ? 'border-destructive/50 bg-destructive/5' : 
                           fp.severity === 'High' ? 'border-orange-500/30' : ''}
                      `}>
                         <div className="flex items-center gap-3">
                           {fp.severity === 'Critical' ? <ShieldAlert className="text-destructive w-5 h-5" /> :
                            fp.severity === 'High' ? <AlertTriangle className="text-orange-500 w-5 h-5" /> :
                            <ShieldCheck className="text-muted-foreground w-5 h-5" />}
                           <div>
                             <div className="font-mono text-sm uppercase text-foreground">{fp.type}</div>
                             <div className="font-mono text-[10px] text-muted-foreground mt-1">Severity: <span className={fp.severity === 'Critical' ? 'text-destructive' : ''}>{fp.severity}</span></div>
                           </div>
                         </div>
                         
                         <div className="text-right font-mono">
                           <div className="text-[10px] text-muted-foreground uppercase mb-1">Confidence</div>
                           <div className="text-sm text-foreground">{(fp.confidence * 100).toFixed(1)}%</div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
