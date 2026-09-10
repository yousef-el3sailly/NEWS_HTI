import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, HeartHandshake, Users } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FoundersGrid } from "@/components/founders/FoundersGrid";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن NEWS ومؤسسيها — مجتمع طلاب HTI" },
      {
        name: "description",
        content: "قصة NEWS، رسالتها، وفريق المؤسسين من طلاب المعهد العالي للتكنولوجيا.",
      },
      { property: "og:title", content: "عن NEWS ومؤسسيها" },
      { property: "og:description", content: "قصة NEWS ورسالتها وفريق المؤسسين." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Users, title: "مجتمع أولاً", text: "منصة بيبنيها الطلاب لخدمة الطلاب، من غير تعقيد." },
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
            NEWS — مجتمع طلاب HTI
          </h1>
          <p className="mt-4 max-w-2xl leading-loose text-muted-foreground">
           بدأت NEWS كفكرة بسيطة بين مجموعة من طلاب المعهد التكنولوجي العالي بمدينة العاشر من رمضان، إيمانًا بأن المعلومة الأكاديمية لازم تكون متاحة ومنظمة للجميع. واليوم، أصبحت المنصة تجمع الأخبار والفعاليات، وتساعد الطلاب على بناء جداولهم الدراسية، وتوفر لهم مصادر المواد الدراسية في مكان واحد.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
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
          description="فريق من طلاب المعهد من تخصصات ودفعات مختلفة، بيشتغلوا على تطوير المنصة."
        />
        <FoundersGrid />
      </section>

      <section className="container-page">
        <div className="surface-card flex flex-wrap items-center justify-between gap-5 p-8">
          <div className="max-w-xl">
            <h2 className="text-xl font-extrabold text-foreground">عايز تكون جزء من NEWS؟</h2>
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
