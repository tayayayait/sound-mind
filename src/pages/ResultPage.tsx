import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AppBar } from "@/components/layout/AppBar";
import { MetricCard } from "@/components/cards/MetricCard";
import { AdviceCard } from "@/components/cards/AdviceCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Home, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Analysis {
  id: string;
  overall_score: number | null;
  tension_score: number | null;
  vitality_score: number | null;
  focus_score: number | null;
  recovery_score: number | null;
  summary: string | null;
  advice: string | null;
  transcript: string | null;
  created_at: string;
}

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      // Check for passed state first (Guest mode)
      const stateAnalysis = location.state?.analysis;
      if (stateAnalysis) {
        setAnalysis(stateAnalysis);
        setLoading(false);
        return;
      }

      if (!id || !user) {
        setError("분석할 대상이 없거나 인증이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        if (id === "latest") {
          const { data, error: fetchError } = await supabase
            .from("analyses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
            
          if (fetchError) throw fetchError;
          if (!data) throw new Error("최근 분석 기록을 찾을 수 없습니다.");
          setAnalysis(data);
        } else {
          const { data, error: fetchError } = await supabase
            .from("analyses")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

          if (fetchError) throw fetchError;
          if (!data) throw new Error("선택한 분석 기록을 찾을 수 없습니다.");
          setAnalysis(data);
        }
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError("분석 결과를 불러오는 데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [id, user, location.state]);

  if (loading) {
    return (
      <MainLayout showNav={false}>
        <AppBar title="분석 결과" />
        <div className="px-4 py-6 space-y-6">
          <Skeleton className="h-[200px] rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
            <Skeleton className="h-[120px] rounded-lg" />
          </div>
          <Skeleton className="h-[100px] rounded-lg" />
        </div>
      </MainLayout>
    );
  }

  if (error || !analysis) {
    return (
      <MainLayout showNav={false}>
        <AppBar title="분석 결과" />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-h2 text-foreground mb-2">결과를 불러올 수 없어요.</h2>
          <p className="text-body text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link to="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNav={false}>
      <AppBar title="분석 결과" />
      
      <div className="px-4 py-6 space-y-6">
        {/* Main Score Card */}
        <Card className="shadow-elevation-1">
          <CardContent className="p-6 text-center">
            {/* Ring Gauge */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--neutral-20))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--brand-500))"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${((analysis.overall_score ?? 0) / 100) * 352} 352`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-display text-primary">
                  {analysis.overall_score ?? "--"}
                </span>
              </div>
            </div>
            
            <h2 className="text-h2 text-foreground mb-2">오늘의 심리 상태</h2>
            <p className="text-body text-muted-foreground">
              {analysis.summary || "현재 상태 요약을 불러올 수 없습니다."}
            </p>
          </CardContent>
        </Card>

        {/* Transcript */}
        {analysis.transcript && (
          <Card className="shadow-elevation-1">
            <CardContent className="p-6">
              <h3 className="text-h3 text-foreground mb-2">녹음 내용</h3>
              <p className="text-body text-muted-foreground whitespace-pre-wrap">
                {analysis.transcript}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="회복 지수"
            value={analysis.recovery_score}
            description="0점에 가까울수록 불안정, 100점에 가까울수록 안정"
            lowLabel="불안정"
            highLabel="안정"
          />
        </div>

        {/* Advice Card */}
        {analysis.advice && (
          <AdviceCard
            advice={analysis.advice}
            recommendedAction={{
              label: "3분 안정 루틴 시작",
              path: "/healing",
            }}
          />
        )}

        {/* Disclaimer */}
        <Alert className="bg-secondary/50">
          <AlertDescription className="text-caption text-muted-foreground">
            테스트에 집중하는 것도 좋지만, 중간중간 짧은 휴식을 통해 심신의 균형을 유지하는 것을 추천합니다.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 pb-6">
          <Button variant="outline" asChild className="flex-1">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              홈
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link to="/healing">
              <Sparkles className="mr-2 h-4 w-4" />
              치유 콘텐츠
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
