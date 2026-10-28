// Simulated data for Savera AI dashboard
// All data is clearly marked as simulated for demonstration purposes

export interface Building {
  id: string;
  name: string;
  location: string;
  type: string;
  floors: number;
  occupancy: number;
  manager: string;
  avgDailyKwh: number;
}

export interface Anomaly {
  id: string;
  buildingId: string;
  buildingName: string;
  timestamp: string;
  actualKwh: number;
  expectedKwh: number;
  deviationKwh: number;
  deviationPercent: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Active" | "Acknowledged" | "Resolved" | "Dismissed";
  explanation: string;
  possibleCause: string;
}

export interface Recommendation {
  id: string;
  anomalyId: string;
  buildingName: string;
  action: string;
  reason: string;
  priority: "Low" | "Medium" | "High";
  estimatedSavingsKwh: number;
  estimatedSavingsRs: number;
  status: "Pending" | "Accepted" | "Rejected" | "Completed";
}

export interface EnergyReading {
  timestamp: string;
  hour: number;
  buildingA: number;
  buildingB: number;
}

export interface SMSCampaign {
  id: string;
  buildingName: string;
  message: string;
  recipientCount: number;
  sentAt: string;
  status: "Draft" | "Queued" | "Sent" | "Delivered" | "Failed";
  delivered: number;
  failed: number;
}

export interface Task {
  id: string;
  title: string;
  buildingName: string;
  assignee: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Completed";
  dueDate: string;
  anomalyId?: string;
}

export const buildings: Building[] = [
  {
    id: "bld-a",
    name: "Building A — Academic Block",
    location: "North Campus",
    type: "Academic",
    floors: 4,
    occupancy: 320,
    manager: "Rajesh Kumar",
    avgDailyKwh: 485,
  },
  {
    id: "bld-b",
    name: "Building B — Hostel",
    location: "East Campus",
    type: "Residential",
    floors: 6,
    occupancy: 450,
    manager: "Priya Sharma",
    avgDailyKwh: 620,
  },
  {
    id: "bld-c",
    name: "Building C — Admin Office",
    location: "Central Campus",
    type: "Office",
    floors: 3,
    occupancy: 120,
    manager: "Amit Patel",
    avgDailyKwh: 210,
  },
];

export const anomalies: Anomaly[] = [
  {
    id: "anom-001",
    buildingId: "bld-a",
    buildingName: "Building A",
    timestamp: "2026-01-15T02:30:00",
    actualKwh: 48,
    expectedKwh: 40,
    deviationKwh: 8,
    deviationPercent: 20,
    severity: "High",
    status: "Active",
    explanation: "Nighttime consumption is 20% above the expected baseline for unoccupied hours. This pattern started 3 days ago.",
    possibleCause: "HVAC system left running overnight or lighting schedule misconfiguration in floors 2-3.",
  },
  {
    id: "anom-002",
    buildingId: "bld-b",
    buildingName: "Building B",
    timestamp: "2026-01-15T14:00:00",
    actualKwh: 72,
    expectedKwh: 55,
    deviationKwh: 17,
    deviationPercent: 31,
    severity: "Critical",
    status: "Acknowledged",
    explanation: "Afternoon consumption spiked 31% above expected levels during a period of normal occupancy. No weather extreme recorded.",
    possibleCause: "Possible equipment malfunction in the water pumping system or unauthorized use of high-load appliances.",
  },
  {
    id: "anom-003",
    buildingId: "bld-a",
    buildingName: "Building A",
    timestamp: "2026-01-14T22:00:00",
    actualKwh: 35,
    expectedKwh: 30,
    deviationKwh: 5,
    deviationPercent: 17,
    severity: "Medium",
    status: "Resolved",
    explanation: "Evening consumption slightly above baseline. Likely due to extended lab session beyond scheduled hours.",
    possibleCause: "Computer labs remained powered on after scheduled closing time.",
  },
  {
    id: "anom-004",
    buildingId: "bld-c",
    buildingName: "Building C",
    timestamp: "2026-01-13T03:00:00",
    actualKwh: 18,
    expectedKwh: 8,
    deviationKwh: 10,
    deviationPercent: 125,
    severity: "Critical",
    status: "Active",
    explanation: "Overnight consumption is 125% above expected for an unoccupied office building. This is a significant deviation.",
    possibleCause: "Server room cooling system running at full capacity, or lights/HVAC not on timer schedule.",
  },
  {
    id: "anom-005",
    buildingId: "bld-b",
    buildingName: "Building B",
    timestamp: "2026-01-12T10:00:00",
    actualKwh: 42,
    expectedKwh: 38,
    deviationKwh: 4,
    deviationPercent: 11,
    severity: "Low",
    status: "Dismissed",
    explanation: "Minor deviation within acceptable range. Likely normal variation due to slightly higher occupancy than usual.",
    possibleCause: "Normal fluctuation — no action required.",
  },
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-001",
    anomalyId: "anom-001",
    buildingName: "Building A",
    action: "Verify HVAC timer settings for floors 2-3 and ensure automatic shutoff at 10 PM",
    reason: "Nighttime consumption anomaly suggests HVAC is running during unoccupied hours.",
    priority: "High",
    estimatedSavingsKwh: 6.5,
    estimatedSavingsRs: 52,
    status: "Pending",
  },
  {
    id: "rec-002",
    anomalyId: "anom-002",
    buildingName: "Building B",
    action: "Inspect water pumping system for malfunction and check for unauthorized appliance usage",
    reason: "31% spike during normal hours suggests equipment issue or policy violation.",
    priority: "High",
    estimatedSavingsKwh: 14,
    estimatedSavingsRs: 112,
    status: "Accepted",
  },
  {
    id: "rec-003",
    anomalyId: "anom-004",
    buildingName: "Building C",
    action: "Audit server room cooling schedule and install timer switches for non-essential lighting",
    reason: "125% overnight deviation is critical and likely due to systems running without occupancy.",
    priority: "High",
    estimatedSavingsKwh: 8,
    estimatedSavingsRs: 64,
    status: "Pending",
  },
  {
    id: "rec-004",
    anomalyId: "anom-003",
    buildingName: "Building A",
    action: "Configure auto-shutdown for computer labs at scheduled closing time",
    reason: "Extended lab hours caused unnecessary energy consumption.",
    priority: "Medium",
    estimatedSavingsKwh: 4,
    estimatedSavingsRs: 32,
    status: "Completed",
  },
];

