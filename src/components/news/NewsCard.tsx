import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/common/SmartImage";
import { formatArabicDate } from "@/lib/format";

export type NewsItem = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  external_url: string | null;
  category: string;
  is_published: boolean;
  published_at: string;
};

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="surface-card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <SmartImage
          bucket="news-images"
          path={item.image_url}
          alt={item.title}
          variant="thumb"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute top-3 start-3 bg-primary text-primary-foreground">
          {item.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-lg font-bold text-foreground">{item.title}</h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {formatArabicDate(item.published_at)}
          </span>
          <Link
            to="/news/$id"
            params={{ id: item.id }}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-soft"
          >
            اقرأ المزيد <ArrowLeft className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
