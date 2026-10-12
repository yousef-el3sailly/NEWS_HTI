import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, GraduationCap, HeartHandshake, Newspaper, Users } from "lucide-react";
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

function AboutPage() {
  return (
    <div className="pb-8">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary to-background py-16">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-32 start-1/2 size-[24rem] -translate-x-1/2 rounded-full bg-accent/50 blur-3xl"
        />
        <div className="container-page relative flex flex-col items-center text-center">
          <Logo size={84} withText={false} />
          <h1 className="mt-6 text-3xl font-extrabold text-foreground sm:text-4xl">
            NEWS x UniCourses HTI
          </h1>
          <p className="mt-3 text-lg font-bold text-primary">قصتان اجتمعتا في منصة واحدة</p>
          <p className="mt-4 max-w-2xl leading-loose text-muted-foreground">
            لم يبدأ NEWS x UniCourses HTI كفكرة واحدة من البداية، بل هو نتاج تعاون بين مشروعين
            طلابيين لكل منهما هويته وبدايته الخاصة.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="surface-card animate-fade-up p-7">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Newspaper className="size-5" />
            </span>
            <h2 className="mt-4 text-xl font-extrabold text-foreground">NEWS Community</h2>
            <p className="mt-3 text-sm leading-loose text-muted-foreground">
              بدأت NEWS كـ Community طلابي هدفه جمع طلاب HTI وتوفير مساحة للتواصل ومشاركة الأخبار
              والإعلانات والمعلومات والفعاليات التي تهم الطلاب.
            </p>
            <p className="mt-3 text-sm leading-loose text-muted-foreground">
              وكانت انطلاقة Community NEWS على يد بكري مصعب، ومع الوقت أصبح المجتمع مساحة يشارك
              فيها طلاب من تخصصات ودفعات مختلفة.
            </p>
          </div>
          <div
            className="surface-card animate-fade-up p-7"
            style={{ animationDelay: "90ms" }}
          >
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <h2 className="mt-4 text-xl font-extrabold text-foreground">UniCourses HTI</h2>
            <p className="mt-3 text-sm leading-loose text-muted-foreground">
              وفي جانب آخر، بدأت UniCourses HTI كمنصة أكاديمية مستقلة تهدف إلى تنظيم وتجميع
              المحتوى الأكاديمي الذي يحتاجه طلاب HTI، مثل الخطط الدراسية، الـ Flowcharts، المواد
              والمصادر التعليمية والتدريب الصيفي.
            </p>
            <p className="mt-3 text-sm leading-loose text-muted-foreground">
              بدأت UniCourses وتطورت بشكل مستقل على يد يوسف العسيلي، قبل ظهور الموقع الحالي. وقد
              احتفظت UniCourses بهويتها كمنصة أكاديمية مخصصة لرحلة الطالب الدراسية.
            </p>
          </div>
        </div>

        <div className="surface-card mt-6 animate-fade-up p-7" style={{ animationDelay: "160ms" }}>
          <h2 className="text-xl font-extrabold text-foreground">NEWS x UniCourses HTI</h2>
          <p className="mt-3 text-sm leading-loose text-muted-foreground">
            من هنا جاءت فكرة الموقع الحالي. بدل أن يعمل كل مشروع بشكل منفصل، تم التعاون بين NEWS
            Community و UniCourses HTI لإنشاء منصة تجمع الجانب المجتمعي والإخباري مع الجانب
            الأكاديمي في تجربة واحدة.
          </p>
          <p className="mt-3 text-sm leading-loose text-muted-foreground">
            NEWS تمثل الجانب المجتمعي والأخبار والتواصل بين الطلاب، بينما تمثل UniCourses الجانب
            الأكاديمي والمصادر والخطط الدراسية. وبذلك أصبح NEWS x UniCourses HTI مساحة واحدة تجمع
            ما يحتاجه الطالب خلال رحلته الجامعية، مع الحفاظ على هوية وتاريخ كل مشروع من
            المشروعين.
          </p>
        </div>
      </section>

      <section className="container-page pb-14">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="surface-card group animate-fade-up p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lifted)]"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <v.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-foreground">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-12">
        <SectionHeading
          eyebrow="FOUNDERS"
          title="مؤسسو NEWS"
          description="فريق من الطلاب الذين ساهموا في تأسيس Community NEWS وتطويره عبر الدفعات والتخصصات المختلفة."
        />
        <FoundersGrid />
      </section>

      <section className="container-page pb-12">
        <SectionHeading eyebrow="UNICOURSES" title="مؤسس UniCourses" />
        <div className="surface-card mx-auto max-w-xl p-7 text-center">
          <h3 className="text-lg font-extrabold text-foreground">يوسف العسيلي</h3>
          <p className="mt-3 text-sm leading-loose text-muted-foreground">
            مؤسس ومطور UniCourses HTI، وساهم في تطوير التجربة الرقمية والمنصة الحالية وربط
            UniCourses بمشروع NEWS ضمن الشراكة الحالية.
          </p>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="surface-card relative overflow-hidden p-8 text-center">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-24 start-1/2 size-72 -translate-x-1/2 rounded-full bg-accent/40 blur-3xl"
          />
          <div className="relative">
            <p className="text-sm font-bold text-primary">شراكة تجمع المجتمع بالأكاديميا</p>
            <h2 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
              NEWS × UniCourses
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              مجتمع طلابي + منصة أكاديمية
              <br />
              في مكان واحد.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="surface-card flex flex-wrap items-center justify-between gap-5 p-8">
          <div className="max-w-xl">
            <h2 className="text-xl font-extrabold text-foreground">
              عايز تكون جزء من NEWS x UniCourses HTI؟
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              سجّل حسابك، احفظ جدولك الدراسي، وتابع كل الأخبار والفعاليات في مكان واحد.
            </p>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            إنشاء حساب <ArrowLeft className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
