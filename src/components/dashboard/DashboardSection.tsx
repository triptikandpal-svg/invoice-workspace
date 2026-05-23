import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  label?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardSection({
  label,
  title,
  description,
  action,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section className={cn("space-y-5", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          {label && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {label}
            </p>
          )}
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          {description && (
            <p className="max-w-xl text-[13px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
