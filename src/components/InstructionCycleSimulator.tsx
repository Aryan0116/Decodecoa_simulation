
import { useState, useRef, useEffect } from "react";
import { 
  Cpu, 
  HardDrive, 
  ArrowRight,
  RotateCw,
  Code,
  CircleDot,
  Clock,
  Calculator,
  ArrowDownToLine
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Instruction {
  opcode: string;
  operands: string;
  description: string;
}

const instructions: Instruction[] = [
  { 
    opcode: "LOAD", 
    operands: "R1, [200]", 
    description: "Loads the value from memory address 200 into register R1" 
  },
  { 
    opcode: "ADD", 
    operands: "R1, R2", 
    description: "Adds the values in registers R1 and R2, storing the result in R1" 
  },
  { 
    opcode: "STORE", 
    operands: "R1, [300]", 
    description: "Stores the value in register R1 to memory address 300" 
  },
  { 
    opcode: "JUMP", 
    operands: "LABEL", 
    description: "Jumps to the instruction labeled LABEL" 
  }
];

export function InstructionCycleSimulator() {
  const [stage, setStage] = useState<"fetch" | "decode" | "execute" | "complete">("fetch");
  const [cycleCount, setCycleCount] = useState(0);
  const [automatic, setAutomatic] = useState(false);
  const [instruction, setInstruction] = useState<Instruction>(instructions[0]);
  const [speed, setSpeed] = useState<"slow" | "medium" | "fast">("medium");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle automatic cycling
  useEffect(() => {
    if (automatic) {
      const speeds = { 
        slow: 2000, 
        medium: 1000, 
        fast: 500 
      };
      
      timerRef.current = setTimeout(() => {
        nextStage();
      }, speeds[speed]);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [automatic, stage, speed, cycleCount]);

  const nextStage = () => {
    switch (stage) {
      case "fetch":
        setStage("decode");
        break;
      case "decode":
        setStage("execute");
        break;
      case "execute":
        setStage("complete");
        break;
      case "complete":
        setStage("fetch");
        setCycleCount(c => c + 1);
        // Choose next instruction or loop back
        const nextIndex = (instructions.findIndex(i => i.opcode === instruction.opcode) + 1) % instructions.length;
        setInstruction(instructions[nextIndex]);
        break;
    }
  };

  const resetSimulation = () => {
    setStage("fetch");
    setCycleCount(0);
    setInstruction(instructions[0]);
    if (automatic) {
      setAutomatic(false);
    }
  };

  const toggleAutomatic = () => {
    setAutomatic(!automatic);
  };

  const highlightComponent = (componentName: string) => {
    const stageComponentMap = {
      fetch: ["PC", "MAR", "Memory", "IR"],
      decode: ["IR", "CU"],
      execute: ["CU", "ALU", "Registers"],
      complete: []
    };
    
    return stageComponentMap[stage].includes(componentName);
  };

  const getExplanationText = () => {
    switch (stage) {
      case "fetch":
        return "The CPU fetches the instruction from memory at the address stored in the Program Counter (PC). The address is transferred to the Memory Address Register (MAR), and the instruction is then loaded into the Instruction Register (IR).";
      case "decode":
        return "The Control Unit (CU) decodes the instruction in the IR to determine what operation to perform. It identifies the opcode and operands, and prepares the necessary control signals.";
      case "execute":
        return "The CPU executes the instruction. This may involve the ALU for arithmetic/logic operations, data transfer between registers, or memory access. Results are stored in appropriate registers.";
      case "complete":
        return "The instruction is complete. The PC is updated to point to the next instruction (or a new location for jump/branch instructions), and the CPU is ready to fetch the next instruction.";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Instruction Cycle Simulator</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Explore how the CPU processes instructions through the fetch-decode-execute cycle.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CircleDot className="h-5 w-5 mr-2 text-blue-500" />
              Current Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Badge variant="outline" className="text-lg p-2 capitalize font-semibold">
                {stage === "complete" ? "Cycle Complete" : stage}
              </Badge>
            </div>
            <div className="mt-4 text-sm">
              {getExplanationText()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-blue-500" />
              Current Instruction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono bg-slate-100 dark:bg-slate-800 rounded p-2 text-center">
              <span className="font-bold text-blue-600 dark:text-blue-400">{instruction.opcode}</span>{" "}
              <span>{instruction.operands}</span>
            </div>
            <p className="mt-3 text-sm">
              {instruction.description}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Simulation Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span>Completed Cycles:</span>
                <Badge variant="secondary">{cycleCount}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Current Mode:</span>
                <Badge variant={automatic ? "default" : "outline"}>
                  {automatic ? "Automatic" : "Manual"}
                </Badge>
              </div>
              {automatic && (
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <Select value={speed} onValueChange={(val: "slow" | "medium" | "fast") => setSpeed(val)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* CPU Diagram */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">CPU Components</h3>
        
        <div className="relative">
          {/* CPU outer box */}
          <div className="border-2 border-blue-500 dark:border-blue-600 rounded-xl p-4 relative">
            <div className="absolute -top-3 bg-white dark:bg-slate-900 px-2 text-blue-600 dark:text-blue-400 font-semibold">
              CPU
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <TooltipProvider>
                {/* Control Unit */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "p-3 border rounded-lg bg-purple-100 dark:bg-purple-900 bg-opacity-20 dark:bg-opacity-20",
                      highlightComponent("CU") && "ring-2 ring-purple-500 animate-pulse"
                    )}>
                      <div className="font-medium text-center">Control Unit (CU)</div>
                      <div className="text-xs text-center mt-1">Decodes and controls</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Decodes instructions and generates control signals</p>
                  </TooltipContent>
                </Tooltip>
                
                {/* ALU */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "p-3 border rounded-lg bg-green-100 dark:bg-green-900 bg-opacity-20 dark:bg-opacity-20",
                      highlightComponent("ALU") && "ring-2 ring-green-500 animate-pulse"
                    )}>
                      <div className="font-medium text-center flex justify-center">
                        <Calculator className="h-4 w-4 mr-1" />
                        <span>ALU</span>
                      </div>
                      <div className="text-xs text-center mt-1">Arithmetic operations</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Performs arithmetic and logical operations</p>
                  </TooltipContent>
                </Tooltip>
                
                {/* Registers */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "p-3 border rounded-lg bg-yellow-100 dark:bg-yellow-900 bg-opacity-20 dark:bg-opacity-20",
                      highlightComponent("Registers") && "ring-2 ring-yellow-500 animate-pulse"
                    )}>
                      <div className="font-medium text-center">Registers</div>
                      <div className="text-xs text-center mt-1">
                        <span className={cn(
                          "inline-block px-1",
                          stage === "execute" && "text-blue-600 dark:text-blue-400 font-semibold"
                        )}>
                          R1: 42
                        </span>
                        <span className="inline-block px-1">R2: 10</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fast storage for data during processing</p>
                  </TooltipContent>
                </Tooltip>
                
                {/* Special Registers */}
                <div className="space-y-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "p-2 border rounded-lg bg-blue-100 dark:bg-blue-900 bg-opacity-20 dark:bg-opacity-20",
                        highlightComponent("PC") && "ring-2 ring-blue-500 animate-pulse"
                      )}>
                        <div className="text-sm flex justify-between">
                          <span>Program Counter (PC)</span>
                          <span className="font-mono">0x{(100 + cycleCount * 4).toString(16).toUpperCase()}</span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Holds the address of next instruction to fetch</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "p-2 border rounded-lg bg-blue-100 dark:bg-blue-900 bg-opacity-20 dark:bg-opacity-20",
                        highlightComponent("MAR") && "ring-2 ring-blue-500 animate-pulse"
                      )}>
                        <div className="text-sm flex justify-between">
                          <span>Memory Address Register</span>
                          <span className="font-mono">
                            {stage === "fetch" ? `0x${(100 + cycleCount * 4).toString(16).toUpperCase()}` : "—"}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Holds the address for memory access</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "p-2 border rounded-lg bg-blue-100 dark:bg-blue-900 bg-opacity-20 dark:bg-opacity-20",
                        highlightComponent("IR") && "ring-2 ring-blue-500 animate-pulse"
                      )}>
                        <div className="text-sm flex justify-between">
                          <span>Instruction Register (IR)</span>
                          <span className="font-mono">
                            {stage !== "fetch" ? `${instruction.opcode}` : "—"}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Holds the current instruction being executed</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Memory */}
          <div className="border-2 border-amber-500 dark:border-amber-600 rounded-xl p-4 mt-8 max-w-sm mx-auto relative">
            <div className="absolute -top-3 bg-white dark:bg-slate-900 px-2 text-amber-600 dark:text-amber-400 font-semibold">
              Memory
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "grid grid-cols-2 gap-2",
                    highlightComponent("Memory") && "animate-pulse"
                  )}>
                    <div className="border rounded p-2 bg-slate-50 dark:bg-slate-800 text-center text-sm">
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400">0x100</div>
                      <div>LOAD R1, [200]</div>
                    </div>
                    <div className="border rounded p-2 bg-slate-50 dark:bg-slate-800 text-center text-sm">
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400">0x104</div>
                      <div>ADD R1, R2</div>
                    </div>
                    <div className="border rounded p-2 bg-slate-50 dark:bg-slate-800 text-center text-sm">
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400">0x108</div>
                      <div>STORE R1, [300]</div>
                    </div>
                    <div className="border rounded p-2 bg-slate-50 dark:bg-slate-800 text-center text-sm">
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400">0x10C</div>
                      <div>JUMP LABEL</div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stores instructions and data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Data flow indicators */}
          <div className="flex justify-center mt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "flex items-center text-slate-500",
                    stage === "fetch" && "text-blue-600 font-medium"
                  )}>
                    <ArrowDownToLine className="h-5 w-5 mr-1" />
                    <span className="text-sm">Data Bus</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Transfers data between CPU and memory</p>
                </TooltipContent>
              </Tooltip>
              
              <span className="mx-4">|</span>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "flex items-center text-slate-500",
                    stage === "decode" && "text-purple-600 font-medium"
                  )}>
                    <ArrowDownToLine className="h-5 w-5 mr-1" />
                    <span className="text-sm">Control Bus</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Carries control signals</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-wrap gap-3 justify-center">
        <Button 
          onClick={nextStage} 
          disabled={automatic}
          className="flex items-center"
        >
          Next Stage <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <Button 
          onClick={toggleAutomatic} 
          variant={automatic ? "destructive" : "outline"}
          className="flex items-center"
        >
          {automatic ? "Stop" : "Auto-run"} <RotateCw className="ml-2 h-4 w-4" />
        </Button>
        
        <Select 
          value={instruction.opcode} 
          onValueChange={(val) => {
            const newInstruction = instructions.find(i => i.opcode === val) || instructions[0];
            setInstruction(newInstruction);
          }}
          disabled={automatic || stage !== "fetch"}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Instruction" />
          </SelectTrigger>
          <SelectContent>
            {instructions.map((inst) => (
              <SelectItem key={inst.opcode} value={inst.opcode}>
                {inst.opcode} {inst.operands}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={resetSimulation} 
          variant="secondary"
          className="flex items-center"
        >
          Reset
        </Button>
      </div>
      
      <div className="mt-8 text-sm text-slate-600 dark:text-slate-400">
        <h3 className="font-medium text-base mb-2">Understanding the Instruction Cycle</h3>
        <p className="mb-2">
          The instruction cycle is the basic operation cycle of a CPU. It consists of these main stages:
        </p>
        <ol className="list-decimal list-inside space-y-1 ml-4">
          <li><strong>Fetch:</strong> The CPU retrieves the next instruction from memory using the Program Counter (PC).</li>
          <li><strong>Decode:</strong> The Control Unit interprets the instruction to determine what operation to perform.</li>
          <li><strong>Execute:</strong> The CPU performs the operation specified by the instruction.</li>
          <li><strong>Update PC:</strong> The Program Counter is updated to point to the next instruction.</li>
        </ol>
        <p className="mt-2">
          This cycle repeats continuously as the CPU executes a program, with each instruction following this pattern.
        </p>
      </div>
    </div>
  );
}
