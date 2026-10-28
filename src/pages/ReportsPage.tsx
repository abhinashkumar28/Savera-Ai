import { FileBarChart, Download, TrendingDown, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { anomalies, buildings, recommendations } from "../data/mockData";

const anomalyBySeverity = [
  { name: "Critical", value: anomalies.filter(a => a.severity === "Critical").length, color: "#ef4444" },
  { name: "High", value: anomalies.filter(a => a.severity === "High").length, color: "#f97316" },
  { name: "Medium", value: anomalies.filter(a => a.severity === "Medium").length, color: "#f59e0b" },
  { name: "Low", value: anomalies.filter(a => a.severity === "Low").length, color: "#9ca3af" },
];

const monthlySavings = [
  { month: "Sep", estimated: 180, verified: 0 },
  { month: "Oct", estimated: 220, verified: 45 },
  { month: "Nov", estimated: 258, verified: 120 },
  { month: "Dec", estimated: 310, verified: 195 },
  { month: "Jan", estimated: 280, verified: 32 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-sm text-savera-text-dim mt-1">
            Summarized reports on energy, anomalies, savings, and campaigns
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-savera-border px-4 py-2 text-xs font-medium text-savera-text-dim hover:text-white hover:border-savera-amber/30 transition-colors">
          <Download className="h-3.5 w-3.5" />
          Export Report
        </button>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileBarChart className="h-4 w-4 text-savera-amber" />
            <span className="text-xs text-savera-text-dim">Total Consumption</span>
          </div>
          <p className="text-xl font-bold text-white">{buildings.reduce((s, b) => s + b.avgDailyKwh, 0) * 30} kWh</p>
          <p className="text-xs text-savera-text-dim mt-1">This month (estimated)</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-savera-warning" />
            <span className="text-xs text-savera-text-dim">Anomalies Detected</span>
          </div>
          <p className="text-xl font-bold text-white">{anomalies.length}</p>
          <p className="text-xs text-savera-text-dim mt-1">Last 30 days</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-savera-success" />
            <span className="text-xs text-savera-text-dim">Est. Savings</span>
          </div>
          <p className="text-xl font-bold text-white">₹{recommendations.reduce((s, r) => s + r.estimatedSavingsRs, 0) * 30}</p>
          <p className="text-xs text-savera-text-dim mt-1">Monthly estimate</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileBarChart className="h-4 w-4 text-savera-info" />
            <span className="text-xs text-savera-text-dim">Recommendations</span>
          </div>
          <p className="text-xl font-bold text-white">{recommendations.length}</p>
          <p className="text-xs text-savera-text-dim mt-1">{recommendations.filter(r => r.status === "Completed").length} completed</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Anomaly distribution */}
        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Anomaly Distribution by Severity</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={anomalyBySeverity}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                >
                  {anomalyBySeverity.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {anomalyBySeverity.map((item) => (
              <span key={item.name} className="flex items-center gap-1.5 text-xs text-savera-text-dim">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} ({item.value})
              </span>
            ))}
          </div>
        </div>

        {/* Savings trend */}
        <div className="lg:col-span-2 rounded-xl border border-savera-border bg-savera-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Savings Trend — Estimated vs Verified</h3>
          <p className="text-xs text-savera-text-dim mb-4">Monthly comparison (₹) • Verified savings from completed actions with readings</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySavings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} unit=" ₹" />
                <Tooltip contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="estimated" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Estimated" />
                <Bar dataKey="verified" fill="#22c55e" radius={[3, 3, 0, 0]} name="Verified" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Building-wise report */}
      <div className="rounded-xl border border-savera-border bg-savera-card overflow-hidden">
        <div className="px-5 py-4 border-b border-savera-border">
          <h3 className="text-sm font-semibold text-white">Building-wise Monthly Report</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-savera-border bg-savera-surface">
              <th className="text-left px-5 py-3 text-xs font-medium text-savera-text-dim">Building</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Monthly kWh</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Est. Cost</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Anomalies</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Actions Taken</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Est. Savings</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((b) => {
              const bldAnomalies = anomalies.filter(a => a.buildingId === b.id).length;
              const bldRecs = recommendations.filter(r => r.buildingName === b.name.split("—")[0].trim());
              return (
                <tr key={b.id} className="border-b border-savera-border last:border-0 hover:bg-savera-surface">
                  <td className="px-5 py-3 text-white font-medium">{b.name.split("—")[0].trim()}</td>
                  <td className="px-5 py-3 text-right text-white">{(b.avgDailyKwh * 30).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-white">₹{(b.avgDailyKwh * 8 * 30).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-white">{bldAnomalies}</td>
                  <td className="px-5 py-3 text-right text-white">{bldRecs.filter(r => r.status === "Completed").length}/{bldRecs.length}</td>
                  <td className="px-5 py-3 text-right text-savera-success">₹{bldRecs.reduce((s, r) => s + r.estimatedSavingsRs, 0) * 30}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
