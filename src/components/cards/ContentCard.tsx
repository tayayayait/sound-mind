import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface ContentCardProps {
  id: string;
  title: string;
  duration: number; // in seconds
  category: string;
  difficulty?: string;
  thumbnailUrl?: string;
}

const categoryLabels: Record<string, string> = {
  breathing: "호흡",
  sleep: "수면",
  anxiety: "불안 완화",
  focus: "집중",
  short: "짧게",
};

const difficultyLabels: Record<string, string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}분`;
}

export function ContentCard({ 
  id, 
  title, 
  duration, 
  category, 
  difficulty = "beginner",
  thumbnailUrl 
}: ContentCardProps) {
  return (
    <Link to={`/healing/${id}`}>
      <Card className="overflow-hidden shadow-elevation-1 hover:shadow-elevation-2 transition-shadow group">
        <div className="aspect-[16/9] bg-gradient-to-br from-brand-100 to-brand-50 relative flex items-center justify-center">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-card/80 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="h-6 w-6 text-primary ml-0.5" />
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-accent text-accent-foreground">
              {categoryLabels[category] || category}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5">
              {difficultyLabels[difficulty] || difficulty}
            </Badge>
          </div>
          <h3 className="text-body-strong text-foreground line-clamp-1 mb-1">{title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="text-caption">{formatDuration(duration)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
