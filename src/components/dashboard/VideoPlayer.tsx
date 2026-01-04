import { useState, useRef } from "react";
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  PictureInPicture2, 
  Film,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const VideoPlayer = () => {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const closeVideo = () => {
    setCurrentVideoId(null);
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Film className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Video Player</h2>
        </div>
      </div>

      <div className="space-y-4">
        {/* URL Input */}
        <div className="flex gap-2">
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste YouTube URL to play..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && playFromUrl()}
          />
          <Button variant="hero" onClick={playFromUrl} disabled={!videoUrl}>
            <Play className="w-4 h-4 mr-2" />
            Play
          </Button>
        </div>

        {/* Video Player - Only shows when video is playing */}
        {currentVideoId && (
          <div className="space-y-4">
            <div 
              ref={containerRef}
              className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border/50"
            >
              <iframe
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 bg-background/80 hover:bg-background"
                onClick={closeVideo}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-end gap-2 p-3 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-2 w-28">
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
                  className="w-20"
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={togglePiP}
              >
                <PictureInPicture2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={toggleFullscreen}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
