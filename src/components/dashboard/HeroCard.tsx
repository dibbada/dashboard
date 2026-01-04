import { Zap, Activity } from "lucide-react";

const HeroCard = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card border border-border/50 h-[340px]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full p-8">
        {/* Status badges */}
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-glow" />
            ONLINE
          </span>
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-xs font-medium text-muted-foreground">
            <Activity className="w-3 h-3" />
            4 Servers Connected
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
          Welcome to <span className="text-gradient">R3GE</span>
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-lg max-w-lg">
          Your personal command center for media, productivity, and more.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">System Status: <span className="text-emerald-400">Optimal</span></span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-primary/50 blur-2xl" />
      </div>
    </div>
  );
};

export default HeroCard;
