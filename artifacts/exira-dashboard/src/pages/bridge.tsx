import { useState } from "react";
import { useComputeBridgeRoute, BridgeInputPrivacyMode } from "@workspace/api-client-react";
import { GitMerge, ArrowRightLeft, Shield, Clock, Fuel, Activity } from "lucide-react";

export default function Bridge() {
  const [assetIn, setAssetIn] = useState("USDC");
  const [assetOut, setAssetOut] = useState("USDC");
  const [amount, setAmount] = useState("1000");
  const [sourceChain, setSourceChain] = useState<number>(1);
  const [targetChain, setTargetChain] = useState<number>(42161);
  const [privacyMode, setPrivacyMode] = useState<BridgeInputPrivacyMode>("ZkCredential");

  const computeRoute = useComputeBridgeRoute();

  const handleCompute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetIn || !assetOut || !amount) return;
    
    computeRoute.mutate({
      data: {
        assetIn,
        assetOut,
        amount,
        sourceChain,
        targetChain,
        privacyMode
      }
    });
  };

  const routes = computeRoute.data;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-border/50 pb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-widest uppercase flex items-center gap-3">
            <GitMerge className="text-primary w-8 h-8" />
            Bridge Router
          </h1>
          <p className="text-muted-foreground font-mono mt-3 max-w-2xl text-sm">
            Behaviorally-optimized cross-chain routing. Routes are ranked by BTCP (Behavioral Truth Continuity Proof) scores to minimize slippage and counterparty risk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleCompute} className="bg-card border border-border/50 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <h2 className="text-sm font-mono tracking-widest text-muted-foreground uppercase">Parameters</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Source Chain</label>
                <select 
                  value={sourceChain}
                  onChange={(e) => setSourceChain(Number(e.target.value))}
                  className="w-full bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary appearance-none"
                >
                  <option value={1}>Ethereum</option>
                  <option value={10}>Optimism</option>
                  <option value={42161}>Arbitrum</option>
                  <option value={137}>Polygon</option>
                  <option value={8453}>Polygon zkEVM</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Target Chain</label>
                <select 
                  value={targetChain}
                  onChange={(e) => setTargetChain(Number(e.target.value))}
                  className="w-full bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary appearance-none"
                >
                  <option value={42161}>Arbitrum</option>
                  <option value={1}>Ethereum</option>
                  <option value={10}>Optimism</option>
                  <option value={137}>Polygon</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Asset In</label>
                <input 
                  type="text"
                  value={assetIn}
                  onChange={(e) => setAssetIn(e.target.value.toUpperCase())}
                  className="w-full bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary uppercase text-center"
                />
              </div>
              <div className="col-span-1 flex justify-center pt-6 text-muted-foreground">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-mono uppercase text-muted-foreground">Asset Out</label>
                <input 
                  type="text"
                  value={assetOut}
                  onChange={(e) => setAssetOut(e.target.value.toUpperCase())}
                  className="w-full bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary uppercase text-center"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Amount</label>
              <input 
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-background border border-border px-3 py-2 font-mono text-xl focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Privacy Mode</label>
              <select 
                value={privacyMode}
                onChange={(e) => setPrivacyMode(e.target.value as BridgeInputPrivacyMode)}
                className="w-full bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary appearance-none"
              >
                <option value="Public">Public (Transparent)</option>
                <option value="ZkCredential">ZK Credential Shielded</option>
                <option value="Invisible">Invisible (Dark Pool)</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={computeRoute.isPending}
              className="w-full bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 px-4 transition-all duration-300 disabled:opacity-50 flex justify-center"
            >
              {computeRoute.isPending ? 'Computing Graph...' : 'Find Routes'}
            </button>
          </form>
        </div>

        {/* Route Results */}
        <div className="lg:col-span-8">
          {!routes && !computeRoute.isPending ? (
             <div className="h-full min-h-[400px] border border-border/50 border-dashed flex flex-col items-center justify-center opacity-50">
               <GitMerge className="w-8 h-8 text-muted-foreground mb-4" />
               <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Awaiting Route Request</p>
             </div>
          ) : computeRoute.isPending ? (
            <div className="space-y-4 animate-pulse">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-32 bg-card border border-border/50" />
               ))}
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-6 flex items-center justify-between">
                <span>Optimal Routes</span>
                <span className="text-primary">{routes?.length} Found</span>
              </h2>

              {routes?.map((route, index) => (
                <div 
                  key={route.routeId} 
                  className={`border p-5 relative overflow-hidden transition-all duration-300
                    ${index === 0 ? 'bg-card border-primary/50 shadow-[0_0_15px_-5px_rgba(var(--primary),0.3)]' : 'bg-background border-border/50 hover:border-border'}
                  `}
                >
                  {index === 0 && (
                     <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-mono font-bold px-2 py-1 uppercase">
                       Best BTCP
                     </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs uppercase bg-white/5 px-2 py-0.5 border border-border">{route.routeType}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">ID: {route.routeId.substring(0,8)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">BTCP Score</div>
                      <div className={`text-2xl font-mono font-bold ${route.btcpScore > 90 ? 'text-primary' : 'text-foreground'}`}>
                        {route.btcpScore.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 font-mono">
                     <div className="col-span-1">
                        <div className="text-[10px] text-muted-foreground uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Time</div>
                        <div className="text-sm">{route.estimatedTime}s</div>
                     </div>
                     <div className="col-span-1">
                        <div className="text-[10px] text-muted-foreground uppercase mb-1 flex items-center gap-1"><Fuel className="w-3 h-3"/> Gas Est</div>
                        <div className="text-sm">${route.estimatedGas}</div>
                     </div>
                     <div className="col-span-1 border-l border-border/50 pl-4">
                        <div className="text-[10px] text-muted-foreground uppercase mb-1">NL Score</div>
                        <div className="text-sm">{route.nlScore.toFixed(2)}</div>
                     </div>
                     <div className="col-span-1 border-l border-border/50 pl-4">
                        <div className="text-[10px] text-muted-foreground uppercase mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Coherence</div>
                        <div className="text-sm text-secondary">{route.ccCoherence.toFixed(2)}</div>
                     </div>
                  </div>

                  {index === 0 && (
                    <button className="mt-6 w-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 px-4 hover:bg-primary/90 transition-colors">
                      Execute Route
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
