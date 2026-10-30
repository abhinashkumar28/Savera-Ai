import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  AlertCircle,
  CheckCircle,
  Database,
  Download,
  FileText,
  Upload,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_ROWS = 100_000;
const PAGE_SIZE = 50;

interface EnergyReading {
  timestamp?: string;
  building: string;
  consumption: number;
  state?: string;
  temperature?: number;
  occupancy?: number;
  dayOfWeek?: string;
  isHoliday?: boolean;
  rowNumber: number;
  sourceValues: string[];
}

interface ImportResult {
  filename: string;
  headers: string[];
  rows: EnergyReading[];
  isUtilityDataset: boolean;
  consumptionUnit: string;
  totalRows: number;
  duplicateRows: number;
  invalidRows: number;
  errors: string[];
}

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const firstLine = content.split(/\r?\n/, 1)[0] ?? "";
  const delimiterCounts = [",", ";", "\t"].map((delimiter) => {
    let count = 0;
    let quoted = false;
    for (let index = 0; index < firstLine.length; index += 1) {
      if (firstLine[index] === '"') {
        if (quoted && firstLine[index + 1] === '"') index += 1;
        else quoted = !quoted;
      } else if (firstLine[index] === delimiter && !quoted) {
        count += 1;
      }
    }
    return count;
  });
  const delimiters = [",", ";", "\t"];
  const delimiter = delimiters[delimiterCounts.indexOf(Math.max(...delimiterCounts))];

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];

    if (character === '"') {
      if (inQuotes && content[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (inQuotes) {
        inQuotes = false;
      } else if (cell.length === 0) {
        inQuotes = true;
      } else {
        throw new Error("The CSV contains a quote in an unexpected position.");
      }
    } else if (character === delimiter && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && content[index + 1] === "\n") index += 1;
      row.push(cell.trim());
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }

    if (rows.length > MAX_ROWS + 1) {
      throw new Error(`The CSV exceeds the ${MAX_ROWS.toLocaleString()} row limit.`);
    }
  }

  if (inQuotes) throw new Error("The CSV has an unclosed quoted field.");
  row.push(cell.trim());
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

