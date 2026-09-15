import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Dumbbell,
  LineChart,
  Settings,
  Target,
  TriangleAlert,
} from "lucide-react";

const NAV = [
  { to: "/today", label: "Today", icon: CalendarDays },
  { to: "/program", label: "Program", icon: Dumbbell },
  { to: "/skills", label: "Skills", icon: Target },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/weak-points", label: "Weak", icon: TriangleAlert },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;


export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  // Rendered after hydration only: server and client clocks/locales differ.
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }),
    );
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <span className="font-display text-lg font-semibold uppercase tracking-[0.18em]">
            {title}
          </span>
          <span className="metric text-xs text-muted-foreground">
            {today}
          </span>
        </div>
      </header>

      {/* Desktop / tablet nav */}
      <nav className="hidden border-b border-border md:block">
        <div className="mx-auto flex max-w-3xl gap-1 px-2">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: false }}

              activeProps={{ className: "text-primary border-primary" }}
              inactiveProps={{ className: "text-muted-foreground border-transparent" }}
              className="label-caps border-b-2 px-4 py-3 transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-5 md:pb-12">{children}</main>

      {/* Mobile nav — large touch targets */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background md:hidden">
        <div className="grid grid-cols-6">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: false }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex min-h-16 flex-col items-center justify-center gap-1 text-[0.625rem] uppercase tracking-widest"
            >
              <Icon className="size-5" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
