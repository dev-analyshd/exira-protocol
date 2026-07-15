import { useState } from "react";
import { useIssueCredential, CredentialInputCredentialType } from "@workspace/api-client-react";
import { Shield, Key, Fingerprint, Lock, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

export default function Guard() {
  const [credentialType, setCredentialType] = useState<CredentialInputCredentialType>("kyc");
  const [jurisdiction, setJurisdiction] = useState("");
  const [disclosureHash, setDisclosureHash] = useState("");

  const issueCredential = useIssueCredential();

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    issueCredential.mutate({
      data: {
        credentialType,
        jurisdiction: jurisdiction || undefined,
        disclosureHash: disclosureHash || undefined
      }
    });
  };

  const credential = issueCredential.data;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-3xl font-bold tracking-widest uppercase flex items-center gap-3">
          <Shield className="text-primary w-8 h-8" />
          ZK Credentials
        </h1>
        <p className="text-muted-foreground font-mono mt-3 max-w-2xl text-sm">
          Zero-knowledge compliance primitive. Issue verifiably true statements about entities without revealing the underlying sensitive data. Essential for dark pool routing and shielded interactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Panel */}
        <div>
          <form onSubmit={handleIssue} className="bg-card border border-border/50 p-6 space-y-6">
            <h2 className="text-sm font-mono tracking-widest text-muted-foreground uppercase flex items-center gap-2 border-b border-border/50 pb-4">
              <Key className="w-4 h-4" /> Issue New Credential
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-foreground">Credential Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['kyc', 'aml', 'sanctions', 'travel_rule'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCredentialType(type as CredentialInputCredentialType)}
                      className={`py-3 px-4 font-mono text-xs uppercase tracking-widest border transition-colors
                        ${credentialType === type ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border/50 text-muted-foreground hover:border-border'}
                      `}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono uppercase text-foreground">Jurisdiction (Optional)</label>
                <input 
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  placeholder="e.g. US, EU, SG"
                  className="w-full bg-background border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary uppercase"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-foreground">Disclosure Hash (Optional)</label>
                <input 
                  type="text"
                  value={disclosureHash}
                  onChange={(e) => setDisclosureHash(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-background border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary"
                />
                <p className="text-[10px] text-muted-foreground font-mono mt-1">Hash of the underlying private document to commit to state.</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={issueCredential.isPending}
              className="w-full mt-4 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest py-4 px-4 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {issueCredential.isPending ? 'Generating ZK Proof...' : 'Issue Shielded Credential'}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div>
          {issueCredential.isPending ? (
            <div className="h-full min-h-[400px] border border-border/50 bg-card/20 flex flex-col items-center justify-center space-y-6">
              <Lock className="w-16 h-16 text-primary opacity-50 animate-pulse" />
              <div className="font-mono text-sm text-primary uppercase tracking-widest text-center">
                Computing SNARK...<br/>
                <span className="text-[10px] text-muted-foreground mt-2 block">Securing multi-party computation</span>
              </div>
            </div>
          ) : !credential ? (
            <div className="h-full min-h-[400px] border border-border/50 border-dashed flex flex-col items-center justify-center opacity-50">
              <ShieldCheck className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest text-center">
                Awaiting Issuance Request<br/>
                <span className="text-[10px] mt-2 block opacity-70">Truth remains hidden until proven</span>
              </p>
            </div>
          ) : (
            <div className="h-full bg-card border border-primary/50 relative overflow-hidden animate-in slide-in-from-right-8 duration-500">
              <div className="absolute top-0 right-0 p-1 bg-primary text-primary-foreground font-mono text-[8px] uppercase tracking-widest">Valid Truth Statement</div>
              <div className="absolute inset-0 bg-primary/5 bg-grid-pattern opacity-10 pointer-events-none" />
              
              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-primary/20 border border-primary flex items-center justify-center">
                    <Fingerprint className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-mono text-xl text-foreground font-bold">{credentialType.toUpperCase()} Credential</h3>
                    <p className="font-mono text-xs text-secondary mt-1 tracking-widest uppercase">Zero-Knowledge Validated</p>
                  </div>
                </div>

                <div className="space-y-6 flex-1 font-mono">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase">Credential ID</span>
                    <div className="text-sm break-all text-foreground bg-background border border-border/50 p-2">{credential.credentialId}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1"><Lock className="w-3 h-3"/> ZK Proof (zkSNARK)</span>
                    <div className="text-[10px] break-all text-muted-foreground bg-background border border-border/50 p-3 h-24 overflow-y-auto leading-relaxed">
                      {credential.zkProof}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase">Verifier Address</span>
                      <div className="text-xs text-foreground truncate">{credential.verifierAddress}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase">Expiry</span>
                      <div className="text-xs text-destructive">{format(new Date(credential.expiresAt), "MMM dd, yyyy")}</div>
                    </div>
                  </div>
                </div>

                <button className="mt-8 w-full border border-primary text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground py-3 font-mono text-xs uppercase tracking-widest transition-colors">
                  Download Proof
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
