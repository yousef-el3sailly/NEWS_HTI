import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Compass,
  GraduationCap,
  HeartHandshake,
  Newspaper,
  Sparkles,
  Users,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FoundersGrid } from "@/components/founders/FoundersGrid";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "NEWS x UniCourses HTI — مجتمع طلاب HTI" },
      {
        name: "description",
        content:
          "تعرف على قصة NEWS x UniCourses HTI، رسالتها، وفريق المؤسسين من طلاب المعهد التكنولوجي العالي بمدينة العاشر من رمضان.",
      },
      {
        property: "og:title",
        content: "NEWS x UniCourses HTI — مجتمع طلاب HTI",
      },
      { property: "og:description", content: "قصة NEWS x UniCourses HTI ورسالتها وفريق المؤسسين." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Users, title: "مجتمع أولاً", text: "منصة لخدمة طلاب، بكل بساطة ومن غير تعقيد." },
  { icon: Compass, title: "معلومة موثوقة", text: "أخبار وخطط دراسية مراجعة، بدون شائعات." },
  {
    icon: HeartHandshake,
    title: "مساعدة متبادلة",
    text: "تجارب وخبرات الدفعات السابقة متاحة للجميع.",
  },
];

function ChapterBadge({ n }: { n: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1 text-xs font-bold text-primary">
      <span className="font-mono tracking-widest">{n}</span>
    </span>
  );
}

