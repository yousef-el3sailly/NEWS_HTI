import logo from "@/assets/news-logo.png";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 40,
  withText = true,
  tone = "default",
}: {
  className?: string;
  size?: number;
  withText?: boolean;
  tone?: "default" | "inverted";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src={logo}
        alt="شعار NEWS x UniCourses HTI"
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />

      {withText && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "whitespace-nowrap text-sm font-extrabold tracking-[0.06em] sm:text-base lg:text-lg",
              tone === "inverted"
                ? "text-sidebar-foreground"
                : "text-primary",
            )}
          >
            NEWS x UniCourses
          </span>

          <span
            className={cn(
              "mt-1 text-[9px] font-medium sm:text-[10px]",
              tone === "inverted"
                ? "text-sidebar-foreground/70"
                : "text-muted-foreground",
            )}
          >
            مجتمع طلاب HTI
          </span>
        </span>
      )}
    </span>
  );
}