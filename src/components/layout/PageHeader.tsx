import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 border-b border-border/60 pb-8 lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="space-y-3">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <div className="space-y-2">
          <h1 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-foreground sm:text-[32px]">
            {title}
          </h1>
          {description && (
            <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}
