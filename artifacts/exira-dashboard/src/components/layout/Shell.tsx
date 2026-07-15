import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Activity, LayoutDashboard, Shield, GitMerge, Users, Brain, Eye } from "lucide-react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full bg-background text-foreground font-sans relative overflow-hidden">
      {/* Background ambient light */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[150px]" />
      </div>

      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 z-10">
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">System Online // COHERENCE GATED</span>
          </div>
          <div className="font-mono text-xs text-primary/70 bg-primary/10 px-3 py-1 border border-primary/20">
            v1.0.0-rc // OMNI-PLANE
          </div>
        </header>
        
        <div className="flex-1 p-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/finance", label: "Finance Signals", icon: Activity },
    { href: "/verify", label: "Agent Auditor", icon: Shield },
    { href: "/bridge", label: "Bridge Router", icon: GitMerge },
    { href: "/agents", label: "Registry", icon: Users },
    { href: "/learn", label: "Skill Catalog", icon: Brain },
    { href: "/guard", label: "ZK Credentials", icon: Shield },
    { href: "/sense", label: "Behav. Proofs", icon: Eye },
  ];

  return (
    <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col z-20 relative">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 w-full group">
          <div className="h-8 w-8 bg-background border border-primary/50 flex items-center justify-center glow-border-primary transition-all duration-500">
            <div className="w-3 h-3 bg-primary group-hover:bg-secondary transition-colors duration-500" />
          </div>
          <span className="font-bold text-lg tracking-widest uppercase">EXIRA</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
        {links.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-3 py-3 text-sm transition-all duration-300 relative group
                ${isActive ? 'text-primary font-medium bg-primary/10 border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary glow-primary" />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border/50 font-mono text-[10px] text-muted-foreground leading-relaxed uppercase tracking-wider">
        <p className="opacity-50">7-PILLAR TRUTH ASP</p>
        <p className="opacity-50 mt-1">Ψ(t) ≥ Θ(t)</p>
      </div>
    </aside>
  );
}
