import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/format";
import type { StudentNote, Subject } from "@/lib/student";
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

export function NoteDialog({
  open,
  onOpenChange,
  userId,
  subjects,
  note,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | undefined;
  subjects: Subject[];
  note?: StudentNote | null | undefined;
}) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", subject_id: NONE, content: "" });

  useEffect(() => {
    if (!open) return;
    setForm({
      title: note?.title ?? "",
      subject_id: note?.subject_id ?? NONE,
      content: note?.content ?? "",
    });
  }, [open, note]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const title = form.title.trim();
    if (title.length < 2) {
      toast.error("اكتب عنوان الملاحظة أولاً");
      return;
    }
    setSaving(true);
    const payload = {
      title,
      content: form.content,
      subject_id: form.subject_id === NONE ? null : form.subject_id,
    };
    const { error } = note
      ? await supabase.from("notes").update(payload).eq("id", note.id)
      : await supabase.from("notes").insert({ ...payload, user_id: userId });
    setSaving(false);
    if (error) {
      toast.error(friendlyError(error, "لم نتمكن من حفظ الملاحظة."));
      return;
    }
    toast.success(note ? "تم تحديث الملاحظة" : "تمت إضافة الملاحظة");
    void queryClient.invalidateQueries({ queryKey: ["notes"] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{note ? "تعديل الملاحظة" : "ملاحظة جديدة"}</DialogTitle>
          <DialogDescription>سجّل ملاحظات المحاضرة بسرعة وبساطة.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">العنوان</Label>
            <Input
              id="note-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="محاضرة 3"
              required
            />
          </div>
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
            <Label htmlFor="note-content">المحتوى</Label>
            <Textarea
              id="note-content"
              rows={9}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="ملاحظات المحاضرة..."
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />} حفظ الملاحظة
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
