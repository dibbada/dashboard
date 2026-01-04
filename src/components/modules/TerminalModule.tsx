import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play, Loader2, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Command {
  id: string;
  name: string;
  command: string;
  description: string;
}

interface CommandResult {
  id: string;
  command: string;
  output: string;
  status: "running" | "success" | "error";
  timestamp: Date;
}

const TerminalModule = () => {
  const [results, setResults] = useState<CommandResult[]>([]);
  const [runningCommand, setRunningCommand] = useState<string | null>(null);

  const commands: Command[] = [
    { id: "1", name: "System Update", command: "sudo apt update && sudo apt upgrade -y", description: "Update system packages" },
    { id: "2", name: "Docker Status", command: "docker ps -a", description: "List all containers" },
    { id: "3", name: "Disk Usage", command: "df -h", description: "Check disk space" },
    { id: "4", name: "Memory Info", command: "free -h", description: "Check RAM usage" },
    { id: "5", name: "Restart Services", command: "sudo systemctl restart docker", description: "Restart Docker daemon" },
  ];

  const executeCommand = async (cmd: Command) => {
    setRunningCommand(cmd.id);

    const newResult: CommandResult = {
      id: `${Date.now()}`,
      command: cmd.command,
      output: "",
      status: "running",
      timestamp: new Date(),
    };

    setResults(prev => [newResult, ...prev].slice(0, 10));

    try {
      const response = await fetch('/api/terminal/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd.command }),
      });

      const data = await response.json();

      setResults(prev => prev.map(r =>
        r.id === newResult.id
          ? {
            ...r,
            output: data.output || (data.isError ? "Error executing command" : "Command finished"),
            status: data.isError ? "error" : "success"
          }
          : r
      ));
    } catch (error) {
      setResults(prev => prev.map(r =>
        r.id === newResult.id
          ? { ...r, output: "Failed to connect to backend", status: "error" }
          : r
      ));
    }

    setRunningCommand(null);
  };

  const clearResults = () => setResults([]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bento-item h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-semibold">Terminal</h3>
        </div>
        {results.length > 0 && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearResults}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Commands grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {commands.slice(0, 4).map((cmd) => (
          <Button
            key={cmd.id}
            variant="secondary"
            size="sm"
            disabled={runningCommand !== null}
            onClick={() => executeCommand(cmd)}
            className="h-auto py-2 px-3 flex items-center gap-2 justify-start text-left"
          >
            {runningCommand === cmd.id ? (
              <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
            ) : (
              <Play className="w-3 h-3 flex-shrink-0" />
            )}
            <span className="text-xs truncate">{cmd.name}</span>
          </Button>
        ))}
      </div>

      {/* Output area */}
      <ScrollArea className="flex-1 rounded-lg bg-background/50 border border-border/30">
        <div className="p-3 font-mono text-xs">
          <AnimatePresence mode="popLayout">
            {results.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted-foreground text-center py-4"
              >
                Run a command to see output...
              </motion.p>
            ) : (
              results.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-3 last:mb-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {result.status === "running" && (
                      <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                    )}
                    {result.status === "success" && (
                      <CheckCircle className="w-3 h-3 text-success" />
                    )}
                    {result.status === "error" && (
                      <XCircle className="w-3 h-3 text-destructive" />
                    )}
                    <span className="text-muted-foreground text-[10px]">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-foreground whitespace-pre-wrap break-all">
                    {result.output || "Executing..."}
                  </pre>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default TerminalModule;
