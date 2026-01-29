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
const ConsumerLayout = lazy(() => import("./pages/consumer/Layout"));
const ConsumerDashboard = lazy(() => import("./pages/consumer/Dashboard"));
const MedicineScan = lazy(() => import("./pages/consumer/MedicineScan"));
const Medicines = lazy(() => import("./pages/consumer/Medicines"));
const HealthRecords = lazy(() => import("./pages/consumer/HealthRecords"));
const Prescriptions = lazy(() => import("./pages/consumer/Prescriptions"));
const Alerts = lazy(() => import("./pages/consumer/Alerts"));
const Settings = lazy(() => import("./pages/consumer/Settings"));
const ScanHistory = lazy(() => import("./pages/consumer/ScanHistory"));

// Manufacturer Pages
const ManufacturerLayout = lazy(() => import("./pages/manufacturer/ManufacturerLayout"));
const ManufacturerDashboard = lazy(() => import("./pages/manufacturer/Dashboard"));
const ManufacturerMedicines = lazy(() => import("./pages/manufacturer/Medicines"));
const CreateMedicine = lazy(() => import("./pages/manufacturer/CreateMedicine"));
const GenerateQR = lazy(() => import("./pages/manufacturer/GenerateQR"));
const ManufacturerReports = lazy(() => import("./pages/manufacturer/Reports"));

// Public Pages
const Verify = lazy(() => import("./pages/Verify"));
const NotVerified = lazy(() => import("./pages/NotVerified"));
const Reports = lazy(() => import("./pages/Reports"));

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
                <Route path="/dashboard" element={<ConsumerLayout />}>
                  <Route index element={<ConsumerDashboard />} />
                  <Route path="scan" element={<MedicineScan />} />
                  <Route path="history" element={<ScanHistory />} />
                </Route>

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