import { CalendarRange, GraduationCap, Newspaper, Users } from "lucide-react";
import { TIME_SLOTS } from "@/lib/constants";

const CARDS = [
  {
    icon: Newspaper,
    title: "أحدث الأخبار",
    text: "إعلان نتائج منتصف الفصل الدراسي",
    meta: "أخبار",
    offset: "lg:translate-x-6",
  },
  {
    icon: CalendarRange,
    title: "جدولك الدراسي",
    text: `الجدول الدراسي· ${TIME_SLOTS[0]}`,
    meta: "الجدول",
    offset: "lg:-translate-x-4",
  },
  {
    icon: GraduationCap,
    title: "UniCourses",
    text: "الخطة الدراسية والفلوتشارت واللائحة",
    meta: "مصادر",
    offset: "lg:translate-x-10",
  },
  {
    icon: Users,
    title: "مجتمع الطلاب",
    text: "طلاب HTI بيساعدوا بعض في مكان واحد",
    meta: "المجتمع",
    offset: "lg:-translate-x-2",
  },
];

export function HeroShowcase() {
  return (
    <div className="relative isolate w-full">
      <span
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-accent/70 via-secondary/50 to-transparent blur-2xl"
      />
      <div className="flex flex-col gap-3">
        {CARDS.map((c, i) => (
          <div
            key={c.title}
            className={`surface-card animate-fade-up flex items-center gap-4 p-4 transition-transform duration-300 hover:-translate-y-1 ${c.offset}`}
            style={{ animationDelay: `${150 + i * 110}ms` }}
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <c.icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{c.title}</p>
              <p className="truncate text-xs text-muted-foreground">{c.text}</p>
            </div>
            <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-primary">
              {c.meta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
