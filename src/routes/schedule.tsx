import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, FileImage, Loader2, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { friendlyError } from "@/lib/format";
import { DAYS, DISABLED_DAY, MAX_SUBJECTS_PER_DAY, TIME_SLOTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ExportSheet } from "@/components/schedule/ExportSheet";


export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "الجدول الدراسي — NEWS" },
      {
        name: "description",
        content: "ابنِ جدولك الدراسي بـ10 محاضرات يومياً، واحفظه أو صدّره كصورة أو PDF.",
      },
      { property: "og:title", content: "الجدول الدراسي — NEWS" },
      { property: "og:description", content: "منشئ الجدول الدراسي لطلاب HTI." },
    ],
  }),
  component: SchedulePage,
});

type Entry = {
  id: string;
  day: number;
  slot: number;
  subject_name: string;
  instructor_name: string | null;
  group_number: string | null;
  room: string | null;
  notes: string | null;
};

const LOCAL_KEY = "news-schedule-guest";

/** Periods 9 and 10 (0-indexed 8, 9) are permanently locked. */
const LOCKED_SLOTS = [8, 9];
const isLockedSlot = (slot: number) => LOCKED_SLOTS.includes(slot);
/** Block 0 = periods 1-4, block 1 = periods 5-8. */
const blockOf = (slot: number) => (slot < 4 ? 0 : 1);
const slotsOfBlock = (block: number) => (block === 0 ? [0, 1, 2, 3] : [4, 5, 6, 7]);

