import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AppBar } from "@/components/layout/AppBar";
import { SummaryCard } from "@/components/cards/SummaryCard";
import { TrendCard } from "@/components/cards/TrendCard";
import { AdviceCard } from "@/components/cards/AdviceCard";
import { ContentCard } from "@/components/cards/ContentCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Analysis {
  id: string;
  overall_score: number;
  advice: string;
  created_at: string;
}

interface Meditation {
  id: string;
  title: string;
  duration_seconds: number;
  category: string;
  difficulty: string;
  thumbnail_url: string | null;
}

export default function HomePage() {
  const { user } = useAuth();
  const [latestAnalysis, setLatestAnalysis] = useState<Analysis | null>(null);
  const [trendData, setTrendData] = useState<{ date: string; score: number }[]>([]);
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch recommended meditations (Public)
        const { data: meditationsData } = await supabase
          .from("meditations")
          .select("id, title, duration_seconds, category, difficulty, thumbnail_url")
          .eq("is_active", true)
          .limit(4);

        if (meditationsData) {
          setMeditations(meditationsData);
        }

        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", user.id)
          .single();
        
        if (profile?.display_name) {
          setDisplayName(profile.display_name);
        }

        // Fetch latest analysis
        const { data: analyses } = await supabase
          .from("analyses")
          .select("id, overall_score, advice, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(7);

        if (analyses && analyses.length > 0) {
          setLatestAnalysis(analyses[0]);
          
          // Build trend data from last 7 analyses
          const trend = analyses
            .slice(0, 7)
            .reverse()
            .map((a) => ({
              date: new Date(a.created_at).toLocaleDateString("ko-KR", { weekday: "short" }),
              score: a.overall_score ?? 0,
            }));
          setTrendData(trend);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = displayName || user?.email?.split("@")[0];
    
    if (name) {
        if (hour < 12) return `좋은 아침이에요, ${name}님`;
        if (hour < 18) return `안녕하세요, ${name}님`;
        return `좋은 저녁이에요, ${name}님`;
    } else {
        if (hour < 12) return "좋은 아침이에요";
        if (hour < 18) return "안녕하세요";
        return "좋은 저녁이에요";
    }
  };

  const getTimeSince = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  };

  const calculateTrend = (): { trend: "up" | "down" | "stable"; change: number } => {
    if (trendData.length < 2) return { trend: "stable", change: 0 };
    
    const recent = trendData.slice(-3);
    const earlier = trendData.slice(0, Math.max(trendData.length - 3, 1));
    
    const recentAvg = recent.reduce((a, b) => a + b.score, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b.score, 0) / earlier.length;
    
    const change = Math.round(recentAvg - earlierAvg);
    
    return {
      trend: change > 3 ? "up" : change < -3 ? "down" : "stable",
      change,
    };
  };

  return (
    <MainLayout>
      <AppBar greeting={getGreeting()} showSettings />
      
      <div className="px-4 py-6 space-y-6">
        {loading ? (
          <>
            <Skeleton className="h-[200px] rounded-lg" />
            <Skeleton className="h-[140px] rounded-lg" />
            <Skeleton className="h-[100px] rounded-lg" />
          </>
        ) : (
          <>
            {/* Summary Card */}
            <SummaryCard
              score={latestAnalysis?.overall_score}
              lastMeasured={latestAnalysis ? getTimeSince(latestAnalysis.created_at) : undefined}
              isEmpty={!latestAnalysis}
            />

            {/* Trend Card */}
            {latestAnalysis && (
              <TrendCard
                data={trendData}
                {...calculateTrend()}
              />
            )}

            {/* Advice Card */}
            {latestAnalysis?.advice && (
              <AdviceCard
                advice={latestAnalysis.advice}
                recommendedAction={{
                  label: "3분 호흡하기",
                  path: "/healing",
                }}
              />
            )}

            {/* Recommended Meditations */}
            {meditations.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-h3 text-foreground">추천 콘텐츠</h2>
                  <Link 
                    to="/healing" 
                    className="flex items-center text-caption text-primary hover:underline"
                  >
                    전체 보기
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {meditations.slice(0, 4).map((meditation) => (
                    <ContentCard
                      key={meditation.id}
                      id={meditation.id}
                      title={meditation.title}
                      duration={meditation.duration_seconds}
                      category={meditation.category}
                      difficulty={meditation.difficulty}
                      thumbnailUrl={meditation.thumbnail_url ?? undefined}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
