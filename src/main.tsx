import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import "./types/global.d.ts";

// Lazy load route components
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Consumer Pages
const ConsumerDashboard = lazy(() => import("./pages/consumer/Dashboard.tsx"));
const MedicineScan = lazy(() => import("./pages/MedicineScan.tsx"));
const Medicines = lazy(() => import("./pages/Medicines.tsx"));
const HealthRecords = lazy(() => import("./pages/HealthRecords.tsx"));
const Prescriptions = lazy(() => import("./pages/Prescriptions.tsx"));
const Alerts = lazy(() => import("./pages/Alerts.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));

// Manufacturer Pages
const ManufacturerLayout = lazy(() => import("./pages/manufacturer/ManufacturerLayout.tsx"));
const ManufacturerDashboard = lazy(() => import("./pages/manufacturer/Dashboard.tsx"));
const ManufacturerMedicines = lazy(() => import("./pages/manufacturer/Medicines.tsx"));
const CreateMedicine = lazy(() => import("./pages/manufacturer/CreateMedicine.tsx"));
const GenerateQR = lazy(() => import("./pages/manufacturer/GenerateQR.tsx"));
const ManufacturerReports = lazy(() => import("./pages/manufacturer/Reports.tsx"));

// Public Pages
const Verify = lazy(() => import("./pages/Verify.tsx"));
const NotVerified = lazy(() => import("./pages/NotVerified.tsx"));
const Reports = lazy(() => import("./pages/Reports.tsx"));

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <div className="relative flex min-h-screen flex-col">
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Public Verification Routes */}
                <Route path="/verify" element={<Verify />} />
                <Route path="/not-verified" element={<NotVerified />} />
                <Route path="/reports" element={<Reports />} />

                {/* Consumer Dashboard */}
                <Route path="/dashboard" element={<ConsumerDashboard />}>
                  {/* Note: The ConsumerDashboard component in the reference might handle its own sub-routes or be a single page. 
                      Based on the file structure, it seems Dashboard.tsx is the main view. 
                      If it has an Outlet, we add children. If not, we might need to adjust.
                      The reference Dashboard.tsx seems to be a single page dashboard.
                      However, the original project had sub-routes. 
                      Let's keep the sub-routes for now as they were in the original project, 
                      but we might need to check if ConsumerDashboard renders an Outlet.
                      Looking at the read file, ConsumerDashboard.tsx does NOT seem to have an Outlet.
                      It seems to be a standalone dashboard page.
                      The other pages (Medicines, HealthRecords) are separate.
                  */}
                </Route>
                <Route path="/dashboard/scan" element={<MedicineScan />} />
                <Route path="/dashboard/medicines" element={<Medicines />} />
                <Route path="/dashboard/records" element={<HealthRecords />} />
                <Route path="/dashboard/prescriptions" element={<Prescriptions />} />
                <Route path="/dashboard/alerts" element={<Alerts />} />
                <Route path="/dashboard/settings" element={<Settings />} />

                {/* Manufacturer Portal */}
                <Route path="/manufacturer" element={<ManufacturerLayout />}>
                  <Route index element={<ManufacturerDashboard />} />
                  <Route path="medicines" element={<ManufacturerMedicines />} />
                  <Route path="create" element={<CreateMedicine />} />
                  <Route path="generate-qr" element={<GenerateQR />} />
                  <Route path="reports" element={<ManufacturerReports />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);