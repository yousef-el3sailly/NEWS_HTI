import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  Eye,
  ImagePlus,
  LayoutDashboard,
  Loader2,
  Newspaper,
  Pencil,
  Plus,
  Megaphone,
  Settings,
  ShieldAlert,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { friendlyError, formatArabicDate, formatSpecialization } from "@/lib/format";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { removeFiles, thumbPath, uploadFile, useStorageUrl } from "@/lib/storage";
import {
  IMAGE_PRESETS,
  formatBytes,
  hashFile,
  optimizeImage,
  validateImageFile,
} from "@/lib/image";
import { Logo } from "@/components/brand/Logo";
import { EmptyState } from "@/components/common/EmptyState";
import { AnnouncementsPanel } from "@/components/admin/AnnouncementsPanel";
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم — NEWS" },
      { name: "description", content: "إدارة الأخبار والمستخدمين في منصة NEWS." },
      { property: "og:title", content: "لوحة التحكم — NEWS" },
      { property: "og:description", content: "إدارة الأخبار والمستخدمين في منصة NEWS." },
    ],
  }),
  component: AdminPage,
});

type AdminNews = {
  id: string;
  title: string;
  description: string;
  content: string | null;
  image_url: string | null;
  external_url: string | null;
  category: string;
  is_published: boolean;
  published_at: string;
};

const NEWS_SELECT =
  "id, title, description, content, image_url, external_url, category, is_published, published_at";

const EMPTY = {
  id: null as string | null,
  title: "",
  description: "",
  content: "",
  category: NEWS_CATEGORIES[0] as string,
  external_url: "",
  image_url: null as string | null,
  is_published: true,
  published_at: "",
};

