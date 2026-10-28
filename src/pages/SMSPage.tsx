import { useState } from "react";
import { MessageSquare, Send, Users, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { smsCampaigns, contacts, anomalies } from "../data/mockData";

export default function SMSPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "contacts" | "compose">("campaigns");
  const [selectedBuilding, setSelectedBuilding] = useState("Building A");
  const [messageText, setMessageText] = useState("");

  const eligibleContacts = contacts.filter(
    (c) => c.building === selectedBuilding && c.verified && c.optedIn
  );

  const activeAnomaly = anomalies.find(a => a.status === "Active" && a.buildingName === selectedBuilding);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="text-xl font-bold text-white">SMS & Notifications</h2>
        <p className="text-sm text-savera-text-dim mt-1">
          Demo mode — no real messages are sent. Configure a provider (MSG91/Twilio) for production use.
        </p>
      </div>

      {/* Demo mode warning */}
      <div className="rounded-lg border border-savera-amber/30 bg-savera-amber/5 px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-savera-amber flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-savera-amber">Running in Demo Mode</p>
          <p className="text-xs text-savera-text-dim mt-0.5">
            SMS functionality requires a configured provider (MSG91/Twilio), valid credentials, and compliance with Indian DLT regulations. 
            This demo shows the workflow without actually sending messages.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-savera-border">
        {[
          { id: "campaigns" as const, label: "Campaign History", icon: MessageSquare },
          { id: "compose" as const, label: "Compose", icon: Send },
          { id: "contacts" as const, label: "Contacts", icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-savera-amber text-savera-amber"
                : "border-transparent text-savera-text-dim hover:text-white"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-savera-border bg-savera-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-savera-border bg-savera-surface">
                  <th className="text-left px-5 py-3 text-xs font-medium text-savera-text-dim">Building</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-savera-text-dim">Message</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-savera-text-dim">Recipients</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-savera-text-dim">Delivered</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-savera-text-dim">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-savera-text-dim">Sent</th>
                </tr>
              </thead>
              <tbody>
                {smsCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-savera-border last:border-0 hover:bg-savera-surface">
                    <td className="px-5 py-3 text-white font-medium">{campaign.buildingName}</td>
                    <td className="px-5 py-3 text-savera-text-dim max-w-xs truncate">{campaign.message}</td>
                    <td className="px-5 py-3 text-center text-white">{campaign.recipientCount}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-savera-success">{campaign.delivered}</span>
                      {campaign.failed > 0 && <span className="text-savera-danger ml-1">/ {campaign.failed} failed</span>}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        campaign.status === "Delivered" ? "bg-savera-success/10 text-savera-success" :
                        campaign.status === "Sent" ? "bg-savera-info/10 text-savera-info" :
                        campaign.status === "Failed" ? "bg-savera-danger/10 text-savera-danger" :
                        "bg-savera-text-dim/10 text-savera-text-dim"
                      }`}>
                        {campaign.status === "Delivered" && <CheckCircle className="h-3 w-3" />}
                        {campaign.status === "Failed" && <XCircle className="h-3 w-3" />}
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-savera-text-dim">
                      {new Date(campaign.sentAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Building & recipients */}
            <div className="rounded-xl border border-savera-border bg-savera-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Recipients</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-savera-text-dim block mb-1">Building</label>
                  <select
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                    className="w-full rounded-lg border border-savera-border bg-savera-surface px-3 py-2 text-sm text-white focus:outline-none focus:border-savera-amber/50"
                  >
                    <option>Building A</option>
                    <option>Building B</option>
                    <option>Building C</option>
                  </select>
                </div>
                <div className="rounded-lg border border-savera-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-savera-text-dim">Eligible recipients</span>
                    <span className="text-sm font-semibold text-white">{eligibleContacts.length}</span>
                  </div>
                  <p className="text-xs text-savera-text-dim mt-1">
                    Verified & opted-in contacts in {selectedBuilding}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick anomaly alert */}
            {activeAnomaly && (
              <div className="rounded-xl border border-savera-warning/20 bg-savera-warning/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-savera-warning" />
                  <h3 className="text-sm font-semibold text-white">Auto-draft from Active Anomaly</h3>
                </div>
                <p className="text-xs text-savera-text-dim mb-3">
                  {activeAnomaly.buildingName}: {activeAnomaly.deviationPercent}% above expected ({activeAnomaly.actualKwh} vs {activeAnomaly.expectedKwh} kWh)
                </p>
                <button
                  onClick={() => setMessageText(
                    `Savera AI Alert: Unusual electricity consumption detected in ${activeAnomaly.buildingName}, ${activeAnomaly.deviationPercent}% above expected usage. Please switch off unnecessary electrical equipment and report any ongoing issue to the facility team.`
                  )}
                  className="rounded-lg bg-savera-warning/10 border border-savera-warning/30 px-3 py-2 text-xs font-medium text-savera-warning hover:bg-savera-warning/20 transition-colors"
                >
                  Use Anomaly Template
                </button>
              </div>
            )}
          </div>

          {/* Message editor */}
          <div className="rounded-xl border border-savera-border bg-savera-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Message</h3>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message or use a template..."
              className="w-full h-40 rounded-lg border border-savera-border bg-savera-surface px-3 py-2 text-sm text-white placeholder:text-savera-text-dim focus:outline-none focus:border-savera-amber/50 resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-savera-text-dim">
                {messageText.length}/160 characters {messageText.length > 160 && <span className="text-savera-warning">(multi-SMS)</span>}
              </span>
              <button
                className="flex items-center gap-2 rounded-lg bg-savera-amber px-4 py-2 text-xs font-semibold text-savera-bg hover:bg-savera-amber-light transition-colors disabled:opacity-50"
                disabled={!messageText || eligibleContacts.length === 0}
              >
                <Send className="h-3.5 w-3.5" />
                Send to {eligibleContacts.length} recipients (Demo)
              </button>
            </div>

            {/* Templates */}
            <div className="mt-4 pt-4 border-t border-savera-border">
              <span className="text-xs text-savera-text-dim block mb-2">Quick templates:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Maintenance notice",
                  "Power shutdown schedule",
                  "Energy saving advisory",
                ].map((template) => (
                  <button
                    key={template}
                    onClick={() => setMessageText(`[Savera AI] ${template}: ${selectedBuilding} — Details to follow. Please contact facility management for more information.`)}
                    className="rounded-full border border-savera-border px-3 py-1 text-xs text-savera-text-dim hover:text-white hover:border-savera-amber/30 transition-colors"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === "contacts" && (
        <div className="rounded-xl border border-savera-border bg-savera-card overflow-hidden">
          <div className="px-5 py-4 border-b border-savera-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Resident Contacts</h3>
            <span className="text-xs text-savera-text-dim">{contacts.length} total contacts</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-savera-border bg-savera-surface">
                <th className="text-left px-5 py-3 text-xs font-medium text-savera-text-dim">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-savera-text-dim">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-savera-text-dim">Building</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-savera-text-dim">Verified</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-savera-text-dim">Opted In</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-savera-text-dim">Eligible</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => {
                const eligible = contact.verified && contact.optedIn;
                return (
                  <tr key={contact.id} className="border-b border-savera-border last:border-0 hover:bg-savera-surface">
                    <td className="px-5 py-3 text-white">{contact.name}</td>
                    <td className="px-5 py-3 text-savera-text-dim">{contact.phone}</td>
                    <td className="px-5 py-3 text-savera-text-dim">{contact.building}</td>
                    <td className="px-5 py-3 text-center">
                      {contact.verified ? (
                        <CheckCircle className="h-4 w-4 text-savera-success mx-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-savera-danger mx-auto" />
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {contact.optedIn ? (
                        <span className="text-xs text-savera-success">Yes</span>
                      ) : (
                        <span className="text-xs text-savera-text-dim">No</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {eligible ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-savera-success/10 text-savera-success">
                          <CheckCircle className="h-3 w-3" /> Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-savera-text-dim/10 text-savera-text-dim">
                          <Clock className="h-3 w-3" /> Excluded
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
