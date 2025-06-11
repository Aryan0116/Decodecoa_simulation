import { Button } from "@/components/ui/button";
import { LogicGateSimulator } from "@/components/LogicGateSimulator";
import { PipelineVisualizer } from "@/components/PipelineVisualizer";
import { NumberConverter } from "@/components/NumberConverter";
import { CpuComponents } from "@/components/CpuComponents";
import { ComputerOrganization } from "@/components/ComputerOrganization";
import { NumberSystems } from "@/components/NumberSystems";
import { ProcessorArchitecture } from "@/components/ProcessorArchitecture";
import { TimingControl } from "@/components/TimingControl";
import { AluOperations } from "@/components/AluOperations";
import { MemoryOrganization } from "@/components/MemoryOrganization";
import { IOOrganization } from "@/components/IOOrganization";
import { BusStructure } from "@/components/BusStructure";
import CACalculator from "@/components/CACalculator";
import { AssemblySimulator } from "@/components/AssemblySimulator";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CircuitBoard, 
  Binary, 
  Microchip, 
  Clock,
  Calculator,
  HardDrive,
  Server,
  Terminal,
  Cpu,
  ChevronRight,
  ArrowUp,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { LogicGateAnd, ComputerIcon, RegisterIcon } from "@/components/icons/LogicGateIcons";

// Navigation items with their metadata
const navItems = [
  { id: "logic", label: "Logic Gates", icon: LogicGateAnd },
  { id: "pipeline", label: "Pipelining", icon: CircuitBoard },
  { id: "converter", label: "Number Conversion", icon: Binary },
  { id: "cpu", label: "CPU Components", icon: Microchip },
  { id: "organization", label: "Computer Organization", icon: ComputerIcon },
  { id: "number-systems", label: "Number Systems", icon: Binary },
  { id: "processor", label: "Processor Architecture", icon: RegisterIcon },
  { id: "timing-control", label: "Timing & Control", icon: Clock },
  { id: "alu", label: "ALU Operations", icon: Calculator },
  { id: "memory", label: "Memory Organization", icon: HardDrive },
  { id: "io", label: "I/O Organization", icon: Server },
  { id: "bus", label: "Bus Structure", icon: Server },
  { id: "assembly", label: "Assembly Simulator", icon: Cpu },
  { id: "calcu", label: "CAO Calculator", icon: Calculator}
];