type FormState = typeof EMPTY;

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "news", label: "الأخبار", icon: Newspaper },
  { id: "announcements", label: "الإعلانات", icon: Megaphone },
  { id: "users", label: "المستخدمون", icon: Users },
  { id: "settings", label: "الإعدادات", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AdminPage() {
  const { isAdmin, loading, profile, user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabId>("overview");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMeta, setImageMeta] = useState<{ original: number; optimized: number } | null>(null);
  const [replacedImage, setReplacedImage] = useState<string | null>(null);
  const previewImage = useStorageUrl("news-images", form.image_url);

  const newsQuery = useQuery({
    queryKey: ["news", "admin"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select(NEWS_SELECT)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdminNews[];
    },
  });

  const statsQuery = useQuery({
    queryKey: ["admin", "stats"],
    enabled: isAdmin,
    queryFn: async () => {
      const [users, schedules] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("schedules").select("id", { count: "exact", head: true }),
      ]);
      return { users: users.count ?? 0, schedules: schedules.count ?? 0 };
    },
  });

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    enabled: isAdmin && tab === "users",
    queryFn: async () => {
      const [{ data: profiles, error }, { data: roles }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email, specialization, batch, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (error) throw error;
      const adminIds = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));
      return (profiles ?? []).map((p) => ({ ...p, isAdmin: adminIds.has(p.id) }));
    },
  });

  if (loading) {
    return (
      <div className="container-page py-16">
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-page max-w-lg py-24 text-center">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <ShieldAlert className="size-6" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">صفحة للمشرفين فقط</h1>
        <p className="mt-2 text-muted-foreground">حسابك لا يملك صلاحية الدخول للوحة التحكم.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <ArrowRight className="size-4" /> الرئيسية
        </Link>
      </div>
    );
  }

  const news = newsQuery.data ?? [];
  const publishedCount = news.filter((n) => n.is_published).length;

  const resetForm = () => setForm(EMPTY);

  const pickImage = async (file: File) => {
    const invalid = validateImageFile(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    setUploading(true);
    const toastId = toast.loading("جاري تجهيز الصورة...");
    try {
      // resize → compress → WebP, then upload a small card rendition too
      const full = await optimizeImage(file, { ...IMAGE_PRESETS.news, fileName: "news" });
      const thumb = await optimizeImage(file, { ...IMAGE_PRESETS.newsThumb, fileName: "news" });
      const hash = await hashFile(full.file);
      const ext = full.file.type === "image/webp" ? "webp" : "jpg";
      const path = `news/${hash}.${ext}`;
      await uploadFile("news-images", path, full.file);
      await uploadFile("news-images", thumbPath(path)!, thumb.file);
      if (form.image_url && form.image_url !== path) setReplacedImage(form.image_url);
      setForm((f) => ({ ...f, image_url: path }));
      setImageMeta({ original: full.originalSize, optimized: full.optimizedSize });
      toast.success("تم رفع الصورة بنجاح", { id: toastId });
    } catch (err) {
      toast.error(friendlyError(err, "تعذّر رفع الصورة، حاول مرة أخرى"), { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const cleanupImage = (path: string | null) =>
    removeFiles("news-images", [path, thumbPath(path)]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    if (title.length < 3 || title.length > 150) {
      toast.error("العنوان لازم يكون بين 3 و150 حرف");
      return;
    }
    if (description.length < 10 || description.length > 5000) {
      toast.error("التفاصيل قصيرة جداً");
      return;
    }
    setBusy(true);
    const payload = {
      title,
      description,
      content: form.content.trim() || null,
      category: form.category,
      external_url: form.external_url.trim() || null,
      image_url: form.image_url,
      is_published: form.is_published,
      ...(form.published_at ? { published_at: new Date(form.published_at).toISOString() } : {}),
    };

    const { error } = form.id
      ? await supabase.from("news").update(payload).eq("id", form.id)
      : await supabase.from("news").insert(payload);
    setBusy(false);
    if (error) {
      toast.error(friendlyError(error));
      return;
    }
    if (replacedImage && replacedImage !== form.image_url) {
      void cleanupImage(replacedImage);
      setReplacedImage(null);
    }
    resetForm();
    setImageMeta(null);
    await queryClient.invalidateQueries({ queryKey: ["news"] });
    toast.success(form.id ? "تم تحديث الخبر ✅" : "تم حفظ الخبر ✅");
  };

  const startEdit = (item: AdminNews) => {
    setTab("news");
    setImageMeta(null);
    setReplacedImage(null);
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      content: item.content ?? "",
      category: item.category,
      external_url: item.external_url ?? "",
      image_url: item.image_url,
      is_published: item.is_published,
      published_at: item.published_at.slice(0, 10),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePublish = async (item: AdminNews) => {
    const { error } = await supabase
      .from("news")
      .update({ is_published: !item.is_published })
      .eq("id", item.id);
    if (error) {
      toast.error(friendlyError(error));
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["news"] });
  };

  const remove = async (item: AdminNews) => {
    const { error } = await supabase.from("news").delete().eq("id", item.id);
    if (error) {
      toast.error(friendlyError(error));
      return;
    }
    void cleanupImage(item.image_url);
    if (form.id === item.id) resetForm();
    await queryClient.invalidateQueries({ queryKey: ["news"] });
    toast.success("تم حذف الخبر");
  };

  const stats = [
    { label: "إجمالي المستخدمين", value: statsQuery.data?.users, icon: Users },
    { label: "إجمالي الأخبار", value: news.length, icon: Newspaper },
    { label: "الأخبار المنشورة", value: publishedCount, icon: CheckCircle2 },
    { label: "الجداول الدراسية", value: statsQuery.data?.schedules, icon: CalendarRange },
  ];

  return (
    <div className="container-page py-8 lg:py-12">
      <header className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Logo size={44} withText={false} />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold text-foreground sm:text-3xl">
              لوحة التحكم
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              أهلاً {profile?.full_name || "مشرف NEWS"}
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-input bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
        >
          <ArrowRight className="size-4" /> الموقع
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* SIDEBAR */}
        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:h-fit lg:flex-col lg:overflow-visible lg:rounded-2xl lg:border lg:border-sidebar-border lg:bg-sidebar lg:p-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors lg:w-full lg:border-transparent lg:bg-transparent lg:text-sidebar-foreground/80",
                tab === t.id
                  ? "border-primary bg-primary text-primary-foreground lg:border-transparent lg:bg-sidebar-accent lg:text-sidebar-foreground"
                  : "hover:bg-secondary lg:hover:bg-sidebar-accent/60",
              )}
            >
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 space-y-8">
          {tab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="surface-card p-5">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      <s.icon className="size-5" />
                    </span>
                    <p className="mt-4 text-3xl font-extrabold text-foreground">
                      {s.value ?? <span className="text-lg text-muted-foreground">—</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="surface-card p-6">
                <h2 className="mb-4 text-lg font-bold text-foreground">آخر الأخبار المضافة</h2>
                {newsQuery.isLoading ? (
                  <Skeleton className="h-24 w-full rounded-xl" />
                ) : news.length === 0 ? (
                  <p className="text-sm text-muted-foreground">لا توجد أخبار بعد.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {news.slice(0, 5).map((n) => (
                      <li key={n.id} className="flex items-center justify-between gap-3 py-3">
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                          {n.title}
                        </span>
                        <Badge variant={n.is_published ? "default" : "outline"}>
                          {n.is_published ? "منشور" : "مسودة"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {tab === "news" && (
            <div className="grid gap-8 xl:grid-cols-[minmax(0,400px)_1fr]">
              <form onSubmit={submit} className="surface-card h-fit space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">
                    {form.id ? "تعديل الخبر" : "إضافة خبر جديد"}
                  </h2>
                  {form.id && (
                    <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                      <X className="size-4" /> إلغاء
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">العنوان</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    maxLength={150}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">الوصف المختصر</Label>
                  <Textarea
                    id="desc"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    maxLength={5000}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">المحتوى الكامل (اختياري)</Label>
                  <Textarea
                    id="content"
                    rows={6}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    maxLength={20000}
                  />
                </div>

                <div className="space-y-2">
                  <Label>صورة الخبر</Label>
                  <div className="flex items-center gap-3">
                    <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
                      {previewImage ? (
                        <img src={previewImage} alt="معاينة" className="size-full object-cover" />
                      ) : (
                        <span className="flex size-full items-center justify-center text-muted-foreground">
                          <ImagePlus className="size-5" />
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-input bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary">
                        {uploading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <ImagePlus className="size-4" />
                        )}
                        رفع صورة
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void pickImage(f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {imageMeta && (
                        <p className="text-[11px] leading-5 text-muted-foreground">
                          الأصلية: {formatBytes(imageMeta.original)}
                          <br />
                          بعد الضغط: {formatBytes(imageMeta.optimized)}
                        </p>
                      )}
                      {form.image_url && (
                        <button
                          type="button"
                          onClick={() => {
                            setReplacedImage(form.image_url);
                            setImageMeta(null);
                            setForm({ ...form, image_url: null });
                          }}
                          className="text-xs font-semibold text-destructive"
                        >
                          إزالة الصورة
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>التصنيف</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NEWS_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">تاريخ النشر</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.published_at}
                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">رابط خارجي (اختياري)</Label>
                  <Input
                    id="url"
                    type="url"
                    value={form.external_url}
                    onChange={(e) => setForm({ ...form, external_url: e.target.value })}
                    maxLength={500}
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                  <Label htmlFor="pub">منشور</Label>
                  <Switch
                    id="pub"
                    checked={form.is_published}
                    onCheckedChange={(v) => setForm({ ...form, is_published: v })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={busy || uploading}>
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                  {form.id ? "حفظ التعديلات" : "إضافة"}
                </Button>
              </form>

              <div className="space-y-3">
                {newsQuery.isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-2xl" />
                  ))
                ) : news.length === 0 ? (
                  <EmptyState
                    icon={Newspaper}
                    title="لا توجد أخبار بعد"
                    description="ابدأ بإضافة أول خبر من النموذج بجانبك."
                  />
                ) : (
                  news.map((item) => (
                    <div
                      key={item.id}
                      className="surface-card flex flex-wrap items-center justify-between gap-3 p-5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{item.category}</Badge>
                          {!item.is_published && <Badge variant="outline">مسودة</Badge>}
                        </div>
                        <h3 className="mt-2 truncate font-bold text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {formatArabicDate(item.published_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/news/$id" params={{ id: item.id }}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => togglePublish(item)}>
                          {item.is_published ? "إخفاء" : "نشر"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => remove(item)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === "announcements" && <AnnouncementsPanel userId={user?.id} />}

          {tab === "users" && (
            <div className="surface-card overflow-hidden">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-bold text-foreground">المستخدمون</h2>
                <p className="text-sm text-muted-foreground">
                  كل الحسابات المسجلة في منصة NEWS.
                </p>
              </div>
              {usersQuery.isLoading ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-xl" />
                  ))}
                </div>
              ) : (usersQuery.data?.length ?? 0) === 0 ? (
                <div className="p-10 text-center text-muted-foreground">لا يوجد مستخدمون بعد.</div>
              ) : (
                <ul className="divide-y divide-border">
                  {usersQuery.data?.map((u) => (
                    <li key={u.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-primary">
                        {(u.full_name || u.email || "؟").charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-foreground">
                          {u.full_name || "بدون اسم"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {u.specialization && (
                          <span className="rounded-full bg-secondary px-3 py-1">
                            {formatSpecialization(u.specialization)}
                          </span>
                        )}
                        {u.batch && (
                          <span className="rounded-full bg-secondary px-3 py-1">
                            دفعة {u.batch}
                          </span>
                        )}
                        <Badge variant={u.isAdmin ? "default" : "outline"}>
                          {u.isAdmin ? "مشرف" : "طالب"}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "settings" && (
            <div className="surface-card space-y-4 p-6">
              <h2 className="text-lg font-bold text-foreground">الإعدادات</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                صلاحيات المشرفين تُدار من قاعدة بيانات المنصة عبر جدول الأدوار، ولا يمكن تعديلها من
                هنا حفاظاً على الأمان.
              </p>
              <div className="rounded-xl bg-secondary px-4 py-3 text-sm text-foreground/80">
                حسابك الحالي: <span className="font-bold">{profile?.email}</span> — صلاحية مشرف.
              </div>
              <Button asChild variant="outline">
                <Link to="/profile">تعديل ملفك الشخصي</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
