import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/format";
import { PRIORITIES, type Priority, type Subject, type Task } from "@/lib/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

export function TaskDialog({
  open,
  onOpenChange,
  userId,
  subjects,
  task,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | undefined;
  subjects: Subject[];
  task?: Task | null | undefined;
}) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subject_id: NONE,
    priority: "medium" as Priority,
    due_date: "",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      title: task?.title ?? "",
      subject_id: task?.subject_id ?? NONE,
      priority: (task?.priority as Priority) ?? "medium",
      due_date: task?.due_date ?? "",
      notes: task?.notes ?? "",
    });
  }, [open, task]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const title = form.title.trim();
    if (title.length < 2) {
      toast.error("اكتب اسم المهمة أولاً");
      return;
    }
    setSaving(true);
    const payload = {
      title,
      subject_id: form.subject_id === NONE ? null : form.subject_id,
      priority: form.priority,
      due_date: form.due_date || null,
      notes: form.notes.trim() || null,
    };
    const { error } = task
      ? await supabase.from("tasks").update(payload).eq("id", task.id)
      : await supabase.from("tasks").insert({ ...payload, user_id: userId });
    setSaving(false);
    if (error) {
      toast.error(friendlyError(error, "لم نتمكن من حفظ المهمة."));
      return;
    }
    toast.success(task ? "تم تحديث المهمة" : "تمت إضافة المهمة");
    void queryClient.invalidateQueries({ queryKey: ["tasks"] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "تعديل المهمة" : "إضافة مهمة"}</DialogTitle>
          <DialogDescription>نظّم مذاكرتك وتسليماتك في مكان واحد.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">اسم المهمة</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="مذاكرة Chapter 3"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>المادة</Label>
              <Select
                value={form.subject_id}
                onValueChange={(v) => setForm((f) => ({ ...f, subject_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختياري" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>بدون مادة</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الأولوية</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm((f) => ({ ...f, priority: v as Priority }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-due">الموعد النهائي</Label>
            <Input
              id="task-due"
              type="date"
              value={form.due_date}
              onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-notes">ملاحظات</Label>
            <Textarea
              id="task-notes"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="اختياري"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />} حفظ المهمة
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
