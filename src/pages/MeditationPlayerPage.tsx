import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  X, 
  Clock,
  ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Meditation {
  id: string;
  title: string;
  description: string | null;
  duration_seconds: number;
  category: string;
  difficulty: string;
  audio_url: string | null;
}

const categoryLabels: Record<string, string> = {
  breathing: "호흡",
  sleep: "수면",
  anxiety: "불안 완화",
  focus: "집중",
  short: "짧게",
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MeditationPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [meditation, setMeditation] = useState<Meditation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    async function fetchMeditation() {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("meditations")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setMeditation(data);
        setDuration(data.duration_seconds);
      } catch (error) {
        console.error("Error fetching meditation:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMeditation();
  }, [id]);

  useEffect(() => {
    // Simulate audio playback since we don't have actual audio files
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            handleComplete();
            return duration;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, playbackSpeed]);

  const handleComplete = async () => {
    if (!user || !meditation) return;

    try {
      await supabase.from("meditation_sessions").insert({
        user_id: user.id,
        meditation_id: meditation.id,
        completed: true,
      });
    } catch (error) {
      console.error("Error saving meditation session:", error);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10));
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <MainLayout showNav={false}>
        <div className="min-h-screen bg-gradient-to-b from-brand-50 to-background flex flex-col">
          <Skeleton className="h-14 w-full" />
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <Skeleton className="w-48 h-48 rounded-full mb-8" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!meditation) {
    return (
      <MainLayout showNav={false}>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">콘텐츠를 찾을 수 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNav={false}>
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-background flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <ChevronDown className="h-6 w-6" />
          </Button>
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            {categoryLabels[meditation.category] || meditation.category}
          </Badge>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-6 w-6" />
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
          {/* Visualization */}
          <div className="relative w-48 h-48 mb-8">
            <div 
              className={cn(
                "absolute inset-0 rounded-full bg-brand-100",
                isPlaying && "animate-breathe"
              )}
            />
            <div 
              className={cn(
                "absolute inset-4 rounded-full bg-brand-300/50",
                isPlaying && "animate-breathe"
              )}
              style={{ animationDelay: "0.5s" }}
            />
            <div 
              className={cn(
                "absolute inset-8 rounded-full bg-brand-500/30",
                isPlaying && "animate-breathe"
              )}
              style={{ animationDelay: "1s" }}
            />
            <div className="absolute inset-12 rounded-full bg-card flex items-center justify-center shadow-elevation-2">
              <Play className={cn("h-12 w-12 text-primary ml-1", isPlaying && "hidden")} />
              {isPlaying && (
                <div className="flex items-end gap-1 h-8">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-primary rounded-full animate-waveform"
                      style={{ 
                        height: `${20 + Math.random() * 12}px`,
                        animationDelay: `${i * 100}ms` 
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="text-h1 text-foreground text-center mb-2">
            {meditation.title}
          </h1>
          {meditation.description && (
            <p className="text-body text-muted-foreground text-center mb-6 max-w-sm">
              {meditation.description}
            </p>
          )}

          {/* Duration */}
          <div className="flex items-center gap-1 text-muted-foreground mb-8">
            <Clock className="h-4 w-4" />
            <span className="text-caption">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="p-6 bg-card rounded-t-[20px] shadow-elevation-2">
          {/* Progress Bar */}
          <div className="mb-6">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-caption text-muted-foreground">
                {formatTime(currentTime)}
              </span>
              <span className="text-caption text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              onClick={handleSkipBack}
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            
            <Button
              size="icon"
              className="w-16 h-16 rounded-full"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              onClick={handleSkipForward}
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex justify-center gap-4">
            <Badge
              variant="outline"
              className="cursor-pointer"
              onClick={handleSpeedChange}
            >
              {playbackSpeed}x
            </Badge>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
