import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, ExternalLink, ImageOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SmartImage } from "@/components/common/SmartImage";
import { formatArabicDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { NewsItem } from "@/components/news/NewsCard";

export const Route = createFileRoute("/news/$id")({
  head: () => ({
    meta: [
      { title: "تفاصيل الخبر — NEWS" },
      { name: "description", content: "تفاصيل الخبر أو الفعالية من مجتمع طلاب HTI." },
      { property: "og:title", content: "تفاصيل الخبر — NEWS" },
      { property: "og:description", content: "تفاصيل الخبر أو الفعالية من مجتمع طلاب HTI." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsDetail,
});

type NewsDetailItem = NewsItem & { content: string | null };

function NewsDetail() {
  const { id } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select(
          "id, title, description, content, image_url, external_url, category, is_published, published_at",
        )
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as NewsDetailItem | null) ?? null;
    },
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="container-page max-w-3xl space-y-4 py-12">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container-page max-w-3xl py-24 text-center">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
          <ImageOff className="size-7" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">الخبر غير متاح</h1>
        <p className="mt-3 text-muted-foreground">ربما تم حذفه أو لم يُنشر بعد.</p>
        <Link
          to="/news"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <ArrowRight className="size-4" /> كل الأخبار
        </Link>
      </div>
    );
  }

  return (
    <article className="container-page max-w-3xl py-12">
      <Link
        to="/news"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-soft"
      >
        <ArrowRight className="size-4" /> رجوع للأخبار
      </Link>

      <Badge className="mb-3 bg-primary text-primary-foreground">{data.category}</Badge>
      <h1 className="text-3xl font-extrabold leading-snug text-foreground sm:text-4xl">
        {data.title}
      </h1>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <CalendarDays className="size-4" />
        {formatArabicDate(data.published_at)}
      </p>

      {data.image_url && (
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]">
          <SmartImage
            bucket="news-images"
            path={data.image_url}
            alt={data.title}
            eager
            className="w-full object-cover"
          />
        </div>
      )}

      <p className="mt-8 text-lg font-semibold leading-loose text-foreground/90">
        {data.description}
      </p>

      {data.content && (
        <div className="mt-6 whitespace-pre-line border-t border-border pt-6 text-base leading-loose text-foreground/80">
          {data.content}
        </div>
      )}

      {data.external_url && (
        <a
          href={data.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-soft"
        >
          فتح الرابط <ExternalLink className="size-4" />
        </a>
      )}
    </article>
  );
}