// Logo component
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="rounded-lg shadow-lg flex items-center justify-center h-8 w-8 md:h-10 md:w-10 overflow-hidden">
      <img src="/favicon.png" alt="DECODE Logo" className="w-full h-full object-cover" />
    </div>
  </div>
);

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("logic");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBreakpointMd, setIsBreakpointMd] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Check if screen is smaller than md breakpoint
  useEffect(() => {
    const checkBreakpoint = () => {
      setIsBreakpointMd(window.innerWidth < 768);
    };
    
    // Initial check
    checkBreakpoint();
    
    // Add event listener
    window.addEventListener('resize', checkBreakpoint);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  useEffect(() => {
    // Handle scroll to top button visibility and header effects
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
      
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "pipeline":
        return <PipelineVisualizer />;
      case "converter":
        return <NumberConverter />;
      case "cpu":
        return <CpuComponents />;
      case "organization":
        return <ComputerOrganization />;
      case "number-systems":
        return <NumberSystems />;
      case "processor":
        return <ProcessorArchitecture />;
      case "timing-control":
        return <TimingControl />;
      case "alu":
        return <AluOperations />;
      case "memory":
        return <MemoryOrganization />;
      case "io":
        return <IOOrganization />;
      case "bus":
        return <BusStructure />;
      case "assembly":
        return <AssemblySimulator />;
      case "calcu":
        return <CACalculator />;
      case "logic":
      default:
        return <LogicGateSimulator />;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    
    // Scroll to top of content
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants
  const sidebarItemVariants = {
    hover: { 
      scale: 1.03, 
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      transition: { duration: 0.2 }
    },
    active: {
      scale: 1.05,
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      transition: { duration: 0.2 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Mobile Menu Toggle */}
      <motion.button 
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Sidebar */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white dark:bg-slate-900 shadow-lg z-40 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center mb-8">
                  <Logo />
                </div>
                <motion.div 
                  className="space-y-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center p-3 rounded-xl transition-all ${
                          activeTab === item.id 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                        variants={itemVariants}
                        whileHover={sidebarItemVariants.hover}
                        animate={activeTab === item.id ? sidebarItemVariants.active : {}}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header 
          className={`bg-gradient-to-r from-blue-600 to-indigo-700 text-white sticky top-0 z-30 transition-all ${
            hasScrolled ? 'shadow-lg' : ''
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo and App Name */}
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={isBreakpointMd ? 'ml-8 md:ml-0' : ''}
                >
                  <Logo />
                </motion.div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl sm:text-2xl md:text-3xl font-bold"
                  >
                    DECODE CO-A Simulation
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-xs sm:text-sm text-blue-100 hidden sm:block"
                  >
                    Interactive computer organization learning
                  </motion.p>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex">
                <Button asChild variant="secondary" size="sm" 
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white shadow-md"
                >
                  <a href="https://aryan0116.github.io/DECODE-CO-A/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Visit DECODE <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <div className="flex items-center text-xs sm:text-sm text-blue-100 pb-3">
              <span>Home</span>
              {activeTab !== "logic" && (
                <>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="capitalize">
                    {navItems.find(item => item.id === activeTab)?.label || activeTab}
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.header>

        {/* Content Area with Desktop/Tablet Sidebar */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <AnimatePresence>
            {!isBreakpointMd && (
              <motion.div 
                className="w-64 lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto shadow-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="sticky top-0 bg-white dark:bg-slate-900 pt-2 pb-4 z-10">
                  <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200 pl-2">Modules</h2>
                </div>
                <motion.div 
                  className="space-y-2 pb-20"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center p-3 rounded-xl transition-all ${
                          activeTab === item.id 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium shadow-sm' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                        variants={itemVariants}
                        whileHover={sidebarItemVariants.hover}
                        animate={activeTab === item.id ? sidebarItemVariants.active : {}}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        <span className="text-sm">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-hidden bg-slate-100 dark:bg-slate-900/60" ref={contentRef}>
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, type: "spring", damping: 15 }}
              className="max-w-6xl mx-auto"
            >
              <main className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
                {renderContent()}
              </main>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-center p-6">
  <div className="max-w-6xl mx-auto">
    <p className="text-slate-300 font-medium">© 2025 DECODE CO-A Simulation</p>
    <p className="mt-1 text-sm text-slate-400">Educational tool for computer organization concepts</p>
    <p className="mt-1 text-sm text-slate-400">A Unit Of Decode CO-A</p>
    <p className="mt-2 text-sm text-slate-400 flex items-center justify-center gap-1">
      Created with love by Decode CO-A Team 
      <span className="text-red-400 inline-block" style={{
        animation: 'heartbeat 1.5s ease-in-out infinite'
      }}>
        ❤️
      </span>
    </p>
    {/* <div className="mt-3 flex flex-wrap justify-center gap-4">
      <a href="#" className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">About</a>
      <a href="https://www.decodecoa.com" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors flex items-center gap-1">
        DECODE CO-A <ExternalLink className="h-3 w-3" />
      </a>
      <a href="#" className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">Privacy Policy</a>
      <a href="#" className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">Terms of Use</a>
    </div> */}
  </div>
  <style jsx>{`
    @keyframes heartbeat {
      0% { transform: scale(1); }
      25% { transform: scale(1.1); }
      50% { transform: scale(1); }
      75% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `}</style>
</footer>
      </div>
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;