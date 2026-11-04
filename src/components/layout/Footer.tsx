import { Link } from "@tanstack/react-router";
import { Code2, Instagram, Facebook, Mail } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const QUICK = [
  { to: "/", label: "الرئيسية" },
  { to: "/news", label: "الأخبار" },
  { to: "/schedule", label: "الجدول الدراسي" },
  { to: "/unicourses", label: "UniCourses" },
  { to: "/about", label: "عن NEWS x UniCourses HTI" },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <Logo size={48} />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            مجتمع طلاب المعهد التكنولوجي العالي (HTI) — كل أخبارك، جدولك، ومصادرك الدراسية في مكان
            واحد.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-primary">روابط سريعة</h3>
          <ul className="space-y-2">
            {QUICK.map((q) => (
              <li key={q.to}>
                <Link
                  to={q.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-primary">تواصل معنا</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            قنوات التواصل الرسمية سيتم تفعيلها قريباً.
          </p>
          <div className="flex gap-2">
            {[Instagram, Facebook, Mail].map((Icon, i) => (
              <span
                key={i}
                aria-hidden
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-secondary text-primary"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 sm:py-7">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:gap-4">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-muted-foreground sm:text-sm">
            <span>تم تطوير المنصة بواسطة</span>
            <span
              dir="ltr"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 font-bold text-primary shadow-sm"
            >
              <Code2 className="size-3.5 shrink-0 sm:size-4" />
              <span className="whitespace-nowrap">Yousef Amin A El-Assaily</span>
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground/80 sm:text-xs">© NEWS x UniCourses HTI</p>
        </div>
      </div>
    </footer>
  );
}
