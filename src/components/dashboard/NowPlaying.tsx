import { MoreHorizontal, SkipBack, Play, Pause, SkipForward } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

const NowPlaying = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([42]);

  return (
    <div className="rounded-2xl bg-card border border-border/50 p-6 h-[340px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <div className="w-1 h-4 bg-primary rounded-full animate-pulse" />
            <div className="w-1 h-3 bg-primary rounded-full animate-pulse delay-75" />
            <div className="w-1 h-5 bg-primary rounded-full animate-pulse delay-150" />
          </div>
          <span className="text-sm font-medium">Now Playing</span>
        </div>
        <button className="p-1 hover:bg-secondary rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-36 h-36 rounded-xl bg-gradient-to-br from-amber-600 via-teal-600 to-sky-700 shadow-2xl mb-6 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-amber-500/30 to-transparent" />
        </div>

        {/* Track Info */}
        <h3 className="font-semibold text-lg mb-1">Midnight City</h3>
        <p className="text-muted-foreground text-sm">M83 • Hurry Up, We're Dreaming</p>
      </div>

      {/* Progress */}
      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-8">1:42</span>
          <Slider
            value={progress}
            onValueChange={setProgress}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8">4:03</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button className="p-2 hover:bg-secondary rounded-full transition-colors">
            <SkipBack className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 bg-foreground text-background rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
            )}
          </button>
          <button className="p-2 hover:bg-secondary rounded-full transition-colors">
            <SkipForward className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
