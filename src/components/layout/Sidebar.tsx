import { NavLink } from "react-router-dom";
import {
  FileText,
  LayoutDashboard,
  PlusCircle,
  Users,
  FolderOpen,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/create", label: "New Invoice", icon: PlusCircle },
  { to: "/drafts", label: "Drafts", icon: FolderOpen },
  { to: "/clients", label: "Clients", icon: Users },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Receipt className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">Smart Invoice</p>
          <p className="text-xs text-muted-foreground">Workspace</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted/60 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <FileText className="h-3.5 w-3.5" />
            Pro workspace
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Drafts & clients saved locally in your browser.
          </p>
        </div>
      </div>
    </aside>
  );
}
