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
import { TrendingUp, Info, AlertCircle } from "lucide-react";

// Generate forecast data
const forecastData = Array.from({ length: 48 }, (_, i) => {
  const hour = i % 24;
  const day = i < 24 ? "Today" : "Tomorrow";
  const base = hour >= 8 && hour <= 18
    ? 50 + Math.sin((hour - 8) / 10 * Math.PI) * 25
    : 12 + Math.random() * 6;
  const forecast = base + (Math.random() - 0.5) * 8;
  const actual = i < 24 ? base + (Math.random() - 0.5) * 10 : null;
  return {
    time: `${day} ${String(hour).padStart(2, "0")}:00`,
    shortTime: i < 24 ? `${String(hour).padStart(2, "0")}:00` : `${String(hour).padStart(2, "0")}:00`,
    period: day,
    forecast: Math.round(forecast * 10) / 10,
    actual: actual ? Math.round(actual * 10) / 10 : null,
  };
});

const weeklyForecast = [
  { day: "Mon", forecast: 1280, actual: 1315 },
  { day: "Tue", forecast: 1250, actual: 1290 },
  { day: "Wed", forecast: 1320, actual: 1340 },
  { day: "Thu", forecast: 1290, actual: null },
  { day: "Fri", forecast: 1350, actual: null },
  { day: "Sat", forecast: 980, actual: null },
  { day: "Sun", forecast: 850, actual: null },
];

export default function ForecastingPage() {
  const mae = 4.2;
  const accuracy = 92;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-bold text-white">Electricity Forecasting</h2>
        <p className="text-sm text-savera-text-dim mt-1">
          Predicted consumption vs actual readings • Based on historical patterns and simulated model
        </p>
      </div>

      {/* Model info */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-savera-card border border-savera-border">
          <Info className="h-3.5 w-3.5 text-savera-info" />
          <span className="text-xs text-savera-text-dim">Model: Baseline forecasting (transparent, interpretable)</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-savera-card border border-savera-border">
          <span className="text-xs text-savera-text-dim">MAE:</span>
          <span className="text-xs font-semibold text-white">{mae} kWh</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-savera-card border border-savera-border">
          <span className="text-xs text-savera-text-dim">Fit (last 7 days):</span>
          <span className="text-xs font-semibold text-white">{accuracy}%</span>
        </div>
      </div>

      {/* 48-hour forecast chart */}
      <div className="rounded-xl border border-savera-border bg-savera-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">48-Hour Forecast</h3>
            <p className="text-xs text-savera-text-dim mt-0.5">Campus-wide predicted vs actual consumption</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded bg-savera-amber" />
              Forecast
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-savera-teal" />
              Actual
            </span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
              <XAxis
                dataKey="shortTime"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={{ stroke: "#1e2640" }}
                tickLine={false}
                interval={5}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={{ stroke: "#1e2640" }}
                tickLine={false}
                unit=" kWh"
              />
              <Tooltip
                contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.08}
                strokeWidth={2}
                name="Forecast"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={false}
                name="Actual"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-savera-border bg-savera-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Weekly Forecast vs Actual</h3>
          <p className="text-xs text-savera-text-dim mb-4">Daily predicted and actual campus consumption</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} unit=" kWh" />
                <Tooltip contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Forecast" />
                <Line type="monotone" dataKey="actual" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} name="Actual" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecast insights */}
        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Forecast Insights</h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-savera-warning/20 bg-savera-warning/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-3.5 w-3.5 text-savera-warning" />
                <span className="text-xs font-medium text-savera-warning">High Consumption Expected</span>
              </div>
              <p className="text-xs text-savera-text-dim">
                Friday forecast: 1,350 kWh — highest this week. Consider pre-emptive load management.
              </p>
            </div>
            <div className="rounded-lg border border-savera-border p-3">
              <span className="text-xs font-medium text-white">Weekend Outlook</span>
              <p className="text-xs text-savera-text-dim mt-1">
                Sat–Sun expected 30-35% lower than weekdays due to reduced occupancy.
              </p>
            </div>
            <div className="rounded-lg border border-savera-border p-3">
              <span className="text-xs font-medium text-white">Model Notes</span>
              <p className="text-xs text-savera-text-dim mt-1">
                Forecast uses historical patterns, day-of-week, and occupancy estimates. Weather data not yet integrated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-savera-border bg-savera-surface px-4 py-3">
        <p className="text-xs text-savera-text-dim">
          <span className="font-medium text-savera-amber">Note:</span> Forecasts are estimates based on a transparent baseline model. 
          They should not be treated as guaranteed predictions. Accuracy improves with more historical data and additional context (weather, events).
        </p>
      </div>
    </div>
  );
}
