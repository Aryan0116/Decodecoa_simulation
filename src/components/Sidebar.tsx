
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Microchip, 
  Binary, 
  CircuitBoard,
  Menu,
  X,
  Clock,
  Calculator,
  HardDrive,
  Server,
  Terminal,
  Cpu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  LogicGateAnd, 
  ComputerIcon, 
  RegisterIcon 
} from "@/components/icons/LogicGateIcons";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
          "hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1",
          isActive ? "bg-slate-100 dark:bg-slate-800 text-blue-600 font-medium" : "text-slate-600 dark:text-slate-400",
        )
      }
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!isCollapsed && <span className="transition-opacity duration-200 whitespace-nowrap">{label}</span>}
    </NavLink>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(!isCollapsed));
  };
  
  // Initialize sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    } else {
      // Default to collapsed on mobile
      setIsCollapsed(window.innerWidth < 768);
    }
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white md:hidden shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={cn("sticky top-0 h-screen z-40 transition-all duration-300", 
                         isCollapsed ? "w-16" : "w-64")}>
        <div 
          className={cn(
            "h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col",
            "fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-64",
            isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            {!isCollapsed && (
              <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent truncate">
                DECODE CO-A
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className={cn("transition-all duration-300", 
                          isCollapsed ? "ml-auto" : "ml-auto")}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
            <nav className="space-y-1">
              <SidebarItem icon={LogicGateAnd} label="Logic Gates" to="/" isCollapsed={isCollapsed} />
              <SidebarItem icon={CircuitBoard} label="Pipelining" to="/pipeline" isCollapsed={isCollapsed} />
              <SidebarItem icon={Binary} label="Number Conversion" to="/converter" isCollapsed={isCollapsed} />
              <SidebarItem icon={Microchip} label="CPU Components" to="/cpu" isCollapsed={isCollapsed} />
              <SidebarItem icon={ComputerIcon} label="Computer Organization" to="/organization" isCollapsed={isCollapsed} />
              <SidebarItem icon={Binary} label="Number Systems" to="/number-systems" isCollapsed={isCollapsed} />
              <SidebarItem icon={RegisterIcon} label="Processor Architecture" to="/processor" isCollapsed={isCollapsed} />
              <SidebarItem icon={Clock} label="Timing & Control" to="/timing-control" isCollapsed={isCollapsed} />
              <SidebarItem icon={Calculator} label="ALU Operations" to="/alu" isCollapsed={isCollapsed} />
              <SidebarItem icon={HardDrive} label="Memory Organization" to="/memory" isCollapsed={isCollapsed} />
              <SidebarItem icon={Server} label="I/O Organization" to="/io" isCollapsed={isCollapsed} />
              <SidebarItem icon={Server} label="Bus Structure" to="/bus" isCollapsed={isCollapsed} />
              <SidebarItem icon={Cpu} label="Assembly Simulator" to="/assembly" isCollapsed={isCollapsed} />
            </nav>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-center text-slate-500">
            {!isCollapsed && (
              <div className="flex flex-col gap-1">
                <span>DECODE CO-A Simulation v1.0</span>
                <div className="flex justify-center gap-2 mt-1">
                  <a href="#" className="hover:text-blue-600 transition-colors">Help</a>
                  <span>•</span>
                  <a href="#" className="hover:text-blue-600 transition-colors">About</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
