import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router";

export function DashboardHeader() {
  const navigate = useNavigate();
  
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <img 
          src="https://harmless-tapir-303.convex.cloud/api/storage/6fe7d1e8-1ae1-4599-8bb9-5c6b39e1af03" 
          alt="Logo" 
          className="h-8 w-8 rounded-full" 
        />
        <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-samarkan tracking-wide pt-1">
          Dhanvantari
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/")}
        className="text-cyan-400 hover:text-white hover:bg-cyan-500/20"
      >
        <Home className="h-6 w-6" />
      </Button>
    </header>
  );
}