import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AppBar } from "@/components/layout/AppBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Trash2, Clock, TrendingUp, Archive } from "lucide-react";
import { toast } from "sonner";

interface Recording {
  id: string;
  duration_seconds: number | null;
  status: string;
  created_at: string;
  analyses: {
    id: string;
    overall_score: number | null;
  }[];
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "대기 중", variant: "secondary" },
  analyzing: { label: "분석 중", variant: "outline" },
  completed: { label: "완료", variant: "default" },
  failed: { label: "실패", variant: "destructive" },
};

export default function LibraryPage() {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRecordings();
  }, [user]);

  async function fetchRecordings() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("recordings")
        .select(`
          id,
          duration_seconds,
          status,
          created_at,
          analyses (
            id,
            overall_score
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecordings(data || []);
    } catch (error) {
      console.error("Error fetching recordings:", error);
      toast.error("기록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("recordings")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setRecordings((prev) => prev.filter((r) => r.id !== deleteId));
      toast.success("기록이 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting recording:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <MainLayout>
      <AppBar title="보관함" />
      
      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[72px] rounded-lg" />
            ))}
          </div>
        ) : recordings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Archive className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-h3 text-foreground mb-2">기록이 없어요</h2>
            <p className="text-body text-muted-foreground text-center mb-6">
              음성을 녹음하면 여기에 저장됩니다.
            </p>
            <Button asChild>
              <Link to="/record">첫 녹음하기</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recordings.map((recording) => {
              const analysis = recording.analyses?.[0];
              const status = statusLabels[recording.status] || statusLabels.pending;
              
              return (
                <Card key={recording.id} className="shadow-elevation-1">
                  <div className="flex items-center p-4 gap-4">
                    {/* Left: Score or Icon */}
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      {analysis?.overall_score !== undefined && analysis?.overall_score !== null ? (
                        <span className="text-body-strong text-primary">
                          {analysis.overall_score}
                        </span>
                      ) : (
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Center: Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-body-strong text-foreground truncate">
                          {formatDate(recording.created_at)}
                        </span>
                        <Badge variant={status.variant} className="text-[10px]">
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-caption">
                          {formatDuration(recording.duration_seconds)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      {analysis && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/result/${analysis.id}`}>보기</Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteId(recording.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>기록을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제하면 복구할 수 없어요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
