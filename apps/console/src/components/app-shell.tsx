import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/monitors', label: 'Monitors' },
  { to: '/incidents', label: 'Incidents' },
  { to: '/logs', label: 'Logs' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/status-pages', label: 'Status Pages' },
  { to: '/settings', label: 'Settings' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 border-r border-slate-800 bg-slate-950/80">
        <div className="px-4 py-4 text-lg font-semibold tracking-tight border-b border-slate-800">
          downtime
        </div>
        <nav className="px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.to === '/'
                ? pathname === '/'
                : pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'text-slate-400 hover:text-slate-50 hover:bg-slate-800/80',
                  isActive && 'bg-slate-800 text-slate-50'
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/70 backdrop-blur">
          <div className="font-medium text-sm text-slate-400">Workspace selector / search</div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>Notifications</span>
            <span>User menu</span>
          </div>
        </header>

        <main className="flex-1 p-6 bg-slate-950/90">
          <div className="max-w-6xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
