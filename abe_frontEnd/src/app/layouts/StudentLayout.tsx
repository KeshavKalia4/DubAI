import { NavLink, Outlet, Link } from 'react-router';
import { Sparkles, MessageSquare, LayoutDashboard } from 'lucide-react';
import { MadrLogo } from '@/components/ui/madr-logo';

export function StudentLayout() {
  return (
    <div className="flex flex-col h-screen bg-[#08060f]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#08060f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 grid grid-cols-[1fr_auto_1fr] items-center">
          <nav className="flex items-center gap-1 justify-self-start">
            <StudentNavLink to="/student" icon={<Sparkles size={14} />} label="Feed" end />
            <StudentNavLink to="/student/chat" icon={<MessageSquare size={14} />} label="madr AI" />
          </nav>

          {/* Logo */}
          <Link to="/student" className="justify-self-center">
            <MadrLogo size={26} showText={false} />
          </Link>

          {/* Switch to Contributor */}
          <Link
            to="/contributor"
            className="hidden sm:flex justify-self-end items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 cursor-pointer"
          >
            <LayoutDashboard size={12} />
            <span>Contributor</span>
          </Link>
          <div className="sm:hidden justify-self-end h-8 w-8" />
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

function StudentNavLink({
  to,
  icon,
  label,
  end,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
          isActive
            ? 'bg-[#4b2e83]/30 text-[#b7a57a] border border-[#4b2e83]/40'
            : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
        }`
      }
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  );
}
