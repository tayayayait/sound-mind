import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendData {
  date: string;
  score: number;
}

interface TrendCardProps {
  data: TrendData[];
  trend?: "up" | "down" | "stable";
  change?: number;
}

export function TrendCard({ data, trend = "stable", change = 0 }: TrendCardProps) {
  const maxScore = Math.max(...data.map(d => d.score), 100);
  const minScore = Math.min(...data.map(d => d.score), 0);
  const range = maxScore - minScore || 1;

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-success-600" : trend === "down" ? "text-danger-600" : "text-muted-foreground";

  return (
    <Card className="shadow-elevation-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-h3">7일 추세</CardTitle>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-caption">
              {change > 0 ? "+" : ""}{change}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[80px] flex items-center justify-center text-muted-foreground text-caption">
            기록을 쌓아 추세를 보여드릴게요
          </div>
        ) : (
          <div className="h-[80px] flex items-end justify-between gap-1">
            {data.map((item, index) => {
              const height = ((item.score - minScore) / range) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-brand-300 rounded-t-sm transition-all duration-300"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
