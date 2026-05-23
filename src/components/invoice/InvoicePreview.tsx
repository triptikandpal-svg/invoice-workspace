import type { Invoice } from "@/types/invoice";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { CorporateTemplate } from "./templates/CorporateTemplate";
import { FreelancerTemplate } from "./templates/FreelancerTemplate";
import { TaxInvoiceTemplate } from "./templates/TaxInvoiceTemplate";

interface InvoicePreviewProps {
  invoice: Invoice;
  className?: string;
}

export function InvoicePreview({ invoice, className }: InvoicePreviewProps) {
  const props = { invoice, className };

  switch (invoice.template) {
    case "minimal":
      return <MinimalTemplate {...props} />;
    case "freelancer":
      return <FreelancerTemplate {...props} />;
    case "tax":
      return <TaxInvoiceTemplate {...props} />;
    case "corporate":
    default:
      return <CorporateTemplate {...props} />;
  }
}
