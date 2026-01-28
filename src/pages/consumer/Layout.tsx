import {
  Home,
  Scan,
  Pill,
  FileText,
  Bell,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";
import { Outlet, useLocation } from "react-router";

export default function Dashboard() {
  const { isLoading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Scan, label: "Scan Medicine", path: "/dashboard/scan" },
    { icon: Pill, label: "Medicines", path: "/dashboard/medicines" },
    { icon: FileText, label: "Health Records", path: "/dashboard/records" },
    { icon: Activity, label: "Prescriptions", path: "/dashboard/prescriptions" },
    { icon: Bell, label: "Alerts", path: "/dashboard/alerts" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}