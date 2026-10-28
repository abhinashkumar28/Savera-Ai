import { Link } from "react-router-dom";
import NetworkGraphCanvas from "../components/NetworkGraphCanvas";
import {
  Zap,
  Building2,
  Brain,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Shield,
  TrendingDown,
  Activity,
  Network,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#15370D" }}>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <NetworkGraphCanvas />

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border" style={{ backgroundColor: "rgba(229, 205, 130, 0.15)", borderColor: "rgba(229, 205, 130, 0.3)" }}>
              <Zap className="h-5 w-5" style={{ color: "#E5CD82" }} />
            </div>
            <span className="text-lg font-semibold tracking-tight" style={{ color: "#f0ead6" }}>
              Savera<span style={{ color: "#E5CD82" }}>AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#a8b8a0" }}>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <Link
            to="/dashboard"
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: "#E5CD82", color: "#15370D" }}
          >
            Open Dashboard
          </Link>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center">
          <div className="animate-fade-up">
            <span className="inline-block rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide uppercase mb-6" style={{ borderColor: "rgba(229, 205, 130, 0.3)", backgroundColor: "rgba(229, 205, 130, 0.1)", color: "#FFF2B4" }}>
              AI-Powered Energy Intelligence
            </span>
            <h1 className="max-w-3xl text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: "#f0ead6" }}>
              Smarter Energy.{" "}
              <span style={{ color: "#E5CD82" }}>
                Clearer Insights.
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-base md:text-lg mb-10 leading-relaxed" style={{ color: "#a8b8a0" }}>
              Savera AI monitors electricity consumption across your buildings, detects anomalies before they escalate, and delivers actionable recommendations — all in one intelligent platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
                style={{ backgroundColor: "#E5CD82", color: "#15370D" }}
              >
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
                style={{ borderColor: "#2d5e23", color: "#f0ead6" }}
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y" style={{ backgroundColor: "#1a4210", borderColor: "#2d5e23" }}>
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4" style={{ borderColor: "#2d5e23" }}>
          {[
            { label: "Buildings Monitored", value: "2+" },
            { label: "Anomalies Detected", value: "Real-time" },
            { label: "Energy Saved", value: "Est. 15-25%" },
            { label: "Response Time", value: "< 5 min" },
          ].map((stat, i) => (
            <div key={stat.label} className="px-6 py-6 text-center" style={{ borderRight: i < 3 ? "1px solid #2d5e23" : "none" }}>
              <div className="text-xl md:text-2xl font-bold" style={{ color: "#E5CD82" }}>{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: "#a8b8a0" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-12" style={{ backgroundColor: "#15370D" }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#f0ead6" }}>
              Everything You Need to Manage Energy
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: "#a8b8a0" }}>
              From real-time monitoring to AI-driven anomaly detection and automated alerts — Savera AI gives you complete control over your campus energy footprint.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Energy Monitoring",
                desc: "Real-time consumption tracking with hourly, daily, and monthly breakdowns. Compare buildings and identify peak usage patterns.",
                color: "#E5CD82",
                bg: "rgba(229, 205, 130, 0.1)",
              },
              {
                icon: Brain,
                title: "AI Anomaly Detection",
                desc: "Automatically detect unusual consumption patterns. Get severity-rated alerts with explanations of what went wrong and why.",
                color: "#728E6D",
                bg: "rgba(114, 142, 109, 0.15)",
              },
              {
                icon: TrendingDown,
                title: "Forecasting & Savings",
                desc: "Predict upcoming consumption and identify potential wastage before it happens. Track estimated and verified savings.",
                color: "#4ade80",
                bg: "rgba(74, 222, 128, 0.1)",
              },
              {
                icon: Building2,
                title: "Building Management",
                desc: "Manage multiple buildings under one campus. Assign managers, track per-building history, and compare performance.",
                color: "#60a5fa",
                bg: "rgba(96, 165, 250, 0.1)",
              },
              {
                icon: MessageSquare,
                title: "SMS Alerts & Messaging",
                desc: "One-click anomaly notifications to building residents. Bulk messaging for maintenance schedules and energy advisories.",
                color: "#f97316",
                bg: "rgba(249, 115, 22, 0.1)",
              },
              {
                icon: Shield,
                title: "Role-Based Access",
                desc: "Secure authentication with admin, facility manager, and staff roles. Building-level access restrictions and audit logs.",
                color: "#a78bfa",
                bg: "rgba(167, 139, 250, 0.1)",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border p-6 transition-colors"
                style={{ backgroundColor: "#1f4d14", borderColor: "#2d5e23" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(229, 205, 130, 0.3)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2d5e23")}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg mb-4" style={{ backgroundColor: feature.bg }}>
                  <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#f0ead6" }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#a8b8a0" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 border-t" style={{ backgroundColor: "#1a4210", borderColor: "#2d5e23" }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-16" style={{ color: "#f0ead6" }}>How Savera AI Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Monitor", desc: "Electricity readings are collected from buildings — via CSV import, simulated data, or future IoT meters." },
              { step: "02", title: "Analyze", desc: "AI compares actual consumption against expected baselines, considering occupancy, weather, and time context." },
              { step: "03", title: "Detect", desc: "Unusual patterns trigger anomaly alerts with severity levels, explanations, and probable causes." },
              { step: "04", title: "Act", desc: "Get actionable recommendations, send SMS alerts, create tasks, and track verified savings." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <span className="text-4xl font-bold" style={{ color: "rgba(229, 205, 130, 0.2)" }}>{item.step}</span>
                <h3 className="text-lg font-semibold mt-2 mb-2" style={{ color: "#f0ead6" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#a8b8a0" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 border-t" style={{ backgroundColor: "#15370D", borderColor: "#2d5e23" }}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#f0ead6" }}>
            Ready to Take Control of Your Energy?
          </h2>
          <p className="mb-8" style={{ color: "#a8b8a0" }}>
            Launch the Savera AI dashboard to explore energy monitoring, anomaly detection, forecasting, and more — all with simulated data.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#E5CD82", color: "#15370D" }}
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 md:px-12" style={{ backgroundColor: "#0d2408", borderColor: "#2d5e23" }}>
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" style={{ color: "#E5CD82" }} />
            <span className="text-sm font-medium" style={{ color: "#a8b8a0" }}>
              Savera AI — Intelligent Energy Monitoring
            </span>
          </div>
          <p className="text-xs" style={{ color: "#728E6D" }}>
            Demo mode • Simulated data • No real meter connections
          </p>
        </div>
      </footer>
    </div>
  );
}
