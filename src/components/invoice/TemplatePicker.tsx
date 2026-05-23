import { cn } from "@/lib/utils";
import type { InvoiceTemplate } from "@/types/invoice";

const templates: { value: InvoiceTemplate; label: string; hint: string }[] = [
  { value: "minimal", label: "Minimal", hint: "Clean & light" },
  { value: "corporate", label: "Corporate", hint: "Professional" },
  { value: "freelancer", label: "Freelancer", hint: "Personal brand" },
  { value: "tax", label: "Tax Invoice", hint: "GST breakdown" },
];

interface TemplatePickerProps {
  value: InvoiceTemplate;
  onChange: (value: InvoiceTemplate) => void;
}

export function TemplatePicker({ value, onChange }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {templates.map((t) => {
        const active = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-left transition-all",
              active
                ? "border-foreground/20 bg-foreground/[0.04] ring-1 ring-foreground/10"
                : "border-border/70 bg-card hover:border-border hover:bg-muted/30"
            )}
          >
            <p
              className={cn(
                "text-[13px] font-medium",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t.label}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{t.hint}</p>
          </button>
        );
      })}
    </div>
  );
}
