import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  Building2,
  Activity,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  ListTodo,
  MessageSquare,
  FileBarChart,
  Database,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { path: "/dashboard/buildings", icon: Building2, label: "Buildings" },
  { path: "/dashboard/energy", icon: Activity, label: "Energy Monitoring" },
  { path: "/dashboard/anomalies", icon: AlertTriangle, label: "AI Anomalies" },
  { path: "/dashboard/forecasting", icon: TrendingUp, label: "Forecasting" },
  { path: "/dashboard/recommendations", icon: Lightbulb, label: "Recommendations" },
  { path: "/dashboard/tasks", icon: ListTodo, label: "Tasks" },
  { path: "/dashboard/sms", icon: MessageSquare, label: "SMS & Notifications" },
  { path: "/dashboard/reports", icon: FileBarChart, label: "Reports" },
  { path: "/dashboard/data", icon: Database, label: "Data Management" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const C = {
  bg: "#15370D",
  bgDeep: "#0d2408",
  surface: "#1a4210",
  card: "#1f4d14",
  border: "#2d5e23",
  sage: "#728E6D",
  gold: "#E5CD82",
  goldLight: "#FFF2B4",
  text: "#f0ead6",
  textDim: "#a8b8a0",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: C.bg }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 h-full w-64 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ backgroundColor: C.surface, borderRight: `1px solid ${C.border}` }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border" style={{ backgroundColor: `${C.gold}26`, borderColor: `${C.gold}4D` }}>
              <Zap className="h-4 w-4" style={{ color: C.gold }} />
            </div>
            <span className="text-base font-semibold tracking-tight" style={{ color: C.text }}>
              Savera<span style={{ color: C.gold }}>AI</span>
            </span>
          </Link>
          <button
            className="md:hidden"
            style={{ color: C.textDim }}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
                  style={{
                    backgroundColor: isActive ? `${C.gold}1A` : "transparent",
                    color: isActive ? C.gold : C.textDim,
                    fontWeight: isActive ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = C.card;
                      e.currentTarget.style.color = C.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = C.textDim;
                    }
                  }}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Demo mode badge */}
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="rounded-lg px-3 py-2 border" style={{ backgroundColor: `${C.gold}0D`, borderColor: `${C.gold}33` }}>
            <p className="text-xs font-medium" style={{ color: C.goldLight }}>Demo Mode</p>
            <p className="text-xs mt-0.5" style={{ color: C.textDim }}>Using simulated data</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3" style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}` }}>
          <button
            className="md:hidden"
            style={{ color: C.textDim }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-sm font-medium" style={{ color: C.text }}>
              {navItems.find((n) => n.path === location.pathname)?.label || "Overview"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: C.textDim }}>
              Campus: North Region
            </span>
            <div className="h-8 w-8 rounded-full flex items-center justify-center border" style={{ backgroundColor: `${C.gold}33`, borderColor: `${C.gold}4D` }}>
              <span className="text-xs font-semibold" style={{ color: C.gold }}>A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
