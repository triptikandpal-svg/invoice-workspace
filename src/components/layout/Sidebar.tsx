import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  FolderOpen,
  Receipt,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/create", label: "New Invoice", icon: PlusCircle },
];

const manageNav = [
  { to: "/drafts", label: "Drafts", icon: FolderOpen },
  { to: "/clients", label: "Clients", icon: Users },
];

function NavItem({
  to,
  label,
  icon: Icon,
  end,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
          isActive
            ? "bg-foreground/[0.06] text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-foreground" />
          )}
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}
            strokeWidth={1.75}
          />
          {label}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-border/80 bg-card">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background shadow-soft">
          <Receipt className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[13px] font-semibold tracking-tight">Smart Invoice</p>
          <p className="text-[11px] text-muted-foreground">Workspace</p>
        </div>
      </div>

      <div className="mx-5 mb-4 rounded-lg border border-border/70 bg-muted/25 px-3 py-2.5">
        <NavLink
          to="/create"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-md bg-foreground px-3 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          Create invoice
        </NavLink>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3">
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Main
          </p>
          <div className="space-y-0.5">
            {mainNav.map((item) => (
              <NavItem key={item.to} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Manage
          </p>
          <div className="space-y-0.5">
            {manageNav.map((item) => (
              <NavItem key={item.to} {...item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-border/60 p-4">
        <div className="rounded-lg border border-border/60 bg-gradient-to-br from-muted/30 to-card p-3.5">
          <div className="flex items-center gap-2 text-[12px] font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
            Local workspace
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Data saved in your browser. No account required.
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/90">
            Works offline · Private to this device
          </p>
        </div>
      </div>
    </aside>
  );
}
