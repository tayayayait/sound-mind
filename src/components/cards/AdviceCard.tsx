import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface AdviceCardProps {
  advice: string;
  recommendedAction?: {
    label: string;
    path: string;
  };
}

export function AdviceCard({ advice, recommendedAction }: AdviceCardProps) {
  return (
    <Card className="shadow-elevation-1 bg-accent/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body text-foreground mb-3 line-clamp-3">
              {advice}
            </p>
            {recommendedAction && (
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link to={recommendedAction.path}>
                  {recommendedAction.label}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
