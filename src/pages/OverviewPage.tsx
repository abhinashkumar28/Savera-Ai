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

const C = {
  bg: "#15370D",
  surface: "#1a4210",
  card: "#1f4d14",
  border: "#2d5e23",
  sage: "#728E6D",
  gold: "#E5CD82",
  goldLight: "#FFF2B4",
  text: "#f0ead6",
  textDim: "#a8b8a0",
  danger: "#ef4444",
  warning: "#f97316",
  success: "#4ade80",
  info: "#60a5fa",
};

export default function OverviewPage() {
  const hourlyData = generateHourlyReadings();
  const weeklyData = generateWeeklyReadings();
  const activeAnomalies = anomalies.filter((a) => a.status === "Active").length;
  const openTasks = tasks.filter((t) => t.status !== "Completed").length;
  const totalDailyKwh = buildings.reduce((sum, b) => sum + b.avgDailyKwh, 0);
  const estimatedSavingsRs = 258;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 rounded-xl border p-5" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: C.textDim }}>Today's Consumption</span>
            <Zap className="h-4 w-4" style={{ color: C.gold }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: C.text }}>{totalDailyKwh} <span className="text-base font-normal" style={{ color: C.textDim }}>kWh</span></div>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <ArrowUpRight className="h-3 w-3" style={{ color: C.warning }} />
            <span style={{ color: C.warning }}>8% above yesterday</span>
          </div>
          <div className="mt-3 text-xs" style={{ color: C.textDim }}>
            Estimated cost: ₹{(totalDailyKwh * 8).toLocaleString()}
          </div>
        </div>

        <div className="md:col-span-3 rounded-xl border p-5" style={{ backgroundColor: `${C.danger}0D`, borderColor: `${C.danger}4D` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: C.textDim }}>Active Anomalies</span>
            <AlertTriangle className="h-4 w-4" style={{ color: C.danger }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: C.text }}>{activeAnomalies}</div>
          <div className="mt-2 text-xs" style={{ color: C.danger }}>
            {anomalies.filter(a => a.severity === "Critical" && a.status === "Active").length} critical, needs attention
          </div>
          <div className="mt-3 text-xs" style={{ color: C.textDim }}>
            {openTasks} open tasks
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border p-5" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: C.textDim }}>Est. Savings</span>
            <TrendingDown className="h-4 w-4" style={{ color: C.success }} />
          </div>
          <div className="text-2xl font-bold" style={{ color: C.text }}>₹{estimatedSavingsRs}</div>
          <div className="mt-2 text-xs flex items-center gap-1" style={{ color: C.success }}>
            <ArrowDownRight className="h-3 w-3" />
            <span>This month</span>
          </div>
        </div>

        <div className="md:col-span-3 rounded-xl border p-5" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: C.textDim }}>Buildings</span>
            <Building2 className="h-4 w-4" style={{ color: C.info }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: C.text }}>{buildings.length}</div>
          <div className="mt-2 space-y-1">
            {buildings.map((b) => (
              <div key={b.id} className="flex items-center justify-between text-xs">
                <span className="truncate" style={{ color: C.textDim }}>{b.name.split("—")[0].trim()}</span>
                <span className="font-medium" style={{ color: C.text }}>{b.avgDailyKwh} kWh</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-xl border p-5" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: C.text }}>Today's Hourly Consumption</h3>
              <p className="text-xs mt-0.5" style={{ color: C.textDim }}>Simulated data • All buildings combined</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.gold }} />
                Building A
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.sage }} />
                Building B
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: C.textDim }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.textDim }} axisLine={{ stroke: C.border }} tickLine={false} unit=" kWh" />
                <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", fontSize: "12px" }} labelStyle={{ color: C.text }} />
                <Area type="monotone" dataKey="buildingA" stroke={C.gold} fill={C.gold} fillOpacity={0.1} strokeWidth={2} name="Building A" />
                <Area type="monotone" dataKey="buildingB" stroke={C.sage} fill={C.sage} fillOpacity={0.1} strokeWidth={2} name="Building B" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border p-5" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold" style={{ color: C.text }}>Weekly Comparison</h3>
            <p className="text-xs mt-0.5" style={{ color: C.textDim }}>Daily consumption by building (kWh)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.textDim }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.textDim }} axisLine={{ stroke: C.border }} tickLine={false} />
                <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="buildingA" fill={C.gold} radius={[2, 2, 0, 0]} name="Bld A" />
                <Bar dataKey="buildingB" fill={C.sage} radius={[2, 2, 0, 0]} name="Bld B" />
                <Bar dataKey="buildingC" fill={C.info} radius={[2, 2, 0, 0]} name="Bld C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent anomalies & Peak hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border p-5" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: C.text }}>Recent Anomalies</h3>
            <span className="text-xs" style={{ color: C.textDim }}>Last 48 hours</span>
          </div>
          <div className="space-y-3">
            {anomalies.slice(0, 4).map((anomaly) => (
              <div
                key={anomaly.id}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors"
                style={{ backgroundColor: "transparent", borderColor: C.border }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.surface)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0`} style={{
                  backgroundColor: anomaly.severity === "Critical" ? C.danger :
                    anomaly.severity === "High" ? C.warning :
                    anomaly.severity === "Medium" ? C.gold : C.textDim
                }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: C.text }}>{anomaly.buildingName}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{
                      backgroundColor: anomaly.severity === "Critical" ? `${C.danger}26` :
                        anomaly.severity === "High" ? `${C.warning}26` :
                        anomaly.severity === "Medium" ? `${C.gold}26` : `${C.textDim}26`,
                      color: anomaly.severity === "Critical" ? C.danger :
                        anomaly.severity === "High" ? C.warning :
                        anomaly.severity === "Medium" ? C.gold : C.textDim
                    }}>
                      {anomaly.severity}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      backgroundColor: anomaly.status === "Active" ? `${C.danger}1A` :
                        anomaly.status === "Resolved" ? `${C.success}1A` : `${C.border}`,
                      color: anomaly.status === "Active" ? C.danger :
                        anomaly.status === "Resolved" ? C.success : C.textDim
                    }}>
                      {anomaly.status}
                    </span>
                  </div>
                  <p className="text-xs mt-1 truncate" style={{ color: C.textDim }}>{anomaly.explanation}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium" style={{ color: C.text }}>+{anomaly.deviationPercent}%</div>
                  <div className="text-xs flex items-center gap-1" style={{ color: C.textDim }}>
                    <Clock className="h-3 w-3" />
                    {new Date(anomaly.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: C.text }}>Peak Usage Hours</h3>
          <div className="space-y-3">
            {[
              { time: "10:00 – 12:00", building: "Building A", kwh: 48, level: "high" },
              { time: "14:00 – 16:00", building: "Building B", kwh: 65, level: "high" },
              { time: "09:00 – 11:00", building: "Building C", kwh: 28, level: "medium" },
              { time: "18:00 – 20:00", building: "Building B", kwh: 52, level: "medium" },
            ].map((peak, i) => (
              <div key={i} className="flex items-center justify-between py-2 last:border-0" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div className="text-sm" style={{ color: C.text }}>{peak.time}</div>
                  <div className="text-xs" style={{ color: C.textDim }}>{peak.building}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: C.text }}>{peak.kwh} kWh</div>
                  <div className="text-xs" style={{ color: peak.level === "high" ? C.warning : C.gold }}>
                    {peak.level === "high" ? "Peak" : "High"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: C.textDim }}>Overnight Consumption</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: C.text }}>00:00 – 06:00</span>
              <span className="text-sm font-medium" style={{ color: C.warning }}>142 kWh</span>
            </div>
            <p className="text-xs mt-1" style={{ color: C.textDim }}>
              18% of daily total — potential savings area
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
