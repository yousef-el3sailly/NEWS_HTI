import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Briefcase, Code, ExternalLink, Languages, ScrollText, Workflow } from "lucide-react";
import { UNICOURSES_LINKS } from "@/lib/constants";

const ICONS = { BookOpen, Briefcase, Code, Languages, Workflow, ScrollText } as const;

export const Route = createFileRoute("/unicourses")({
  head: () => ({
    meta: [
      { title: "UniCourses — الخطة الدراسية ومصادر HTI" },
      {
        name: "description",
        content: "بوابة UniCourses: الخطة الدراسية بالعربي والإنجليزي، الفلوchart، واللائحة.",
      },
      { property: "og:title", content: "UniCourses — الخطة الدراسية ومصادر HTI" },
      {
        property: "og:description",
        content: "كل مصادر المواد والخطة الدراسية واللائحة في مكان واحد.",
      },
    ],
  }),
  component: UniCoursesPage,
});

function UniCoursesPage() {
  return (
    <div className="container-page py-12">
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-sm font-bold text-primary-soft">UNICOURSES</p>
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          بوابة المواد والخطة الدراسية
        </h1>
        <p className="mt-3 text-muted-foreground">
          كل اللي تحتاجه عن المواد والمتطلبات واللائحة — روابط مباشرة تفتح في تبويب جديد.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {UNICOURSES_LINKS.map((link) => {
          const Icon = ICONS[link.icon as keyof typeof ICONS] ?? BookOpen;
          return (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card group flex gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)]"
            >
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <div className="flex-1">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  {link.title}
                  <ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </h2>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-soft">
                  {link.subtitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
