import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/create": "New Invoice",
  "/drafts": "Drafts",
  "/clients": "Clients",
};

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const pageTitle = routeTitles[pathname] ?? "Workspace";

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="relative z-10 h-full w-[260px] bg-card shadow-card">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-card/80 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <nav className="hidden items-center gap-1.5 text-[13px] text-muted-foreground sm:flex">
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{pageTitle}</span>
            </nav>

            <p className="text-[13px] font-medium text-foreground sm:hidden">{pageTitle}</p>

            <div className="flex-1" />

            <div
              className={cn(
                "hidden items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-[12px] text-muted-foreground md:flex"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All changes saved locally
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top,_hsl(0_0%_100%)_0%,_hsl(var(--background))_55%)] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
