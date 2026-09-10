import { supabase } from "@/integrations/supabase/client";

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "completed";

export type Subject = {
  id: string;
  name: string;
  instructor_name: string | null;
  group_number: string | null;
  course_code: string | null;
  notes: string | null;
};

export type Task = {
  id: string;
  title: string;
  subject_id: string | null;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
};

export type StudentNote = {
  id: string;
  title: string;
  content: string;
  subject_id: string | null;
  created_at: string;
  updated_at: string;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  related_id: string | null;
  is_read: boolean;
  created_at: string;
};

export const SUBJECT_SELECT = "id, name, instructor_name, group_number, course_code, notes";
export const TASK_SELECT =
  "id, title, subject_id, priority, status, due_date, notes, completed_at, created_at";
export const NOTE_SELECT = "id, title, content, subject_id, created_at, updated_at";
export const NOTIFICATION_SELECT = "id, title, message, type, related_id, is_read, created_at";

export const PRIORITIES: { value: Priority; label: string; className: string }[] = [
  { value: "low", label: "منخفضة", className: "bg-secondary text-foreground/70" },
  { value: "medium", label: "متوسطة", className: "bg-accent/15 text-accent-foreground" },
  { value: "high", label: "عالية", className: "bg-primary/12 text-primary" },
];

export function priorityMeta(value: string) {
  return PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[1]!;
}

export const PRIORITY_WEIGHT: Record<string, number> = { high: 0, medium: 1, low: 2 };

/** Local (not UTC) YYYY-MM-DD for the given date. */
export function isoDay(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function isOverdue(task: Pick<Task, "due_date" | "status">) {
  return Boolean(task.status !== "completed" && task.due_date && task.due_date < isoDay());
}

/** Friendly Arabic relative label for a YYYY-MM-DD deadline. */
export function dueLabel(due?: string | null) {
  if (!due) return "بدون موعد";
  const today = isoDay();
  if (due === today) return "النهارده";
  const diff = Math.round(
    (new Date(`${due}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86_400_000,
  );
  if (diff === 1) return "غداً";
  if (diff === -1) return "أمس";
  if (diff > 1 && diff <= 7) return `بعد ${diff} أيام`;
  if (diff < -1) return `متأخرة ${Math.abs(diff)} يوم`;
  return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long" }).format(
    new Date(`${due}T00:00:00`),
  );
}

/**
 * Maps a JS day index (0 = Sunday) onto the app's schedule day index
 * (0 = Saturday … 5 = Thursday). Returns null for Friday (no schedule).
 */
export function scheduleDayIndex(date = new Date()): number | null {
  const map: Record<number, number | null> = { 6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: null };
  return map[date.getDay()] ?? null;
}

export const subjectsQuery = (userId?: string) => ({
  queryKey: ["subjects", userId],
  enabled: Boolean(userId),
  staleTime: 5 * 60 * 1000,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select(SUBJECT_SELECT)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Subject[];
  },
});

export const tasksQuery = (userId?: string) => ({
  queryKey: ["tasks", userId],
  enabled: Boolean(userId),
  staleTime: 5 * 60 * 1000,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select(TASK_SELECT)
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Task[];
  },
});

export const notesQuery = (userId?: string) => ({
  queryKey: ["notes", userId],
  enabled: Boolean(userId),
  staleTime: 5 * 60 * 1000,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("notes")
      .select(NOTE_SELECT)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as StudentNote[];
  },
});

export const notificationsQuery = (userId?: string) => ({
  queryKey: ["notifications", userId],
  enabled: Boolean(userId),
  staleTime: 2 * 60 * 1000,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select(NOTIFICATION_SELECT)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw error;
    return (data ?? []) as AppNotification[];
  },
});
