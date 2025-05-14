
import React, { useState } from "react";
import { 
  Cpu, 
  Calculator, 
  SquareDot, 
  HardDrive, 
  Terminal, 
  MonitorDown, 
  ArrowRight, 
  XCircle,
  ArrowRightToLine,
  ArrowLeftToLine
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ComponentType = "cpu" | "alu" | "control" | "memory" | "input" | "output" | null;

interface ComponentInfo {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  details: string;
}

export function ComputerBlockDiagram() {
  const [activeComponent, setActiveComponent] = useState<ComponentType>(null);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [animationStep, setAnimationStep] = useState<number>(0);

  const componentData: Record<Exclude<ComponentType, null>, ComponentInfo> = {
    cpu: {
      title: "Central Processing Unit (CPU)",
      description: "The brain of the computer that processes instructions",
      icon: Cpu,
      color: "bg-blue-500",
      details: "The CPU is responsible for executing instructions stored in memory. It consists of the Control Unit (CU) that directs operations, the Arithmetic Logic Unit (ALU) that performs calculations, and registers that store data temporarily during processing."
    },
    alu: {
      title: "Arithmetic Logic Unit (ALU)",
      description: "Performs mathematical and logical operations",
      icon: Calculator,
      color: "bg-green-500",
      details: "The ALU performs arithmetic operations (addition, subtraction, etc.) and logical operations (AND, OR, NOT). It takes inputs from registers, performs the specified operation, and stores the result back in a register. It also sets flags based on the result, such as zero, carry, overflow, etc."
    },
    control: {
      title: "Control Unit (CU)",
      description: "Coordinates the operation of the CPU",
      icon: SquareDot,
      color: "bg-purple-500",
      details: "The Control Unit manages the execution of instructions by generating control signals that coordinate the activities of the CPU. It fetches instructions from memory, decodes them to determine the operation to perform, and controls the data flow between registers, the ALU, and memory."
    },
    memory: {
      title: "Memory",
      description: "Stores data and instructions",
      icon: HardDrive,
      color: "bg-yellow-500",
      details: "Memory stores both data and instructions. The CPU fetches instructions from memory, decodes and executes them. Memory is organized in addressable units (bytes), and each location has a unique address. Primary memory (RAM) is volatile and provides fast access to data, while secondary memory (disks) provides permanent storage."
    },
    input: {
      title: "Input Devices",
      description: "Allows data entry into the computer",
      icon: Terminal,
      color: "bg-red-500",
      details: "Input devices enable users to enter data and instructions into a computer. Common input devices include keyboards, mice, scanners, and microphones. The data from input devices is converted to a binary format that can be processed by the CPU."
    },
    output: {
      title: "Output Devices",
      description: "Displays or outputs results from the computer",
      icon: MonitorDown,
      color: "bg-indigo-500",
      details: "Output devices present the results of data processing. Common output devices include monitors, printers, and speakers. The CPU sends binary data to output devices, which convert it to a human-understandable format (visual, audio, etc.)."
    }
  };
  
  const handleComponentClick = (component: ComponentType) => {
    setActiveComponent(component);
  };

  const closeDrawer = () => {
    setActiveComponent(null);
    setShowAnimation(false);
    setAnimationStep(0);
  };
  
  const toggleAnimation = () => {
    setShowAnimation(!showAnimation);
    setAnimationStep(0);
  };
  
  const nextAnimationStep = () => {
    setAnimationStep((prev) => (prev + 1) % 4);
  };

  const renderAnimationContent = () => {
    if (!showAnimation) return null;
    
    const steps = [
      {
        title: "Step 1: Instruction Fetch",
        description: "The CPU fetches the instruction from memory.",
        path: "memory → cpu"
      },
      {
        title: "Step 2: Instruction Decode",
        description: "The Control Unit decodes the instruction to determine the operation.",
        path: "cpu → control"
      },
      {
        title: "Step 3: Execution",
        description: "The ALU performs the arithmetic or logical operation.",
        path: "control → alu"
      },
      {
        title: "Step 4: Store Result",
        description: "The result is stored back in memory or a register.",
        path: "alu → memory"
      }
    ];
    
    return (
      <div className="mt-4 space-y-3">
        <h3 className="font-semibold text-lg">Instruction Cycle Animation</h3>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
          <h4 className="font-medium text-base text-blue-600 dark:text-blue-400">{steps[animationStep].title}</h4>
          <p className="text-sm mt-1">{steps[animationStep].description}</p>
          <div className="text-xs text-slate-500 mt-2">Data flow: {steps[animationStep].path}</div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={nextAnimationStep}>
            Next Step
          </Button>
          <div className="text-sm text-slate-500">
            Step {animationStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    );
  };

  // Define connections between components
  const connections = [
    { from: "input", to: "memory", label: "Data In" },
    { from: "memory", to: "cpu", label: "Instructions" },
    { from: "cpu", to: "memory", label: "Data Access" },
    { from: "cpu", to: "output", label: "Results" }
  ];

  // Animation highlight for the current step
  const getAnimationClass = (component: ComponentType) => {
    if (!showAnimation) return "";
    
    const stepMappings = [
      { highlight: ["memory", "cpu"] }, // Fetch
      { highlight: ["cpu", "control"] }, // Decode
      { highlight: ["control", "alu"] }, // Execute
      { highlight: ["alu", "memory"] } // Store
    ];
    
    return stepMappings[animationStep].highlight.includes(component as string) 
      ? "ring-4 ring-offset-2 ring-blue-500 ring-offset-white dark:ring-offset-slate-950 animate-pulse"
      : "";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Computer Organization Block Diagram</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Click on any component to learn more about its function and see data flow animations.
      </p>
      
      {/* Main diagram */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 mb-8">
        {/* CPU Box with ALU and Control Unit inside */}
        <div className="border-2 border-blue-500 dark:border-blue-600 rounded-xl p-6 mb-8 max-w-2xl mx-auto relative">
          <div className="absolute -top-3 bg-white dark:bg-slate-900 px-2 text-blue-600 dark:text-blue-400 font-semibold">
            CPU
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Drawer>
              <DrawerTrigger asChild>
                <div 
                  onClick={() => handleComponentClick("control")}
                  className={`p-4 border rounded-lg ${componentData.control.color} bg-opacity-20 cursor-pointer hover:bg-opacity-30 transition-all flex items-center ${getAnimationClass("control")}`}
                >
                  <componentData.control.icon className="h-6 w-6 mr-3 text-purple-600" />
                  <div>
                    <div className="font-medium">Control Unit</div>
                    <div className="text-xs">Decodes instructions</div>
                  </div>
                </div>
              </DrawerTrigger>
            </Drawer>
            
            <Drawer>
              <DrawerTrigger asChild>
                <div 
                  onClick={() => handleComponentClick("alu")}
                  className={`p-4 border rounded-lg ${componentData.alu.color} bg-opacity-20 cursor-pointer hover:bg-opacity-30 transition-all flex items-center ${getAnimationClass("alu")}`}
                >
                  <componentData.alu.icon className="h-6 w-6 mr-3 text-green-600" />
                  <div>
                    <div className="font-medium">ALU</div>
                    <div className="text-xs">Arithmetic & logic</div>
                  </div>
                </div>
              </DrawerTrigger>
            </Drawer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Input */}
          <Drawer>
            <DrawerTrigger asChild>
              <div 
                onClick={() => handleComponentClick("input")}
                className={`p-4 border rounded-lg ${componentData.input.color} bg-opacity-20 cursor-pointer hover:bg-opacity-30 transition-all flex items-center ${getAnimationClass("input")}`}
              >
                <componentData.input.icon className="h-6 w-6 mr-3 text-red-600" />
                <div>
                  <div className="font-medium">Input</div>
                  <div className="text-xs">Keyboard, mouse, etc.</div>
                </div>
              </div>
            </DrawerTrigger>
          </Drawer>
          
          {/* Memory */}
          <Drawer>
            <DrawerTrigger asChild>
              <div 
                onClick={() => handleComponentClick("memory")}
                className={`p-4 border rounded-lg ${componentData.memory.color} bg-opacity-20 cursor-pointer hover:bg-opacity-30 transition-all flex items-center ${getAnimationClass("memory")}`}
              >
                <componentData.memory.icon className="h-6 w-6 mr-3 text-yellow-600" />
                <div>
                  <div className="font-medium">Memory</div>
                  <div className="text-xs">RAM, storage</div>
                </div>
              </div>
            </DrawerTrigger>
          </Drawer>
          
          {/* Output */}
          <Drawer>
            <DrawerTrigger asChild>
              <div 
                onClick={() => handleComponentClick("output")}
                className={`p-4 border rounded-lg ${componentData.output.color} bg-opacity-20 cursor-pointer hover:bg-opacity-30 transition-all flex items-center ${getAnimationClass("output")}`}
              >
                <componentData.output.icon className="h-6 w-6 mr-3 text-indigo-600" />
                <div>
                  <div className="font-medium">Output</div>
                  <div className="text-xs">Display, printer</div>
                </div>
              </div>
            </DrawerTrigger>
          </Drawer>
        </div>
        
        {/* Connection arrows */}
        <div className="relative mt-8">
          <div className="flex justify-center">
            <TooltipProvider>
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-slate-500">
                      <span className="text-xs mr-1">Data</span>
                      <ArrowRightToLine className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Data flow direction</p>
                  </TooltipContent>
                </Tooltip>
                
                <span className="mx-4">|</span>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-slate-500">
                      <span className="text-xs mr-1">Control</span>
                      <ArrowLeftToLine className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Control signal direction</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Animation controls */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex justify-center space-x-4">
        <Button onClick={toggleAnimation} variant={showAnimation ? "destructive" : "default"}>
          {showAnimation ? "Stop Animation" : "Start Instruction Cycle Animation"}
        </Button>
        {showAnimation && (
          <Button variant="outline" onClick={nextAnimationStep}>
            Next Step <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Component details drawer */}
      <Drawer open={activeComponent !== null} onOpenChange={(open) => !open && closeDrawer()}>
        <DrawerContent>
          {activeComponent && (
            <>
              <DrawerHeader>
                <DrawerTitle className="flex items-center">
                  <span className={`inline-block w-8 h-8 rounded-full ${componentData[activeComponent].color} mr-3 flex items-center justify-center`}>
                    {React.createElement(componentData[activeComponent].icon, { className: "h-4 w-4 text-white" })}
                  </span>
                  {componentData[activeComponent].title}
                </DrawerTitle>
                <DrawerDescription>{componentData[activeComponent].description}</DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="px-6 py-2 max-h-[60vh]">
                <div className="space-y-4">
                  <p>{componentData[activeComponent].details}</p>
                  
                  {renderAnimationContent()}
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Function in the Computer System</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="list-disc list-inside space-y-1">
                        {activeComponent === "cpu" && (
                          <>
                            <li>Fetches instructions from memory</li>
                            <li>Decodes instructions to determine operations</li>
                            <li>Executes instructions</li>
                            <li>Stores results in memory or registers</li>
                            <li>Controls the operation of other components</li>
                          </>
                        )}
                        {activeComponent === "alu" && (
                          <>
                            <li>Performs arithmetic operations (add, subtract, multiply, divide)</li>
                            <li>Performs logical operations (AND, OR, NOT, XOR)</li>
                            <li>Sets flags based on results (Zero, Carry, Overflow)</li>
                            <li>Supports comparison operations</li>
                            <li>Powers mathematical computations</li>
                          </>
                        )}
                        {activeComponent === "control" && (
                          <>
                            <li>Fetches and decodes instructions</li>
                            <li>Coordinates data flow between CPU components</li>
                            <li>Generates control signals</li>
                            <li>Maintains the program counter</li>
                            <li>Manages the instruction execution sequence</li>
                          </>
                        )}
                        {activeComponent === "memory" && (
                          <>
                            <li>Stores program instructions</li>
                            <li>Stores data being processed</li>
                            <li>Organized in addressable locations</li>
                            <li>Provides fast access to current data</li>
                            <li>Includes volatile (RAM) and non-volatile (ROM) types</li>
                          </>
                        )}
                        {activeComponent === "input" && (
                          <>
                            <li>Converts physical input to digital signals</li>
                            <li>Sends data to the computer for processing</li>
                            <li>Includes devices like keyboards, mice, scanners</li>
                            <li>Provides user interface to the system</li>
                            <li>Requires controllers to interface with the CPU</li>
                          </>
                        )}
                        {activeComponent === "output" && (
                          <>
                            <li>Converts digital signals to human-readable form</li>
                            <li>Displays processing results</li>
                            <li>Includes monitors, printers, speakers</li>
                            <li>Provides feedback to users</li>
                            <li>May require specialized controllers or adapters</li>
                          </>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
              <DrawerFooter>
                <Button variant="outline" onClick={toggleAnimation}>
                  {showAnimation ? "Stop Animation" : "Show Data Flow Animation"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
