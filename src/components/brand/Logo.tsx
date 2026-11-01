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
    <span className={cn("inline-flex min-w-0 items-center gap-1.5 sm:gap-2", className)}>
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
              "flex items-baseline gap-[0.22em] whitespace-nowrap text-[13px] font-extrabold tracking-[0.04em] sm:text-base lg:text-lg",
              tone === "inverted" ? "text-sidebar-foreground" : "text-primary",
            )}
          >
            <span>NEWS</span>
            <span
              aria-hidden
              className={cn(
                "text-[0.82em] font-bold",
                tone === "inverted" ? "text-sidebar-foreground/60" : "text-muted-foreground",
              )}
            >
              ×
            </span>
            <span>UniCourses</span>
          </span>

          <span
            className={cn(
              "mt-1 truncate text-[10px] font-medium sm:text-[11px]",
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