function AboutPage() {
  return (
    <div className="pb-10">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary to-background py-16 sm:py-20">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-32 start-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-accent/50 blur-3xl"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-40 end-[-6rem] size-[20rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div className="container-page relative flex flex-col items-center text-center">
          <div className="animate-fade-up">
            <Logo size={88} withText={false} />
          </div>
          <span
            className="mt-7 inline-flex animate-fade-up items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold text-muted-foreground shadow-sm"
            style={{ animationDelay: "60ms" }}
          >
            <Sparkles className="size-3.5 text-primary" />
            قصتنا
          </span>
          <h1
            className="mt-4 animate-fade-up text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl"
            style={{ animationDelay: "120ms" }}
          >
            NEWS <span className="text-primary">x</span> UniCourses HTI
          </h1>
          <p
            className="mt-4 animate-fade-up text-lg font-bold text-primary sm:text-xl"
            style={{ animationDelay: "180ms" }}
          >
            قصتان اجتمعتا في منصة واحدة
          </p>
          <p
            className="mt-5 max-w-2xl animate-fade-up text-base leading-loose text-muted-foreground sm:text-lg"
            style={{ animationDelay: "240ms" }}
          >
            لم يبدأ NEWS x UniCourses HTI كفكرة واحدة من البداية، بل هو نتاج تعاون بين مشروعين
            طلابيين لكل منهما هويته وبدايته الخاصة.
          </p>
        </div>
      </section>

      {/* ===== القصة: فصلان ثم اللقاء ===== */}
      <section className="container-page py-14 sm:py-16">
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {/* NEWS Community */}
          <article className="surface-card group relative animate-fade-up overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lifted)] sm:p-9">
            <span
              aria-hidden
              className="pointer-events-none absolute -end-10 -top-10 size-36 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10"
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex size-13 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <Newspaper className="size-6" />
                </span>
                <ChapterBadge n="01" />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold text-foreground">NEWS Community</h2>
              <p className="mt-1.5 text-sm font-bold text-primary">الجانب المجتمعي والإخباري</p>
              <p className="mt-4 leading-loose text-muted-foreground">
                بدأت NEWS كـ Community طلابي هدفه جمع طلاب HTI وتوفير مساحة للتواصل ومشاركة
                الأخبار والإعلانات والمعلومات والفعاليات التي تهم الطلاب.
              </p>
              <p className="mt-3 leading-loose text-muted-foreground">
                وكانت انطلاقة Community NEWS على يد{" "}
                <span className="font-bold text-foreground">بكري مصعب</span>، ومع الوقت أصبح
                المجتمع مساحة يشارك فيها طلاب من تخصصات ودفعات مختلفة.
              </p>
            </div>
          </article>

          {/* UniCourses HTI */}
          <article
            className="surface-card group relative animate-fade-up overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lifted)] sm:p-9"
            style={{ animationDelay: "100ms" }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -end-10 -top-10 size-36 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10"
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex size-13 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <GraduationCap className="size-6" />
                </span>
                <ChapterBadge n="02" />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold text-foreground">UniCourses HTI</h2>
              <p className="mt-1.5 text-sm font-bold text-primary">الجانب الأكاديمي والمصادر</p>
              <p className="mt-4 leading-loose text-muted-foreground">
                وفي جانب آخر، بدأت UniCourses HTI كمنصة أكاديمية مستقلة تهدف إلى تنظيم وتجميع
                المحتوى الأكاديمي الذي يحتاجه طلاب HTI، مثل الخطط الدراسية، الـ Flowcharts،
                المواد والمصادر التعليمية والتدريب الصيفي.
              </p>
              <p className="mt-3 leading-loose text-muted-foreground">
                بدأت UniCourses وتطورت بشكل مستقل على يد{" "}
                <span className="font-bold text-foreground">يوسف العسيلي</span>، قبل ظهور الموقع
                الحالي. وقد احتفظت UniCourses بهويتها كمنصة أكاديمية مخصصة لرحلة الطالب الدراسية.
              </p>
            </div>
          </article>
        </div>

        {/* اللقاء */}
        <article
          className="relative mt-6 animate-fade-up overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-l from-primary/10 via-card to-accent/30 p-7 sm:p-10"
          style={{ animationDelay: "180ms" }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -start-16 -bottom-16 size-56 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-10">
            <div className="flex items-center gap-4">
              <ChapterBadge n="03" />
              <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                NEWS <span className="text-primary">x</span> UniCourses HTI
              </h2>
            </div>
            <div className="min-w-0">
              <p className="leading-loose text-muted-foreground">
                من هنا جاءت فكرة الموقع الحالي. بدل أن يعمل كل مشروع بشكل منفصل، تم التعاون بين
                NEWS Community و UniCourses HTI لإنشاء منصة تجمع الجانب المجتمعي والإخباري مع
                الجانب الأكاديمي في تجربة واحدة.
              </p>
              <p className="mt-3 leading-loose text-muted-foreground">
                NEWS تمثل الجانب المجتمعي والأخبار والتواصل بين الطلاب، بينما تمثل UniCourses
                الجانب الأكاديمي والمصادر والخطط الدراسية. وبذلك أصبح NEWS x UniCourses HTI مساحة
                واحدة تجمع ما يحتاجه الطالب خلال رحلته الجامعية،{" "}
                <span className="font-bold text-foreground">
                  مع الحفاظ على هوية وتاريخ كل مشروع من المشروعين.
                </span>
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* ===== القيم ===== */}
      <section className="container-page pb-14 sm:pb-16">
        <SectionHeading
          eyebrow="VALUES"
          title="قيمنا"
          description="المبادئ اللي بنشتغل بيها كل يوم"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="surface-card group animate-fade-up p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lifted)] sm:p-7"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                <v.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== مؤسسو NEWS ===== */}
      <section className="container-page pb-14 sm:pb-16">
        <SectionHeading
          eyebrow="FOUNDERS"
          title="مؤسسو NEWS"
          description="فريق من الطلاب الذين ساهموا في تأسيس Community NEWS وتطويره عبر الدفعات والتخصصات المختلفة."
        />
        <FoundersGrid />
      </section>

      {/* ===== مؤسس UniCourses ===== */}
      <section className="container-page pb-14 sm:pb-16">
        <SectionHeading eyebrow="UNICOURSES" title="مؤسس UniCourses" />
        <div className="surface-card group relative mx-auto max-w-2xl animate-fade-up overflow-hidden p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lifted)] sm:p-10">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 start-1/2 size-44 -translate-x-1/2 rounded-full bg-accent/40 blur-3xl"
          />
          <div className="relative">
            <span className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground shadow-sm">
              ي
            </span>
            <h3 className="mt-5 text-2xl font-extrabold text-foreground">يوسف العسيلي</h3>
            <p className="mt-4 leading-loose text-muted-foreground">
              مؤسس ومطور UniCourses HTI، وساهم في تطوير التجربة الرقمية والمنصة الحالية وربط
              UniCourses بمشروع NEWS ضمن الشراكة الحالية.
            </p>
          </div>
        </div>
      </section>

      {/* ===== الشراكة ===== */}
      <section className="container-page pb-14 sm:pb-16">
        <div className="relative animate-fade-up overflow-hidden rounded-3xl bg-primary p-8 text-center shadow-[var(--shadow-lifted)] sm:p-12">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-24 start-1/4 size-64 rounded-full bg-primary-foreground/10 blur-3xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-24 end-1/4 size-64 rounded-full bg-primary-foreground/10 blur-3xl"
          />
          <div className="relative">
            <p className="text-sm font-bold text-primary-foreground/80">
              شراكة تجمع المجتمع بالأكاديميا
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
              NEWS × UniCourses
            </h2>
            <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-primary-foreground/30 px-5 py-2 text-sm font-bold text-primary-foreground">
                مجتمع طلابي
              </span>
              <span className="text-xl font-extrabold text-primary-foreground/70">+</span>
              <span className="rounded-full border border-primary-foreground/30 px-5 py-2 text-sm font-bold text-primary-foreground">
                منصة أكاديمية
              </span>
            </div>
            <p className="mt-5 text-base font-bold text-primary-foreground sm:text-lg">
              في مكان واحد.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="container-page">
        <div className="surface-card flex flex-wrap items-center justify-between gap-5 p-8">
          <div className="min-w-0 max-w-xl">
            <h2 className="text-xl font-extrabold text-foreground">
              عايز تكون جزء من NEWS x UniCourses HTI؟
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              سجّل حسابك، احفظ جدولك الدراسي، وتابع كل الأخبار والفعاليات في مكان واحد.
            </p>
          </div>
          <Link
            to="/auth"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            إنشاء حساب <ArrowLeft className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
