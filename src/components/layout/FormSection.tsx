import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  step?: number;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ step, title, description, children, className }: FormSectionProps) {
  return (
    <section className={cn("app-panel overflow-hidden", className)}>
      <div className="border-b border-border/60 px-6 py-5">
        <div className="flex items-start gap-4">
          {step != null && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-[13px] font-semibold tabular-nums text-muted-foreground">
              {step}
            </span>
          )}
          <div className="min-w-0 space-y-1">
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h2>
            {description && (
              <p className="text-[13px] leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-4 px-6 py-5">{children}</div>
    </section>
  );
}
