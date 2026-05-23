import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { InvoiceProvider } from "@/context/InvoiceContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { CreateInvoicePage } from "@/pages/CreateInvoicePage";
import { DraftsPage } from "@/pages/DraftsPage";
import { ClientsPage } from "@/pages/ClientsPage";

export default function App() {
  return (
    <InvoiceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="create" element={<CreateInvoicePage />} />
            <Route path="drafts" element={<DraftsPage />} />
            <Route path="clients" element={<ClientsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </InvoiceProvider>
  );
}