function SchedulePage() {
  const { user, profile, loading } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [target, setTarget] = useState<{ day: number; slot: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);


  // Load
  useEffect(() => {
    if (loading) return;
    if (!user) {
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        setEntries(raw ? (JSON.parse(raw) as Entry[]) : []);
      } catch {
        setEntries([]);
      }
      return;
    }
    void (async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select("id, day, slot, subject_name, instructor_name, group_number, room, notes")
        .eq("user_id", user.id);
      if (error) {
        toast.error(friendlyError(error, "تعذّر تحميل جدولك."));
        return;
      }
      setEntries((data ?? []) as Entry[]);
    })();
  }, [user, loading]);

  const persistLocal = useCallback((next: Entry[]) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  }, []);

  const byCell = useMemo(() => {
    const map = new Map<string, Entry>();
    for (const e of entries) map.set(`${e.day}-${e.slot}`, e);
    return map;
  }, [entries]);

  /** Number of distinct subject blocks (1-4 / 5-8) used on a day. */
  const countForDay = useCallback(
    (day: number) => {
      const blocks = new Set<number>();
      for (const e of entries) {
        if (e.day === day && !isLockedSlot(e.slot)) blocks.add(blockOf(e.slot));
      }
      return blocks.size;
    },
    [entries],
  );

  const openCell = (day: number, slot: number) => {
    if (day === DISABLED_DAY) {
      toast.info("يوم الخميس إجازة — لا يمكن إضافة محاضرات فيه.");
      return;
    }
    if (isLockedSlot(slot)) {
      toast.info("المحاضرتان 9 و10 غير متاحتين.");
      return;
    }
    if (!byCell.has(`${day}-${slot}`) && countForDay(day) >= MAX_SUBJECTS_PER_DAY) {
      toast.error(`الحد الأقصى ${MAX_SUBJECTS_PER_DAY} مواد في اليوم الواحد.`);
      return;
    }
    setTarget({ day, slot });
  };

  const saveEntry = async (values: Omit<Entry, "id" | "day" | "slot">) => {
    if (!target) return;
    const key = `${target.day}-${target.slot}`;
    const existing = byCell.get(key);
    setBusy(true);

    // First subject of an empty block auto-fills its four periods (1-4 or 5-8).
    const blockSlots = slotsOfBlock(blockOf(target.slot));
    const blockEmpty = blockSlots.every((s) => !byCell.has(`${target.day}-${s}`));
    const targetSlots = !existing && blockEmpty ? blockSlots : [target.slot];

    if (!user) {
      const next = existing
        ? entries.map((e) => (e.id === existing.id ? { ...e, ...values } : e))
        : [
            ...entries,
            ...targetSlots.map((slot) => ({
              id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              day: target.day,
              slot,
              ...values,
            })),
          ];
      setEntries(next);
      persistLocal(next);
      setBusy(false);
      setTarget(null);
      toast.success("تم الحفظ محلياً — سجّل الدخول لحفظه في حسابك.");
      return;
    }

    if (existing) {
      const { error } = await supabase.from("schedules").update(values).eq("id", existing.id);
      setBusy(false);
      if (error) {
        toast.error(friendlyError(error));
        return;
      }
      setEntries(entries.map((e) => (e.id === existing.id ? { ...e, ...values } : e)));
    } else {
      const { data, error } = await supabase
        .from("schedules")
        .insert(
          targetSlots.map((slot) => ({ ...values, day: target.day, slot, user_id: user.id })),
        )
        .select("id, day, slot, subject_name, instructor_name, group_number, room, notes");
      setBusy(false);
      if (error) {
        toast.error(friendlyError(error));
        return;
      }
      setEntries([...entries, ...((data ?? []) as Entry[])]);
    }
    setTarget(null);
    toast.success("تم حفظ المادة في جدولك ✅");
  };

  const removeEntry = async (entry: Entry) => {
    if (!user) {
      const next = entries.filter((e) => e.id !== entry.id);
      setEntries(next);
      persistLocal(next);
      setTarget(null);
      return;
    }
    const { error } = await supabase.from("schedules").delete().eq("id", entry.id);
    if (error) {
      toast.error(friendlyError(error));
      return;
    }
    setEntries(entries.filter((e) => e.id !== entry.id));
    setTarget(null);
    toast.success("تم حذف المادة");
  };

  const exportAs = async (kind: "png" | "pdf") => {
    if (!sheetRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(sheetRef.current, {
        backgroundColor: "#FBF6EC",
        scale: 2,
      });
      if (kind === "png") {
        const link = document.createElement("a");
        link.download = "news-schedule.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const ratio = Math.min((pageW - 40) / canvas.width, (pageH - 40) / canvas.height);
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          (pageW - canvas.width * ratio) / 2,
          20,
          canvas.width * ratio,
          canvas.height * ratio,
        );
        pdf.save("news-schedule.pdf");
      }
      toast.success("تم تصدير الجدول");
    } catch {
      toast.error("تعذّر تصدير الجدول، حاول تاني.");
    } finally {
      setExporting(false);
    }
  };


  const current = target ? (byCell.get(`${target.day}-${target.slot}`) ?? null) : null;

  return (
    <div className="container-page py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-bold text-primary-soft">STUDY SCHEDULE</p>
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">جدولك الدراسي</h1>
          <p className="mt-3 text-muted-foreground">
            اضغط على أي خانة لإضافة مادة. الحد الأقصى {MAX_SUBJECTS_PER_DAY} مواد في اليوم، والخميس
            إجازة.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportAs("png")} disabled={exporting}>
            {exporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileImage className="size-4" />
            )}
            صورة
          </Button>
          <Button onClick={() => exportAs("pdf")} disabled={exporting}>
            <Download className="size-4" /> PDF
          </Button>
        </div>
      </header>

      {!user && !loading && (
        <div className="mb-6 rounded-xl border border-border bg-secondary px-5 py-4 text-sm text-foreground/80">
          أنت تعدّل الجدول محلياً على هذا الجهاز.{" "}
          <Link to="/auth" className="font-bold text-primary underline-offset-4 hover:underline">
            سجّل الدخول
          </Link>{" "}
          علشان يتحفظ في حسابك ويفضل معاك على أي جهاز.
        </div>
      )}

      {/* Mobile: day-by-day layout */}
      <div className="space-y-4 lg:hidden">
        {DAYS.map((label, day) => {
          const off = day === DISABLED_DAY;
          const dayEntries = TIME_SLOTS.map((time, slot) => ({
            time,
            slot,
            entry: byCell.get(`${day}-${slot}`),
          }));
          return (
            <section
              key={label}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div
                className={cn(
                  "flex items-center justify-between px-4 py-3",
                  off ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground",
                )}
              >
                <h2 className="text-sm font-extrabold">{label}</h2>
                <span className="text-[11px] font-semibold opacity-90">
                  {off ? "إجازة" : `${countForDay(day)} / ${MAX_SUBJECTS_PER_DAY} مواد`}
                </span>
              </div>
              {off ? (
                <p className="px-4 py-5 text-center text-xs text-muted-foreground">
                  لا محاضرات يوم الخميس.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {dayEntries.map(({ time, slot, entry }) => (
                    <li key={time}>
                      <button
                        type="button"
                        onClick={() => openCell(day, slot)}
                        disabled={isLockedSlot(slot)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-3 text-start transition-colors",
                          isLockedSlot(slot)
                            ? "cursor-not-allowed bg-muted/50"
                            : "hover:bg-secondary",
                        )}
                      >
                        <span className="flex w-16 shrink-0 flex-col">
                          <span className="text-xs font-bold text-primary">{slot + 1}</span>
                          <span className="text-[10px] text-muted-foreground">{time}</span>
                        </span>
                        <span className="min-w-0 flex-1">
                          {isLockedSlot(slot) ? (
                            <span className="text-xs text-muted-foreground/70">غير متاحة</span>
                          ) : entry ? (
                            <>
                              <span className="block truncate text-sm font-bold text-foreground">
                                {entry.subject_name}
                              </span>
                              <span className="block truncate text-[11px] text-muted-foreground">
  {[
    entry.instructor_name,
    entry.group_number ? `جروب ${entry.group_number}` : null,
    entry.room ? `📍 ${entry.room}` : null,
  ]
    .filter(Boolean)
    .join(" · ")}
</span>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground/70">إضافة مادة</span>
                          )}
                        </span>
                        {!isLockedSlot(slot) && (
                          <Plus className="size-4 shrink-0 text-muted-foreground/60" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Desktop: full weekly grid */}
      <div className="hidden overflow-x-auto pb-2 lg:block">
        <div ref={gridRef} className="min-w-[900px] rounded-2xl border border-border bg-card p-3">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `120px repeat(${DAYS.length}, minmax(0, 1fr))` }}
          >
            <div className="rounded-lg bg-primary px-2 py-3 text-center text-xs font-bold text-primary-foreground">
              المحاضرة
            </div>
            {DAYS.map((d, i) => (
              <div
                key={d}
                className={cn(
                  "rounded-lg px-2 py-3 text-center text-sm font-bold",
                  i === DISABLED_DAY
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {d}
                {i === DISABLED_DAY && <span className="block text-[10px]">إجازة</span>}
              </div>
            ))}

            {TIME_SLOTS.map((time, slot) => (
              <FragmentRow
                key={time}
                time={time}
                slot={slot}
                byCell={byCell}
                onOpen={openCell}
              />
            ))}
          </div>
        </div>
      </div>


      <EntryDialog
        open={Boolean(target)}
        entry={current}
        busy={busy}
        dayLabel={target ? (DAYS[target.day] ?? "") : ""}
        timeLabel={target ? (TIME_SLOTS[target.slot] ?? "") : ""}
        onClose={() => setTarget(null)}
        onSave={saveEntry}
        onDelete={current ? () => removeEntry(current) : undefined}
      />

      {/* Off-screen printable version used for PNG/PDF export */}
      <div aria-hidden className="pointer-events-none fixed -start-[9999px] top-0 opacity-0">
        <ExportSheet
          ref={sheetRef}
          entries={entries}
          studentName={profile?.full_name || "طالب HTI"}
          specialization={profile?.specialization || ""}
          batch={profile?.batch || ""}
        />
      </div>
    </div>

  );
}

function FragmentRow({
  time,
  slot,
  byCell,
  onOpen,
}: {
  time: string;
  slot: number;
  byCell: Map<string, Entry>;
  onOpen: (day: number, slot: number) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center rounded-lg bg-secondary px-2 py-3 text-center">
        <span className="text-xs font-bold text-primary">{slot + 1}</span>
        <span className="text-[10px] text-muted-foreground">{time}</span>
      </div>
      {DAYS.map((_, day) => {
        const entry = byCell.get(`${day}-${slot}`);
        const disabled = day === DISABLED_DAY || isLockedSlot(slot);
        return (
          <button
            key={day}
            type="button"
            onClick={() => onOpen(day, slot)}
            disabled={disabled}
            className={cn(
              "min-h-[64px] rounded-lg border p-2 text-start text-xs transition-colors",
              disabled
                ? "cursor-not-allowed border-dashed border-border bg-muted/50"
                : entry
                  ? "border-primary/30 bg-primary/10 hover:bg-primary/15"
                  : "border-dashed border-border bg-background hover:bg-secondary",
            )}
          >
            {entry ? (
              <span className="block space-y-0.5">
                <span className="block font-bold text-primary">{entry.subject_name}</span>
                {entry.instructor_name && (
                  <span className="block text-muted-foreground">{entry.instructor_name}</span>
                )}
                {entry.group_number && (
                  <span className="block text-muted-foreground">جروب {entry.group_number}</span>
                )}
                {entry.room && (
  <span className="block text-muted-foreground">📍 {entry.room}</span>
)}
              </span>
            ) : disabled ? null : (
              <span className="flex h-full items-center justify-center text-muted-foreground/60">
                <Plus className="size-4" />
              </span>
            )}
          </button>
        );
      })}
    </>
  );
}

function EntryDialog({
  open,
  entry,
  busy,
  dayLabel,
  timeLabel,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  entry: Entry | null;
  busy: boolean;
  dayLabel: string;
  timeLabel: string;
  onClose: () => void;
  onSave: (v: Omit<Entry, "id" | "day" | "slot">) => void;
  onDelete?: (() => void) | undefined;
}) {
  const [form, setForm] = useState({
  subject: "",
  instructor: "",
  group: "",
  room: "",
  notes: "",
});

  useEffect(() => {
    if (!open) return;
    setForm({
  subject: entry?.subject_name ?? "",
  instructor: entry?.instructor_name ?? "",
  group: entry?.group_number ?? "",
  room: entry?.room ?? "",
  notes: entry?.notes ?? "",
});
  }, [open, entry]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = form.subject.trim();
    if (!subject) {
      toast.error("اكتب اسم المادة");
      return;
    }
    if (subject.length > 100) {
      toast.error("اسم المادة طويل جداً");
      return;
    }
       onSave({
      subject_name: subject,
      instructor_name: form.instructor.trim().slice(0, 100) || null,
      group_number: form.group.trim().slice(0, 20) || null,
      room: form.room.trim().slice(0, 50) || null,
      notes: form.notes.trim().slice(0, 300) || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {entry ? "تعديل المادة" : "إضافة مادة"} — {dayLabel} · {timeLabel}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">اسم المادة</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              maxLength={100}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
  <div className="space-y-2">
    <Label htmlFor="instructor">المحاضر</Label>
    <Input
      id="instructor"
      value={form.instructor}
      onChange={(e) => setForm({ ...form, instructor: e.target.value })}
      maxLength={100}
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="group">الجروب</Label>
    <Input
      id="group"
      value={form.group}
      onChange={(e) => setForm({ ...form, group: e.target.value })}
      maxLength={20}
    />
  </div>
</div>

<div className="space-y-2">
  <Label htmlFor="room">القاعة</Label>
  <Input
    id="room"
    value={form.room}
    onChange={(e) => setForm({ ...form, room: e.target.value })}
    placeholder="مثال: E103"
    maxLength={50}
  />
</div>
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              maxLength={300}
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            {onDelete ? (
              <Button type="button" variant="destructive" onClick={onDelete} disabled={busy}>
                <Trash2 className="size-4" /> حذف
              </Button>
            ) : (
              <Button type="button" variant="ghost" onClick={onClose}>
                <X className="size-4" /> إلغاء
              </Button>
            )}
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" />} حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
