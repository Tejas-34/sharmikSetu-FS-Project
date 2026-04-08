import React from 'react';
import {
  BriefcaseBusiness, CalendarDays, CalendarSearch, FileBadge, HardHat,
  LayoutDashboard, LogOut, PlusSquare, Settings, Users,
  Building2, MessageSquare,
} from 'lucide-react';

const AppShell = ({ currentUser, currentPath, navigate, confirmLogout, children }) => {
  const isEmployer = currentUser?.role === 'employer';
  const isWorker = currentUser?.role === 'worker';

  const navItems = [
    { path: '/app/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/app/jobs', label: isEmployer ? 'My Job Postings' : 'Browse Jobs', icon: BriefcaseBusiness },
    ...(isEmployer ? [{ path: '/app/applicants', label: 'Applicants', icon: Users }] : []),
    ...(isEmployer ? [{ path: '/app/worker-availability', label: 'Worker Availability', icon: CalendarSearch }] : []),
    ...(isEmployer ? [{ path: '/app/jobs/new', label: 'Create Job', icon: PlusSquare }] : []),
    ...(isWorker ? [{ path: '/app/certificates', label: 'Certificates', icon: FileBadge }] : []),
    ...(isWorker ? [{ path: '/app/calendar', label: 'Calendar', icon: CalendarDays }] : []),
    { path: '/app/profile', label: 'Profile', icon: Settings },
    { path: '/app/messages', label: 'Messages', icon: MessageSquare },
  ];

  // ── Employer: violet/purple palette ──────────────────────────────────────
  // ── Worker  : slate/dark palette (original) ──────────────────────────────
  const theme = isEmployer
    ? {
        sidebarBg: '#1e1040',         // deep violet-950
        sidebarBorder: '#4c1d95',     // violet-900
        logoAccent: 'bg-violet-500 text-white',
        logoIcon: Building2,
        navActive: 'bg-violet-500 text-white',
        navIdle: 'text-violet-200 hover:text-white',
        navHover: 'hover:bg-white/10',
        userCardBg: 'bg-white/5',
        sectionLabel: 'text-violet-400',
        headerLeft: 'Employer Portal',
        headerTitle: 'Business Dashboard',
        headerBadgeBg: 'bg-violet-50 border-violet-200',
        headerBadgeText: 'text-violet-700',
        headerBadgeRole: 'text-violet-400',
        mainBg: 'bg-violet-50/40',
      }
    : {
        sidebarBg: '#020617',         // slate-950
        sidebarBorder: '#1e293b',     // slate-800
        logoAccent: 'bg-amber-400 text-slate-900',
        logoIcon: HardHat,
        navActive: 'bg-amber-400 text-slate-950',
        navIdle: 'text-slate-300 hover:text-white',
        navHover: 'hover:bg-white/8',
        userCardBg: 'bg-white/5',
        sectionLabel: 'text-slate-500',
        headerLeft: 'ShramikSetu App',
        headerTitle: 'Operations dashboard',
        headerBadgeBg: 'bg-slate-50 border-slate-200',
        headerBadgeText: 'text-slate-900',
        headerBadgeRole: 'text-slate-500',
        mainBg: 'bg-slate-100',
      };

  const LogoIcon = theme.logoIcon;

  return (
    <div className={`min-h-screen text-slate-900 ${theme.mainBg}`}>
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">

        {/* ── Sidebar ── */}
        <aside
          className="px-5 py-6"
          style={{
            background: theme.sidebarBg,
            borderRight: `1px solid ${theme.sidebarBorder}`,
            color: '#e2e8f0',
          }}
        >
          {/* Logo */}
          <button onClick={() => navigate('/app/dashboard')} className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.logoAccent}`}>
              <LogoIcon size={20} />
            </div>
            <div className="text-left">
              <div className="text-lg font-black uppercase tracking-[0.16em] text-white">ShramikSetu</div>
              <div
                className={`text-[11px] uppercase tracking-[0.18em] ${theme.sectionLabel}`}
              >
                {isEmployer ? 'Employer' : 'Worker'} Portal
              </div>
            </div>
          </button>

          {/* Role badge */}
          {isEmployer && (
            <div className="mt-5 rounded-xl px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300" style={{ background: '#2e1065', border: '1px solid #6d28d9' }}>
              ⚡ Employer Access
            </div>
          )}

          {/* User card */}
          <div className={`mt-6 rounded-2xl ${theme.userCardBg} p-4`}>
            <div className="text-sm font-semibold text-white">{currentUser?.name}</div>
            <div className={`mt-1 text-xs uppercase tracking-[0.18em] ${theme.sectionLabel}`}>{currentUser?.role}</div>
          </div>

          {/* Nav */}
          <div className={`mt-8 text-[11px] font-bold uppercase tracking-[0.2em] ${theme.sectionLabel}`}>
            Workspace
          </div>
          <nav className="mt-3 space-y-2">
            {navItems.map(({ path, label, icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  currentPath === path
                    ? theme.navActive
                    : `${theme.navIdle} ${theme.navHover}`
                }`}
              >
                {React.createElement(icon, { size: 18 })}
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={confirmLogout}
            className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="ml-3">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{theme.headerLeft}</div>
                <h1 className="mt-1 text-2xl font-bold text-slate-950">{theme.headerTitle}</h1>
              </div>
              {/* Role badge in header */}
              <div className={`rounded-2xl border px-4 py-3 text-right ${theme.headerBadgeBg}`}>
                <div className={`text-sm font-semibold ${theme.headerBadgeText}`}>{currentUser?.name}</div>
                <div className={`text-xs uppercase tracking-[0.18em] ${theme.headerBadgeRole}`}>{currentUser?.role}</div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
