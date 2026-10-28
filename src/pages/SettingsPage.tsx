import { Settings as SettingsIcon, Users, Bell, Shield, Database, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-savera-text-dim mt-1">
          Configure users, roles, thresholds, and integrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users & Roles */}
        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-savera-amber" />
            <h3 className="text-sm font-semibold text-white">Users & Roles</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: "Admin User", role: "Administrator", buildings: "All", color: "text-savera-danger" },
              { name: "Rajesh Kumar", role: "Facility Manager", buildings: "Building A", color: "text-savera-amber" },
              { name: "Priya Sharma", role: "Facility Manager", buildings: "Building B", color: "text-savera-amber" },
              { name: "Amit Patel", role: "Facility Manager", buildings: "Building C", color: "text-savera-amber" },
              { name: "Staff Viewer", role: "Staff", buildings: "Read-only", color: "text-savera-info" },
            ].map((user) => (
              <div key={user.name} className="flex items-center justify-between py-2 border-b border-savera-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-savera-surface border border-savera-border flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{user.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm text-white">{user.name}</p>
                    <p className="text-xs text-savera-text-dim">{user.buildings}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${user.color}`}>{user.role}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg border border-savera-border px-4 py-2 text-xs font-medium text-savera-text-dim hover:text-white hover:border-savera-amber/30 transition-colors">
            + Add User
          </button>
        </div>

        {/* Anomaly Thresholds */}
        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-savera-warning" />
            <h3 className="text-sm font-semibold text-white">Anomaly Detection Thresholds</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-savera-text-dim block mb-1">Low Severity — deviation above</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={10}
                  className="w-20 rounded-lg border border-savera-border bg-savera-surface px-3 py-1.5 text-sm text-white focus:outline-none focus:border-savera-amber/50"
                />
                <span className="text-xs text-savera-text-dim">%</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-savera-text-dim block mb-1">Medium Severity — deviation above</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={15}
                  className="w-20 rounded-lg border border-savera-border bg-savera-surface px-3 py-1.5 text-sm text-white focus:outline-none focus:border-savera-amber/50"
                />
                <span className="text-xs text-savera-text-dim">%</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-savera-text-dim block mb-1">High Severity — deviation above</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={25}
                  className="w-20 rounded-lg border border-savera-border bg-savera-surface px-3 py-1.5 text-sm text-white focus:outline-none focus:border-savera-amber/50"
                />
                <span className="text-xs text-savera-text-dim">%</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-savera-text-dim block mb-1">Critical Severity — deviation above</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={50}
                  className="w-20 rounded-lg border border-savera-border bg-savera-surface px-3 py-1.5 text-sm text-white focus:outline-none focus:border-savera-amber/50"
                />
                <span className="text-xs text-savera-text-dim">%</span>
              </div>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg bg-savera-amber/10 border border-savera-amber/30 px-4 py-2 text-xs font-medium text-savera-amber hover:bg-savera-amber/20 transition-colors">
            Save Thresholds
          </button>
        </div>

        {/* Notification Settings */}
        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-savera-info" />
            <h3 className="text-sm font-semibold text-white">Notification Rules</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Auto-create SMS draft on Critical anomaly", enabled: true },
              { label: "Auto-create SMS draft on High anomaly", enabled: true },
              { label: "Send daily anomaly summary email", enabled: false },
              { label: "Notify on forecast deviation > 20%", enabled: true },
              { label: "Weekly savings report", enabled: false },
            ].map((rule) => (
              <div key={rule.label} className="flex items-center justify-between py-2">
                <span className="text-sm text-savera-text">{rule.label}</span>
                <div className={`h-5 w-9 rounded-full relative cursor-pointer transition-colors ${
                  rule.enabled ? "bg-savera-amber" : "bg-savera-border"
                }`}>
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    rule.enabled ? "left-4.5 translate-x-0" : "left-0.5"
                  }`} style={{ left: rule.enabled ? "18px" : "2px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-4 w-4 text-savera-teal" />
            <h3 className="text-sm font-semibold text-white">Integrations</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: "SMS Provider (MSG91/Twilio)", status: "Not configured", connected: false },
              { name: "Electricity Meter API", status: "Not connected", connected: false },
              { name: "MQTT Broker (IoT)", status: "Future module", connected: false },
              { name: "Weather API", status: "Not configured", connected: false },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between py-2 border-b border-savera-border last:border-0">
                <span className="text-sm text-white">{integration.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  integration.connected
                    ? "bg-savera-success/10 text-savera-success"
                    : "bg-savera-text-dim/10 text-savera-text-dim"
                }`}>
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-savera-border bg-savera-surface p-3">
            <p className="text-xs text-savera-text-dim">
              <Shield className="h-3 w-3 inline mr-1" />
              All integrations require secure backend configuration. API keys and credentials are never stored in the frontend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
