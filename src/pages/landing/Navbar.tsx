import { Button } from "@/components/ui/button";
import { ArrowRight, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 w-full">
      <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={() => navigate("/")}>
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-cyan-400/20 rounded-full" />
          <img
            src="https://harmless-tapir-303.convex.cloud/api/storage/6fe7d1e8-1ae1-4599-8bb9-5c6b39e1af03"
            alt="Dhanvantari Logo"
            className="relative h-[46px] w-[46px] md:h-[76px] md:w-[76px] object-cover rounded-full transition-all duration-300"
          />
        </div>
        <span className="text-[28px] md:text-[46px] font-normal bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-samarkan tracking-wide transition-all duration-300 pt-2">
          Dhanvantari
        </span>
      </div>

      {/* Navigation Sidebar */}
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-cyan-400 transition-colors">
              <Menu className="h-8 w-8" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-slate-950/95 backdrop-blur-xl border-l border-cyan-500/20 text-white w-[300px] z-[100]">
            <SheetHeader>
              <SheetTitle className="text-left text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8 mt-4">
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6">
              <button 
                onClick={() => scrollToSection('hero')} 
                className="text-lg font-medium text-gray-300 hover:text-cyan-400 transition-colors text-left flex items-center gap-2"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-lg font-medium text-gray-300 hover:text-cyan-400 transition-colors text-left flex items-center gap-2"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('team')} 
                className="text-lg font-medium text-gray-300 hover:text-cyan-400 transition-colors text-left flex items-center gap-2"
              >
                Team
              </button>
              <button 
                onClick={() => scrollToSection('location')} 
                className="text-lg font-medium text-gray-300 hover:text-cyan-400 transition-colors text-left flex items-center gap-2"
              >
                Contact
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Button
          onClick={() => {
            console.log("Navigating to dashboard");
            navigate("/dashboard");
          }}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
        >
          Scan now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}