import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  label: string;
  value: number | null;
  description?: string;
  change?: number;
  lowLabel?: string;
  highLabel?: string;
}

export function MetricCard({ 
  label, 
  value, 
  description,
  change,
  lowLabel = "낮음",
  highLabel = "높음"
}: MetricCardProps) {
  const trend = change ? (change > 0 ? "up" : change < 0 ? "down" : "stable") : undefined;
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-success-600" : trend === "down" ? "text-danger-600" : "text-muted-foreground";

  return (
    <Card className="shadow-elevation-1">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="text-caption text-muted-foreground">{label}</span>
            {description && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="touch-target flex items-center justify-center">
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-[200px]">{description}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {trend && change !== undefined && (
            <div className={`flex items-center gap-0.5 ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              <span className="text-[10px]">{change > 0 ? "+" : ""}{change}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-h2 text-foreground">
            {value !== null ? value : "--"}
          </span>
          <span className="text-caption text-muted-foreground">/ 100</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${value ?? 0}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">{lowLabel}</span>
          <span className="text-[10px] text-muted-foreground">{highLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