export function generateHourlyReadings(): EnergyReading[] {
  const readings: EnergyReading[] = [];
  for (let h = 0; h < 24; h++) {
    // Simulate realistic patterns
    const baseA = h >= 8 && h <= 18 ? 35 + Math.sin((h - 8) / 10 * Math.PI) * 15 : 8 + Math.random() * 5;
    const baseB = h >= 6 && h <= 22 ? 20 + Math.sin((h - 6) / 16 * Math.PI) * 12 : 12 + Math.random() * 4;
    readings.push({
      timestamp: `${String(h).padStart(2, "0")}:00`,
      hour: h,
      buildingA: Math.round(baseA * 10) / 10,
      buildingB: Math.round(baseB * 10) / 10,
    });
  }
  return readings;
}

export function generateWeeklyReadings() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, i) => ({
    day,
    buildingA: Math.round(420 + Math.sin(i / 3) * 80 + (i >= 5 ? -100 : 0)),
    buildingB: Math.round(560 + Math.cos(i / 2.5) * 90 + (i >= 5 ? 40 : 0)),
    buildingC: Math.round(180 + Math.sin(i / 4) * 40 + (i >= 5 ? -80 : 0)),
  }));
}

export const smsCampaigns: SMSCampaign[] = [
  {
    id: "sms-001",
    buildingName: "Building A",
    message: "Savera AI Alert: Unusual electricity consumption detected in Building A, 20% above expected usage. Please switch off unnecessary electrical equipment and report any ongoing issue to the facility team.",
    recipientCount: 45,
    sentAt: "2026-01-15T03:00:00",
    status: "Delivered",
    delivered: 43,
    failed: 2,
  },
  {
    id: "sms-002",
    buildingName: "Building B",
    message: "Savera AI Notice: Scheduled power maintenance in Building B on Jan 18, 2-4 PM. Please plan accordingly and save your work.",
    recipientCount: 120,
    sentAt: "2026-01-15T10:00:00",
    status: "Sent",
    delivered: 118,
    failed: 0,
  },
  {
    id: "sms-003",
    buildingName: "Building C",
    message: "Savera AI Alert: Critical energy anomaly in Building C — overnight consumption 125% above baseline. Facility team has been notified.",
    recipientCount: 15,
    sentAt: "2026-01-13T04:00:00",
    status: "Delivered",
    delivered: 15,
    failed: 0,
  },
];

export const tasks: Task[] = [
  {
    id: "task-001",
    title: "Inspect HVAC timer settings — Building A floors 2-3",
    buildingName: "Building A",
    assignee: "Rajesh Kumar",
    priority: "High",
    status: "Open",
    dueDate: "2026-01-17",
    anomalyId: "anom-001",
  },
  {
    id: "task-002",
    title: "Investigate water pump malfunction — Building B",
    buildingName: "Building B",
    assignee: "Priya Sharma",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-01-16",
    anomalyId: "anom-002",
  },
  {
    id: "task-003",
    title: "Audit server room cooling — Building C",
    buildingName: "Building C",
    assignee: "Amit Patel",
    priority: "High",
    status: "Open",
    dueDate: "2026-01-16",
    anomalyId: "anom-004",
  },
  {
    id: "task-004",
    title: "Configure auto-shutdown for computer labs",
    buildingName: "Building A",
    assignee: "Rajesh Kumar",
    priority: "Medium",
    status: "Completed",
    dueDate: "2026-01-15",
    anomalyId: "anom-003",
  },
];

export const contacts = [
  { id: "c1", name: "Arun Mehta", phone: "+91 98XXX XXX01", building: "Building A", floor: "1", verified: true, optedIn: true },
  { id: "c2", name: "Sneha Reddy", phone: "+91 98XXX XXX02", building: "Building A", floor: "2", verified: true, optedIn: true },
  { id: "c3", name: "Vikram Singh", phone: "+91 98XXX XXX03", building: "Building B", floor: "1", verified: true, optedIn: true },
  { id: "c4", name: "Deepa Nair", phone: "+91 98XXX XXX04", building: "Building B", floor: "3", verified: true, optedIn: false },
  { id: "c5", name: "Karan Joshi", phone: "+91 98XXX XXX05", building: "Building C", floor: "1", verified: true, optedIn: true },
  { id: "c6", name: "Meera Iyer", phone: "+91 98XXX XXX06", building: "Building A", floor: "3", verified: false, optedIn: true },
  { id: "c7", name: "Rahul Gupta", phone: "+91 98XXX XXX07", building: "Building B", floor: "2", verified: true, optedIn: true },
  { id: "c8", name: "Anita Desai", phone: "+91 98XXX XXX08", building: "Building C", floor: "2", verified: true, optedIn: true },
];
