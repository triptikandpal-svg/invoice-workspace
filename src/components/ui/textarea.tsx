import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[88px] w-full rounded-lg border border-border/80 bg-card px-3 py-2.5 text-[13px] shadow-soft placeholder:text-muted-foreground/70 transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-foreground/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
