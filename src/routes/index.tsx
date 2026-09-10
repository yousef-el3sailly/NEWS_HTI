import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Calculator,
  CalendarRange,
  CheckSquare,
  Database,
  Download,
  ExternalLink,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  ScrollText,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard, type NewsItem } from "@/components/news/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/brand/Logo";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EmptyState } from "@/components/common/EmptyState";
import { FoundersGrid } from "@/components/founders/FoundersGrid";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { SPECIALIZATIONS, UNICOURSES_LINKS } from "@/lib/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEWS — مجتمع طلاب HTI" },
      {
        name: "description",
        content: "أخبار وفعاليات HTI، منشئ الجدول الدراسي، ومصادر المواد في منصة واحدة للطلاب.",
      },
      { property: "og:title", content: "NEWS — مجتمع طلاب HTI" },
      {
        property: "og:description",
        content: "أخبار وفعاليات HTI، منشئ الجدول الدراسي، ومصادر المواد.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const QUICK_ACCESS = [
  {
    icon: Newspaper,
    title: "أحدث الأخبار",
    text: "تابع آخر أخبار وإعلانات وأحداث HTI أول بأول.",
    to: "/news" as const,
    cta: "استكشف الأخبار",
  },
  {
    icon: CalendarRange,
    title: "جدولك الدراسي",
    text: "أنشئ جدولك الدراسي واحفظه وحمّله PNG أو PDF.",
    to: "/schedule" as const,
    cta: "أنشئ جدولك",
  },
  {
    icon: GraduationCap,
    title: "UniCourses",
    text: "خطط دراسية، شجرة المواد، واللائحة في مكان واحد.",
    to: "/unicourses" as const,
    cta: "استكشف UniCourses",
  },
];

const SPEC_ICONS: Record<string, LucideIcon> = {
  Database,
  Briefcase,
  Calculator,
  Megaphone,
  TrendingUp,
};

const UNI_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Languages,
  Workflow,
  ScrollText,
};

