import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, CalendarClock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/format";
import { dueLabel, isOverdue, priorityMeta, type Subject, type Task } from "@/lib/student";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TaskRow({
  task,
  subjects,
  onEdit,
  compact,
}: {
  task: Task;
  subjects: Subject[];
  onEdit?: (task: Task) => void;
  compact?: boolean;
}) {
  const queryClient = useQueryClient();
  const subject = subjects.find((s) => s.id === task.subject_id);
  const done = task.status === "completed";
  const late = isOverdue(task);
  const meta = priorityMeta(task.priority);

  const mutate = async (
    run: () => PromiseLike<{ error: unknown }>,
    optimistic: (list: Task[]) => Task[],
    fallback: string,
  ) => {
    const key = ["tasks"];
    await queryClient.cancelQueries({ queryKey: key });
    queryClient.setQueriesData<Task[]>({ queryKey: key }, (old) => (old ? optimistic(old) : old));
    const { error } = await run();
    if (error) toast.error(friendlyError(error, fallback));
    void queryClient.invalidateQueries({ queryKey: key });
  };

  const toggle = () =>
    mutate(
      () =>
        supabase
          .from("tasks")
          .update({
            status: done ? "pending" : "completed",
            completed_at: done ? null : new Date().toISOString(),
          })
          .eq("id", task.id),
      (list) =>
        list.map((t) =>
          t.id === task.id ? { ...t, status: done ? "pending" : "completed" } : t,
        ),
      "لم نتمكن من تحديث المهمة.",
    );

  const remove = () =>
    mutate(
      () => supabase.from("tasks").delete().eq("id", task.id),
      (list) => list.filter((t) => t.id !== task.id),
      "لم نتمكن من حذف المهمة.",
    );

  return (
    <li
      className={cn(
        "animate-fade-up flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30",
        done && "bg-secondary/40",
      )}
    >
      <Checkbox
        checked={done}
        onCheckedChange={() => void toggle()}
        className="mt-1 transition-transform active:scale-90"
        aria-label={done ? "إلغاء الإكمال" : "إتمام المهمة"}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "line-clamp-2 break-words text-sm font-bold text-foreground",
            done && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {subject && <span className="font-semibold text-foreground/70">{subject.name}</span>}
          <span
            className={cn("rounded-full px-2 py-0.5 font-semibold", meta.className)}
            title="الأولوية"
          >
            {meta.label}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarClock className="size-3.5" />
            {dueLabel(task.due_date)}
          </span>
          {late && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
              <AlertTriangle className="size-3.5" /> متأخرة
            </span>
          )}
          {done && <span className="font-semibold text-foreground/60">مكتملة</span>}
        </div>
        {!compact && task.notes && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{task.notes}</p>
        )}
      </div>
      {!compact && (
        <div className="flex shrink-0 items-center gap-1">
          {onEdit && (
            <Button variant="ghost" size="icon" aria-label="تعديل" onClick={() => onEdit(task)}>
              <Pencil className="size-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" aria-label="حذف" onClick={() => void remove()}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      )}
    </li>
  );
}
