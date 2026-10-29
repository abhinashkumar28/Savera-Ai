import { Trash2, Recycle, Leaf, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
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
  Legend,
} from "recharts";
import { wasteRecords, wasteWeeklyData, wasteOptimizations, wasteStats } from "../data/mockData";

export default function WasteManagementPage() {
  const todayBreakdown = [
    { name: "Organic", value: wasteRecords.reduce((s, r) => s + r.organic, 0), color: "#22c55e" },
    { name: "Recyclable", value: wasteRecords.reduce((s, r) => s + r.recyclable, 0), color: "#38bdf8" },
    { name: "General", value: wasteRecords.reduce((s, r) => s + r.general, 0), color: "#9ca3af" },
    { name: "E-Waste", value: wasteRecords.reduce((s, r) => s + r.eWaste, 0), color: "#a78bfa" },
    { name: "Hazardous", value: wasteRecords.reduce((s, r) => s + r.hazardous, 0), color: "#ef4444" },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-bold text-white">Waste Management</h2>
        <p className="text-sm text-savera-text-dim mt-1">
          Track waste generation, optimize segregation, and reduce environmental impact
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trash2 className="h-4 w-4 text-savera-waste" />
            <span className="text-xs text-savera-text-dim">Weekly Total</span>
          </div>
          <p className="text-xl font-bold text-white">{wasteStats.totalWeeklyKg} kg</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="h-4 w-4 text-savera-info" />
            <span className="text-xs text-savera-text-dim">Recycling Rate</span>
          </div>
          <p className="text-xl font-bold text-white">{wasteStats.recyclingRate}%</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-4 w-4 text-savera-success" />
            <span className="text-xs text-savera-text-dim">Composting</span>
          </div>
          <p className="text-xl font-bold text-white">{wasteStats.compostingRate}%</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <span className="text-xs text-savera-text-dim">Hazardous ↓</span>
          <p className="text-xl font-bold text-savera-success mt-1">-{wasteStats.hazardousReduction}%</p>
          <p className="text-xs text-savera-text-dim">vs last month</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <span className="text-xs text-savera-text-dim">Monthly Cost</span>
          <p className="text-xl font-bold text-white mt-1">₹{wasteStats.monthlyCost.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <span className="text-xs text-savera-text-dim">CO₂ Saved</span>
          <p className="text-xl font-bold text-savera-success mt-1">{wasteStats.co2Saved} kg</p>
          <p className="text-xs text-savera-text-dim">this month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-savera-border bg-savera-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Weekly Waste by Category</h3>
          <p className="text-xs text-savera-text-dim mb-4">Kilograms per day, broken down by waste type</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} unit=" kg" />
                <Tooltip contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="organic" stackId="a" fill="#22c55e" name="Organic" />
                <Bar dataKey="recyclable" stackId="a" fill="#38bdf8" name="Recyclable" />
                <Bar dataKey="general" stackId="a" fill="#9ca3af" name="General" />
                <Bar dataKey="eWaste" stackId="a" fill="#a78bfa" name="E-Waste" />
                <Bar dataKey="hazardous" stackId="a" fill="#ef4444" name="Hazardous" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Today's Breakdown</h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={todayBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" stroke="none">
                  {todayBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {todayBreakdown.map((b) => (
              <div key={b.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-savera-text-dim">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color }} />
                  {b.name}
                </span>
                <span className="text-white font-medium">{b.value} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Building-wise breakdown */}
      <div className="rounded-xl border border-savera-border bg-savera-card overflow-hidden">
        <div className="px-5 py-4 border-b border-savera-border">
          <h3 className="text-sm font-semibold text-white">Today's Waste by Building</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-savera-border bg-savera-surface">
              <th className="text-left px-5 py-3 text-xs font-medium text-savera-text-dim">Building</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Total</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Organic</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Recyclable</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">E-Waste</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Hazardous</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">General</th>
            </tr>
          </thead>
          <tbody>
            {wasteRecords.map((record) => (
              <tr key={record.id} className="border-b border-savera-border last:border-0 hover:bg-savera-surface">
                <td className="px-5 py-3 text-white font-medium">{record.buildingName}</td>
                <td className="px-5 py-3 text-right text-white font-semibold">{record.totalKg} kg</td>
                <td className="px-5 py-3 text-right text-savera-success">{record.organic} kg</td>
                <td className="px-5 py-3 text-right text-savera-info">{record.recyclable} kg</td>
                <td className="px-5 py-3 text-right text-purple-400">{record.eWaste} kg</td>
                <td className="px-5 py-3 text-right text-savera-danger">{record.hazardous} kg</td>
                <td className="px-5 py-3 text-right text-savera-text-dim">{record.general} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optimization Recommendations */}
      <div className="rounded-xl border border-savera-border bg-savera-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-savera-amber" />
          <h3 className="text-sm font-semibold text-white">Waste Optimization Recommendations</h3>
        </div>
        <div className="space-y-3">
          {wasteOptimizations.map((opt) => (
            <div
              key={opt.id}
              className="flex items-start gap-3 rounded-lg border border-savera-border p-4 hover:border-savera-amber/30 transition-colors"
            >
              <div className="mt-0.5">
                <Lightbulb className="h-4 w-4 text-savera-amber" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-medium text-white">{opt.buildingName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    opt.priority === "High" ? "bg-savera-danger/10 text-savera-danger" :
                    "bg-savera-amber/10 text-savera-amber"
                  }`}>
                    {opt.priority} Priority
                  </span>
                </div>
                <p className="text-sm text-savera-text">{opt.recommendation}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-savera-text-dim">Impact: {opt.impact}</span>
                  <span className="text-xs font-medium text-savera-success">{opt.estimatedSavings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future AI Features */}
      <div className="rounded-lg border border-savera-border bg-savera-surface px-4 py-3">
        <p className="text-xs text-savera-text-dim">
          <span className="font-medium text-savera-amber">Coming soon:</span> AI-powered computer vision waste classification using camera feeds, 
          automated bin fill-level monitoring, and predictive waste generation models.
        </p>
      </div>
    </div>
  );
}