function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["news", "latest"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select(
          "id, title, description, image_url, external_url, category, is_published, published_at",
        )
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return (data ?? []) as NewsItem[];
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary via-background to-background">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-40 start-1/4 size-[28rem] rounded-full bg-accent/50 blur-3xl"
        />
        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="animate-fade-up text-center lg:text-start">
            <div className="flex justify-center lg:justify-start">
              <Logo size={88} withText={false} />
            </div>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold text-primary-soft">
              <Sparkles className="size-3.5" /> منصة طلابية بناها طلاب HTI
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] text-foreground sm:text-5xl lg:text-6xl">
              مجتمع طلاب <span className="text-primary">HTI</span> في مكان واحد
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-loose text-muted-foreground lg:mx-0 lg:text-lg">
             أخبار وفعاليات المعهد، منشئ الجدول الدراسي، ومصادر المواد والخطط الدراسية — كلها في منصة واحدة منظّمة وسهلة.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-primary-soft"
              >
                ابنِ جدولك الآن <ArrowLeft className="size-4" />
              </Link>
              <Link
                to="/news"
                className="inline-flex items-center gap-2 rounded-full border border-input bg-card px-7 py-3.5 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:bg-secondary"
              >
                آخر الأخبار
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <HeroShowcase />
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="QUICK ACCESS"
          title="وصول سريع"
          description="أهم ثلاث خدمات في NEWS، على بعد ضغطة واحدة."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {QUICK_ACCESS.map((f, i) => (
            <Link
              key={f.title}
              to={f.to}
              className="surface-card group animate-fade-up relative overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[var(--shadow-lifted)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span
                aria-hidden
                className="absolute -end-10 -top-10 size-28 rounded-full bg-secondary transition-transform duration-500 group-hover:scale-150"
              />
              <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                <f.icon className="size-6" />
              </span>
              <h3 className="relative mt-5 text-xl font-extrabold text-foreground">{f.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.text}
              </p>
              <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                {f.cta}
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="border-y border-border bg-card/60 py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="NEWS & EVENTS"
            title="أحدث الأخبار والأحداث"
            description="كل الإعلانات الأكاديمية والأنشطة الطلابية، محدّثة أول بأول."
            action={
              <Link
                to="/news"
                className="inline-flex items-center gap-1.5 rounded-full border border-input bg-card px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-secondary"
              >
                عرض كل الأخبار <ArrowLeft className="size-4" />
              </Link>
            }
          />
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : (data?.length ?? 0) === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="لا توجد أخبار حالياً"
              description="أول ما يتنشر خبر أو فعالية جديدة هتلاقيها هنا مباشرة."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data?.map((item, i) => (
                <div
                  key={item.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <NewsCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* UNICOURSES */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="UNICOURSES"
          title="UniCourses"
          description="مصادرك الدراسية في مكان واحد."
          action={
            <Link
              to="/unicourses"
              className="inline-flex items-center gap-1.5 rounded-full border border-input bg-card px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-secondary"
            >
              كل المصادر <ArrowLeft className="size-4" />
            </Link>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {UNICOURSES_LINKS.map((l, i) => {
            const Icon = UNI_ICONS[l.icon] ?? BookOpen;
            return (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card group animate-fade-up flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[var(--shadow-lifted)]"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{l.title}</h3>
                <p className="text-[11px] font-semibold text-primary-soft">{l.subtitle}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {l.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  فتح <ExternalLink className="size-4" />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* SCHEDULE CTA */}
      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-sidebar px-8 py-14 text-center sm:px-14">
          <span
            aria-hidden
            className="pointer-events-none absolute -end-16 -top-16 size-64 rounded-full bg-sidebar-accent/60 blur-2xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
              <CalendarRange className="size-6" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-sidebar-foreground sm:text-3xl">
              جدولك الدراسي جاهز في دقيقتين
            </h2>
            <p className="mt-3 leading-loose text-sidebar-foreground/75">
              اضغط على أي خانة، اكتب اسم المادة والمجموعة والدكتور، واحفظ. بعدها حمّل جدولك صورة أو
              PDF جاهز للطباعة.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 rounded-full bg-sidebar-primary px-7 py-3.5 text-sm font-bold text-sidebar-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                أنشئ جدولك <ArrowLeft className="size-4" />
              </Link>
              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 rounded-full border border-sidebar-border px-7 py-3.5 text-sm font-bold text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
              >
                <Download className="size-4" /> تحميل PNG / PDF
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALIZATIONS */}
      <section className="border-t border-border bg-card/60 py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="SPECIALIZATIONS"
            title="تخصصات HTI"
            description="تعرّف على التخصصات المتاحة وطبيعة الدراسة في كل منها."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIALIZATIONS.map((s, i) => {
              const Icon = SPEC_ICONS[s.icon] ?? GraduationCap;
              return (
                <div
                  key={s.id}
                  className="surface-card group animate-fade-up flex gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lifted)]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-foreground">{s.name}</h3>
                    <p className="text-[11px] font-semibold text-primary-soft">{s.en}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DASHBOARD PROMO */}
      <section className="border-t border-border bg-card/60 py-16">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-sidebar px-6 py-12 text-center sm:px-12 lg:px-16 lg:py-16">
            <span
              aria-hidden
              className="pointer-events-none absolute -start-16 -top-16 size-64 rounded-full bg-sidebar-accent/60 blur-2xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -end-20 size-72 rounded-full bg-sidebar-primary/30 blur-3xl"
            />
            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
                <LayoutDashboard className="size-6" />
              </span>
              <span className="mt-5 block text-xs font-bold tracking-wide text-sidebar-primary-foreground/80">
                STUDENT DASHBOARD
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-sidebar-foreground sm:text-3xl lg:text-4xl">
                داشبورد الطالب
              </h2>
              <p className="mx-auto mt-3 max-w-xl leading-loose text-sidebar-foreground/75">
                كل أدواتك الدراسية في مكان واحد — مهامك، جدولك، مواعيدك، ملاحظاتك وآخر الأخبار.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-sidebar-primary px-7 py-3.5 text-sm font-bold text-sidebar-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  اكتشف الداشبورد <ArrowLeft className="size-4" />
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-full border border-sidebar-border px-7 py-3.5 text-sm font-bold text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                >
                  سجّل الدخول للبدء
                </Link>
              </div>

              <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "مهامك", icon: CheckSquare },
                  { label: "جدولك", icon: CalendarRange },
                  { label: "مواعيدك", icon: CalendarRange },
                  { label: "ملاحظاتك", icon: ScrollText },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/40 px-3 py-4 text-sidebar-foreground"
                  >
                    <stat.icon className="size-5 text-sidebar-primary" />
                    <span className="text-sm font-bold">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="FOUNDERS"
          title="مؤسسو NEWS"
          description="الفريق اللي بدأ الفكرة وبيطوّرها باستمرار لخدمة طلاب المعهد."
          action={
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 rounded-full border border-input bg-card px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-secondary"
            >
              عن NEWS <ArrowLeft className="size-4" />
            </Link>
          }
        />
        <FoundersGrid />
      </section>

      {/* COMMUNITY */}
      <section className="border-t border-border bg-secondary/50 py-16">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Users className="size-6" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-foreground sm:text-3xl">
              مجتمع NEWS — طلاب بيساعدوا طلاب
            </h2>
            <p className="mt-3 leading-loose text-muted-foreground">
              NEWS مش مجرد موقع أخبار؛ دي مساحة بيتشارك فيها طلاب HTI الخبرات والمصادر والتنظيم
              الدراسي. سجّل حسابك علشان تحفظ جدولك، تحدّث ملفك الشخصي، وتتابع كل جديد.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                انضم لمجتمع NEWS <ArrowLeft className="size-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-input bg-card px-7 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-card/70"
              >
                اعرف أكتر عننا
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <Logo size={140} withText={false} />
          </div>
        </div>
      </section>
    </div>
  );
}