function normalizeHeader(value: string): string {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function findColumn(headers: string[], aliases: string[]): number {
  return headers.findIndex((header) => aliases.includes(header));
}

function parseOptionalNumber(value: string, label: string, rowNumber: number, integer = false): number | undefined {
  if (value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || (integer && !Number.isInteger(parsed))) {
    throw new Error(`Row ${rowNumber}: ${label} must be a ${integer ? "whole number" : "valid number"}.`);
  }
  return parsed;
}

function parseImport(content: string, filename: string): ImportResult {
  const records = parseCsv(content);
  if (records.length < 2) throw new Error("The CSV must include a header row and at least one data row.");

  const headers = records[0].map(normalizeHeader);
  const timestampColumn = findColumn(headers, [
    "timestamp",
    "time_stamp",
    "datetime",
    "date_time",
    "date_and_time",
    "date",
    "time",
    "reading_time",
    "reading_date",
    "reading_datetime",
    "reading_date_time",
    "year",
    "report_year",
    "reporting_year",
    "data_year",
  ]);
  const utilityNameColumn = findColumn(headers, ["utility_name", "utility"]);
  const utilityNumberColumn = findColumn(headers, ["utility_number", "utility_id"]);
  const buildingColumn = findColumn(headers, [
    "building_id",
    "building",
    "building_name",
    "building_code",
    "building_identifier",
    "facility",
    "facility_id",
    "facility_name",
    "site",
    "site_id",
    "site_name",
    "meter",
    "meter_id",
    "meter_name",
    "asset",
    "asset_id",
    "location",
    "utility_name",
    "utility",
    "utility_number",
    "utility_id",
  ]);
  const consumptionColumn = findColumn(headers, [
    "consumption_kwh",
    "energy_consumption_kwh",
    "electricity_consumption_kwh",
    "power_consumption_kwh",
    "energy_kwh",
    "electricity_kwh",
    "usage_kwh",
    "total_kwh",
    "reading_kwh",
    "energy_used_kwh",
    "energy_consumed_kwh",
    "uses_consumed",
    "uses_total",
    "energy_consumed",
    "electricity_consumed",
    "kwh",
    "consumption",
    "energy",
    "electricity",
    "usage",
    "units",
    "value",
  ]);
  const isUtilityDataset = utilityNameColumn >= 0 || utilityNumberColumn >= 0;
  const missingColumns = [
    timestampColumn < 0 && !isUtilityDataset && "timestamp",
    buildingColumn < 0 && "building_id",
    consumptionColumn < 0 && "consumption_kwh",
  ].filter(Boolean);

  if (missingColumns.length) {
    const actualHeaders = records[0].map((header) => header.trim()).filter(Boolean);
    const found = actualHeaders.length
      ? ` Headers found: ${actualHeaders.map((header) => `"${header}"`).join(", ")}.`
      : " No column headers were found.";
    const expected = isUtilityDataset
      ? "For utility data, include Utility.Name or Utility.Number and Uses.Consumed (a date column is optional)."
      : "Use a date/time column, a building or meter name, and an energy/consumption column, or download the CSV template.";
    throw new Error(
      `Could not identify ${missingColumns.join(", ")} from your CSV headers.${found} ${expected}`
    );
  }

  const stateColumn = findColumn(headers, ["utility_state", "state", "state_name"]);
  const temperatureColumn = findColumn(headers, ["temperature", "temperature_c", "temp"]);
  const occupancyColumn = findColumn(headers, ["occupancy", "occupants"]);
  const dayColumn = findColumn(headers, ["day_of_week", "day"]);
  const holidayColumn = findColumn(headers, ["is_holiday", "holiday"]);
  const readings: EnergyReading[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();
  let duplicateRows = 0;
  let invalidRows = 0;
  const totalRows = records.length - 1;

  records.slice(1).forEach((record, index) => {
    const rowNumber = index + 2;
    try {
      if (record.length !== headers.length) {
        throw new Error(`Row ${rowNumber}: expected ${headers.length} columns but found ${record.length}.`);
      }
      const timestampValue = timestampColumn >= 0 ? record[timestampColumn].trim() : "";
      const buildingValue = record[buildingColumn].trim();
      const utilityNumber = utilityNumberColumn >= 0 ? record[utilityNumberColumn].trim() : "";
      const building = buildingValue || utilityNumber;
      const consumptionValue = record[consumptionColumn].trim();
      const timestamp = timestampValue ? new Date(timestampValue) : undefined;
      const consumption = Number(consumptionValue.replace(/,/g, ""));

      if (timestampValue && (!timestamp || Number.isNaN(timestamp.getTime()))) {
        throw new Error(`Row ${rowNumber}: timestamp must be a valid date.`);
      }
      if (!building) throw new Error(`Row ${rowNumber}: building identifier cannot be empty.`);
      if (!consumptionValue || !Number.isFinite(consumption) || consumption < 0) {
        throw new Error(`Row ${rowNumber}: consumption must be a number greater than or equal to zero.`);
      }

      const temperature = temperatureColumn >= 0
        ? parseOptionalNumber(record[temperatureColumn], "temperature", rowNumber)
        : undefined;
      const occupancy = occupancyColumn >= 0
        ? parseOptionalNumber(record[occupancyColumn], "occupancy", rowNumber, true)
        : undefined;
      if (occupancy !== undefined && occupancy < 0) {
        throw new Error(`Row ${rowNumber}: occupancy cannot be negative.`);
      }

      let isHoliday: boolean | undefined;
      if (holidayColumn >= 0 && record[holidayColumn] !== "") {
        const holidayValue = record[holidayColumn].trim().toLowerCase();
        if (["true", "yes", "1"].includes(holidayValue)) isHoliday = true;
        else if (["false", "no", "0"].includes(holidayValue)) isHoliday = false;
        else throw new Error(`Row ${rowNumber}: is_holiday must be true or false.`);
      }

      const isoTimestamp = timestamp?.toISOString();
      if (isoTimestamp) {
        const duplicateKey = `${building.toLowerCase()}|${isoTimestamp}`;
        if (seen.has(duplicateKey)) {
          duplicateRows += 1;
          return;
        }
        seen.add(duplicateKey);
      }
      readings.push({
        timestamp: isoTimestamp,
        building,
        consumption,
        state: stateColumn >= 0 ? record[stateColumn].trim() || undefined : undefined,
        temperature,
        occupancy,
        dayOfWeek: dayColumn >= 0 ? record[dayColumn] || undefined : undefined,
        isHoliday,
        rowNumber,
        sourceValues: record,
      });
    } catch (error) {
      invalidRows += 1;
      if (errors.length < 10) {
        errors.push(error instanceof Error ? error.message : `Row ${rowNumber}: invalid data.`);
      }
    }
  });

  const consumptionHeader = records[0][consumptionColumn].trim();
  const consumptionUnit = /_kwh\b/i.test(normalizeHeader(consumptionHeader)) ? "kWh" : "reported units";
  return {
    filename,
    headers: records[0].map((header) => header.trim()),
    rows: readings,
    isUtilityDataset,
    consumptionUnit,
    totalRows,
    duplicateRows,
    invalidRows,
    errors,
  };
}

function downloadTemplate() {
  const content = [
    "timestamp,building_id,consumption_kwh,temperature,occupancy,day_of_week,is_holiday",
    "2026-10-28T09:00:00Z,Building A,42.5,26,120,Wednesday,false",
    "2026-10-28T10:00:00Z,Building A,48.2,27,135,Wednesday,false",
    "2026-10-28T09:00:00Z,Building B,31.8,25,85,Wednesday,false",
  ].join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "savera-energy-template.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function formatNumber(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value);
}

export default function DataManagementPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [page, setPage] = useState(0);

  const analytics = useMemo(() => {
    if (!result?.rows.length) return null;
    const byDate = new Map<string, { date: string; consumption: number; readings: number }>();
    const byBuilding = new Map<string, number>();
    const byState = new Map<string, number>();
    let temperatureTotal = 0;
    let temperatureCount = 0;
    let occupancyTotal = 0;
    let occupancyCount = 0;

    result.rows.forEach((reading) => {
      if (reading.timestamp) {
        const date = reading.timestamp.slice(0, 10);
        const daily = byDate.get(date) ?? { date, consumption: 0, readings: 0 };
        daily.consumption += reading.consumption;
        daily.readings += 1;
        byDate.set(date, daily);
      }
      byBuilding.set(reading.building, (byBuilding.get(reading.building) ?? 0) + reading.consumption);
      if (reading.state) {
        byState.set(reading.state, (byState.get(reading.state) ?? 0) + reading.consumption);
      }
      if (reading.temperature !== undefined) {
        temperatureTotal += reading.temperature;
        temperatureCount += 1;
      }
      if (reading.occupancy !== undefined) {
        occupancyTotal += reading.occupancy;
        occupancyCount += 1;
      }
    });

    const datedRows = result.rows.filter((reading) => reading.timestamp);
    const sortedRows = [...datedRows].sort((a, b) => a.timestamp!.localeCompare(b.timestamp!));
    const totalConsumption = result.rows.reduce((total, reading) => total + reading.consumption, 0);
    const peak = result.rows.reduce((highest, reading) => (
      reading.consumption > highest.consumption ? reading : highest
    ));

    return {
      daily: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
      states: [...byState.entries()]
        .map(([state, consumption]) => ({ state, consumption }))
        .sort((a, b) => b.consumption - a.consumption)
        .slice(0, 10),
      buildings: [...byBuilding.entries()]
        .map(([building, consumption]) => ({ building, consumption }))
        .sort((a, b) => b.consumption - a.consumption)
        .slice(0, 10),
      totalConsumption,
      averageConsumption: totalConsumption / result.rows.length,
      peak,
      firstDate: sortedRows[0]?.timestamp,
      lastDate: sortedRows[sortedRows.length - 1]?.timestamp,
      buildingCount: byBuilding.size,
      stateCount: byState.size,
      averageTemperature: temperatureCount ? temperatureTotal / temperatureCount : undefined,
      averageOccupancy: occupancyCount ? occupancyTotal / occupancyCount : undefined,
      temperatureCount,
      occupancyCount,
    };
  }, [result]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setErrorMessage("");
    setResult(null);
    setPage(0);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Please choose a CSV file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("This file is larger than 10 MB. Please upload a smaller CSV file.");
      return;
    }
    if (file.size === 0) {
      setErrorMessage("The selected file is empty.");
      return;
    }

    setIsImporting(true);
    try {
      const imported = parseImport(await file.text(), file.name);
      setResult(imported);
      if (!imported.rows.length) {
        setErrorMessage("No valid readings were found. Review the row errors below and upload a corrected file.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "The CSV could not be read.");
    } finally {
      setIsImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    void handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  };

  const currentRows = result?.rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) ?? [];
  const pageCount = result ? Math.ceil(result.rows.length / PAGE_SIZE) : 0;

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Data Management</h2>
          <p className="text-sm text-savera-text-dim mt-1">
            Upload energy readings to explore trends, building comparisons, and data quality.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-savera-border px-3 py-2 text-xs font-medium text-savera-text-dim hover:text-white hover:bg-savera-surface transition-colors"
        >
          <Download className="h-4 w-4" />
          Download CSV template
        </button>
      </div>

      <section className="rounded-xl border border-savera-border bg-savera-card p-5">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="h-4 w-4 text-savera-amber" />
          <h3 className="text-sm font-semibold text-white">Import CSV Data</h3>
        </div>
        <p className="text-xs text-savera-text-dim mb-4">
          Meter data can include <span className="font-mono text-white">timestamp</span>,{" "}
          <span className="font-mono text-white">building_id</span>, and{" "}
          <span className="font-mono text-white">consumption_kwh</span>. Utility reports are also supported:
          <span className="font-mono text-white"> Utility.Name</span> or{" "}
          <span className="font-mono text-white"> Utility.Number</span> with{" "}
          <span className="font-mono text-white"> Uses.Consumed</span>; dates are optional for utility data.
          Files are analyzed in this browser and are limited to 10 MB.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleInputChange}
          className="hidden"
          aria-label="Choose a CSV file"
        />
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer focus:outline-none focus:border-savera-amber ${
            isDragging ? "border-savera-amber bg-savera-amber/5" : "border-savera-border hover:border-savera-amber/40"
          }`}
        >
          <Upload className="h-8 w-8 text-savera-text-dim mx-auto mb-3" />
          <p className="text-sm text-white font-medium">
            {isImporting ? "Reading and analyzing your CSV..." : "Drop your CSV file here"}
          </p>
          <p className="text-xs text-savera-text-dim mt-1">or click to browse • CSV up to 10 MB</p>
        </div>

        {errorMessage && (
          <div role="alert" className="mt-4 rounded-lg border border-savera-danger/30 bg-savera-danger/5 px-4 py-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-savera-danger flex-shrink-0 mt-0.5" />
            <p className="text-xs text-savera-danger">{errorMessage}</p>
          </div>
        )}

        {result && result.rows.length > 0 && (
          <div role="status" className="mt-4 rounded-lg border border-savera-success/30 bg-savera-success/5 px-4 py-3 flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-savera-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-savera-success">CSV analyzed: {result.filename}</p>
              <p className="text-xs text-savera-text-dim mt-0.5">
                {formatNumber(result.rows.length, 0)} {result.isUtilityDataset ? "utilities" : "readings"} ready • {formatNumber(result.duplicateRows, 0)} duplicates skipped •{" "}
                {formatNumber(result.invalidRows, 0)} invalid rows
              </p>
            </div>
          </div>
        )}
      </section>

      {result && (
        <>
          <section className="rounded-xl border border-savera-border bg-savera-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-4 w-4 text-savera-info" />
              <h3 className="text-sm font-semibold text-white">Dataset Overview</h3>
            </div>
            {analytics ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: result.isUtilityDataset ? "Utilities" : "Valid readings", value: formatNumber(result.rows.length, 0), detail: `of ${formatNumber(result.totalRows, 0)} rows` },
                    { label: "Total consumption", value: `${formatNumber(analytics.totalConsumption)} ${result.consumptionUnit}`, detail: "Across valid records" },
                    { label: result.isUtilityDataset ? "Average per utility" : "Average per reading", value: `${formatNumber(analytics.averageConsumption)} ${result.consumptionUnit}`, detail: "Mean consumption" },
                    { label: result.isUtilityDataset ? "States" : "Buildings", value: formatNumber(result.isUtilityDataset ? analytics.stateCount : analytics.buildingCount, 0), detail: result.isUtilityDataset ? "With reported consumption" : "Unique identifiers" },
                    { label: result.isUtilityDataset ? "Highest consumption" : "Peak reading", value: `${formatNumber(analytics.peak.consumption)} ${result.consumptionUnit}`, detail: analytics.peak.building },
                    { label: "Date coverage", value: analytics.firstDate && analytics.lastDate ? `${new Date(analytics.firstDate).toLocaleDateString()} – ${new Date(analytics.lastDate).toLocaleDateString()}` : "No date column", detail: analytics.firstDate ? "First to last reading" : "Utility snapshot/report" },
                    { label: "Duplicate rows", value: formatNumber(result.duplicateRows, 0), detail: "Skipped during analysis" },
                    { label: "Invalid rows", value: formatNumber(result.invalidRows, 0), detail: "Excluded from charts" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-savera-border p-3 min-w-0">
                      <p className="text-xs text-savera-text-dim">{stat.label}</p>
                      <p className="text-base font-bold text-white mt-1 break-words">{stat.value}</p>
                      <p className="text-xs text-savera-text-dim mt-1 truncate" title={stat.detail}>{stat.detail}</p>
                    </div>
                  ))}
                </div>
                {(analytics.temperatureCount > 0 || analytics.occupancyCount > 0) && (
                  <p className="text-xs text-savera-text-dim mt-4">
                    Optional data averages:{" "}
                    {analytics.averageTemperature !== undefined && `temperature ${formatNumber(analytics.averageTemperature)} °C`}
                    {analytics.averageTemperature !== undefined && analytics.averageOccupancy !== undefined && " • "}
                    {analytics.averageOccupancy !== undefined && `occupancy ${formatNumber(analytics.averageOccupancy, 0)}`}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-savera-text-dim">No valid readings are available in this file.</p>
            )}
          </section>

          {analytics && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {(analytics.daily.length > 0 || analytics.states.length > 0) && (
              <section className="rounded-xl border border-savera-border bg-savera-card p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white">
                    {analytics.daily.length > 0 ? "Consumption over time" : "Consumption by state"}
                  </h3>
                  <p className="text-xs text-savera-text-dim mt-1">
                    {analytics.daily.length > 0 ? "Daily total from the uploaded readings" : "Total reported consumption by state"}
                  </p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    {analytics.daily.length > 0 ? (
                      <AreaChart data={analytics.daily}>
                        <defs>
                          <linearGradient id="importConsumption" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#AA5E7A" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#AA5E7A" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                        <Tooltip
                          labelFormatter={(label) => new Date(`${label}T00:00:00`).toLocaleDateString()}
                          formatter={(value: number) => [`${formatNumber(value)} ${result.consumptionUnit}`, "Consumption"]}
                          contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }}
                        />
                        <Area type="monotone" dataKey="consumption" stroke="#c97d96" fill="url(#importConsumption)" strokeWidth={2} />
                      </AreaChart>
                    ) : (
                      <BarChart data={analytics.states} margin={{ left: 4, right: 12 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                        <XAxis dataKey="state" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                        <Tooltip
                          formatter={(value: number) => [`${formatNumber(value)} ${result.consumptionUnit}`, "Consumption"]}
                          contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }}
                        />
                        <Bar dataKey="consumption" fill="#AA5E7A" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </section>
              )}

              <section className="rounded-xl border border-savera-border bg-savera-card p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white">
                    Consumption by {result.isUtilityDataset ? "utility" : "building"}
                  </h3>
                  <p className="text-xs text-savera-text-dim mt-1">
                    {analytics.buildingCount > 10
                      ? `Top 10 ${result.isUtilityDataset ? "utilities" : "buildings"} by reported consumption`
                      : `Total reported consumption per ${result.isUtilityDataset ? "utility" : "building"}`}
                  </p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.buildings} margin={{ left: 4, right: 12 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2640" />
                      <XAxis dataKey="building" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={{ stroke: "#1e2640" }} tickLine={false} />
                      <Tooltip
                        formatter={(value: number) => [`${formatNumber(value)} ${result.consumptionUnit}`, "Consumption"]}
                        contentStyle={{ background: "#151b2b", border: "1px solid #1e2640", borderRadius: "8px", fontSize: "12px" }}
                      />
                      <Bar dataKey="consumption" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          )}

          {result.errors.length > 0 && (
            <section className="rounded-xl border border-savera-warning/30 bg-savera-warning/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-savera-warning" />
                <h3 className="text-sm font-semibold text-white">Rows needing attention</h3>
              </div>
              <ul className="space-y-1">
                {result.errors.map((message, index) => (
                  <li key={`${index}-${message}`} className="text-xs text-savera-text-dim">{message}</li>
                ))}
                {result.invalidRows > result.errors.length && (
                  <li className="text-xs text-savera-text-dim">
                    Plus {formatNumber(result.invalidRows - result.errors.length, 0)} more invalid rows.
                  </li>
                )}
              </ul>
            </section>
          )}

          {result.rows.length > 0 && (
            <section className="rounded-xl border border-savera-border bg-savera-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-savera-text-dim" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {result.isUtilityDataset ? "Imported utility records" : "Imported readings"}
                  </h3>
                  <p className="text-xs text-savera-text-dim mt-0.5">
                    Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, result.rows.length)} of {formatNumber(result.rows.length, 0)} valid rows • all source columns shown
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-savera-border text-savera-text-dim">
                      {result.headers.map((header) => (
                        <th key={header} className="px-3 py-2 font-medium whitespace-nowrap">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((reading) => (
                      <tr key={`${reading.rowNumber}-${reading.timestamp ?? reading.building}`} className="border-b border-savera-border/60 last:border-0">
                        {reading.sourceValues.map((value, index) => (
                          <td key={`${reading.rowNumber}-${index}`} className="px-3 py-2 text-savera-text-dim whitespace-nowrap">
                            {value || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pageCount > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                    disabled={page === 0}
                    className="rounded-lg border border-savera-border px-3 py-1.5 text-xs text-savera-text-dim hover:text-white disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-savera-text-dim">Page {page + 1} of {pageCount}</span>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                    disabled={page === pageCount - 1}
                    className="rounded-lg border border-savera-border px-3 py-1.5 text-xs text-savera-text-dim hover:text-white disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          )}
        </>
      )}

      {!result && !errorMessage && (
        <section className="rounded-xl border border-savera-border bg-savera-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-savera-teal" />
            <h3 className="text-sm font-semibold text-white">What you’ll get</h3>
          </div>
          <p className="text-xs text-savera-text-dim">
            Upload a CSV to see total and average consumption, peak readings, date coverage, data quality,
            daily trends, building comparisons, and a browsable table of your readings.
          </p>
        </section>
      )}

      <section className="rounded-xl border border-savera-border bg-savera-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-savera-text-dim" />
          <h3 className="text-sm font-semibold text-white">CSV column guide</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-savera-border">
                <th className="text-left px-4 py-2 text-xs font-medium text-savera-text-dim">Column</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-savera-text-dim">Required</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-savera-text-dim">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { column: "timestamp", required: "Yes", description: "Date and time for each reading (ISO 8601 recommended)." },
                { column: "building_id", required: "Yes", description: "Building or meter identifier." },
                { column: "consumption_kwh", required: "Yes", description: "Non-negative energy consumed in kWh." },
                { column: "Utility.Name / Utility.Number", required: "Utility reports", description: "Utility identifier; use with Uses.Consumed for timestamp-free utility datasets." },
                { column: "Uses.Consumed", required: "Utility reports", description: "Reported utility consumption. The source unit is preserved as reported." },
                { column: "Utility.State", required: "No", description: "Used to summarize and chart consumption by state." },
                { column: "temperature", required: "No", description: "Ambient temperature in °C." },
                { column: "occupancy", required: "No", description: "Non-negative whole number of occupants." },
                { column: "day_of_week", required: "No", description: "Day associated with the reading." },
                { column: "is_holiday", required: "No", description: "true/false, yes/no, or 1/0." },
              ].map((row) => (
                <tr key={row.column} className="border-b border-savera-border last:border-0">
                  <td className="px-4 py-2 text-white font-mono text-xs">{row.column}</td>
                  <td className="px-4 py-2 text-xs text-savera-text-dim">{row.required}</td>
                  <td className="px-4 py-2 text-xs text-savera-text-dim">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
