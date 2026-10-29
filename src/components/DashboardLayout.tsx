import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  LogOut,
  Droplets,
  Trash2,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { path: "/dashboard/buildings", icon: Building2, label: "Buildings" },
  { path: "/dashboard/energy", icon: Activity, label: "Energy Monitoring" },
  { path: "/dashboard/water", icon: Droplets, label: "Water Management" },
  { path: "/dashboard/waste", icon: Trash2, label: "Waste Management" },
  { path: "/dashboard/anomalies", icon: AlertTriangle, label: "AI Anomalies" },
  { path: "/dashboard/forecasting", icon: TrendingUp, label: "Forecasting" },
  { path: "/dashboard/recommendations", icon: Lightbulb, label: "Recommendations" },
  { path: "/dashboard/tasks", icon: ListTodo, label: "Tasks" },
  { path: "/dashboard/sms", icon: MessageSquare, label: "SMS & Notifications" },
  { path: "/dashboard/reports", icon: FileBarChart, label: "Reports" },
  { path: "/dashboard/data", icon: Database, label: "Data Management" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-savera-bg overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 h-full w-64 bg-savera-surface border-r border-savera-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-savera-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-savera-rose/20 border border-savera-rose/30">
              <Zap className="h-4 w-4 text-savera-rose" />
            </div>
            <span className="text-base font-semibold text-white tracking-tight">
              Savera<span className="text-savera-rose">AI</span>
            </span>
          </Link>
          <button
            className="md:hidden text-savera-text-dim hover:text-white"
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
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-savera-rose/10 text-savera-rose font-medium"
                      : "text-savera-text-dim hover:text-white hover:bg-savera-card"
                  }`}
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
        <div className="px-4 py-3 border-t border-savera-border">
          <div className="rounded-lg bg-savera-rose/5 border border-savera-rose/20 px-3 py-2">
            <p className="text-xs text-savera-rose-light font-medium">Demo Mode</p>
            <p className="text-xs text-savera-text-dim mt-0.5">Using simulated data</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-savera-border bg-savera-surface">
          <button
            className="md:hidden text-savera-text-dim hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-sm font-medium text-white">
              {navItems.find((n) => n.path === location.pathname)?.label || "Overview"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-savera-text-dim hidden sm:block">
              {user ? `${user.name} • ${user.role}` : "Campus: North Region"}
            </span>
            {user && (
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="h-8 w-8 rounded-full bg-savera-rose/20 border border-savera-rose/30 flex items-center justify-center hover:bg-savera-rose/30 transition-colors"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5 text-savera-rose" />
              </button>
            )}
            {!user && (
              <div className="h-8 w-8 rounded-full bg-savera-rose/20 border border-savera-rose/30 flex items-center justify-center">
                <span className="text-xs font-semibold text-savera-rose">A</span>
              </div>
            )}
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
