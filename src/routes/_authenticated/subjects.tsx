import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookMarked, Hash, Pencil, Plus, Trash2, UserRound, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { friendlyError } from "@/lib/format";
import { subjectsQuery, type Subject } from "@/lib/student";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EmptyState } from "@/components/common/EmptyState";
import { SubjectDialog } from "@/components/student/SubjectDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/subjects")({
  head: () => ({
    meta: [
      { title: "موادي — NEWS" },
      { name: "description", content: "أضف وعدّل موادك الدراسية واربطها بمهامك وملاحظاتك." },
      { property: "og:title", content: "موادي — NEWS" },
      { property: "og:description", content: "إدارة المواد الدراسية داخل منصة NEWS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(subjectsQuery(user?.id));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);

  const subjects = data ?? [];

  const remove = async (id: string) => {
    queryClient.setQueriesData<Subject[]>({ queryKey: ["subjects"] }, (old) =>
      old?.filter((s) => s.id !== id),
    );
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) toast.error(friendlyError(error, "لم نتمكن من حذف المادة."));
    else toast.success("تم حذف المادة");
    void queryClient.invalidateQueries({ queryKey: ["subjects"] });
    void queryClient.invalidateQueries({ queryKey: ["tasks"] });
    void queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  return (
    <main className="container-page py-10">
      <SectionHeading
        eyebrow="مساحتك الدراسية"
        title="موادي"
        description="سجّل المواد اللي بتذاكرها دلوقتي، واربطها بمهامك وملاحظاتك."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="size-4" /> إضافة مادة
          </Button>
        }
      />

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <EmptyState
            icon={BookMarked}
            title="لسه مضفتش مواد"
            description="أضف موادك عشان تقدر تربطها بمهامك وملاحظاتك."
            action={
              <Button
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="size-4" /> إضافة مادة
              </Button>
            }
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => (
              <li
                key={s.id}
                className="surface-card animate-fade-up flex flex-col gap-3 p-5 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-foreground">{s.name}</p>
                    {s.course_code && (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Hash className="size-3" />
                        {s.course_code}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <BookMarked className="size-5" />
                  </span>
                </div>

                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <UserRound className="size-4 text-primary/70" />
                    {s.instructor_name || "بدون دكتور"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="size-4 text-primary/70" />
                    {s.group_number ? `Group ${s.group_number}` : "بدون جروب"}
                  </p>
                </div>

                {s.notes && (
                  <p className="text-xs leading-relaxed text-muted-foreground">{s.notes}</p>
                )}

                <div className="mt-auto flex items-center justify-end gap-1 border-t border-border pt-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="تعديل"
                    onClick={() => {
                      setEditing(s);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="حذف"
                    onClick={() => void remove(s.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SubjectDialog open={open} onOpenChange={setOpen} userId={user?.id} subject={editing} />
    </main>
  );
}
