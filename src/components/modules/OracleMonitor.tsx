import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, RefreshCw, Wifi, WifiOff, Activity, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  name: string;
  url: string;
  status: "online" | "offline" | "checking";
  lastChecked: Date | null;
  responseTime?: number;
}

const OracleMonitor = () => {
  const [services, setServices] = useState<Service[]>([
    { id: "prowler", name: "Prowler", url: "", status: "checking", lastChecked: null },
    { id: "dokploy", name: "Dokploy", url: "", status: "checking", lastChecked: null },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkServiceStatus = async () => {
    setIsRefreshing(true);

    try {
      const res = await fetch('/api/system');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();

      // Update services based on real data (example mapping)
      setServices(prev => [
        {
          id: "cpu",
          name: `CPU Load: ${Math.round(data.cpu)}%`,
          url: "",
          status: "online",
          lastChecked: new Date(),
          responseTime: data.cpu // Storing load as response time for visualization
        },
        {
          id: "mem",
          name: `RAM: ${Math.round(data.mem.active / 1024 / 1024 / 1024)}GB / ${Math.round(data.mem.total / 1024 / 1024 / 1024)}GB`,
          url: "",
          status: "online",
          lastChecked: new Date()
        },
        // We can keep these mock services or replace them with real URL checks if implemented:
        // { id: "prowler", name: "Prowler", url: "", status: "online", lastChecked: new Date() }
      ]);
    } catch (error) {
      console.error(error);
      // Fallback or error state
    }

    setIsRefreshing(false);
  };

  useEffect(() => {
    checkServiceStatus();
    const interval = setInterval(checkServiceStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const onlineCount = services.filter(s => s.status === "online").length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bento-item h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-semibold">Oracle Services</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={checkServiceStatus}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Status summary */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-secondary/50">
        <Activity className="w-4 h-4 text-primary" />
        <span className="text-sm">
          <span className="font-semibold text-success">{onlineCount}</span>
          <span className="text-muted-foreground">/{services.length} services online</span>
        </span>
      </div>

      {/* Services list */}
      <div className="flex-1 space-y-3">
        <AnimatePresence>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-3 h-3 rounded-full
                  ${service.status === "online" ? "status-online" : ""}
                  ${service.status === "offline" ? "status-offline" : ""}
                  ${service.status === "checking" ? "bg-amber-500 animate-pulse" : ""}
                `} />
                <div>
                  <p className="text-sm font-medium">{service.name}</p>
                  {service.responseTime && service.status === "online" && (
                    <p className="text-xs text-muted-foreground">
                      {service.responseTime}ms
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {service.status === "online" ? (
                  <Wifi className="w-4 h-4 text-success" />
                ) : service.status === "offline" ? (
                  <WifiOff className="w-4 h-4 text-destructive" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                )}
                {service.url && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                    <a href={service.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Last updated */}
      {services[0]?.lastChecked && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Last checked: {services[0].lastChecked.toLocaleTimeString()}
        </p>
      )}
    </motion.div>
  );
};

export default OracleMonitor;
