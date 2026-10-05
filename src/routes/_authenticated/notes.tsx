import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NotebookPen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { friendlyError, formatArabicDate } from "@/lib/format";
import { notesQuery, subjectsQuery, type StudentNote } from "@/lib/student";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EmptyState } from "@/components/common/EmptyState";
import { NoteDialog } from "@/components/student/NoteDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/notes")({
  head: () => ({
    meta: [
      { title: "ملاحظاتي — NEWS" },
      { name: "description", content: "دوّن ملاحظات محاضراتك واربطها بموادك الدراسية." },
      { property: "og:title", content: "ملاحظاتي — NEWS" },
      { property: "og:description", content: "ملاحظات المحاضرات داخل منصة NEWS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const notes = useQuery(notesQuery(user?.id));
  const subjectsData = useQuery(subjectsQuery(user?.id));
  const subjects = subjectsData.data ?? [];
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StudentNote | null>(null);

  const filtered = useMemo(() => {
    const list = notes.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((n) => {
      const subject = subjects.find((s) => s.id === n.subject_id)?.name ?? "";
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        subject.toLowerCase().includes(q)
      );
    });
  }, [notes.data, search, subjects]);

  const remove = async (id: string) => {
    queryClient.setQueriesData<StudentNote[]>({ queryKey: ["notes"] }, (old) =>
      old?.filter((n) => n.id !== id),
    );
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) toast.error(friendlyError(error, "لم نتمكن من حذف الملاحظة."));
    else toast.success("تم حذف الملاحظة");
    void queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  return (
    <main className="container-page py-10">
      <SectionHeading
        eyebrow="مساحتك الدراسية"
        title="ملاحظاتي"
        description="سجّل ملاحظات المحاضرات بسرعة، وابحث فيها وقت المذاكرة."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="size-4" /> ملاحظة جديدة
          </Button>
        }
      />

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث في ملاحظاتك..."
          className="pr-10"
          aria-label="ابحث في ملاحظاتك"
        />
      </div>

      {notes.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title={search ? "مفيش نتائج للبحث" : "لم تقم بإنشاء أي ملاحظات بعد."}
          description={
            search ? "جرّب كلمة تانية." : "ابدأ بتدوين ملاحظات محاضراتك واربطها بموادك."
          }
          action={
            !search && (
              <Button
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="size-4" /> ملاحظة جديدة
              </Button>
            )
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n) => {
            const subject = subjects.find((s) => s.id === n.subject_id);
            return (
              <li
                key={n.id}
                className="surface-card animate-fade-up flex flex-col gap-3 p-5 transition-transform hover:-translate-y-0.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-foreground">{n.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {subject ? `${subject.name} · ` : ""}
                    {formatArabicDate(n.updated_at)}
                  </p>
                </div>
                <p className="line-clamp-5 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                  {n.content || "بدون محتوى"}
                </p>
                <div className="mt-auto flex items-center justify-end gap-1 border-t border-border pt-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="تعديل"
                    onClick={() => {
                      setEditing(n);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="حذف"
                    onClick={() => void remove(n.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <NoteDialog
        open={open}
        onOpenChange={setOpen}
        userId={user?.id}
        subjects={subjects}
        note={editing}
      />
    </main>
  );
}
