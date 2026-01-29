import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { PageLoader } from "@/components/PageLoader";
import { DashboardHeader } from "./components/DashboardHeader";
import { ScanActionCard } from "./components/ScanActionCard";
import { RecentScans } from "./components/RecentScans";

export default function ConsumerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }, [isLoading, isAuthenticated, navigate, location]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 pb-20">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-0" />
      
      <div className="max-w-md mx-auto relative z-10 space-y-6">
        <DashboardHeader />

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-1">Hello, {user?.name || "Consumer"}</h1>
          <p className="text-gray-400">Verify your medicines instantly.</p>
        </motion.div>

        <ScanActionCard />
        <RecentScans limit={5} />
      </div>
    </div>
  );
}