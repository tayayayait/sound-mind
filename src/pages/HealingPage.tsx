import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AppBar } from "@/components/layout/AppBar";
import { ContentCard } from "@/components/cards/ContentCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Meditation {
  id: string;
  title: string;
  duration_seconds: number;
  category: string;
  difficulty: string;
  thumbnail_url: string | null;
}

const categories = [
  { id: "all", label: "전체" },
  { id: "breathing", label: "호흡" },
  { id: "sleep", label: "수면" },
  { id: "anxiety", label: "불안 완화" },
  { id: "focus", label: "집중" },
  { id: "short", label: "짧게" },
];

const sortOptions = [
  { id: "recommended", label: "추천순" },
  { id: "newest", label: "최신순" },
  { id: "shortest", label: "짧은 순" },
];

export default function HealingPage() {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("recommended");

  useEffect(() => {
    async function fetchMeditations() {
      try {
        let query = supabase
          .from("meditations")
          .select("id, title, duration_seconds, category, difficulty, thumbnail_url")
          .eq("is_active", true);

        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }

        if (selectedSort === "newest") {
          query = query.order("created_at", { ascending: false });
        } else if (selectedSort === "shortest") {
          query = query.order("duration_seconds", { ascending: true });
        }

        const { data, error } = await query;

        if (error) throw error;
        setMeditations(data || []);
      } catch (error) {
        console.error("Error fetching meditations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMeditations();
  }, [selectedCategory, selectedSort]);

  return (
    <MainLayout>
      <AppBar title="치유 콘텐츠" />
      
      <div className="px-4 py-4">
        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={cn(
                "cursor-pointer whitespace-nowrap px-3 py-1.5 transition-colors",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-accent"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Badge>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex gap-2 mb-4">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              className={cn(
                "text-caption transition-colors",
                selectedSort === option.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setSelectedSort(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
            ))}
          </div>
        ) : meditations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-body text-muted-foreground">
              해당 카테고리에 콘텐츠가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {meditations.map((meditation) => (
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
        )}
      </div>
    </MainLayout>
  );
}
