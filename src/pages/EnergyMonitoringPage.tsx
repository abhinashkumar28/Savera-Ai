import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Calendar, Building2, Clock } from "lucide-react";
import { buildings, generateHourlyReadings, generateWeeklyReadings } from "../data/mockData";

export default function EnergyMonitoringPage() {
  const [selectedBuilding, setSelectedBuilding] = useState("all");
  const [timeRange, setTimeRange] = useState("daily");

  const hourlyData = generateHourlyReadings();
  const weeklyData = generateWeeklyReadings();

  // Generate monthly data
  const monthlyData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    buildingA: Math.round(440 + Math.sin(i / 5) * 80 + Math.random() * 30),
    buildingB: Math.round(580 + Math.cos(i / 4) * 100 + Math.random() * 40),
    buildingC: Math.round(190 + Math.sin(i / 6) * 50 + Math.random() * 20),
  }));

  const chartData = timeRange === "hourly" ? hourlyData : timeRange === "weekly" ? weeklyData : monthlyData;
  const xKey = timeRange === "hourly" ? "timestamp" : timeRange === "weekly" ? "day" : "day";

  const totalToday = buildings.reduce((sum, b) => sum + b.avgDailyKwh, 0);
  const costToday = totalToday * 8;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Energy Monitoring</h2>
          <p className="text-sm text-savera-text-dim mt-1">
            Consumption data from simulated readings • Not connected to real meters
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="rounded-lg border border-savera-border bg-savera-card px-3 py-2 text-xs text-white focus:outline-none focus:border-savera-amber/50"
          >
            <option value="all">All Buildings</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>{b.name.split("—")[0].trim()}</option>
            ))}
          </select>
          <div className="flex rounded-lg border border-savera-border overflow-hidden">
            {(["hourly", "daily", "weekly"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  timeRange === range
                    ? "bg-savera-amber/15 text-savera-amber"
                    : "text-savera-text-dim hover:text-white hover:bg-savera-card"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-3.5 w-3.5 text-savera-amber" />
            <span className="text-xs text-savera-text-dim">Today's Total</span>
          </div>
          <div className="text-xl font-bold text-white">{totalToday} kWh</div>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-savera-text-dim">Est. Cost</span>
          </div>
          <div className="text-xl font-bold text-white">₹{costToday.toLocaleString()}</div>
          <div className="text-xs text-savera-text-dim">@ ₹8/kWh</div>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3.5 w-3.5 text-savera-warning" />
            <span className="text-xs text-savera-text-dim">Peak Hour</span>
          </div>
          <div className="text-xl font-bold text-white">10–12 AM</div>
          <div className="text-xs text-savera-warning">Highest draw</div>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-3.5 w-3.5 text-savera-teal" />
            <span className="text-xs text-savera-text-dim">This Month</span>
          </div>
          <div className="text-xl font-bold text-white">{(totalToday * 28).toLocaleString()} kWh</div>
          <div className="text-xs text-savera-text-dim">Estimated</div>
        </div>
      </div>

      {/* Main chart */}
      <div className="rounded-xl border border-savera-border bg-savera-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {timeRange === "hourly" ? "Hourly" : timeRange === "weekly" ? "Daily (This Week)" : "Daily (This Month)"} Consumption
            </h3>
            <p className="text-xs text-savera-text-dim mt-0.5">
              {selectedBuilding === "all" ? "All buildings" : buildings.find(b => b.id === selectedBuilding)?.name} • kWh
            </p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {timeRange === "hourly" ? (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} unit=" kWh" />
                <Tooltip contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }} />
                {selectedBuilding === "all" || selectedBuilding === "bld-a" ? (
                  <Area type="monotone" dataKey="buildingA" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} name="Building A" />
                ) : null}
                {selectedBuilding === "all" || selectedBuilding === "bld-b" ? (
                  <Area type="monotone" dataKey="buildingB" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.1} strokeWidth={2} name="Building B" />
                ) : null}
                {selectedBuilding === "all" || selectedBuilding === "bld-c" ? (
                  <Area type="monotone" dataKey="buildingC" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="Building C" />
                ) : null}
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} unit=" kWh" />
                <Tooltip contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }} />
                {selectedBuilding === "all" || selectedBuilding === "bld-a" ? (
                  <Line type="monotone" dataKey="buildingA" stroke="#f59e0b" strokeWidth={2} dot={false} name="Building A" />
                ) : null}
                {selectedBuilding === "all" || selectedBuilding === "bld-b" ? (
                  <Line type="monotone" dataKey="buildingB" stroke="#14b8a6" strokeWidth={2} dot={false} name="Building B" />
                ) : null}
                {selectedBuilding === "all" || selectedBuilding === "bld-c" ? (
                  <Line type="monotone" dataKey="buildingC" stroke="#3b82f6" strokeWidth={2} dot={false} name="Building C" />
                ) : null}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Building comparison table */}
      <div className="rounded-xl border border-savera-border bg-savera-card overflow-hidden">
        <div className="px-5 py-4 border-b border-savera-border">
          <h3 className="text-sm font-semibold text-white">Building-wise Consumption Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-savera-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-savera-text-dim">Building</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-savera-text-dim">Type</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Daily (kWh)</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Est. Cost (₹)</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Monthly Est.</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-savera-text-dim">Status</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((b) => (
                <tr key={b.id} className="border-b border-savera-border last:border-0 hover:bg-savera-surface transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{b.name.split("—")[0].trim()}</td>
                  <td className="px-5 py-3 text-savera-text-dim">{b.type}</td>
                  <td className="px-5 py-3 text-right text-white">{b.avgDailyKwh}</td>
                  <td className="px-5 py-3 text-right text-white">₹{(b.avgDailyKwh * 8).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-white">₹{(b.avgDailyKwh * 8 * 30).toLocaleString()}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-savera-success/10 text-savera-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-savera-success" />
                      Normal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
