import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Megaphone, Pencil, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError, formatArabicDate } from "@/lib/format";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Announcement = {
  id: string;
  title: string;
  message: string;
  priority: string;
  external_url: string | null;
  is_published: boolean;
  published_at: string;
};

const SELECT = "id, title, message, priority, external_url, is_published, published_at";

const PRIORITY_LABELS: Record<string, string> = {
  normal: "عادي",
  important: "مهم",
  urgent: "عاجل",
};

const EMPTY = {
  id: null as string | null,
  title: "",
  message: "",
  priority: "normal",
  external_url: "",
  is_published: true,
  published_at: "",
};

export function AnnouncementsPanel({ userId }: { userId: string | undefined }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["announcements", "admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select(SELECT)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Announcement[];
    },
  });

  const items = data ?? [];
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["announcements"] });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    if (title.length < 3) {
      toast.error("اكتب عنوان الإعلان");
      return;
    }
    setBusy(true);
    const payload = {
      title,
      message: form.message.trim(),
      priority: form.priority,
      external_url: form.external_url.trim() || null,
      is_published: form.is_published,
      ...(form.published_at ? { published_at: new Date(form.published_at).toISOString() } : {}),
    };
    const { error } = form.id
      ? await supabase.from("announcements").update(payload).eq("id", form.id)
      : await supabase.from("announcements").insert({ ...payload, created_by: userId ?? null });
    setBusy(false);
    if (error) {
      toast.error(friendlyError(error, "لم نتمكن من حفظ الإعلان."));
      return;
    }
    toast.success(form.id ? "تم تحديث الإعلان" : "تم إنشاء الإعلان");
    setForm(EMPTY);
    void refresh();
  };

  const togglePublish = async (a: Announcement) => {
    const { error } = await supabase
      .from("announcements")
      .update({ is_published: !a.is_published })
      .eq("id", a.id);
    if (error) toast.error(friendlyError(error, "لم نتمكن من تحديث الإعلان."));
    void refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) toast.error(friendlyError(error, "لم نتمكن من حذف الإعلان."));
    else toast.success("تم حذف الإعلان");
    void refresh();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <form onSubmit={submit} className="surface-card h-fit space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-foreground">
            {form.id ? "تعديل إعلان" : "إعلان جديد"}
          </h3>
          {form.id && (
            <Button type="button" variant="ghost" size="icon" onClick={() => setForm(EMPTY)}>
              <X className="size-4" />
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ann-title">العنوان</Label>
          <Input
            id="ann-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ann-message">الرسالة</Label>
          <Textarea
            id="ann-message"
            rows={4}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>الأولوية</Label>
          <Select
            value={form.priority}
            onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ann-url">رابط خارجي</Label>
          <Input
            id="ann-url"
            type="url"
            value={form.external_url}
            onChange={(e) => setForm((f) => ({ ...f, external_url: e.target.value }))}
            placeholder="اختياري"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ann-date">تاريخ النشر</Label>
          <Input
            id="ann-date"
            type="date"
            value={form.published_at}
            onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
          <Label htmlFor="ann-pub" className="text-sm">
            منشور
          </Label>
          <Switch
            id="ann-pub"
            checked={form.is_published}
            onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))}
          />
        </div>

        <Button type="submit" disabled={busy} className="w-full gap-2">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          {form.id ? "حفظ التعديلات" : "نشر الإعلان"}
        </Button>
      </form>

      <div>
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="لا توجد إعلانات بعد"
            description="أنشئ إعلاناً مهماً وسيصل كإشعار لكل الطلاب."
          />
        ) : (
          <ul className="space-y-3">
            {items.map((a) => (
              <li key={a.id} className="surface-card animate-fade-up p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{a.title}</p>
                      <Badge variant="secondary">
                        {PRIORITY_LABELS[a.priority] ?? a.priority}
                      </Badge>
                      {!a.is_published && <Badge variant="outline">مسودة</Badge>}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.message}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {formatArabicDate(a.published_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void togglePublish(a)}
                      className="text-xs"
                    >
                      {a.is_published ? "إلغاء النشر" : "نشر"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="تعديل"
                      onClick={() =>
                        setForm({
                          id: a.id,
                          title: a.title,
                          message: a.message,
                          priority: a.priority,
                          external_url: a.external_url ?? "",
                          is_published: a.is_published,
                          published_at: a.published_at.slice(0, 10),
                        })
                      }
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="حذف"
                      onClick={() => void remove(a.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
