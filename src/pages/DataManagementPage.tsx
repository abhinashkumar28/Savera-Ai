import { useState } from "react";
import { Database, Upload, FileText, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

export default function DataManagementPage() {
  const [importStatus, setImportStatus] = useState<"idle" | "importing" | "success">("idle");

  const handleImport = () => {
    setImportStatus("importing");
    setTimeout(() => setImportStatus("success"), 2000);
  };

  const handleSimulate = () => {
    setImportStatus("importing");
    setTimeout(() => setImportStatus("success"), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-bold text-white">Data Management</h2>
        <p className="text-sm text-savera-text-dim mt-1">
          Import electricity readings, generate simulated data, and manage datasets
        </p>
      </div>

      {/* Import section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-4 w-4 text-savera-amber" />
            <h3 className="text-sm font-semibold text-white">Import CSV Data</h3>
          </div>
          <p className="text-xs text-savera-text-dim mb-4">
            Upload electricity readings in CSV format. Required columns: timestamp, building_id, consumption_kwh. 
            Optional: temperature, occupancy, day_of_week, is_holiday.
          </p>

          <div className="border-2 border-dashed border-savera-border rounded-lg p-8 text-center hover:border-savera-amber/30 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-savera-text-dim mx-auto mb-3" />
            <p className="text-sm text-white font-medium">Drop CSV file here</p>
            <p className="text-xs text-savera-text-dim mt-1">or click to browse</p>
            <p className="text-xs text-savera-text-dim mt-3">Max 10MB • .csv format</p>
          </div>

          <button
            onClick={handleImport}
            disabled={importStatus === "importing"}
            className="mt-4 w-full rounded-lg bg-savera-amber/10 border border-savera-amber/30 px-4 py-2.5 text-sm font-medium text-savera-amber hover:bg-savera-amber/20 transition-colors disabled:opacity-50"
          >
            {importStatus === "importing" ? "Importing..." : "Import File"}
          </button>
        </div>

        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="h-4 w-4 text-savera-teal" />
            <h3 className="text-sm font-semibold text-white">Generate Simulated Data</h3>
          </div>
          <p className="text-xs text-savera-text-dim mb-4">
            Generate realistic simulated hourly electricity readings for demonstration purposes. 
            Data includes realistic patterns for occupancy, time-of-day, and building type.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-savera-text-dim block mb-1">Duration</label>
              <select className="w-full rounded-lg border border-savera-border bg-savera-surface px-3 py-2 text-sm text-white focus:outline-none focus:border-savera-amber/50">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-savera-text-dim block mb-1">Buildings</label>
              <select className="w-full rounded-lg border border-savera-border bg-savera-surface px-3 py-2 text-sm text-white focus:outline-none focus:border-savera-amber/50">
                <option>All buildings</option>
                <option>Building A only</option>
                <option>Building B only</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={importStatus === "importing"}
            className="mt-4 w-full rounded-lg bg-savera-teal/10 border border-savera-teal/30 px-4 py-2.5 text-sm font-medium text-savera-teal hover:bg-savera-teal/20 transition-colors disabled:opacity-50"
          >
            {importStatus === "importing" ? "Generating..." : "Generate Simulated Data"}
          </button>
        </div>
      </div>

      {/* Import result */}
      {importStatus === "success" && (
        <div className="rounded-lg border border-savera-success/30 bg-savera-success/5 px-4 py-3 flex items-start gap-3">
          <CheckCircle className="h-4 w-4 text-savera-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-savera-success">Data imported successfully</p>
            <p className="text-xs text-savera-text-dim mt-0.5">
              1,008 readings processed • 0 duplicates • 0 invalid rows • 3 buildings updated
            </p>
          </div>
        </div>
      )}

      {/* Data quality */}
      <div className="rounded-xl border border-savera-border bg-savera-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-4 w-4 text-savera-info" />
          <h3 className="text-sm font-semibold text-white">Data Quality Overview</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-savera-border p-3">
            <p className="text-xs text-savera-text-dim">Total Readings</p>
            <p className="text-lg font-bold text-white mt-1">4,320</p>
          </div>
          <div className="rounded-lg border border-savera-border p-3">
            <p className="text-xs text-savera-text-dim">Date Range</p>
            <p className="text-lg font-bold text-white mt-1">90 days</p>
          </div>
          <div className="rounded-lg border border-savera-success/20 bg-savera-success/5 p-3">
            <p className="text-xs text-savera-text-dim">Completeness</p>
            <p className="text-lg font-bold text-savera-success mt-1">97.2%</p>
          </div>
          <div className="rounded-lg border border-savera-warning/20 bg-savera-warning/5 p-3">
            <p className="text-xs text-savera-text-dim">Missing Hours</p>
            <p className="text-lg font-bold text-savera-warning mt-1">121</p>
          </div>
        </div>
      </div>

      {/* Data schema info */}
      <div className="rounded-xl border border-savera-border bg-savera-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-savera-text-dim" />
          <h3 className="text-sm font-semibold text-white">Expected Data Schema</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-savera-border">
                <th className="text-left px-4 py-2 text-xs font-medium text-savera-text-dim">Column</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-savera-text-dim">Type</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-savera-text-dim">Required</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-savera-text-dim">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { col: "timestamp", type: "ISO 8601", req: "Yes", desc: "Reading timestamp" },
                { col: "building_id", type: "string", req: "Yes", desc: "Building identifier" },
                { col: "consumption_kwh", type: "number", req: "Yes", desc: "Electricity consumed in kWh" },
                { col: "temperature", type: "number", req: "No", desc: "Ambient temperature (°C)" },
                { col: "occupancy", type: "number", req: "No", desc: "Number of occupants" },
                { col: "day_of_week", type: "string", req: "No", desc: "Mon, Tue, etc." },
                { col: "is_holiday", type: "boolean", req: "No", desc: "Holiday flag" },
              ].map((row) => (
                <tr key={row.col} className="border-b border-savera-border last:border-0">
                  <td className="px-4 py-2 text-white font-mono text-xs">{row.col}</td>
                  <td className="px-4 py-2 text-savera-text-dim text-xs">{row.type}</td>
                  <td className="px-4 py-2">
                    {row.req === "Yes" ? (
                      <span className="text-xs text-savera-amber">Required</span>
                    ) : (
                      <span className="text-xs text-savera-text-dim">Optional</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-savera-text-dim text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div className="rounded-lg border border-savera-border bg-savera-surface px-4 py-3 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-savera-info flex-shrink-0 mt-0.5" />
        <p className="text-xs text-savera-text-dim">
          <span className="font-medium text-savera-info">Note:</span> In the current demo, all data is simulated. 
          For production use, connect to real electricity meters via API or MQTT. 
          The system validates for missing, duplicate, and invalid readings on import.
        </p>
      </div>
    </div>
  );
}
