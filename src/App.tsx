import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import VoiceAssistant from "./components/VoiceAssistant";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./components/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import BuildingsPage from "./pages/BuildingsPage";
import EnergyMonitoringPage from "./pages/EnergyMonitoringPage";
import WaterManagementPage from "./pages/WaterManagementPage";
import WasteManagementPage from "./pages/WasteManagementPage";
import AnomaliesPage from "./pages/AnomaliesPage";
import ForecastingPage from "./pages/ForecastingPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import TasksPage from "./pages/TasksPage";
import SMSPage from "./pages/SMSPage";
import ReportsPage from "./pages/ReportsPage";
import DataManagementPage from "./pages/DataManagementPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <OverviewPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/buildings"
            element={
              <DashboardLayout>
                <BuildingsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/energy"
            element={
              <DashboardLayout>
                <EnergyMonitoringPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/water"
            element={
              <DashboardLayout>
                <WaterManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/waste"
            element={
              <DashboardLayout>
                <WasteManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/anomalies"
            element={
              <DashboardLayout>
                <AnomaliesPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/forecasting"
            element={
              <DashboardLayout>
                <ForecastingPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/recommendations"
            element={
              <DashboardLayout>
                <RecommendationsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/tasks"
            element={
              <DashboardLayout>
                <TasksPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/sms"
            element={
              <DashboardLayout>
                <SMSPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <DashboardLayout>
                <ReportsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/data"
            element={
              <DashboardLayout>
                <DataManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* Voice Assistant - available on all pages */}
        <VoiceAssistant />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
