import {
  Home,
  Scan,
  Pill,
  FileText,
  Bell,
  Settings,
  LogOut,
  Activity,
  History,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { isLoading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }, [isLoading, isAuthenticated, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Scan, label: "Scan Medicine", path: "/dashboard/scan" },
    { icon: History, label: "Scan History", path: "/dashboard/history" },
    { icon: Pill, label: "Medicines", path: "/dashboard/medicines" },
    { icon: FileText, label: "Health Records", path: "/dashboard/records" },
    { icon: Activity, label: "Prescriptions", path: "/dashboard/prescriptions" },
    { icon: Bell, label: "Alerts", path: "/dashboard/alerts" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-950 text-white">
        <Sidebar className="border-r border-slate-800 bg-slate-900 text-white">
          <SidebarHeader className="border-b border-slate-800 p-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Dhanvantari" className="h-8 w-8" />
              <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-samarkan tracking-wide pt-1">Dhanvantari</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                    className="text-gray-400 hover:text-white hover:bg-slate-800 data-[active=true]:bg-slate-800 data-[active=true]:text-cyan-400"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-slate-800 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-slate-800"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 bg-slate-950">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6">
            <SidebarTrigger className="text-white hover:bg-slate-800" />
            <div className="flex-1" />
          </header>
          <main className="p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}