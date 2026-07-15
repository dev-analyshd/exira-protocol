import { Activity, useState } from "react";
import { useListAgents, useGetAgent, useRegisterAgent } from "@workspace/api-client-react";
import { Users, Search, CheckCircle, ShieldAlert, Cpu, Hash, Clock, Plus, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function Agents() {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [newAgentId, setNewAgentId] = useState("");
  const [genomicKey, setGenomicKey] = useState("");

  const { data: agents, isLoading: isLoadingAgents, refetch } = useListAgents();
  const { data: selectedAgent, isLoading: isLoadingSelected } = useGetAgent(selectedAgentId as string, {
    query: { enabled: !!selectedAgentId }
  });
  
  const registerAgent = useRegisterAgent();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentId || !genomicKey) return;
    
    registerAgent.mutate({
      data: {
        agentId: newAgentId,
        genomicKey
      }
    }, {
      onSuccess: () => {
        setShowRegister(false);
        setNewAgentId("");
        setGenomicKey("");
        refetch();
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest uppercase flex items-center gap-3">
            <Users className="text-primary w-8 h-8" />
            Agent Registry
          </h1>
          <p className="text-muted-foreground font-mono mt-3 max-w-2xl text-sm">
            The global index of autonomous entities. Verifiable identities backed by on-chain reputation and behavioral depth.
          </p>
        </div>
        <button 
          onClick={() => setShowRegister(!showRegister)}
          className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs uppercase tracking-widest py-2 px-4 transition-all duration-300 flex items-center gap-2"
        >
          {showRegister ? 'Cancel' : <><Plus className="w-4 h-4"/> Register Agent</>}
        </button>
      </div>

      {showRegister && (
        <form onSubmit={handleRegister} className="bg-card border border-border/50 p-6 mb-8 animate-in slide-in-from-top-4 duration-300">
           <h2 className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-6 border-b border-border/50 pb-2">New Agent Registration</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-foreground">Agent ID / Name</label>
                <input 
                  type="text"
                  value={newAgentId}
                  onChange={(e) => setNewAgentId(e.target.value)}
                  placeholder="agent.exira.eth"
                  className="w-full bg-background border border-border px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-foreground">Genomic Key (Initialization Seed)</label>
                <input 
                  type="text"
                  value={genomicKey}
                  onChange={(e) => setGenomicKey(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-background border border-border px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
           </div>
           <div className="mt-6 flex justify-end">
             <button 
                type="submit"
                disabled={registerAgent.isPending}
                className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 px-8 transition-opacity disabled:opacity-50"
             >
                {registerAgent.isPending ? 'Committing to Plane...' : 'Initialize Identity'}
             </button>
           </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* List Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search registry..."
              className="w-full bg-card border border-border/50 pl-10 pr-4 py-3 font-mono text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="bg-card border border-border/50 flex flex-col h-[600px]">
             <div className="p-3 border-b border-border/50 text-[10px] font-mono text-muted-foreground uppercase flex justify-between">
               <span>Agent Profile</span>
               <span>Credibility</span>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 space-y-1">
               {isLoadingAgents ? (
                 <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"/></div>
               ) : agents?.length === 0 ? (
                 <div className="text-center p-8 text-muted-foreground font-mono text-sm">No agents registered</div>
               ) : agents?.map((agent) => (
                 <button
                   key={agent.agentId}
                   onClick={() => setSelectedAgentId(agent.agentId)}
                   className={`w-full text-left p-3 font-mono border transition-colors flex items-center justify-between
                     ${selectedAgentId === agent.agentId ? 'bg-primary/10 border-primary text-foreground' : 'bg-background border-transparent hover:border-border/50 text-muted-foreground'}
                   `}
                 >
                   <div className="flex items-center gap-3 overflow-hidden">
                     {agent.isVerified ? <CheckCircle className="w-4 h-4 text-primary shrink-0" /> : <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0" />}
                     <span className="truncate text-sm">{agent.agentId}</span>
                   </div>
                   <span className={`text-xs ${agent.credibilityScore > 80 ? 'text-secondary' : ''}`}>{agent.credibilityScore}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-7">
          {isLoadingSelected ? (
             <div className="h-[600px] border border-border/50 bg-card/50 flex items-center justify-center">
               <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
             </div>
          ) : selectedAgent ? (
             <div className="h-[600px] bg-card border border-border/50 flex flex-col animate-in slide-in-from-right-4 duration-300">
               <div className="p-8 border-b border-border/50 relative overflow-hidden">
                 <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
                 
                 <div className="flex items-start justify-between relative z-10">
                   <div>
                     <div className="flex items-center gap-3 mb-2">
                       {selectedAgent.isVerified ? (
                         <div className="bg-primary/20 text-primary border border-primary px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                           <CheckCircle className="w-3 h-3" /> Verified Identity
                         </div>
                       ) : (
                         <div className="bg-orange-500/10 text-orange-500 border border-orange-500/50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                           <ShieldAlert className="w-3 h-3" /> Unverified
                         </div>
                       )}
                     </div>
                     <h2 className="text-2xl font-bold font-mono text-foreground break-all">{selectedAgent.agentId}</h2>
                     <div className="text-sm font-mono text-muted-foreground mt-2 flex items-center gap-2">
                       <Hash className="w-4 h-4" /> Owner: <span className="text-secondary">{selectedAgent.ownerAddress.substring(0,6)}...{selectedAgent.ownerAddress.substring(38)}</span>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="p-8 grid grid-cols-2 gap-6 flex-1">
                 <div className="space-y-6">
                    <div>
                      <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2"><Cpu className="w-3 h-3"/> Core Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-border/50 bg-background p-4">
                          <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Reputation</div>
                          <div className="text-2xl font-mono">{selectedAgent.reputationScore}</div>
                        </div>
                        <div className="border border-border/50 bg-background p-4">
                          <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Credibility</div>
                          <div className={`text-2xl font-mono ${selectedAgent.credibilityScore > 80 ? 'text-secondary' : ''}`}>{selectedAgent.credibilityScore}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">System Identity</div>
                      <div className="border border-border/50 bg-background p-4 space-y-4 font-mono text-xs">
                         <div className="flex flex-col gap-1 border-b border-border/50 pb-3">
                           <span className="text-muted-foreground uppercase text-[10px]">Registration Time</span>
                           <span>{format(new Date(selectedAgent.registrationTime), "MMM dd, yyyy HH:mm:ss")}</span>
                         </div>
                         <div className="flex flex-col gap-1 border-b border-border/50 pb-3">
                           <span className="text-muted-foreground uppercase text-[10px]">Behavioral Depth</span>
                           <span>{selectedAgent.behavioralDepth} TXs</span>
                         </div>
                         {selectedAgent.genomicKey && (
                           <div className="flex flex-col gap-1">
                             <span className="text-muted-foreground uppercase text-[10px]">Genomic Seed</span>
                             <span className="text-primary truncate">{selectedAgent.genomicKey}</span>
                           </div>
                         )}
                      </div>
                    </div>
                 </div>

                 <div className="border border-border/50 bg-background relative overflow-hidden flex flex-col">
                   <div className="p-4 border-b border-border/50 bg-card">
                     <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                       <Clock className="w-3 h-3"/> Action Stream
                     </h3>
                   </div>
                   <div className="flex-1 p-4 flex items-center justify-center text-center">
                      <div className="opacity-50">
                        <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                        <p className="font-mono text-xs text-muted-foreground uppercase">Live stream available only for<br/>active coherence planes</p>
                      </div>
                   </div>
                   <div className="p-4 border-t border-border/50 bg-card">
                     <button className="w-full text-xs font-mono uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2">
                       View Full Audit Report <ExternalLink className="w-3 h-3" />
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          ) : (
             <div className="h-[600px] border border-border/50 border-dashed flex flex-col items-center justify-center text-muted-foreground opacity-50">
               <Users className="w-12 h-12 mb-4" />
               <p className="font-mono text-xs uppercase tracking-widest">Select an agent profile</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
