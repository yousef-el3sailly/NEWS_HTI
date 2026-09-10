import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Loader2, Newspaper, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard, type NewsItem } from "@/components/news/NewsCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { formatArabicDate } from "@/lib/format";
import { SmartImage } from "@/components/common/SmartImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "الأخبار والأحداث — NEWS" },
      {
        name: "description",
        content: "أحدث أخبار وفعاليات وإعلانات طلاب HTI، مع بحث وتصنيفات لكل ما يهمك.",
      },
      { property: "og:title", content: "الأخبار والأحداث — NEWS" },
      { property: "og:description", content: "أحدث أخبار وفعاليات وإعلانات طلاب HTI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsPage,
});

export const NEWS_PAGE_SIZE = 12;
const NEWS_LIST_SELECT =
  "id, title, description, image_url, external_url, category, is_published, published_at";

/** Paginated list query — never fetches the heavy `content` column. */
export async function fetchPublishedNews(page = 0, pageSize = NEWS_PAGE_SIZE) {
  const from = page * pageSize;
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_LIST_SELECT)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) throw error;
  return (data ?? []) as NewsItem[];
}

function NewsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("الكل");

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["news", "published", "paged"],
      initialPageParam: 0,
      queryFn: ({ pageParam }) => fetchPublishedNews(pageParam as number),
      getNextPageParam: (lastPage, pages) =>
        lastPage.length < NEWS_PAGE_SIZE ? undefined : pages.length,
      staleTime: 10 * 60 * 1000,
    });

  const allNews = useMemo(() => data?.pages.flat() ?? [], [data]);

  const items = useMemo(() => {
    const list = allNews;
    const q = search.trim().toLowerCase();
    return list.filter((n) => {
      const matchesCategory = category === "الكل" || n.category === category;
      const matchesSearch =
        !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [allNews, search, category]);

  const isDefaultView = category === "الكل" && !search.trim();
  const featured = isDefaultView ? items[0] : undefined;
  const rest = featured ? items.slice(1) : items;

  return (
    <div className="container-page py-12">
      <header className="mb-8 max-w-2xl">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-primary-soft">
          <span className="size-1.5 rounded-full bg-primary" /> NEWS &amp; EVENTS
        </span>
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          أحدث الأخبار والأحداث
        </h1>
        <p className="mt-3 text-muted-foreground">
          كل الإعلانات والفعاليات الأكاديمية والطلابية اللي محتاج تعرفها، أولاً بأول.
        </p>
      </header>

      <div className="mb-10 space-y-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في الأخبار..."
            className="h-12 rounded-full bg-card ps-10"
            aria-label="بحث في الأخبار"
          />
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          {["الكل", ...NEWS_CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-foreground/75 hover:bg-secondary",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-72 rounded-3xl" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <EmptyState
          icon={Newspaper}
          title="تعذّر تحميل الأخبار"
          description="حاول تحديث الصفحة بعد لحظات."
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={allNews.length ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد أخبار حالياً"}
          description="تابعنا، هننشر كل جديد هنا أول بأول."
        />
      ) : (
        <div className="space-y-10">
          {featured && <FeaturedNews item={featured} />}
          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((item, i) => (
                <div
                  key={item.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <NewsCard item={item} />
                </div>
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                className="rounded-full px-8"
                disabled={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
              >
                {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
                عرض أخبار أقدم
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FeaturedNews({ item }: { item: NewsItem }) {
  return (
    <Link
      to="/news/$id"
      params={{ id: item.id }}
      className="surface-card group animate-fade-up grid overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-lifted)] lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary lg:aspect-auto lg:min-h-[22rem]">
        <SmartImage
          bucket="news-images"
          path={item.image_url}
          alt={item.title}
          eager
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          fallbackIconClassName="size-10"
        />
        <Badge className="absolute top-4 start-4 bg-primary text-primary-foreground">
          {item.category}
        </Badge>
      </div>

      <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
        <span className="text-[11px] font-bold tracking-[0.18em] text-primary-soft">
          الخبر الأحدث
        </span>
        <h2 className="text-2xl font-extrabold leading-snug text-foreground sm:text-3xl">
          {item.title}
        </h2>
        <p className="line-clamp-4 leading-relaxed text-muted-foreground">{item.description}</p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-4" /> {formatArabicDate(item.published_at)}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
          اقرأ التفاصيل
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
