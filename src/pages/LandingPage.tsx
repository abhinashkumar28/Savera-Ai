import { Link } from "react-router-dom";
import OrbitalSphereBackground from "../components/OrbitalSphereBackground";
import {
  Zap,
  Building2,
  Brain,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Shield,
  TrendingDown,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-savera-bg">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <OrbitalSphereBackground
          className="absolute inset-0"
          hue={35}
          particleCount={200}
          sphereRadius={180}
          nodeCount={14}
        />

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-savera-rose/20 border border-savera-rose/30">
              <Zap className="h-5 w-5 text-savera-rose" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">
              Savera<span className="text-savera-rose">AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-savera-text-dim">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-savera-text-dim hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg bg-savera-rose px-4 py-2 text-sm font-medium text-white hover:bg-savera-rose-light transition-colors"
            >
              Open Dashboard
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center">
          <div className="animate-fade-up">
            <span className="inline-block rounded-full border border-savera-rose/30 bg-savera-rose/10 px-4 py-1.5 text-xs font-medium text-savera-rose-light tracking-wide uppercase mb-6">
              AI-Powered Resource Intelligence
            </span>
            <h1 className="max-w-3xl text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Smarter Resources.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-savera-rose to-savera-teal">
                Clearer Insights.
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-base md:text-lg text-savera-text-dim mb-10 leading-relaxed">
              Savera AI monitors energy, water, and waste across your buildings, detects anomalies before they escalate, and delivers actionable recommendations — all in one intelligent platform with voice assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-savera-rose px-6 py-3 text-sm font-semibold text-white hover:bg-savera-rose-light transition-colors"
              >
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 rounded-lg border border-savera-border px-6 py-3 text-sm font-medium text-savera-text hover:border-savera-amber/40 hover:text-white transition-colors"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-savera-border bg-savera-surface">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 divide-x divide-savera-border">
          {[
            { label: "Buildings Monitored", value: "2+" },
            { label: "Anomalies Detected", value: "Real-time" },
            { label: "Energy Saved", value: "Est. 15-25%" },
            { label: "Response Time", value: "< 5 min" },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-6 text-center">
              <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-savera-text-dim mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Manage Energy
            </h2>
            <p className="max-w-2xl mx-auto text-savera-text-dim">
              From real-time monitoring to AI-driven anomaly detection and automated alerts — Savera AI gives you complete control over your campus energy footprint.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Energy Monitoring",
                desc: "Real-time consumption tracking with hourly, daily, and monthly breakdowns. Compare buildings and identify peak usage patterns.",
                color: "text-savera-amber",
                bg: "bg-savera-amber/10",
              },
              {
                icon: Brain,
                title: "AI Anomaly Detection",
                desc: "Automatically detect unusual consumption patterns. Get severity-rated alerts with explanations of what went wrong and why.",
                color: "text-savera-teal",
                bg: "bg-savera-teal/10",
              },
              {
                icon: TrendingDown,
                title: "Forecasting & Savings",
                desc: "Predict upcoming consumption and identify potential wastage before it happens. Track estimated and verified savings.",
                color: "text-savera-success",
                bg: "bg-savera-success/10",
              },
              {
                icon: Building2,
                title: "Building Management",
                desc: "Manage multiple buildings under one campus. Assign managers, track per-building history, and compare performance.",
                color: "text-savera-info",
                bg: "bg-savera-info/10",
              },
              {
                icon: MessageSquare,
                title: "SMS Alerts & Voice Assistant",
                desc: "One-click anomaly notifications via SMS. Plus a voice assistant that helps non-technical users navigate with simple voice commands.",
                color: "text-savera-warning",
                bg: "bg-savera-warning/10",
              },
              {
                icon: Shield,
                title: "Water & Waste Management",
                desc: "Monitor water consumption, detect leaks, track waste generation by category, and optimize recycling and composting rates.",
                color: "text-sky-400",
                bg: "bg-sky-400/10",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-savera-border bg-savera-card p-6 hover:border-savera-amber/30 transition-colors"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg} mb-4`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-savera-text-dim leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 border-t border-savera-border">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-white text-center mb-16">How Savera AI Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Monitor", desc: "Electricity readings are collected from buildings — via CSV import, simulated data, or future IoT meters." },
              { step: "02", title: "Analyze", desc: "AI compares actual consumption against expected baselines, considering occupancy, weather, and time context." },
              { step: "03", title: "Detect", desc: "Unusual patterns trigger anomaly alerts with severity levels, explanations, and probable causes." },
              { step: "04", title: "Act", desc: "Get recommendations, send SMS alerts, use voice commands, and track verified savings across energy, water, and waste." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <span className="text-4xl font-bold text-savera-rose/20">{item.step}</span>
                <h3 className="text-lg font-semibold text-white mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-savera-text-dim leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 border-t border-savera-border">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Energy?
          </h2>
          <p className="text-savera-text-dim mb-8">
            Launch the Savera AI dashboard to explore energy, water, and waste monitoring with AI anomaly detection, voice assistant, and forecasting — all with simulated data.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-savera-rose px-8 py-3.5 text-sm font-semibold text-white hover:bg-savera-rose-light transition-colors"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-savera-border py-8 px-6 md:px-12">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-savera-rose" />
            <span className="text-sm font-medium text-savera-text-dim">
              Savera AI — Intelligent Resource Monitoring
            </span>
          </div>
          <p className="text-xs text-savera-text-dim">
            Demo mode • Simulated data • No real meter connections
          </p>
        </div>
      </footer>
    </div>
  );
}
