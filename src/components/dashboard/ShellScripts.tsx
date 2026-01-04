import { useState } from "react";
import { Terminal, Play, Copy, Check, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Script {
  id: string;
  name: string;
  command: string;
  description: string;
  category: string;
}

interface ScriptOutput {
  scriptId: string;
  output: string;
  timestamp: Date;
  status: "success" | "error" | "running";
}

const defaultScripts: Script[] = [
  { id: "1", name: "System Update", command: "sudo apt update && sudo apt upgrade -y", description: "Update all system packages", category: "System" },
  { id: "2", name: "Clear Cache", command: "sudo rm -rf /var/cache/* && sync", description: "Clear system cache files", category: "Maintenance" },
  { id: "3", name: "Check Disk Space", command: "df -h", description: "Display disk space usage", category: "System" },
  { id: "4", name: "List Processes", command: "ps aux --sort=-%mem | head -20", description: "Show top 20 memory-consuming processes", category: "Monitoring" },
  { id: "5", name: "Network Status", command: "ip addr && netstat -tuln", description: "Display network interfaces and listening ports", category: "Network" },
  { id: "6", name: "Docker Cleanup", command: "docker system prune -af", description: "Remove unused Docker resources", category: "Docker" },
];

const ShellScripts = () => {
  const [scripts, setScripts] = useState<Script[]>(defaultScripts);
  const [outputs, setOutputs] = useState<ScriptOutput[]>([]);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newScript, setNewScript] = useState({ name: "", command: "", description: "", category: "Custom" });

  const simulateScriptExecution = (script: Script) => {
    const outputId = script.id;
    
    // Set running state
    setOutputs(prev => [
      { scriptId: outputId, output: "Executing...", timestamp: new Date(), status: "running" },
      ...prev.filter(o => o.scriptId !== outputId)
    ]);

    // Simulate execution delay
    setTimeout(() => {
      const mockOutputs: Record<string, string> = {
        "1": "Reading package lists... Done\nBuilding dependency tree... Done\nAll packages are up to date.",
        "2": "Cache cleared successfully.\nSync complete.",
        "3": "Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1       256G   45G  211G  18% /\n/dev/sdb1       1.0T  234G  766G  24% /home",
        "4": "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1  16836  4892 ?        Ss   10:00   0:01 /sbin/init\nwww-data  1234  2.1  5.2 125432 52341 ?        S    10:05   1:23 nginx",
        "5": "eth0: 192.168.1.100/24\nlo: 127.0.0.1/8\n\nActive Connections:\ntcp  0.0.0.0:22    LISTEN\ntcp  0.0.0.0:80    LISTEN\ntcp  0.0.0.0:443   LISTEN",
        "6": "Deleted Containers: 3\nDeleted Images: 12\nTotal reclaimed space: 2.5GB",
      };

      setOutputs(prev => [
        { 
          scriptId: outputId, 
          output: mockOutputs[script.id] || `$ ${script.command}\n\nCommand executed successfully.`, 
          timestamp: new Date(), 
          status: "success" 
        },
        ...prev.filter(o => o.scriptId !== outputId)
      ]);
    }, 1500);
  };

  const copyCommand = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addScript = () => {
    if (newScript.name && newScript.command) {
      setScripts([...scripts, { ...newScript, id: Date.now().toString() }]);
      setNewScript({ name: "", command: "", description: "", category: "Custom" });
      setIsAddDialogOpen(false);
    }
  };

  const deleteScript = (id: string) => {
    setScripts(scripts.filter(s => s.id !== id));
    setOutputs(outputs.filter(o => o.scriptId !== id));
  };

  const getOutput = (scriptId: string) => outputs.find(o => o.scriptId === scriptId);

  const categories = [...new Set(scripts.map(s => s.category))];

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Shell Scripts</h2>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Script
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Script</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input 
                  value={newScript.name}
                  onChange={(e) => setNewScript({...newScript, name: e.target.value})}
                  placeholder="Script name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Command</label>
                <Textarea 
                  value={newScript.command}
                  onChange={(e) => setNewScript({...newScript, command: e.target.value})}
                  placeholder="Enter shell command..."
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Input 
                  value={newScript.description}
                  onChange={(e) => setNewScript({...newScript, description: e.target.value})}
                  placeholder="What does this script do?"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Input 
                  value={newScript.category}
                  onChange={(e) => setNewScript({...newScript, category: e.target.value})}
                  placeholder="e.g., System, Network, Docker"
                />
              </div>
              <Button onClick={addScript} className="w-full">Add Script</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scripts Grid */}
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">{category}</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {scripts.filter(s => s.category === category).map(script => {
                const output = getOutput(script.id);
                const isExpanded = expandedScript === script.id;

                return (
                  <div key={script.id} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{script.name}</h4>
                          <p className="text-xs text-muted-foreground">{script.description}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteScript(script.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      
                      <div className="bg-secondary/50 rounded-lg p-2 font-mono text-xs text-muted-foreground mb-3 overflow-x-auto">
                        <code>{script.command}</code>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="hero" 
                          size="sm" 
                          className="flex-1 gap-1"
                          onClick={() => simulateScriptExecution(script)}
                          disabled={output?.status === "running"}
                        >
                          <Play className="w-3.5 h-3.5" />
                          {output?.status === "running" ? "Running..." : "Execute"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyCommand(script.command, script.id)}
                        >
                          {copiedId === script.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                        {output && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setExpandedScript(isExpanded ? null : script.id)}
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Output */}
                    {output && isExpanded && (
                      <div className="border-t border-border/50 bg-secondary/30 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            output.status === "success" ? "bg-green-500" : 
                            output.status === "error" ? "bg-red-500" : 
                            "bg-yellow-500 animate-pulse"
                          }`} />
                          <span className="text-xs text-muted-foreground">
                            {output.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <pre className="font-mono text-xs whitespace-pre-wrap text-foreground/80 max-h-40 overflow-y-auto">
                          {output.output}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShellScripts;
