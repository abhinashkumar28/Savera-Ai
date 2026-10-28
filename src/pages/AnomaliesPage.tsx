import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Eye, Filter, Info } from "lucide-react";
import { anomalies } from "../data/mockData";

const severityColors = {
  Critical: { bg: "bg-savera-danger/10", text: "text-savera-danger", border: "border-savera-danger/30" },
  High: { bg: "bg-savera-warning/10", text: "text-savera-warning", border: "border-savera-warning/30" },
  Medium: { bg: "bg-savera-amber/10", text: "text-savera-amber", border: "border-savera-amber/30" },
  Low: { bg: "bg-savera-text-dim/10", text: "text-savera-text-dim", border: "border-savera-border" },
};

const statusColors = {
  Active: "bg-savera-danger/10 text-savera-danger",
  Acknowledged: "bg-savera-amber/10 text-savera-amber",
  Resolved: "bg-savera-success/10 text-savera-success",
  Dismissed: "bg-savera-text-dim/10 text-savera-text-dim",
};

export default function AnomaliesPage() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = anomalies.filter((a) => {
    if (filterSeverity !== "All" && a.severity !== filterSeverity) return false;
    if (filterStatus !== "All" && a.status !== filterStatus) return false;
    return true;
  });

  const selected = anomalies.find((a) => a.id === selectedAnomaly);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">AI Anomaly Detection</h2>
          <p className="text-sm text-savera-text-dim mt-1">
            Detected deviations from expected consumption patterns. Simulated analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-savera-danger/10 border border-savera-danger/20">
            <AlertTriangle className="h-3.5 w-3.5 text-savera-danger" />
            <span className="text-xs font-medium text-savera-danger">
              {anomalies.filter(a => a.status === "Active").length} Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-savera-success/10 border border-savera-success/20">
            <CheckCircle className="h-3.5 w-3.5 text-savera-success" />
            <span className="text-xs font-medium text-savera-success">
              {anomalies.filter(a => a.status === "Resolved").length} Resolved
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-savera-text-dim">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters:</span>
        </div>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="rounded-lg border border-savera-border bg-savera-card px-3 py-1.5 text-xs text-white focus:outline-none focus:border-savera-amber/50"
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-savera-border bg-savera-card px-3 py-1.5 text-xs text-white focus:outline-none focus:border-savera-amber/50"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Resolved">Resolved</option>
          <option value="Dismissed">Dismissed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anomaly list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-savera-border bg-savera-card p-8 text-center">
              <CheckCircle className="h-8 w-8 text-savera-success mx-auto mb-3" />
              <p className="text-sm text-white font-medium">No anomalies match your filters</p>
              <p className="text-xs text-savera-text-dim mt-1">Try adjusting the severity or status filter.</p>
            </div>
          ) : (
            filtered.map((anomaly) => {
              const colors = severityColors[anomaly.severity];
              return (
                <div
                  key={anomaly.id}
                  onClick={() => setSelectedAnomaly(anomaly.id)}
                  className={`rounded-xl border p-4 cursor-pointer transition-all ${
                    selectedAnomaly === anomaly.id
                      ? `${colors.border} bg-savera-surface`
                      : "border-savera-border bg-savera-card hover:border-savera-amber/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${
                        anomaly.severity === "Critical" ? "bg-savera-danger" :
                        anomaly.severity === "High" ? "bg-savera-warning" :
                        anomaly.severity === "Medium" ? "bg-savera-amber" : "bg-savera-text-dim"
                      }`} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">{anomaly.buildingName}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.bg} ${colors.text}`}>
                            {anomaly.severity}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[anomaly.status]}`}>
                            {anomaly.status}
                          </span>
                        </div>
                        <p className="text-xs text-savera-text-dim mt-1.5 leading-relaxed">
                          {anomaly.explanation}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-white">+{anomaly.deviationPercent}%</div>
                      <div className="text-xs text-savera-text-dim">
                        {anomaly.deviationKwh} kWh above
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-savera-border text-xs text-savera-text-dim">
                    <span>Actual: {anomaly.actualKwh} kWh</span>
                    <span>Expected: {anomaly.expectedKwh} kWh</span>
                    <span className="ml-auto">
                      {new Date(anomaly.timestamp).toLocaleDateString()} {new Date(anomaly.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        <div className="rounded-xl border border-savera-border bg-savera-card p-5 h-fit sticky top-0">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-savera-amber" />
                <h3 className="text-sm font-semibold text-white">Anomaly Details</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-savera-text-dim">Building</label>
                  <p className="text-sm text-white font-medium">{selected.buildingName}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-savera-text-dim">Actual</label>
                    <p className="text-sm text-white font-medium">{selected.actualKwh} kWh</p>
                  </div>
                  <div>
                    <label className="text-xs text-savera-text-dim">Expected</label>
                    <p className="text-sm text-white font-medium">{selected.expectedKwh} kWh</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-savera-text-dim">Deviation</label>
                  <p className="text-sm text-white font-medium">
                    +{selected.deviationKwh} kWh ({selected.deviationPercent}%)
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-savera-border">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-3.5 w-3.5 text-savera-info" />
                  <label className="text-xs font-medium text-savera-text-dim">AI Explanation</label>
                </div>
                <p className="text-xs text-savera-text leading-relaxed">{selected.explanation}</p>
              </div>

              <div className="pt-3 border-t border-savera-border">
                <label className="text-xs font-medium text-savera-text-dim">Possible Cause</label>
                <p className="text-xs text-savera-text leading-relaxed mt-1">{selected.possibleCause}</p>
              </div>

              <div className="pt-3 border-t border-savera-border flex gap-2">
                <button className="flex-1 rounded-lg bg-savera-amber/10 border border-savera-amber/30 px-3 py-2 text-xs font-medium text-savera-amber hover:bg-savera-amber/20 transition-colors">
                  Acknowledge
                </button>
                <button className="flex-1 rounded-lg bg-savera-success/10 border border-savera-success/30 px-3 py-2 text-xs font-medium text-savera-success hover:bg-savera-success/20 transition-colors">
                  Resolve
                </button>
                <button className="rounded-lg border border-savera-border px-3 py-2 text-xs text-savera-text-dim hover:text-white transition-colors">
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-savera-text-dim mx-auto mb-3" />
              <p className="text-sm text-savera-text-dim">Select an anomaly to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
