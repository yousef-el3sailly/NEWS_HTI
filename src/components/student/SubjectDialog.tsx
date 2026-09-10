import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/format";
import type { Subject } from "@/lib/student";
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

export function SubjectDialog({
  open,
  onOpenChange,
  userId,
  subject,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | undefined;
  subject?: Subject | null | undefined;
}) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    instructor_name: "",
    group_number: "",
    course_code: "",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      name: subject?.name ?? "",
      instructor_name: subject?.instructor_name ?? "",
      group_number: subject?.group_number ?? "",
      course_code: subject?.course_code ?? "",
      notes: subject?.notes ?? "",
    });
  }, [open, subject]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const name = form.name.trim();
    if (name.length < 2) {
      toast.error("اكتب اسم المادة أولاً");
      return;
    }
    setSaving(true);
    const payload = {
      name,
      instructor_name: form.instructor_name.trim() || null,
      group_number: form.group_number.trim() || null,
      course_code: form.course_code.trim() || null,
      notes: form.notes.trim() || null,
    };
    const { error } = subject
      ? await supabase.from("subjects").update(payload).eq("id", subject.id)
      : await supabase.from("subjects").insert({ ...payload, user_id: userId });
    setSaving(false);
    if (error) {
      toast.error(friendlyError(error, "لم نتمكن من حفظ المادة."));
      return;
    }
    toast.success(subject ? "تم تحديث المادة" : "تمت إضافة المادة");
    void queryClient.invalidateQueries({ queryKey: ["subjects"] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{subject ? "تعديل المادة" : "إضافة مادة"}</DialogTitle>
          <DialogDescription>موادك بتربط مهامك وملاحظاتك ببعض.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject-name">اسم المادة</Label>
            <Input
              id="subject-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="إدارة مالية"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject-doctor">الدكتور</Label>
              <Input
                id="subject-doctor"
                value={form.instructor_name}
                onChange={(e) => setForm((f) => ({ ...f, instructor_name: e.target.value }))}
                placeholder="د. أحمد محمد"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-group">الجروب</Label>
              <Input
                id="subject-group"
                value={form.group_number}
                onChange={(e) => setForm((f) => ({ ...f, group_number: e.target.value }))}
                placeholder="3"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject-code">كود المادة</Label>
            <Input
              id="subject-code"
              value={form.course_code}
              onChange={(e) => setForm((f) => ({ ...f, course_code: e.target.value }))}
              placeholder="اختياري — BIS301"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject-notes">ملاحظات</Label>
            <Textarea
              id="subject-notes"
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
              {saving && <Loader2 className="size-4 animate-spin" />} حفظ المادة
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
