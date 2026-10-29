import { Droplets, AlertTriangle, TrendingDown, Building2, Recycle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { waterReadings, waterAnomalies, waterStats, buildings } from "../data/mockData";

export default function WaterManagementPage() {
  const activeAnomalies = waterAnomalies.filter(a => a.status === "Active").length;
  const waterBreakdown = [
    { name: "Building A", value: waterReadings.reduce((s, r) => s + r.buildingA, 0), color: "#38bdf8" },
    { name: "Building B", value: waterReadings.reduce((s, r) => s + r.buildingB, 0), color: "#14b8a6" },
    { name: "Building C", value: waterReadings.reduce((s, r) => s + r.buildingC, 0), color: "#AA5E7A" },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-bold text-white">Water Management</h2>
        <p className="text-sm text-savera-text-dim mt-1">
          Monitor water consumption, detect leaks, and optimize usage across buildings
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-4 w-4 text-savera-water" />
            <span className="text-xs text-savera-text-dim">Daily Usage</span>
          </div>
          <p className="text-2xl font-bold text-white">{waterStats.totalDailyLiters.toLocaleString()} L</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <span className="text-xs text-savera-text-dim">Est. Cost</span>
          <p className="text-2xl font-bold text-white mt-1">₹{waterStats.totalDailyCost.toFixed(0)}</p>
          <p className="text-xs text-savera-text-dim">@ ₹0.05/L</p>
        </div>
        <div className="rounded-xl border border-savera-danger/30 bg-savera-danger/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-savera-danger" />
            <span className="text-xs text-savera-text-dim">Active Leaks</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeAnomalies}</p>
          <p className="text-xs text-savera-danger">Needs attention</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="h-4 w-4 text-savera-success" />
            <span className="text-xs text-savera-text-dim">Recycled</span>
          </div>
          <p className="text-2xl font-bold text-white">{waterStats.recycledPercentage}%</p>
          <p className="text-xs text-savera-text-dim">Greywater reuse</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <span className="text-xs text-savera-text-dim">Rainwater</span>
          <p className="text-2xl font-bold text-white mt-1">{waterStats.rainwaterHarvested} L</p>
          <p className="text-xs text-savera-text-dim">Harvested today</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-savera-border bg-savera-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Today's Hourly Water Consumption</h3>
          <p className="text-xs text-savera-text-dim mb-4">Liters per hour by building</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterReadings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} unit=" L" />
                <Tooltip contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="buildingA" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.1} strokeWidth={2} name="Building A" />
                <Area type="monotone" dataKey="buildingB" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.1} strokeWidth={2} name="Building B" />
                <Area type="monotone" dataKey="buildingC" stroke="#AA5E7A" fill="#AA5E7A" fillOpacity={0.1} strokeWidth={2} name="Building C" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Distribution by Building</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={waterBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                  {waterBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {waterBreakdown.map((b) => (
              <div key={b.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-savera-text-dim">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color }} />
                  {b.name}
                </span>
                <span className="text-white font-medium">{b.value.toLocaleString()} L</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Water Anomalies */}
      <div className="rounded-xl border border-savera-border bg-savera-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Detected Water Anomalies</h3>
        <div className="space-y-3">
          {waterAnomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className="flex items-start gap-3 rounded-lg border border-savera-border p-3 hover:bg-savera-surface transition-colors"
            >
              <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                anomaly.severity === "Critical" ? "bg-savera-danger" :
                anomaly.severity === "High" ? "bg-savera-warning" :
                anomaly.severity === "Medium" ? "bg-savera-amber" : "bg-savera-text-dim"
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">{anomaly.buildingName}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    anomaly.severity === "Critical" ? "bg-savera-danger/15 text-savera-danger" :
                    anomaly.severity === "High" ? "bg-savera-warning/15 text-savera-warning" :
                    "bg-savera-amber/15 text-savera-amber"
                  }`}>
                    {anomaly.severity}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    anomaly.status === "Active" ? "bg-savera-danger/10 text-savera-danger" :
                    anomaly.status === "Resolved" ? "bg-savera-success/10 text-savera-success" :
                    "bg-savera-border text-savera-text-dim"
                  }`}>
                    {anomaly.status}
                  </span>
                </div>
                <p className="text-xs text-savera-text-dim mt-1">{anomaly.explanation}</p>
                <p className="text-xs text-savera-text-dim mt-1 italic">
                  <span className="font-medium not-italic">Possible cause:</span> {anomaly.possibleCause}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-medium text-white">+{anomaly.deviationPercent}%</div>
                <div className="text-xs text-savera-text-dim">+{anomaly.deviationLiters} L</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="rounded-xl border border-savera-border bg-savera-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Water Optimization Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "Install low-flow fixtures", savings: "~18% reduction", building: "All buildings" },
            { title: "Fix reported leaks within 24 hours", savings: "~2,400 L/week", building: "Building B" },
            { title: "Implement rainwater harvesting", savings: "~1,200 L/day", building: "All buildings" },
            { title: "Schedule irrigation during early morning", savings: "~15% reduction", building: "Campus grounds" },
          ].map((tip, i) => (
            <div key={i} className="rounded-lg border border-savera-border p-3">
              <p className="text-sm text-white font-medium">{tip.title}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-savera-text-dim">{tip.building}</span>
                <span className="text-xs text-savera-success">{tip.savings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
