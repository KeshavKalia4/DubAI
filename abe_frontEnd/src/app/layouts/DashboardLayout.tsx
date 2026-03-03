import { NavLink, Outlet, useNavigate } from "react-router";
import { MadrLogo } from "@/components/ui/madr-logo";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wand2,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  GraduationCap
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#08060f] overflow-hidden font-sans text-white">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#4b2e83]/30 border border-[#4b2e83]/40 text-white rounded-md cursor-pointer"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-60 bg-[#0d0a1a] border-r border-white/8 text-white flex flex-col z-40 transition-transform duration-300",
        "lg:translate-x-0 lg:static fixed inset-y-0 left-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 border-b border-white/8">
          <MadrLogo size={32} showText={false} />
          <button
            onClick={() => navigate('/')}
            className="mt-3 flex items-center gap-1.5 text-xs text-white/25 hover:text-white/50 transition-colors cursor-pointer"
          >
            <GraduationCap size={11} />
            <span>Student Portal</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
          <NavItem
            to="/contributor"
            icon={<LayoutDashboard size={16} />}
            label="Dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            end
          />
          <NavItem
            to="/contributor/events"
            icon={<CalendarDays size={16} />}
            label="My Events"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem
            to="/contributor/attendees"
            icon={<Users size={16} />}
            label="My Community"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem
            to="/contributor/studio"
            icon={<Wand2 size={16} />}
            label="My Studio"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </nav>

        <div className="p-3 border-t border-white/8 space-y-0.5">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-xs font-medium text-white/30 hover:text-white/60 hover:bg-white/5 rounded-md transition-colors cursor-pointer">
            <Settings size={15} />
            <span>Settings</span>
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 text-xs font-medium text-white/30 hover:text-white/60 hover:bg-white/5 rounded-md transition-colors cursor-pointer">
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-[#08060f] border-b border-white/8 flex items-center justify-between px-4 md:px-6">
          <div className="hidden md:flex items-center bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 w-full max-w-sm">
            <Search className="text-white/25 mr-2 flex-shrink-0" size={14} />
            <input
              type="text"
              placeholder="Search events, students..."
              className="bg-transparent border-none outline-none text-xs w-full placeholder-white/25 text-white/70"
            />
          </div>

          <div className="md:hidden flex-1">
            <MadrLogo size={20} showText={false} />
          </div>

          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <button className="md:hidden p-2 text-white/30 hover:text-white/60 transition-colors rounded-full hover:bg-white/5 cursor-pointer">
              <Search size={16} />
            </button>

            <button className="relative p-2 text-white/30 hover:text-white/60 transition-colors rounded-full hover:bg-white/5 cursor-pointer">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#b7a57a] rounded-full"></span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-white/8">
              <div className="text-right hidden lg:block">
                <p className="text-xs font-medium text-white/70">Faculty Staff</p>
                <p className="text-[10px] text-white/30">Event Coordinator</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#4b2e83]/30 border border-[#4b2e83]/40 text-[#b7a57a] flex items-center justify-center font-medium text-xs">
                FS
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative flex-1 overflow-y-auto p-4 md:p-6">
          <div className="relative z-10 max-w-7xl mx-auto space-y-4 md:space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, onClick, end }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer",
          isActive
            ? "bg-[#4b2e83]/25 text-[#b7a57a] border border-[#4b2e83]/30"
            : "text-white/40 hover:bg-white/5 hover:text-white/70 border border-transparent"
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
