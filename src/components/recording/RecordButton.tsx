import { cn } from "@/lib/utils";
import { Mic, Square, Pause, Play } from "lucide-react";

type RecordState = "idle" | "recording" | "paused";

interface RecordButtonProps {
  state: RecordState;
  onPress: () => void;
  disabled?: boolean;
}

export function RecordButton({ state, onPress, disabled = false }: RecordButtonProps) {
  const getIcon = () => {
    switch (state) {
      case "idle":
        return <Mic className="h-10 w-10 text-primary-foreground" />;
      case "recording":
        return <Square className="h-8 w-8 text-primary-foreground" />;
      case "paused":
        return <Play className="h-10 w-10 text-primary-foreground ml-1" />;
    }
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={cn(
        "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-150 touch-target",
        "focus:outline-none focus:ring-4 focus:ring-ring/40",
        "active:scale-[0.96]",
        disabled && "opacity-45 cursor-not-allowed",
        state === "idle" && "bg-primary hover:bg-primary/90",
        state === "recording" && "bg-danger-600 hover:bg-danger-600/90 animate-pulse-soft",
        state === "paused" && "bg-primary hover:bg-primary/90"
      )}
      aria-label={
        state === "idle" ? "녹음 시작" :
        state === "recording" ? "녹음 정지" :
        "녹음 재개"
      }
    >
      {getIcon()}
    </button>
  );
}

interface SecondaryRecordButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function SecondaryRecordButton({ icon, label, onClick, disabled }: SecondaryRecordButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors touch-target",
        "text-muted-foreground hover:text-foreground hover:bg-secondary",
        disabled && "opacity-45 cursor-not-allowed"
      )}
    >
      {icon}
      <span className="text-caption">{label}</span>
    </button>
  );
}
