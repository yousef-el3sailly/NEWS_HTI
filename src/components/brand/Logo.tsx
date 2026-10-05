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
        alt="شعار NEWS"
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
      {withText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-lg font-extrabold tracking-[0.18em]",
              tone === "inverted" ? "text-sidebar-foreground" : "text-primary",
            )}
          >
            NEWS
          </span>
          <span
            className={cn(
              "text-[10px] font-medium",
              tone === "inverted" ? "text-sidebar-foreground/70" : "text-muted-foreground",
            )}
          >
            مجتمع طلاب HTI
          </span>
        </span>
      )}
    </span>
  );
}
