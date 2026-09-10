import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { notificationsQuery, type AppNotification } from "@/lib/student";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.round(hours / 24)} يوم`;
}

export function NotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(notificationsQuery(user?.id));
  const items: AppNotification[] = data ?? [];
  const unread = items.filter((n) => !n.is_read).length;

  const markRead = async (id?: string) => {
    let q = supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
    if (id) q = q.eq("id", id);
    queryClient.setQueriesData<AppNotification[]>({ queryKey: ["notifications"] }, (old) =>
      old?.map((n) => (!id || n.id === id ? { ...n, is_read: true } : n)),
    );
    await q;
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="الإشعارات"
          className="relative inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors hover:bg-secondary"
        >
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -left-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-bold">الإشعارات</p>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => void markRead()}>
              <CheckCheck className="size-3.5" /> تعليم الكل كمقروء
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {isLoading ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">جارِ التحميل...</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <BellOff className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">لا توجد إشعارات جديدة.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => {
                const body = (
                  <div className="flex items-start gap-2">
                    {!n.is_read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                    <div className={cn("min-w-0 flex-1", n.is_read && "opacity-70")}>
                      <p className="truncate text-sm font-bold text-foreground">{n.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                );
                return (
                  <li key={n.id} className="px-4 py-3 transition-colors hover:bg-secondary/60">
                    {n.type === "news" && n.related_id ? (
                      <Link
                        to="/news/$id"
                        params={{ id: n.related_id }}
                        onClick={() => void markRead(n.id)}
                        className="block"
                      >
                        {body}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void markRead(n.id)}
                        className="block w-full text-right"
                      >
                        {body}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
