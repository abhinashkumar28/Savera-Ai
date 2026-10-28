import {
  Zap,
  AlertTriangle,
  TrendingDown,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
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
} from "recharts";
import { anomalies, buildings, generateHourlyReadings, generateWeeklyReadings, tasks } from "../data/mockData";

export default function OverviewPage() {
  const hourlyData = generateHourlyReadings();
  const weeklyData = generateWeeklyReadings();
  const activeAnomalies = anomalies.filter((a) => a.status === "Active").length;
  const openTasks = tasks.filter((t) => t.status !== "Completed").length;
  const totalDailyKwh = buildings.reduce((sum, b) => sum + b.avgDailyKwh, 0);
  const estimatedSavingsRs = 258;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* KPI Cards - Asymmetric layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Primary metric - wider */}
        <div className="md:col-span-4 rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-savera-text-dim uppercase tracking-wider">Today's Consumption</span>
            <Zap className="h-4 w-4 text-savera-amber" />
          </div>
          <div className="text-3xl font-bold text-white">{totalDailyKwh} <span className="text-base font-normal text-savera-text-dim">kWh</span></div>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <ArrowUpRight className="h-3 w-3 text-savera-warning" />
            <span className="text-savera-warning">8% above yesterday</span>
          </div>
          <div className="mt-3 text-xs text-savera-text-dim">
            Estimated cost: ₹{(totalDailyKwh * 8).toLocaleString()}
          </div>
        </div>

        {/* Anomaly alert - attention-grabbing */}
        <div className="md:col-span-3 rounded-xl border border-savera-danger/30 bg-savera-danger/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-savera-text-dim uppercase tracking-wider">Active Anomalies</span>
            <AlertTriangle className="h-4 w-4 text-savera-danger" />
          </div>
          <div className="text-3xl font-bold text-white">{activeAnomalies}</div>
          <div className="mt-2 text-xs text-savera-danger">
            {anomalies.filter(a => a.severity === "Critical" && a.status === "Active").length} critical, needs attention
          </div>
          <div className="mt-3 text-xs text-savera-text-dim">
            {openTasks} open tasks
          </div>
        </div>

        {/* Savings */}
        <div className="md:col-span-2 rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-savera-text-dim uppercase tracking-wider">Est. Savings</span>
            <TrendingDown className="h-4 w-4 text-savera-success" />
          </div>
          <div className="text-2xl font-bold text-white">₹{estimatedSavingsRs}</div>
          <div className="mt-2 text-xs text-savera-success flex items-center gap-1">
            <ArrowDownRight className="h-3 w-3" />
            <span>This month</span>
          </div>
        </div>

        {/* Buildings */}
        <div className="md:col-span-3 rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-savera-text-dim uppercase tracking-wider">Buildings</span>
            <Building2 className="h-4 w-4 text-savera-info" />
          </div>
          <div className="text-3xl font-bold text-white">{buildings.length}</div>
          <div className="mt-2 space-y-1">
            {buildings.map((b) => (
              <div key={b.id} className="flex items-center justify-between text-xs">
                <span className="text-savera-text-dim truncate">{b.name.split("—")[0].trim()}</span>
                <span className="text-white font-medium">{b.avgDailyKwh} kWh</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Hourly consumption - larger */}
        <div className="lg:col-span-3 rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Today's Hourly Consumption</h3>
              <p className="text-xs text-savera-text-dim mt-0.5">Simulated data • All buildings combined</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-savera-amber" />
                Building A
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-savera-teal" />
                Building B
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={{ stroke: "#1e2640" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={{ stroke: "#1e2640" }}
                  tickLine={false}
                  unit=" kWh"
                />
                <Tooltip
                  contentStyle={{
                    background: "#151b2b",
                    border: "1px solid #1e2640",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Area
                  type="monotone"
                  dataKey="buildingA"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Building A"
                />
                <Area
                  type="monotone"
                  dataKey="buildingB"
                  stroke="#14b8a6"
                  fill="#14b8a6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Building B"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly comparison */}
        <div className="lg:col-span-2 rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Weekly Comparison</h3>
            <p className="text-xs text-savera-text-dim mt-0.5">Daily consumption by building (kWh)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={{ stroke: "#1e2640" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={{ stroke: "#1e2640" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#151b2b",
                    border: "1px solid #1e2640",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="buildingA" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Bld A" />
                <Bar dataKey="buildingB" fill="#14b8a6" radius={[2, 2, 0, 0]} name="Bld B" />
                <Bar dataKey="buildingC" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Bld C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent anomalies & Peak hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent anomalies */}
        <div className="lg:col-span-2 rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Anomalies</h3>
            <span className="text-xs text-savera-text-dim">Last 48 hours</span>
          </div>
          <div className="space-y-3">
            {anomalies.slice(0, 4).map((anomaly) => (
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{anomaly.buildingName}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      anomaly.severity === "Critical" ? "bg-savera-danger/15 text-savera-danger" :
                      anomaly.severity === "High" ? "bg-savera-warning/15 text-savera-warning" :
                      anomaly.severity === "Medium" ? "bg-savera-amber/15 text-savera-amber" : "bg-savera-text-dim/15 text-savera-text-dim"
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
                  <p className="text-xs text-savera-text-dim mt-1 truncate">{anomaly.explanation}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-white">+{anomaly.deviationPercent}%</div>
                  <div className="text-xs text-savera-text-dim flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(anomaly.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak hours & quick stats */}
        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Peak Usage Hours</h3>
          <div className="space-y-3">
            {[
              { time: "10:00 – 12:00", building: "Building A", kwh: 48, level: "high" },
              { time: "14:00 – 16:00", building: "Building B", kwh: 65, level: "high" },
              { time: "09:00 – 11:00", building: "Building C", kwh: 28, level: "medium" },
              { time: "18:00 – 20:00", building: "Building B", kwh: 52, level: "medium" },
            ].map((peak, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-savera-border last:border-0">
                <div>
                  <div className="text-sm text-white">{peak.time}</div>
                  <div className="text-xs text-savera-text-dim">{peak.building}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{peak.kwh} kWh</div>
                  <div className={`text-xs ${peak.level === "high" ? "text-savera-warning" : "text-savera-amber"}`}>
                    {peak.level === "high" ? "Peak" : "High"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-savera-border">
            <h4 className="text-xs font-medium text-savera-text-dim uppercase tracking-wider mb-2">Overnight Consumption</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">00:00 – 06:00</span>
              <span className="text-sm font-medium text-savera-warning">142 kWh</span>
            </div>
            <p className="text-xs text-savera-text-dim mt-1">
              18% of daily total — potential savings area
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
