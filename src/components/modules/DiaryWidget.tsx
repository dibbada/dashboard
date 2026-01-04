import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Calendar, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  source: "manual" | "telegram";
}

const DiaryWidget = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right">("right");

  // Mock entries (replace with actual database fetch)
  const entries: DiaryEntry[] = [
    {
      id: "1",
      date: new Date(),
      content: "Today was productive. Finished setting up the new Oracle server and deployed Dokploy successfully. The self-hosting journey continues...",
      source: "telegram"
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000),
      content: "Worked on the dashboard redesign. The glassmorphism theme is coming together nicely. Need to add more interactive elements tomorrow.",
      source: "manual"
    },
    {
      id: "3",
      date: new Date(Date.now() - 172800000),
      content: "Set up Tailscale for secure access to home network. Now I can access Immich and FileBrowser from anywhere safely.",
      source: "telegram"
    },
  ];

  const handleFlip = (direction: "left" | "right") => {
    if (isFlipping) return;
    
    const nextPage = direction === "right" 
      ? Math.min(currentPage + 1, entries.length - 1)
      : Math.max(currentPage - 1, 0);
    
    if (nextPage === currentPage) return;
    
    setFlipDirection(direction);
    setIsFlipping(true);
    
    setTimeout(() => {
      setCurrentPage(nextPage);
      setIsFlipping(false);
    }, 300);
  };

  const currentEntry = entries[currentPage];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bento-item h-full flex flex-col perspective-1000"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-500" />
          <h3 className="text-sm font-semibold">Daily Diary</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleFlip("left")}
            disabled={currentPage === 0 || isFlipping}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[40px] text-center">
            {currentPage + 1}/{entries.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleFlip("right")}
            disabled={currentPage === entries.length - 1 || isFlipping}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3D Book container */}
      <div className="flex-1 relative" style={{ perspective: "1000px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEntry?.id}
            initial={{ 
              rotateY: flipDirection === "right" ? 90 : -90,
              opacity: 0 
            }}
            animate={{ 
              rotateY: 0,
              opacity: 1 
            }}
            exit={{ 
              rotateY: flipDirection === "right" ? -90 : 90,
              opacity: 0 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            className="absolute inset-0 p-4 rounded-xl bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-500/20"
          >
            {currentEntry && (
              <>
                {/* Date header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {currentEntry.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {currentEntry.source === "telegram" && (
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Mic className="w-3 h-3" />
                      <span>Voice</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {currentEntry.content}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page dots */}
      <div className="flex items-center justify-center gap-1 mt-3">
        {entries.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setFlipDirection(index > currentPage ? "right" : "left");
              setCurrentPage(index);
            }}
            className={`
              w-2 h-2 rounded-full transition-all
              ${index === currentPage 
                ? 'bg-primary w-4' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }
            `}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default DiaryWidget;
