import { motion } from "framer-motion";
import { 
  FileText, 
  BookOpen, 
  Server, 
  Terminal, 
  Image, 
  FolderOpen,
  Settings,
  Play
} from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DockItem {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
}

interface FloatingDockProps {
  onOpenApp: (appId: string) => void;
  activeApp: string | null;
}

const FloatingDock = ({ onOpenApp, activeApp }: FloatingDockProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const dockItems: DockItem[] = [
    { id: "notes", icon: FileText, label: "Notes", color: "bg-amber-500" },
    { id: "diary", icon: BookOpen, label: "Diary", color: "bg-purple-500" },
    { id: "oracle", icon: Server, label: "Oracle Control", color: "bg-orange-500" },
    { id: "terminal", icon: Terminal, label: "Terminal", color: "bg-emerald-500" },
    { id: "media", icon: Image, label: "Media", color: "bg-pink-500" },
    { id: "files", icon: FolderOpen, label: "Files", color: "bg-blue-500" },
    { id: "video", icon: Play, label: "Video", color: "bg-red-500" },
    { id: "settings", icon: Settings, label: "Settings", color: "bg-slate-500" },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-dock px-4 py-3 flex items-center gap-2">
        <TooltipProvider delayDuration={0}>
          {dockItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeApp === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                    whileHover={{ scale: 1.2, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                    onClick={() => onOpenApp(item.id)}
                    className={`
                      relative w-12 h-12 rounded-xl flex items-center justify-center
                      transition-all duration-200 cursor-pointer
                      ${item.color}
                      ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                    `}
                  >
                    <Icon className="w-6 h-6 text-foreground" />
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-3 w-1 h-1 bg-foreground rounded-full"
                      />
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="top" className="glass border-border/30">
                  <p className="text-sm font-medium">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default FloatingDock;
