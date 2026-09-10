import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-card flex flex-col items-center gap-3 px-6 py-16 text-center",
        className,
      )}
    >
      <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary ring-8 ring-secondary/40">
        <Icon className="size-7" />
      </span>
      <p className="text-lg font-bold text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  );
}
