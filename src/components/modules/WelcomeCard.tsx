import { motion } from "framer-motion";
import { Zap, Activity } from "lucide-react";

const WelcomeCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bento-item h-full relative overflow-hidden"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-primary blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-primary/50 blur-2xl animate-float" style={{ animationDelay: "1s" }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full">
        {/* Status badges */}
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 border border-success/30 text-xs font-medium text-success">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse-glow" />
            ONLINE
          </span>
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/30 text-xs font-medium text-muted-foreground">
            <Activity className="w-3 h-3" />
            All Systems Nominal
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
          Welcome to <span className="text-gradient">R3GE</span>
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-base max-w-md">
          Your personal cloud command center for infrastructure, media, and productivity.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Status: <span className="text-success font-medium">Optimal</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;
