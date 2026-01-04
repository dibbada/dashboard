import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FloatingDock from "@/components/modules/FloatingDock";
import WelcomeCard from "@/components/modules/WelcomeCard";
import ClockWidget from "@/components/modules/ClockWidget";
import CalendarWidget from "@/components/modules/CalendarWidget";
import QuickLinks from "@/components/modules/QuickLinks";
import OracleMonitor from "@/components/modules/OracleMonitor";
import TerminalModule from "@/components/modules/TerminalModule";
import DiaryWidget from "@/components/modules/DiaryWidget";
import NotesWidget from "@/components/modules/NotesWidget";
import MediaCards from "@/components/modules/MediaCards";
import VideoModule from "@/components/modules/VideoModule";
import SettingsPage from "@/components/dashboard/SettingsPage";
import FileManagerContent from "@/components/modules/FileManagerContent";
import ShoppingWidget from "@/components/modules/ShoppingWidget";
import { Button } from "@/components/ui/button";

const BentoGrid = () => {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenApp = (appId: string) => {
    if (appId === "video") {
      setIsVideoOpen(true);
    } else if (appId === "files") {
      // Try to open self-hosted Filestash
      window.open('http://localhost:8334', '_blank');
      // If you prefer the internal manager, uncomment below:
      // setIsFilesOpen(true);
    } else if (appId === "settings") {
      setIsSettingsOpen(true);
    } else {
      setActiveApp(activeApp === appId ? null : appId);

      // Scroll to widget if it exists
      const widgetElement = document.getElementById(`widget-${appId}`);
      if (widgetElement) {
        widgetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header with Settings */}
      <header className="relative z-20 flex items-center justify-end px-6 py-4">
        <SettingsPage open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Bento Grid Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]"
        >
          {/* Welcome Card - Large */}
          <div className="col-span-1 sm:col-span-2 row-span-2">
            <WelcomeCard />
          </div>

          {/* Clock Widget */}
          <div className="col-span-1 row-span-1">
            <ClockWidget />
          </div>

          {/* Quick Links */}
          <div className="col-span-1 row-span-1">
            <QuickLinks />
          </div>

          {/* Shopping Widget (Replaces Calendar) */}
          <div className="col-span-1 lg:col-span-2 row-span-2">
            <ShoppingWidget />
          </div>

          {/* Oracle Monitor */}
          <div
            id="widget-oracle"
            className={`col-span-1 sm:col-span-2 row-span-2 transition-all duration-300 rounded-3xl ${activeApp === "oracle" ? "ring-2 ring-primary shadow-glow scale-[1.02]" : ""
              }`}
          >
            <OracleMonitor />
          </div>

          {/* Terminal Module */}
          <div
            id="widget-terminal"
            className={`col-span-1 sm:col-span-2 row-span-2 transition-all duration-300 rounded-3xl ${activeApp === "terminal" ? "ring-2 ring-primary shadow-glow scale-[1.02]" : ""
              }`}
          >
            <TerminalModule />
          </div>

          {/* Notes Widget - Large */}
          <div
            id="widget-notes"
            className={`col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 transition-all duration-300 rounded-3xl ${activeApp === "notes" ? "ring-2 ring-primary shadow-glow scale-[1.02]" : ""
              }`}
          >
            <NotesWidget />
          </div>

          {/* Diary Widget */}
          <div
            id="widget-diary"
            className={`col-span-1 sm:col-span-2 row-span-2 transition-all duration-300 rounded-3xl ${activeApp === "diary" ? "ring-2 ring-primary shadow-glow scale-[1.02]" : ""
              }`}
          >
            <DiaryWidget />
          </div>

          {/* Media Cards */}
          <div
            id="widget-media"
            className={`col-span-1 sm:col-span-2 row-span-1 transition-all duration-300 rounded-3xl ${activeApp === "media" ? "ring-2 ring-primary shadow-glow scale-[1.02]" : ""
              }`}
          >
            <MediaCards />
          </div>
        </motion.div>
      </main>

      {/* Floating Dock */}
      <FloatingDock onOpenApp={handleOpenApp} activeApp={activeApp} />

      {/* Video Module Modal */}
      <VideoModule isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      {/* Files Modal */}
      <AnimatePresence>
        {isFilesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
            onClick={() => setIsFilesOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl h-[600px] glass-card overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <h2 className="text-lg font-semibold">File Manager</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsFilesOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <FileManagerContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BentoGrid;
