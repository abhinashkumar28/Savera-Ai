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

// ============ WATER MANAGEMENT ============

export interface WaterReading {
  timestamp: string;
  hour: number;
  buildingA: number;
  buildingB: number;
  buildingC: number;
}

export interface WaterAnomaly {
  id: string;
  buildingName: string;
  timestamp: string;
  actualLiters: number;
  expectedLiters: number;
  deviationLiters: number;
  deviationPercent: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Active" | "Acknowledged" | "Resolved";
  explanation: string;
  possibleCause: string;
}

export const waterReadings: WaterReading[] = Array.from({ length: 24 }, (_, h) => ({
  timestamp: `${String(h).padStart(2, "0")}:00`,
  hour: h,
  buildingA: Math.round((h >= 6 && h <= 20 ? 120 + Math.sin((h - 6) / 14 * Math.PI) * 80 : 30 + Math.random() * 15) * 10) / 10,
  buildingB: Math.round((h >= 5 && h <= 22 ? 180 + Math.sin((h - 5) / 17 * Math.PI) * 100 : 60 + Math.random() * 20) * 10) / 10,
  buildingC: Math.round((h >= 8 && h <= 18 ? 60 + Math.sin((h - 8) / 10 * Math.PI) * 40 : 15 + Math.random() * 8) * 10) / 10,
}));

export const waterAnomalies: WaterAnomaly[] = [
  {
    id: "water-001",
    buildingName: "Building B",
    timestamp: "2026-01-15T03:00:00",
    actualLiters: 420,
    expectedLiters: 180,
    deviationLiters: 240,
    deviationPercent: 133,
    severity: "Critical",
    status: "Active",
    explanation: "Overnight water consumption is 133% above expected. This suggests a significant leak or continuous running tap.",
    possibleCause: "Possible pipe leak in basement, toilet flush mechanism stuck, or irrigation system malfunction.",
  },
  {
    id: "water-002",
    buildingName: "Building A",
    timestamp: "2026-01-14T14:00:00",
    actualLiters: 280,
    expectedLiters: 200,
    deviationLiters: 80,
    deviationPercent: 40,
    severity: "High",
    status: "Acknowledged",
    explanation: "Afternoon water usage is 40% above baseline during normal occupancy hours.",
    possibleCause: "Extended cleaning schedule, additional events, or inefficient fixtures.",
  },
  {
    id: "water-003",
    buildingName: "Building C",
    timestamp: "2026-01-13T10:00:00",
    actualLiters: 95,
    expectedLiters: 70,
    deviationLiters: 25,
    deviationPercent: 36,
    severity: "Medium",
    status: "Resolved",
    explanation: "Morning consumption slightly elevated. Likely due to additional staff present.",
    possibleCause: "Higher occupancy than usual or extended use of kitchen facilities.",
  },
];

export const waterStats = {
  totalDailyLiters: 7250,
  costPerLiter: 0.05,
  totalDailyCost: 362.5,
  leakageEstimate: 15,
  recycledPercentage: 28,
  rainwaterHarvested: 1200,
};

// ============ WASTE MANAGEMENT ============

export interface WasteRecord {
  id: string;
  buildingName: string;
  date: string;
  totalKg: number;
  organic: number;
  recyclable: number;
  hazardous: number;
  general: number;
  eWaste: number;
}

export interface WasteOptimization {
  id: string;
  buildingName: string;
  recommendation: string;
  impact: string;
  priority: "Low" | "Medium" | "High";
  estimatedSavings: string;
}

export const wasteRecords: WasteRecord[] = [
  {
    id: "waste-001",
    buildingName: "Building A",
    date: "2026-01-15",
    totalKg: 85,
    organic: 32,
    recyclable: 28,
    hazardous: 3,
    general: 18,
    eWaste: 4,
  },
  {
    id: "waste-002",
    buildingName: "Building B",
    date: "2026-01-15",
    totalKg: 142,
    organic: 68,
    recyclable: 35,
    hazardous: 5,
    general: 28,
    eWaste: 6,
  },
  {
    id: "waste-003",
    buildingName: "Building C",
    date: "2026-01-15",
    totalKg: 38,
    organic: 12,
    recyclable: 15,
    hazardous: 2,
    general: 7,
    eWaste: 2,
  },
];

export const wasteWeeklyData = [
  { day: "Mon", organic: 95, recyclable: 72, hazardous: 8, general: 48, eWaste: 10 },
  { day: "Tue", organic: 102, recyclable: 68, hazardous: 9, general: 52, eWaste: 8 },
  { day: "Wed", organic: 98, recyclable: 75, hazardous: 7, general: 45, eWaste: 12 },
  { day: "Thu", organic: 110, recyclable: 70, hazardous: 10, general: 50, eWaste: 9 },
  { day: "Fri", organic: 115, recyclable: 80, hazardous: 12, general: 55, eWaste: 15 },
  { day: "Sat", organic: 65, recyclable: 40, hazardous: 5, general: 30, eWaste: 6 },
  { day: "Sun", organic: 55, recyclable: 32, hazardous: 4, general: 25, eWaste: 4 },
];

export const wasteOptimizations: WasteOptimization[] = [
  {
    id: "opt-001",
    buildingName: "Building B",
    recommendation: "Install separate organic waste bins in each floor kitchen area to improve composting rates",
    impact: "Increase organic recycling by 25%",
    priority: "High",
    estimatedSavings: "₹2,400/month",
  },
  {
    id: "opt-002",
    buildingName: "Building A",
    recommendation: "Set up e-waste collection point and partner with certified recycler",
    impact: "Reduce hazardous waste disposal costs",
    priority: "High",
    estimatedSavings: "₹1,800/month",
  },
  {
    id: "opt-003",
    buildingName: "Building C",
    recommendation: "Switch to digital documentation to reduce paper waste by 40%",
    impact: "Reduce recyclable waste and printing costs",
    priority: "Medium",
    estimatedSavings: "₹900/month",
  },
  {
    id: "opt-004",
    buildingName: "All Buildings",
    recommendation: "Implement waste audit schedule and train staff on segregation",
    impact: "Improve overall segregation accuracy from 65% to 85%",
    priority: "Medium",
    estimatedSavings: "₹3,500/month",
  },
];

export const wasteStats = {
  totalWeeklyKg: 1840,
  recyclingRate: 42,
  compostingRate: 55,
  hazardousReduction: 12,
  monthlyCost: 28500,
  co2Saved: 340,
};

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
