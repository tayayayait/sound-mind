import { cn } from "@/lib/utils";

type WaveformState = "idle" | "recording" | "paused" | "processing";

interface WaveformProps {
  state: WaveformState;
}

export function Waveform({ state }: WaveformProps) {
  const bars = 20;
  
  return (
    <div 
      className={cn(
        "h-[120px] flex items-center justify-center gap-1 px-4 rounded-lg",
        "bg-secondary/50",
        state === "processing" && "blur-sm opacity-50"
      )}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const baseHeight = Math.sin((i / bars) * Math.PI) * 0.6 + 0.4;
        const animationDelay = `${(i * 50)}ms`;
        
        return (
          <div
            key={i}
            className={cn(
              "w-1.5 rounded-full transition-all",
              "bg-brand-300",
              state === "recording" && "animate-waveform",
              state === "idle" && "animate-breathe",
              state === "paused" && ""
            )}
            style={{
              height: state === "recording" 
                ? `${(Math.random() * 0.5 + 0.5) * 100}%`
                : `${baseHeight * 60}%`,
              animationDelay: state === "recording" ? animationDelay : undefined,
              backgroundColor: state === "recording" 
                ? `hsl(var(--brand-${i < bars / 3 ? "300" : i < (bars * 2 / 3) ? "500" : "600"}))`
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
