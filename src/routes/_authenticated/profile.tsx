import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { friendlyError, formatSpecialization } from "@/lib/format";
import { removeFiles, uploadFile, useStorageUrl } from "@/lib/storage";
import { IMAGE_PRESETS, hashFile, optimizeImage, validateImageFile } from "@/lib/image";
import { BATCH_OPTIONS, SPECIALIZATION_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "ملفي الشخصي — NEWS" },
      { name: "description", content: "حدّث بياناتك الدراسية وصورتك الشخصية في مجتمع NEWS." },
      { property: "og:title", content: "ملفي الشخصي — NEWS" },
      { property: "og:description", content: "حدّث بياناتك الدراسية وصورتك الشخصية." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ fullName: "", specialization: "", batch: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const avatar = useStorageUrl("avatars", profile?.avatar_url ?? null);

  useEffect(() => {
    setForm({
      fullName: profile?.full_name ?? "",
      specialization: profile?.specialization ?? "",
      batch: profile?.batch ?? "",
    });
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const fullName = form.fullName.trim();
    if (fullName.length < 3 || fullName.length > 100) {
      toast.error("الاسم لازم يكون بين 3 و100 حرف");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        specialization: form.specialization || null,
        batch: form.batch || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(friendlyError(error));
      return;
    }
    await refreshProfile();
    toast.success("تم تحديث بياناتك ✅");
  };

  const onAvatar = async (file: File | undefined) => {
    if (!file || !user) return;
    const invalid = validateImageFile(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    setUploading(true);
    const previous = profile?.avatar_url ?? null;
    const toastId = toast.loading("جاري تجهيز الصورة...");
    let path: string;
    try {
      const optimized = await optimizeImage(file, { ...IMAGE_PRESETS.avatar, fileName: "avatar" });
      const ext = optimized.file.type === "image/webp" ? "webp" : "jpg";
      const hash = await hashFile(optimized.file);
      // content-hashed path → same photo never uploads twice
      path = await uploadFile("avatars", `${user.id}/avatar-${hash}.${ext}`, optimized.file);
    } catch (err) {
      setUploading(false);
      toast.error(friendlyError(err, "تعذّر رفع الصورة، حاول مرة أخرى"), { id: toastId });
      return;
    }
    const { error } = await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
    setUploading(false);
    if (error) {
      toast.error(friendlyError(error), { id: toastId });
      return;
    }
    if (previous && previous !== path) void removeFiles("avatars", [previous]);
    toast.success("تم تحديث صورتك", { id: toastId });
    await refreshProfile();
  };

  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="text-3xl font-extrabold text-foreground">ملفي الشخصي</h1>
      <p className="mt-2 text-muted-foreground">بياناتك بتظهر في مجتمع NEWS وبتساعدنا نخصّص المحتوى.</p>

      <div className="surface-card mt-8 p-6">
        <div className="mb-8 flex items-center gap-4">
          <span className="inline-flex size-20 items-center justify-center overflow-hidden rounded-full bg-secondary text-2xl font-extrabold text-primary">
            {avatar ? (
              <img src={avatar} alt="صورتي الشخصية" className="size-full object-cover" />
            ) : (
              (profile?.full_name ?? "؟").charAt(0)
            )}
          </span>
          <div>
            <Label
              htmlFor="avatar"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-input bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              تغيير الصورة
            </Label>
            <input
              id="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => void onAvatar(e.target.files?.[0])}
            />
            <p className="mt-2 text-xs text-muted-foreground">PNG أو JPG حتى 3 ميجا.</p>
          </div>
        </div>

        <form onSubmit={save} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم بالكامل</Label>
            <Input
              id="name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <Input value={profile?.email ?? user?.email ?? ""} disabled />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>التخصص</Label>
              <Select
                value={form.specialization}
                onValueChange={(v) => setForm({ ...form, specialization: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التخصص" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATION_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {formatSpecialization(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الدفعة</Label>
              <Select value={form.batch} onValueChange={(v) => setForm({ ...form, batch: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدفعة" />
                </SelectTrigger>
                <SelectContent>
                  {BATCH_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            حفظ التغييرات
          </Button>
        </form>
      </div>
    </div>
  );
}
