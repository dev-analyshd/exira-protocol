import { useState } from "react";
import { useListSkills, ListSkillsComplexity } from "@workspace/api-client-react";
import { Brain, Search, Cpu, Sparkles, Filter } from "lucide-react";

export default function Learn() {
  const [category, setCategory] = useState<string>("");
  const [complexity, setComplexity] = useState<ListSkillsComplexity | undefined>();

  const { data: catalog, isLoading } = useListSkills(
    { category: category || undefined, complexity },
    { query: { keepPreviousData: true } }
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-3xl font-bold tracking-widest uppercase flex items-center gap-3">
          <Brain className="text-primary w-8 h-8" />
          Skill Catalog
        </h1>
        <p className="text-muted-foreground font-mono mt-3 max-w-2xl text-sm">
          Autonomous capabilities library. Skills are weighted by IQ scores and behavioral complexity. Agents can acquire verified skills to expand their operational graph.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-card border border-border/50 p-4">
        <div className="flex items-center gap-3 text-muted-foreground px-2 border-r border-border/50">
          <Filter className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-widest">Filter</span>
        </div>
        
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Filter by category..."
              className="w-full bg-background border border-border pl-10 pr-4 py-2 font-mono text-sm focus:outline-none focus:border-primary"
            />
          </div>
          
          <select 
            value={complexity || ""}
            onChange={(e) => setComplexity(e.target.value as ListSkillsComplexity || undefined)}
            className="w-48 bg-background border border-border px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary appearance-none"
          >
            <option value="">All Complexities</option>
            <option value="simple">Simple</option>
            <option value="medium">Medium</option>
            <option value="complex">Complex</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest flex items-center justify-between px-2">
        <span>Displaying capability matrix</span>
        <span>{catalog?.totalCount || 0} Registered Skills</span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 bg-card border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : catalog?.skills.length === 0 ? (
        <div className="h-64 border border-border/50 border-dashed flex flex-col items-center justify-center text-muted-foreground opacity-50">
          <Brain className="w-12 h-12 mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest">No skills match parameters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog?.skills.map((skill) => (
            <div 
              key={skill.skillId} 
              className="bg-card border border-border/50 p-6 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors duration-300"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500
                ${skill.complexity === 'complex' ? 'bg-secondary' : 'bg-primary'}
              `} />
              
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border
                  ${skill.complexity === 'complex' ? 'border-secondary/50 text-secondary bg-secondary/10' : 
                    skill.complexity === 'medium' ? 'border-primary/50 text-primary bg-primary/10' : 
                    'border-border text-muted-foreground bg-background'}
                `}>
                  {skill.complexity}
                </div>
                
                {skill.isAvailable ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-green-500 uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-destructive uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive" /> Offline
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2 break-words text-foreground relative z-10">{skill.skillName}</h3>
              <p className="text-sm text-muted-foreground font-sans line-clamp-3 mb-6 flex-1 relative z-10">
                {skill.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-auto font-mono">
                <div className="bg-background border border-border/50 p-3">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3"/> IQ Score
                  </div>
                  <div className="text-lg text-foreground">{skill.iqScore}</div>
                </div>
                <div className="bg-background border border-border/50 p-3">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1 flex items-center gap-1">
                    <Cpu className="w-3 h-3"/> ID
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 truncate">{skill.skillId}</div>
                </div>
              </div>
              
              <button 
                disabled={!skill.isAvailable}
                className="mt-4 w-full border border-border/50 bg-background text-foreground font-mono text-xs uppercase tracking-widest py-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10 relative"
              >
                Acquire Skill
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
