import { useState } from "react";
import { useGetFinanceSignal, FinanceSignalInputTimeframe, FinanceSignalInputRiskProfile } from "@workspace/api-client-react";
import { Activity, ShieldAlert, ArrowRight, Zap, Target } from "lucide-react";
import { format } from "date-fns";

export default function Finance() {
  const [assetPair, setAssetPair] = useState("BTC-USDT");
  const [timeframe, setTimeframe] = useState<FinanceSignalInputTimeframe>("1h");
  const [riskProfile, setRiskProfile] = useState<FinanceSignalInputRiskProfile>("balanced");

  const getSignal = useGetFinanceSignal();

  const handleRequestSignal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetPair) return;
    getSignal.mutate({
      data: {
        assetPair,
        timeframe,
        riskProfile
      }
    });
  };

  const signal = getSignal.data;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-3xl font-bold tracking-widest uppercase flex items-center gap-3">
          <Activity className="text-primary w-8 h-8" />
          Finance Signals
        </h1>
        <p className="text-muted-foreground font-mono mt-3 max-w-2xl text-sm">
          Coherence-gated trading signals derived from cross-plane behavioral truth.
          Signals only execute when system Ψ(t) exceeds local threshold Θ(t).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Request Form */}
        <div className="md:col-span-5">
          <form onSubmit={handleRequestSignal} className="bg-card border border-border/50 p-6 space-y-6">
            <h2 className="text-sm font-mono tracking-widest text-muted-foreground uppercase">Parameter Input</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-foreground">Asset Pair</label>
              <input 
                type="text"
                value={assetPair}
                onChange={(e) => setAssetPair(e.target.value)}
                placeholder="e.g. BTC-USDT"
                className="w-full bg-background border border-border px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-foreground">Timeframe</label>
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as FinanceSignalInputTimeframe)}
                className="w-full bg-background border border-border px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">1 Day</option>
                <option value="1w">1 Week</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-foreground">Risk Profile</label>
              <select 
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value as FinanceSignalInputRiskProfile)}
                className="w-full bg-background border border-border px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="conservative">Conservative</option>
                <option value="balanced">Balanced</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={getSignal.isPending}
              className="w-full bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 px-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {getSignal.isPending ? 'Computing...' : 'Generate Signal'}
              {!getSignal.isPending && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        {/* Signal Output */}
        <div className="md:col-span-7">
          <div className="h-full bg-background border border-border/50 p-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
            
            <div className="bg-card/50 h-full p-6 border border-border/20 backdrop-blur-sm flex flex-col relative z-10">
              {getSignal.isPending ? (
                <div className="flex-1 flex flex-col items-center justify-center text-primary font-mono space-y-4">
                  <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin" />
                  <p className="text-xs uppercase tracking-widest animate-pulse">Calculating Multi-plane Coherence</p>
                </div>
              ) : getSignal.isError ? (
                <div className="flex-1 flex flex-col items-center justify-center text-destructive font-mono space-y-4">
                  <ShieldAlert className="w-12 h-12" />
                  <p className="text-sm text-center">Signal calculation failed.<br/>Coherence bounds breached.</p>
                </div>
              ) : signal ? (
                <div className="animate-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Signal ID</div>
                      <div className="font-mono text-[10px] break-all max-w-[200px] text-foreground/70">{signal.signalId}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Generated</div>
                      <div className="font-mono text-xs">{format(new Date(signal.timestamp), 'HH:mm:ss.SSS')}</div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center items-center py-8">
                    <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-4">Recommended Action</div>
                    <div className={`text-6xl font-bold tracking-tight uppercase mb-2
                      ${signal.direction === 'Long' ? 'text-secondary glow-secondary' : 
                        signal.direction === 'Short' ? 'text-destructive' : 
                        signal.direction === 'Silence' ? 'text-muted-foreground' : 'text-primary'}`}
                    >
                      {signal.direction}
                    </div>
                    
                    {signal.direction === 'Silence' && (
                      <p className="font-mono text-xs text-muted-foreground mt-4 text-center max-w-xs">
                        Action withheld. Manipulation risk or low coherence detected.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="border border-border/50 bg-background/50 p-3">
                      <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1 flex items-center gap-1">
                        <Target className="w-3 h-3" /> Confidence
                      </div>
                      <div className="text-lg font-mono">{(signal.confidence * 100).toFixed(1)}%</div>
                      {signal.ci95Lower && signal.ci95Upper && (
                        <div className="text-[10px] text-muted-foreground mt-1">CI: {signal.ci95Lower.toFixed(2)} - {signal.ci95Upper.toFixed(2)}</div>
                      )}
                    </div>
                    <div className="border border-border/50 bg-background/50 p-3">
                      <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Coherence Ψ
                      </div>
                      <div className={`text-lg font-mono ${signal.coherence >= signal.threshold ? 'text-primary' : 'text-destructive'}`}>
                        {(signal.coherence * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">Θ: {(signal.threshold * 100).toFixed(1)}%</div>
                    </div>
                    <div className="col-span-2 border border-border/50 bg-background/50 p-3 flex justify-between items-center">
                      <div>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Manipulation Risk
                        </div>
                        <div className={`text-sm font-mono ${signal.manipulationRisk > 0.5 ? 'text-destructive' : 'text-foreground'}`}>
                          {(signal.manipulationRisk * 100).toFixed(1)}%
                        </div>
                      </div>
                      {signal.strategy && (
                        <div className="text-right">
                          <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Strategy</div>
                          <div className="text-xs font-mono text-primary bg-primary/10 px-2 py-1">{signal.strategy}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground font-mono space-y-4 opacity-50">
                  <Activity className="w-12 h-12" />
                  <p className="text-xs uppercase tracking-widest text-center">Awaiting parameters.<br/>System idle.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
