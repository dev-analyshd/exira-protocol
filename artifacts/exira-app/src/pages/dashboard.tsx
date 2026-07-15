import { useGetCoherenceMetrics, useGetPillarStatus, useGetRecentSignals } from "@workspace/api-client-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: metrics, isLoading: isMetricsLoading } = useGetCoherenceMetrics({
    query: { refetchInterval: 5000 }
  });
  
  const { data: status, isLoading: isStatusLoading } = useGetPillarStatus({
    query: { refetchInterval: 10000 }
  });

  const { data: signals, isLoading: isSignalsLoading } = useGetRecentSignals(
    { limit: 8 }, 
    { query: { refetchInterval: 3000 } }
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Hero Section: Coherence Chart */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">System Coherence Ψ(t)</h1>
            <p className="text-muted-foreground font-mono mt-2">The living truth plane. Only 13% of signals fire.</p>
          </div>
          <div className="text-right flex items-center gap-4">
            <div className="font-mono bg-card border border-border px-4 py-2">
              <div className="text-[10px] text-muted-foreground uppercase mb-1">Global Ψ(t)</div>
              <div className={`text-2xl ${metrics?.overallCoherence && metrics.overallCoherence >= (metrics.threshold || 0.8) ? 'text-primary' : 'text-destructive'}`}>
                {metrics ? (metrics.overallCoherence * 100).toFixed(2) : '--'}%
              </div>
            </div>
            <div className="font-mono bg-card border border-border px-4 py-2">
              <div className="text-[10px] text-muted-foreground uppercase mb-1">Threshold Θ(t)</div>
              <div className="text-2xl text-secondary">
                {metrics ? (metrics.threshold * 100).toFixed(2) : '--'}%
              </div>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full bg-card border border-border/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
          
          {isMetricsLoading ? (
            <div className="w-full h-full flex items-center justify-center font-mono text-sm text-muted-foreground">
              Calibrating planes...
            </div>
          ) : metrics && metrics.history ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.history} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCoherence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="timestamp" 
                  hide 
                />
                <YAxis 
                  domain={[0, 1]} 
                  hide 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 0, fontFamily: 'Space Mono' }}
                  labelFormatter={(v) => format(new Date(v), 'HH:mm:ss')}
                  formatter={(value: number) => [(value * 100).toFixed(2) + '%', 'Coherence']}
                />
                <ReferenceLine y={metrics.threshold} stroke="hsl(var(--secondary))" strokeDasharray="3 3" />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCoherence)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
             <div className="w-full h-full flex items-center justify-center font-mono text-sm text-destructive">
               Signal lost
             </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 7 Pillars Grid */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-xl font-medium tracking-widest uppercase text-muted-foreground">The 7 Pillars</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {isStatusLoading ? (
               Array.from({length: 6}).map((_, i) => (
                 <div key={i} className="h-32 bg-card/50 border border-border/50 animate-pulse" />
               ))
            ) : status?.pillars.map((pillar) => (
              <div 
                key={pillar.name} 
                className="bg-card border border-border/50 p-4 relative overflow-hidden transition-all duration-300 hover:border-primary/50 group"
              >
                <div className={`absolute top-0 right-0 w-16 h-16 blur-2xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity
                  ${pillar.status === 'active' ? 'bg-primary' : pillar.status === 'degraded' ? 'bg-secondary' : 'bg-destructive'}`} 
                />
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-sm tracking-wider uppercase">{pillar.name}</h3>
                  <div className={`w-2 h-2 rounded-full 
                    ${pillar.status === 'active' ? 'bg-primary glow-primary' : pillar.status === 'degraded' ? 'bg-secondary glow-secondary' : 'bg-destructive'}`} 
                  />
                </div>
                <div className="space-y-2 font-mono text-[10px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Req/Day</span>
                    <span className="text-foreground">{pillar.requestsToday.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latency</span>
                    <span className="text-foreground">{pillar.avgResponseMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime</span>
                    <span className="text-foreground">{pillar.uptime}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Signal Feed */}
        <div className="col-span-1 space-y-4">
          <h2 className="text-xl font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-3">
            Signal Tape
            <div className="h-1.5 w-1.5 bg-secondary rounded-full animate-pulse" />
          </h2>
          <div className="bg-card border border-border/50 h-[400px] overflow-hidden flex flex-col relative">
             <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-card to-transparent z-10" />
             <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent z-10" />
             
             <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
                {isSignalsLoading ? (
                  <div className="text-xs text-muted-foreground text-center mt-10">Listening to the void...</div>
                ) : signals?.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center mt-10">Silence is data.</div>
                ) : signals?.map((signal) => (
                  <div key={signal.signalId} className="text-[11px] border-b border-border/30 pb-3 last:border-0">
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>{format(new Date(signal.timestamp), 'HH:mm:ss.SSS')}</span>
                      <span className={signal.coherence >= signal.threshold ? 'text-primary' : 'text-destructive'}>
                        Ψ {(signal.coherence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-foreground break-all">
                      <span className="text-secondary mr-2">[{signal.signalType}]</span>
                      {signal.entityId}
                    </div>
                    {signal.direction && (
                      <div className="mt-1 flex gap-2">
                        <span className="bg-white/5 px-1">{signal.direction}</span>
                        {signal.margin && <span className="text-muted-foreground">M:{signal.margin.toFixed(2)}</span>}
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
