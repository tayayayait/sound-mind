import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AppBarProps {
  title?: string;
  greeting?: string;
  showSettings?: boolean;
}

export function AppBar({ 
  title, 
  greeting, 
  showSettings = false 
}: AppBarProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 bg-card border-b border-border">
      <div className="flex-1">
        {greeting && (
          <p className="text-body-strong text-foreground">{greeting}</p>
        )}
        {title && (
          <h1 className="text-h3 text-foreground">{title}</h1>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {showSettings && (
          <Button variant="ghost" size="icon" asChild className="touch-target">
            <Link to="/settings">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
