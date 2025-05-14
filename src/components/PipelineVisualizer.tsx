import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HelpCircle, Info, PlayCircle, PauseCircle, RotateCcw, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

type PipelineStage = "Fetch" | "Decode" | "Execute" | "Memory" | "Writeback";
const STAGES: PipelineStage[] = ["Fetch", "Decode", "Execute", "Memory", "Writeback"];

interface Instruction {
  id: number;
  name: string;
  stages: Record<PipelineStage, { cycle: number | null, stalled: boolean, hazardType?: string }>;
  dependencies?: number[];
}

export function PipelineVisualizer() {
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(1);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [lastInstructionId, setLastInstructionId] = useState(0);
  const [selectedInstruction, setSelectedInstruction] = useState<Instruction | null>(null);
  const [stepMode, setStepMode] = useState(false);
  const [explanation, setExplanation] = useState("");
  const { toast } = useToast();
  const tableRef = useRef<HTMLDivElement>(null);

  // Stage explanations
  const stageExplanations = {
    "Fetch": "In this stage, the processor fetches the instruction from memory at the address stored in the program counter (PC).",
    "Decode": "The fetched instruction is decoded to determine the operation to be performed and the operands to be used.",
    "Execute": "The ALU performs the operation specified by the instruction on the operands.",
    "Memory": "If required, memory is accessed for read or write operations.",
    "Writeback": "The result of the operation is written back to the register file."
  };

  // Hazard explanations
  const hazardExplanations = {
    "RAW": "Read After Write (RAW): This data hazard occurs when an instruction tries to read a source before a previous instruction writes to it.",
    "WAR": "Write After Read (WAR): This hazard occurs when an instruction tries to write to a destination before a previous instruction reads it.",
    "WAW": "Write After Write (WAW): This hazard occurs when an instruction tries to write to a destination before a previous instruction writes to the same destination.",
    "Control": "Control Hazard: Occurs with branch instructions when the pipeline has to be flushed if the branch prediction was incorrect.",
    "Structural": "Structural Hazard: Occurs when multiple instructions try to use the same hardware resource simultaneously."
  };

  // Generate a set of example instructions
  const generateInstructions = () => {
    const instructionTypes = [
      "ADD R1, R2, R3",
      "SUB R4, R5, R6",
      "LW R7, 0(R8)",
      "SW R9, 4(R10)",
      "BEQ R11, R12, label",
      "JUMP label"
    ];
    
    const hazardTypes = ["RAW", "WAR", "WAW", "Control", "Structural"];
    const newInstructions: Instruction[] = [];
    
    for (let i = 0; i < 5; i++) {
      const id = lastInstructionId + i + 1;
      const instructionType = instructionTypes[Math.floor(Math.random() * instructionTypes.length)];
      
      // Create dependencies between instructions to simulate hazards
      const dependencies = i > 0 ? [lastInstructionId + Math.floor(Math.random() * i) + 1] : [];
      
      const stagesObj: Record<PipelineStage, { cycle: number | null, stalled: boolean, hazardType?: string }> = {
        Fetch: { cycle: null, stalled: false },
        Decode: { cycle: null, stalled: false },
        Execute: { cycle: null, stalled: false },
        Memory: { cycle: null, stalled: false },
        Writeback: { cycle: null, stalled: false }
      };
      
      newInstructions.push({
        id,
        name: `${instructionType}`,
        stages: stagesObj,
        dependencies
      });
    }
    
    setLastInstructionId(lastInstructionId + 5);
    return newInstructions;
  };
  
  // Initialize with some instructions
  useEffect(() => {
    setInstructions(generateInstructions());
  }, []);

  // Scroll to the latest instruction
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [instructions]);

  // Function to step forward one cycle
  const stepForward = () => {
    setCycle(c => c + 1);
    updatePipelineState();
  };

  // Pipeline simulation logic
  const updatePipelineState = () => {
    setInstructions(prevInstructions => {
      const newInstructions = [...prevInstructions];
      let currentExplanation = `Cycle ${cycle + 1}:\n`;
      
      // Process each instruction
      for (let i = 0; i < newInstructions.length; i++) {
        const instruction = newInstructions[i];
        
        // Find the current stage for this instruction
        let currentStageIndex = -1;
        for (let j = STAGES.length - 1; j >= 0; j--) {
          if (instruction.stages[STAGES[j]].cycle !== null) {
            currentStageIndex = j;
            break;
          }
        }
        
        // If instruction hasn't started yet, start fetch
        if (currentStageIndex === -1) {
          // Check if previous instruction is at least in decode
          const canStart = i === 0 || 
            newInstructions[i - 1].stages.Decode.cycle !== null;
          
          if (canStart) {
            instruction.stages.Fetch = { cycle: cycle + 1, stalled: false };
            currentExplanation += `\n- Instruction ${instruction.id} (${instruction.name}) starts Fetch stage.`;
          }
        }
        // Otherwise progress to next stage if possible
        else if (currentStageIndex < STAGES.length - 1) {
          const currentStage = STAGES[currentStageIndex];
          const nextStage = STAGES[currentStageIndex + 1];
          
          // Check for hazards based on dependencies
          let hasHazard = false;
          let hazardType = "";
          
          if (instruction.dependencies && instruction.dependencies.length > 0) {
            // Find the dependent instruction
            const dependentInstr = newInstructions.find(instr => 
              instruction.dependencies!.includes(instr.id)
            );
            
            if (dependentInstr) {
              // Different hazard types based on the stage
              if (nextStage === "Execute" && dependentInstr.stages.Writeback.cycle === null) {
                hasHazard = Math.random() < 0.7; // High chance for RAW hazard
                hazardType = "RAW";
              } else if (nextStage === "Memory" && currentStage === "Execute") {
                hasHazard = Math.random() < 0.3; // Lower chance for structural hazard
                hazardType = "Structural";
              } else if (instruction.name.startsWith("BEQ") || instruction.name.startsWith("JUMP")) {
                hasHazard = Math.random() < 0.5; // Medium chance for control hazard
                hazardType = "Control";
              }
            }
          } else {
            // Random hazards with low probability
            hasHazard = Math.random() < 0.15;
            hazardType = ["RAW", "WAR", "WAW", "Structural"][Math.floor(Math.random() * 4)];
          }
          
          if (hasHazard) {
            // Stall current stage
            instruction.stages[currentStage].stalled = true;
            instruction.stages[currentStage].hazardType = hazardType;
            currentExplanation += `\n- Instruction ${instruction.id} (${instruction.name}) is stalled in ${currentStage} stage due to ${hazardType} hazard.`;
          } else {
            // Progress to next stage
            instruction.stages[nextStage] = { 
              cycle: cycle + 1, 
              stalled: false 
            };
            // Clear stall if it was stalled before
            if (instruction.stages[currentStage].stalled) {
              instruction.stages[currentStage].stalled = false;
              delete instruction.stages[currentStage].hazardType;
              currentExplanation += `\n- Instruction ${instruction.id} (${instruction.name}) resolves hazard and advances to ${nextStage} stage.`;
            } else {
              currentExplanation += `\n- Instruction ${instruction.id} (${instruction.name}) advances to ${nextStage} stage.`;
            }
          }
        }
      }
      
      // Update the explanation
      setExplanation(currentExplanation);
      
      return newInstructions;
    });
  };

  // Pipeline simulation logic
  useEffect(() => {
    if (!running || stepMode) return;
    
    const interval = setInterval(() => {
      stepForward();
      
      // Add new instructions occasionally when old ones finish
      const allInstructionsCompleted = instructions.every(instr => 
        instr.stages.Writeback.cycle !== null
      );
      
      if (allInstructionsCompleted) {
        setInstructions([...instructions, ...generateInstructions()]);
      }
      
    }, 1000 / speed);
    
    return () => clearInterval(interval);
  }, [running, speed, instructions, cycle, stepMode]);

  const toggleSimulation = () => {
    setRunning(prev => !prev);
  };
  
  const resetSimulation = () => {
    setRunning(false);
    setCycle(1);
    setInstructions(generateInstructions());
    setLastInstructionId(0);
    setSelectedInstruction(null);
    setExplanation("");
    toast({
      title: "Pipeline Reset",
      description: "The pipeline simulation has been reset."
    });
  };

  const handleInstructionClick = (instruction: Instruction) => {
    setSelectedInstruction(instruction);

    // Show explanation of the instruction's current state
    let detail = `Instruction ${instruction.id} (${instruction.name}):\n`;
    
    for (const stage of STAGES) {
      const stageInfo = instruction.stages[stage];
      if (stageInfo.cycle !== null) {
        detail += `\n- ${stage}: Cycle ${stageInfo.cycle}`;
        if (stageInfo.stalled) {
          detail += ` (Stalled - ${stageInfo.hazardType} hazard)`;
        }
      }
    }
    
    if (instruction.dependencies && instruction.dependencies.length > 0) {
      detail += `\n\nDepends on instruction(s): ${instruction.dependencies.join(', ')}`;
    }
    
    setExplanation(detail);
  };
  
  const getStageClass = (stage: { cycle: number | null, stalled: boolean, hazardType?: string }) => {
    if (stage.cycle === null) return "bg-slate-100 dark:bg-slate-800";
    if (stage.stalled) {
      switch(stage.hazardType) {
        case "RAW": return "bg-red-100 dark:bg-red-900/30";
        case "WAR": return "bg-orange-100 dark:bg-orange-900/30";
        case "WAW": return "bg-yellow-100 dark:bg-yellow-900/30";
        case "Control": return "bg-purple-100 dark:bg-purple-900/30";
        case "Structural": return "bg-amber-100 dark:bg-amber-900/30";
        default: return "bg-amber-100 dark:bg-amber-900/30";
      }
    }
    return "bg-tech-teal bg-opacity-20";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">CPU Pipeline Simulator</h2>
        
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <Button
            onClick={toggleSimulation}
            variant={running ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {running ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
            {running ? "Pause" : "Start"} Simulation
          </Button>
          
          <Button
            onClick={resetSimulation}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            onClick={stepForward}
            variant="outline"
            disabled={running && !stepMode}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            Step Forward
          </Button>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="step-mode" 
              checked={stepMode} 
              onChange={(e) => setStepMode(e.target.checked)} 
              className="rounded border-gray-300"
            />
            <label htmlFor="step-mode" className="text-sm">Step Mode</label>
          </div>
          
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm">Speed:</span>
            <Slider
              value={[speed]}
              min={0.5}
              max={5}
              step={0.5}
              onValueChange={(value) => setSpeed(value[0])}
              className="w-32"
            />
            <span className="text-sm">{speed}x</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-lg font-semibold">Current Cycle: {cycle}</div>
        </div>

        {/* Pipeline diagram */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]" ref={tableRef}>
            {/* Pipeline header */}
            <div className="grid grid-cols-6 gap-1 mb-1 font-medium">
              <div className="p-2">Instruction</div>
              {STAGES.map(stage => (
                <div key={stage} className="p-2 text-center relative">
                  {stage}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1 inline-flex items-center">
                          <HelpCircle className="h-3 w-3 text-slate-500" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{stageExplanations[stage]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
            
            {/* Pipeline rows */}
            {instructions.map(instruction => (
              <div 
                key={instruction.id} 
                className={cn(
                  "grid grid-cols-6 gap-1 mb-1",
                  selectedInstruction?.id === instruction.id ? "ring-2 ring-tech-teal" : ""
                )}
                onClick={() => handleInstructionClick(instruction)}
              >
                <div className={cn(
                  "p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer",
                  selectedInstruction?.id === instruction.id ? "font-semibold" : ""
                )}>
                  {instruction.name}
                </div>
                
                {STAGES.map(stage => {
                  const stageInfo = instruction.stages[stage];
                  return (
                    <div 
                      key={stage} 
                      className={cn(
                        "p-2 border border-slate-200 dark:border-slate-700 text-center transition-colors",
                        getStageClass(stageInfo)
                      )}
                    >
                      {stageInfo.cycle !== null ? (
                        <div className="flex flex-col items-center">
                          <span>{stageInfo.cycle}</span>
                          {stageInfo.stalled && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
                                    {stageInfo.hazardType} Hazard
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{hazardExplanations[stageInfo.hazardType as keyof typeof hazardExplanations]}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline explanation */}
        {explanation && (
          <div className="mt-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <Info className="h-5 w-5 mr-2 text-tech-teal" />
              <h3 className="font-medium">Pipeline Analysis</h3>
            </div>
            <pre className="text-sm whitespace-pre-wrap font-mono">{explanation}</pre>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Understanding CPU Pipelining</h3>
        
        <div className="space-y-4">
          <p className="mb-2">
            CPU pipelining is a technique used to increase instruction throughput by dividing instruction processing into several sequential stages. 
            This allows multiple instructions to be processed simultaneously, with each instruction at a different stage of the pipeline.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="font-semibold mb-1">Pipeline Stages:</div>
                <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
                  <li><span className="font-medium">Fetch:</span> Retrieve instruction from memory</li>
                  <li><span className="font-medium">Decode:</span> Determine what operation to perform</li>
                  <li><span className="font-medium">Execute:</span> Perform the operation</li>
                  <li><span className="font-medium">Memory:</span> Access memory if needed</li>
                  <li><span className="font-medium">Writeback:</span> Update registers with results</li>
                </ol>
              </div>
              
              <div>
                <div className="font-semibold">Performance Improvement:</div>
                <p className="text-sm ml-4">
                  In an ideal pipeline, if each stage takes 1 clock cycle, a 5-stage pipeline can process 5 instructions simultaneously.
                  While a non-pipelined processor might take 5 cycles to complete one instruction, a pipelined processor can potentially
                  complete one instruction every cycle after the initial pipeline fill.
                </p>
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-1">Pipeline Hazards:</div>
              <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                <li className="p-1 bg-red-50 dark:bg-red-950 rounded border-l-2 border-red-500">
                  <span className="font-medium text-red-700 dark:text-red-300">Data Hazards (RAW):</span> 
                  <p className="ml-4">Read After Write - An instruction tries to read data before a previous instruction writes it.</p>
                </li>
                <li className="p-1 bg-orange-50 dark:bg-orange-950 rounded border-l-2 border-orange-500">
                  <span className="font-medium text-orange-700 dark:text-orange-300">Data Hazards (WAR):</span> 
                  <p className="ml-4">Write After Read - An instruction tries to write before a previous instruction reads the location.</p>
                </li>
                <li className="p-1 bg-yellow-50 dark:bg-yellow-950 rounded border-l-2 border-yellow-500">
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">Data Hazards (WAW):</span> 
                  <p className="ml-4">Write After Write - An instruction tries to write before a previous instruction writes to the same location.</p>
                </li>
                <li className="p-1 bg-purple-50 dark:bg-purple-950 rounded border-l-2 border-purple-500">
                  <span className="font-medium text-purple-700 dark:text-purple-300">Control Hazards:</span> 
                  <p className="ml-4">Branch instructions that interrupt the sequential flow, causing pipeline flushes.</p>
                </li>
                <li className="p-1 bg-amber-50 dark:bg-amber-950 rounded border-l-2 border-amber-500">
                  <span className="font-medium text-amber-700 dark:text-amber-300">Structural Hazards:</span> 
                  <p className="ml-4">Multiple instructions need the same hardware resource simultaneously.</p>
                </li>
              </ul>
            </div>
          </div>
          
          <Alert className="mt-4">
            <AlertDescription>
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 mt-0.5" />
                <div>
                  <span className="font-semibold">Interactive Simulation:</span> Click on an instruction in the pipeline to see its detailed analysis. 
                  Use "Step Mode" checkbox to enable manual stepping through cycles with the "Step Forward" button.
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
