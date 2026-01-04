import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  X, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  PictureInPicture2,
  Film
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface VideoModuleProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModule = ({ isOpen, onClose }: VideoModuleProps) => {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const playFromUrl = () => {
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      setCurrentVideoId(videoId);
      setVideoUrl("");
    }
  };

  const togglePiP = async () => {
    if (currentVideoId) {
      window.open(
        `https://www.youtube.com/embed/${currentVideoId}?autoplay=1`,
        'pipWindow',
        'width=400,height=225,menubar=no,toolbar=no,location=no,status=no'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-4xl glass-card p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold">Video Player</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* URL Input */}
          <div className="flex gap-2 mb-4">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste YouTube URL to play..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && playFromUrl()}
            />
            <Button onClick={playFromUrl} disabled={!videoUrl}>
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
          </div>

          {/* Video Player */}
          {currentVideoId ? (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary">
                <iframe
                  src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 w-32">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={(v) => { setVolume(v[0]); setIsMuted(false); }}
                    className="w-24"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePiP}>
                    <PictureInPicture2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setCurrentVideoId(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-secondary/30 flex items-center justify-center">
              <p className="text-muted-foreground">Paste a YouTube URL to start watching</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoModule;
