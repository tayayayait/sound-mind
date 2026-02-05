interface TimerProps {
  seconds: number;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function Timer({ seconds }: TimerProps) {
  return (
    <div className="text-display text-foreground tabular-nums">
      {formatTime(seconds)}
    </div>
  );
}
