import { Building2, MapPin, Users, Layers, User } from "lucide-react";
import { buildings, generateWeeklyReadings } from "../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BuildingsPage() {
  const weeklyData = generateWeeklyReadings();

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-bold text-white">Building Management</h2>
        <p className="text-sm text-savera-text-dim mt-1">
          Overview of all buildings in your campus • {buildings.length} buildings registered
        </p>
      </div>

      {/* Building cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildings.map((building) => (
          <div
            key={building.id}
            className="rounded-xl border border-savera-border bg-savera-card p-5 hover:border-savera-amber/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-savera-amber/10 border border-savera-amber/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-savera-amber" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{building.name.split("—")[0].trim()}</h3>
                  <p className="text-xs text-savera-text-dim">{building.name.split("—")[1]?.trim()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="h-3.5 w-3.5 text-savera-text-dim" />
                <span className="text-savera-text-dim">{building.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Layers className="h-3.5 w-3.5 text-savera-text-dim" />
                <span className="text-savera-text-dim">{building.floors} floors • {building.type}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Users className="h-3.5 w-3.5 text-savera-text-dim" />
                <span className="text-savera-text-dim">{building.occupancy} occupants</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <User className="h-3.5 w-3.5 text-savera-text-dim" />
                <span className="text-savera-text-dim">Manager: {building.manager}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-savera-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-savera-text-dim">Avg. Daily</span>
                <span className="text-sm font-semibold text-white">{building.avgDailyKwh} kWh</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-savera-text-dim">Est. Monthly Cost</span>
                <span className="text-sm font-medium text-savera-amber">₹{(building.avgDailyKwh * 8 * 30).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Building comparison chart */}
      <div className="rounded-xl border border-savera-border bg-savera-card p-5">
        <h3 className="text-sm font-semibold text-white mb-1">Weekly Consumption Comparison</h3>
        <p className="text-xs text-savera-text-dim mb-4">Building-wise daily consumption (kWh) • Simulated data</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} unit=" kWh" />
              <Tooltip contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="buildingA" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Building A" />
              <Bar dataKey="buildingB" fill="#14b8a6" radius={[3, 3, 0, 0]} name="Building B" />
              <Bar dataKey="buildingC" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Building C" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consumption per occupant */}
      <div className="rounded-xl border border-savera-border bg-savera-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Efficiency Metric — kWh per Occupant</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {buildings.map((b) => {
            const perOccupant = (b.avgDailyKwh / b.occupancy).toFixed(1);
            const efficiency = b.type === "Residential" ? "Good" : b.type === "Academic" ? "Average" : "High";
            const effColor = efficiency === "Good" ? "text-savera-success" : efficiency === "Average" ? "text-savera-amber" : "text-savera-warning";
            return (
              <div key={b.id} className="rounded-lg border border-savera-border p-4">
                <p className="text-xs text-savera-text-dim mb-1">{b.name.split("—")[0].trim()}</p>
                <p className="text-2xl font-bold text-white">{perOccupant} <span className="text-sm font-normal text-savera-text-dim">kWh/person/day</span></p>
                <p className={`text-xs mt-1 ${effColor}`}>Efficiency: {efficiency}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
