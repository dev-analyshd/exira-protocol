import { useState } from "react";
import { useGenerateProof, ProofInputPropertyType } from "@workspace/api-client-react";
import { Eye, Hexagon, Database, Verified, AlertCircle } from "lucide-react";

export default function Sense() {
  const [propertyType, setPropertyType] = useState<ProofInputPropertyType>("manipulation_free");
  const [threshold, setThreshold] = useState("0.95");

  const generateProof = useGenerateProof();

  const handleProve = (e: React.FormEvent) => {
    e.preventDefault();
    generateProof.mutate({
      data: {
        propertyType,
        threshold: threshold ? Number(threshold) : undefined
      }
    });
  };

  const proof = generateProof.data;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-3xl font-bold tracking-widest uppercase flex items-center gap-3">
          <Eye className="text-primary w-8 h-8" />
          Behavioral Proofs
        </h1>
        <p className="text-muted-foreground font-mono mt-3 max-w-2xl text-sm">
          Cryptographic statements about systemic behavior. Generate verifiable proofs that specific aggregate conditions hold true without exposing the individual transaction graph.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-5">
          <form onSubmit={handleProve} className="bg-card border border-border/50 p-6 space-y-6 sticky top-24">
            <h2 className="text-sm font-mono tracking-widest text-muted-foreground uppercase flex items-center gap-2 border-b border-border/50 pb-4">
              <Database className="w-4 h-4" /> Define Statement
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-foreground">Property to Prove</label>
                <div className="flex flex-col gap-2">
                  {(['task_count', 'satisfaction_rate', 'dispute_free', 'manipulation_free'] as const).map((type) => (
                    <label 
                      key={type} 
                      className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors
                        ${propertyType === type ? 'bg-primary/10 border-primary text-foreground' : 'bg-background border-border/50 text-muted-foreground hover:border-border'}
                      `}
                    >
                      <div className={`w-3 h-3 rounded-full border flex items-center justify-center
                        ${propertyType === type ? 'border-primary' : 'border-muted-foreground'}
                      `}>
                        {propertyType === type && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                      <span className="font-mono text-xs uppercase tracking-wider">{type.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase text-foreground">Threshold Target</label>
                  <span className="text-xs font-mono text-secondary">{threshold}</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.01"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full accent-primary"
                />
                <p className="text-[10px] text-muted-foreground font-mono mt-2">
                  Proves that {propertyType.replace('_', ' ')} is greater than or equal to {Number(threshold) * 100}%.
                </p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={generateProof.isPending}
              className="w-full mt-6 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-4 px-4 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generateProof.isPending ? 'Synthesizing Data Planes...' : 'Generate Proof'}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7">
          {generateProof.isPending ? (
            <div className="h-[500px] border border-border/50 bg-card/20 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
               <div className="absolute w-[200%] h-[10px] bg-primary/20 blur-xl animate-[pulse_2s_ease-in-out_infinite]" />
               <Hexagon className="w-20 h-20 text-primary opacity-50 animate-[spin_4s_linear_infinite]" />
               <div className="font-mono text-sm text-foreground uppercase tracking-widest text-center space-y-2 z-10">
                 <div>Reading Global State Plane...</div>
                 <div className="text-secondary text-xs opacity-70">Applying polynomial commitments</div>
               </div>
            </div>
          ) : !proof ? (
            <div className="h-[500px] border border-border/50 border-dashed flex flex-col items-center justify-center opacity-50">
              <Eye className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest text-center">
                Awaiting Property Definition
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
              
              <div className={`p-6 border flex items-center justify-between
                ${proof.isValid ? 'bg-primary/5 border-primary/50' : 'bg-destructive/5 border-destructive/50'}
              `}>
                <div className="flex items-center gap-4">
                  {proof.isValid ? (
                    <Verified className="w-8 h-8 text-primary" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  )}
                  <div>
                    <h3 className="font-mono text-lg font-bold text-foreground">
                      {proof.isValid ? 'Proof Validated' : 'Proof Rejected'}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                      Property: {propertyType.replace('_', ' ')} &ge; {threshold}
                    </p>
                  </div>
                </div>
                <div className={`font-mono text-2xl font-bold ${proof.isValid ? 'text-primary' : 'text-destructive'}`}>
                  {proof.isValid ? 'TRUE' : 'FALSE'}
                </div>
              </div>

              <div className="bg-card border border-border/50 p-6 space-y-6 font-mono">
                <h3 className="text-xs text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-3">Cryptographic Artifacts</h3>
                
                <div className="space-y-2">
                  <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-between">
                    <span>Proof ID</span>
                  </div>
                  <div className="text-sm bg-background border border-border/50 p-3 text-foreground break-all">
                    {proof.proofId}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-muted-foreground uppercase flex items-center justify-between">
                    <span>Public Commitment (Root)</span>
                  </div>
                  <div className="text-sm bg-background border border-border/50 p-3 text-secondary break-all">
                    {proof.publicCommitment}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-muted-foreground uppercase">ZK Payload</div>
                  <div className="text-[10px] text-muted-foreground bg-background border border-border/50 p-4 h-32 overflow-y-auto leading-relaxed break-all">
                    {proof.zkProof}
                  </div>
                </div>
              </div>

              {proof.isValid && (
                <div className="flex gap-4">
                  <button className="flex-1 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-3 transition-colors hover:bg-primary/90">
                    Publish to Network
                  </button>
                  <button className="flex-1 border border-border bg-background text-foreground font-mono text-xs uppercase tracking-widest py-3 transition-colors hover:bg-card">
                    Download Raw
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
