import { Lightbulb, CheckCircle, XCircle, Clock, TrendingDown } from "lucide-react";
import { recommendations } from "../data/mockData";

const priorityColors = {
  High: "bg-savera-danger/10 text-savera-danger border-savera-danger/20",
  Medium: "bg-savera-amber/10 text-savera-amber border-savera-amber/20",
  Low: "bg-savera-text-dim/10 text-savera-text-dim border-savera-border",
};

const statusConfig = {
  Pending: { icon: Clock, color: "text-savera-text-dim", bg: "bg-savera-text-dim/10" },
  Accepted: { icon: CheckCircle, color: "text-savera-info", bg: "bg-savera-info/10" },
  Rejected: { icon: XCircle, color: "text-savera-danger", bg: "bg-savera-danger/10" },
  Completed: { icon: CheckCircle, color: "text-savera-success", bg: "bg-savera-success/10" },
};

export default function RecommendationsPage() {
  const totalEstSavingsKwh = recommendations.reduce((sum, r) => sum + r.estimatedSavingsKwh, 0);
  const totalEstSavingsRs = recommendations.reduce((sum, r) => sum + r.estimatedSavingsRs, 0);
  const completedCount = recommendations.filter(r => r.status === "Completed").length;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-bold text-white">AI Recommendations</h2>
        <p className="text-sm text-savera-text-dim mt-1">
          Actionable suggestions based on detected anomalies • Savings are estimates, not verified
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <span className="text-xs text-savera-text-dim">Total Recommendations</span>
          <p className="text-2xl font-bold text-white mt-1">{recommendations.length}</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <span className="text-xs text-savera-text-dim">Completed</span>
          <p className="text-2xl font-bold text-savera-success mt-1">{completedCount}</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <span className="text-xs text-savera-text-dim">Est. Energy Savings</span>
          <p className="text-2xl font-bold text-white mt-1">{totalEstSavingsKwh} kWh</p>
        </div>
        <div className="rounded-xl border border-savera-border bg-savera-card p-4">
          <span className="text-xs text-savera-text-dim">Est. Cost Savings</span>
          <p className="text-2xl font-bold text-savera-amber mt-1">₹{totalEstSavingsRs}</p>
        </div>
      </div>

      {/* Recommendations list */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const statusInfo = statusConfig[rec.status];
          return (
            <div
              key={rec.id}
              className="rounded-xl border border-savera-border bg-savera-card p-5 hover:border-savera-amber/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    <Lightbulb className="h-5 w-5 text-savera-amber" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-white">{rec.buildingName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[rec.priority]}`}>
                        {rec.priority} Priority
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-sm text-white mt-2">{rec.action}</p>
                    <p className="text-xs text-savera-text-dim mt-2 leading-relaxed">
                      <span className="font-medium">Reason:</span> {rec.reason}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-savera-success">
                    <TrendingDown className="h-3.5 w-3.5" />
                    <span className="text-sm font-semibold">{rec.estimatedSavingsKwh} kWh</span>
                  </div>
                  <span className="text-xs text-savera-text-dim">₹{rec.estimatedSavingsRs}/day est.</span>
                </div>
              </div>

              {/* Actions */}
              {rec.status === "Pending" && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-savera-border">
                  <button className="rounded-lg bg-savera-success/10 border border-savera-success/30 px-4 py-2 text-xs font-medium text-savera-success hover:bg-savera-success/20 transition-colors">
                    Accept
                  </button>
                  <button className="rounded-lg border border-savera-border px-4 py-2 text-xs font-medium text-savera-text-dim hover:text-white transition-colors">
                    Reject
                  </button>
                  <button className="rounded-lg border border-savera-border px-4 py-2 text-xs font-medium text-savera-text-dim hover:text-white transition-colors ml-auto">
                    Assign Task
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-savera-border bg-savera-surface px-4 py-3">
        <p className="text-xs text-savera-text-dim">
          <span className="font-medium text-savera-amber">Important:</span> Savings figures are estimates based on the anomaly deviation and typical consumption patterns. 
          Actual savings will vary and should be verified using post-action meter readings. These are not guaranteed outcomes.
        </p>
      </div>
    </div>
  );
}
