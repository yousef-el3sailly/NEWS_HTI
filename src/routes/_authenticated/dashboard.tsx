import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookMarked,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Clock,
  ListTodo,
  Newspaper,
  NotebookPen,
  Plus,
  BookOpen,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useStorageUrl } from "@/lib/storage";
import { formatArabicDate, formatSpecialization } from "@/lib/format";
import { DAYS, TIME_SLOTS } from "@/lib/constants";
import {
  dueLabel,
  isoDay,
  isOverdue,
  priorityMeta,
  PRIORITY_WEIGHT,
  scheduleDayIndex,
  subjectsQuery,
  tasksQuery,
  type Task,
} from "@/lib/student";
import { EmptyState } from "@/components/common/EmptyState";
import { TaskDialog } from "@/components/student/TaskDialog";
import { TaskRow } from "@/components/student/TaskList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحتي — NEWS" },
      {
        name: "description",
        content: "جدول اليوم، مهامك، مواعيدك القادمة وموادك في مكان واحد داخل NEWS.",
      },
      { property: "og:title", content: "لوحتي — NEWS" },
      { property: "og:description", content: "مركز الطالب الشخصي في منصة NEWS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const FILTERS = [
  { id: "all", label: "الكل" },
  { id: "today", label: "اليوم" },
  { id: "upcoming", label: "قادمة" },
  { id: "late", label: "متأخرة" },
  { id: "done", label: "مكتملة" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof ListTodo;
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className="surface-card animate-fade-up flex items-center gap-3 p-4">
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="text-xl font-extrabold text-foreground">
          {value} <span className="text-xs font-semibold text-muted-foreground">{hint}</span>
        </p>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user, profile } = useAuth();
  const avatar = useStorageUrl("avatars", profile?.avatar_url);
  const [taskOpen, setTaskOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterId>("all");

  const tasks = useQuery(tasksQuery(user?.id));
  const subjectsData = useQuery(subjectsQuery(user?.id));
  const subjects = subjectsData.data ?? [];

  const todayIndex = scheduleDayIndex();

  const schedule = useQuery({
    queryKey: ["schedule", "today", user?.id, todayIndex],
    enabled: Boolean(user?.id) && todayIndex !== null,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select("id, slot, subject_name, group_number, instructor_name")
        .eq("day", todayIndex as number)
        .order("slot", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const news = useQuery({
    queryKey: ["news", "dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, category, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data ?? [];
    },
  });

  const allTasks = tasks.data ?? [];
  const today = isoDay();

  const pending = allTasks.filter((t) => t.status !== "completed");
  const upcoming = useMemo(
    () =>
      pending
        .filter((t) => t.due_date && t.due_date >= today)
        .sort(
          (a, b) =>
            (a.due_date ?? "").localeCompare(b.due_date ?? "") ||
            (PRIORITY_WEIGHT[a.priority] ?? 1) - (PRIORITY_WEIGHT[b.priority] ?? 1),
        )
        .slice(0, 5),
    [pending, today],
  );

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "today":
        return pending.filter((t) => t.due_date === today);
      case "upcoming":
        return pending.filter((t) => t.due_date && t.due_date > today);
      case "late":
        return pending.filter((t) => isOverdue(t));
      case "done":
        return allTasks.filter((t) => t.status === "completed");
      default:
        return allTasks;
    }
  }, [filter, allTasks, pending, today]);

  const classesToday = schedule.data?.length ?? 0;
  const firstName = (profile?.full_name || "").trim().split(" ")[0] || "طالب HTI";
  const initials = (profile?.full_name || user?.email || "؟").trim().charAt(0);

  const openNewTask = () => {
    setEditing(null);
    setTaskOpen(true);
  };

  return (
    <main className="container-page space-y-8 py-10">
      {/* Header */}
      <section className="surface-card animate-fade-up flex flex-wrap items-center gap-4 p-4 sm:p-6">
        <Avatar className="size-14 shrink-0 border border-border sm:size-16">
          {avatar && <AvatarImage src={avatar} alt="صورتك الشخصية" />}
          <AvatarFallback className="bg-secondary text-xl font-bold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 basis-40">
          <h1 className="break-words text-xl font-extrabold text-foreground sm:text-3xl">
            أهلاً، {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">جاهز تنجز إيه النهارده؟</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {profile?.specialization && (
              <span className="max-w-full break-words rounded-full bg-secondary px-3 py-1 font-semibold text-primary">
                {formatSpecialization(profile.specialization)}
              </span>
            )}
            {profile?.batch && (
              <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-primary">
                دفعة {profile.batch}
              </span>
            )}
          </div>
        </div>
        <Button onClick={openNewTask} className="w-full gap-2 sm:w-auto">
          <Plus className="size-4" /> إضافة مهمة
        </Button>
      </section>

      {/* Quick stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="جدول اليوم" value={classesToday} hint="محاضرات" />
        <StatCard icon={ListTodo} label="المهام" value={pending.length} hint="مهام" />
        <StatCard icon={Clock} label="المواعيد القادمة" value={upcoming.length} hint="قريباً" />
        <StatCard icon={BookMarked} label="المواد" value={subjects.length} hint="مواد" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's schedule */}
        <section className="surface-card animate-fade-up order-1 min-w-0 p-4 sm:p-6 lg:order-none">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold text-foreground">جدول اليوم</h2>
            <span className="text-xs font-semibold text-muted-foreground">
              {todayIndex === null ? "الجمعة" : DAYS[todayIndex]}
            </span>
          </div>

          {schedule.isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : classesToday === 0 ? (
            <p className="rounded-xl bg-secondary/60 px-4 py-8 text-center text-sm font-semibold text-muted-foreground">
              مفيش محاضرات النهارده 🎉
            </p>
          ) : (
            <ul className="space-y-3">
              {schedule.data?.map((s) => (
                <li key={s.id} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs font-bold text-primary">{TIME_SLOTS[s.slot]}</p>
                  <p className="mt-1 break-words text-sm font-bold text-foreground">
                    {s.subject_name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {[s.group_number ? `Group ${s.group_number}` : null, s.instructor_name]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <Button asChild variant="outline" className="mt-4 w-full gap-2">
            <Link to="/schedule">
              عرض الجدول الكامل <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </section>

        {/* Tasks */}
        <section className="surface-card animate-fade-up min-w-0 p-4 sm:p-6 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-foreground">مهامي</h2>
            <Button size="sm" onClick={openNewTask} className="gap-2">
              <Plus className="size-4" /> مهمة جديدة
            </Button>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === f.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground/70 hover:bg-secondary",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {tasks.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="مفيش مهام حالياً 🎉"
              description="ضيف مهمة جديدة وابدأ تنظّم مذاكرتك."
              className="py-10"
            />
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  subjects={subjects}
                  onEdit={(task) => {
                    setEditing(task);
                    setTaskOpen(true);
                  }}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming deadlines */}
        <section className="surface-card animate-fade-up min-w-0 p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-extrabold text-foreground">المواعيد القادمة</h2>
          {upcoming.length === 0 ? (
            <p className="rounded-xl bg-secondary/60 px-4 py-8 text-center text-sm font-semibold text-muted-foreground">
              مفيش مواعيد قريبة 🎉
            </p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((t) => {
                const subject = subjects.find((s) => s.id === t.subject_id);
                const meta = priorityMeta(t.priority);
                return (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-2 break-words text-sm font-bold text-foreground">{t.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {subject?.name ?? "بدون مادة"}
                      </p>
                    </div>
                    <div className="shrink-0 text-left">
                      <p className="text-xs font-bold text-primary">{dueLabel(t.due_date)}</p>
                      <span
                        className={cn(
                          "mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          meta.className,
                        )}
                      >
                        {meta.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Latest news */}
        <section className="surface-card animate-fade-up min-w-0 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold text-foreground">آخر الأخبار</h2>
            <Link to="/news" className="text-xs font-bold text-primary hover:underline">
              كل الأخبار
            </Link>
          </div>
          {news.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : (news.data?.length ?? 0) === 0 ? (
            <p className="rounded-xl bg-secondary/60 px-4 py-8 text-center text-sm font-semibold text-muted-foreground">
              مفيش أخبار منشورة حالياً.
            </p>
          ) : (
            <ul className="space-y-2">
              {news.data?.map((n) => (
                <li key={n.id}>
                  <Link
                    to="/news/$id"
                    params={{ id: n.id }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-2 break-words text-sm font-bold text-foreground">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {n.category} · {formatArabicDate(n.published_at)}
                      </p>
                    </div>
                    <ArrowLeft className="size-4 shrink-0 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick actions */}
      <section className="surface-card animate-fade-up min-w-0 p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-extrabold text-foreground">وصول سريع</h2>
        <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={openNewTask}>
            <Plus className="size-5 text-primary" />
            <span className="text-xs font-bold">إضافة مهمة</span>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
            <Link to="/notes">
              <NotebookPen className="size-5 text-primary" />
              <span className="text-xs font-bold">إضافة ملاحظة</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
            <Link to="/subjects">
              <BookMarked className="size-5 text-primary" />
              <span className="text-xs font-bold">إضافة مادة</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
            <Link to="/schedule">
              <CalendarRange className="size-5 text-primary" />
              <span className="text-xs font-bold">الجدول الدراسي</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
            <Link to="/news">
              <Newspaper className="size-5 text-primary" />
              <span className="text-xs font-bold">الأخبار</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
            <Link to="/unicourses">
              <BookOpen className="size-5 text-primary" />
              <span className="text-xs font-bold">UniCourses</span>
            </Link>
          </Button>
        </div>
      </section>

      <TaskDialog
        open={taskOpen}
        onOpenChange={setTaskOpen}
        userId={user?.id}
        subjects={subjects}
        task={editing}
      />
    </main>
  );
}
