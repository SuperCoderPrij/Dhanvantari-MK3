import { Outlet, useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { LayoutDashboard, Package, PlusCircle, QrCode, FileText, LogOut, Settings, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useWeb3 } from "@/hooks/use-web3";
import { useEffect } from "react";

export default function ManufacturerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isAuthenticated, isLoading, user } = useAuth();
  const { account, connectWallet, disconnectWallet } = useWeb3();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }, [isLoading, isAuthenticated, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/manufacturer" },
    { icon: Package, label: "My Medicines", path: "/manufacturer/medicines" },
    { icon: PlusCircle, label: "Mint New", path: "/manufacturer/create" },
    { icon: QrCode, label: "Generate QR", path: "/manufacturer/generate-qr" },
    { icon: FileText, label: "Reports", path: "/manufacturer/reports" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <img 
              src="https://harmless-tapir-303.convex.cloud/api/storage/6fe7d1e8-1ae1-4599-8bb9-5c6b39e1af03" 
              alt="Logo" 
              className="h-8 w-8 rounded-full" 
            />
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Dhanvantari
            </span>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          {sidebarItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200",
                location.pathname === item.path
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4">
          {user && (
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shrink-0">
                <User className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name || "Manufacturer"}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <Button 
            variant="outline"
            className={cn(
              "w-full justify-start border-slate-700 bg-slate-800/50",
              account 
                ? "text-green-400 hover:text-green-300 hover:bg-green-500/10 border-green-500/20" 
                : "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border-cyan-500/20"
            )}
            onClick={account ? disconnectWallet : connectWallet}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <span className="font-bold">Manufacturer Portal</span>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-0" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}