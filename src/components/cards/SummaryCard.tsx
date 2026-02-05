import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { Link } from "react-router-dom";

interface SummaryCardProps {
  score?: number;
  lastMeasured?: string;
  isEmpty?: boolean;
}

export function SummaryCard({ score, lastMeasured, isEmpty = false }: SummaryCardProps) {
  if (isEmpty) {
    return (
      <Card className="shadow-elevation-1">
        <CardContent className="p-4">
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
              <Mic className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-h3 text-foreground mb-2">첫 기록을 만들어보세요</h3>
            <p className="text-body text-muted-foreground mb-4">
              음성을 녹음하면 마음 상태를 분석해드려요
            </p>
            <Button asChild size="lg" className="w-full">
              <Link to="/record">
                <Mic className="mr-2 h-5 w-5" />
                지금 녹음하기
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elevation-1">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-caption text-muted-foreground mb-1">오늘의 마음 안정 지수</p>
            <div className="flex items-baseline gap-1">
              <span className="text-display text-primary">{score ?? "--"}</span>
              <span className="text-body text-muted-foreground">/ 100</span>
            </div>
          </div>
          
          {/* Ring Gauge Placeholder */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="hsl(var(--neutral-20))"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="hsl(var(--brand-500))"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${(score ?? 0) * 2.2} 220`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
          </div>
        </div>
        
        {lastMeasured && (
          <p className="text-caption text-muted-foreground mb-4">
            마지막 측정: {lastMeasured}
          </p>
        )}
        
        <Button asChild className="w-full" size="lg">
          <Link to="/record">
            <Mic className="mr-2 h-5 w-5" />
            지금 녹음하기
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
