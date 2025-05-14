
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Timer, Microchip, Play, Pause, RotateCcw, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export function TimingControl() {
  const [tab, setTab] = useState("hardwired");
  const [isRunning, setIsRunning] = useState(false);
  const [clockCycle, setClockCycle] = useState(0);
  const [speed, setSpeed] = useState(1000); // ms per cycle
  const [currentPhase, setCurrentPhase] = useState("fetch");
  const [signalStates, setSignalStates] = useState({
    clock: false,
    fetch: false,
    decode: false,
    execute: false,
    alu: false
  });
  const [controlSignals, setControlSignals] = useState({
    memRead: false,
    memWrite: false,
    aluOp: false,
    regWrite: false,
    branch: false
  });
  const [activeInstruction, setActiveInstruction] = useState("");
  const [explanation, setExplanation] = useState("");

  // Animations for clock pulses
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setClockCycle(prev => (prev + 1) % 6);
    }, speed);
    
    return () => clearInterval(interval);
  }, [isRunning, speed]);

  // Update signals based on clock cycle
  useEffect(() => {
    if (tab === "hardwired") {
      updateHardwiredSignals();
    } else {
      updateMicroprogrammedSignals();
    }
  }, [clockCycle, tab]);

  const updateHardwiredSignals = () => {
    // Update signal states based on clock cycle
    const newSignals = { ...signalStates };
    newSignals.clock = !newSignals.clock; // Toggle clock
    
    // Simulate pipeline stages based on clock cycle
    switch (clockCycle) {
      case 0:
        setCurrentPhase("fetch");
        newSignals.fetch = true;
        newSignals.decode = false;
        newSignals.execute = false;
        newSignals.alu = false;
        setControlSignals({
          memRead: true,
          memWrite: false,
          aluOp: false,
          regWrite: false,
          branch: false
        });
        setActiveInstruction("Fetching instruction from memory...");
        setExplanation("The control unit activates the memory read signal to fetch the next instruction from the address in the Program Counter (PC).");
        break;
      case 1:
        setCurrentPhase("decode");
        newSignals.fetch = false;
        newSignals.decode = true;
        setControlSignals({
          memRead: false,
          memWrite: false,
          aluOp: false,
          regWrite: false,
          branch: false
        });
        setActiveInstruction("LW R1, 0(R2)");
        setExplanation("The instruction is decoded. The control unit identifies this as a load word instruction and prepares to read from memory at the address in R2.");
        break;
      case 2:
        setCurrentPhase("execute");
        newSignals.decode = false;
        newSignals.execute = true;
        newSignals.alu = true;
        setControlSignals({
          memRead: false,
          memWrite: false,
          aluOp: true,
          regWrite: false,
          branch: false
        });
        setExplanation("The ALU calculates the effective address by adding the base address (R2) with the offset (0).");
        break;
      case 3:
        setCurrentPhase("memory");
        newSignals.execute = false;
        newSignals.alu = false;
        setControlSignals({
          memRead: true,
          memWrite: false,
          aluOp: false,
          regWrite: false,
          branch: false
        });
        setExplanation("Memory is accessed to read the word at the calculated address.");
        break;
      case 4:
        setCurrentPhase("writeback");
        setControlSignals({
          memRead: false,
          memWrite: false,
          aluOp: false,
          regWrite: true,
          branch: false
        });
        setExplanation("The data read from memory is written back to register R1.");
        break;
      case 5:
        setCurrentPhase("fetch");
        newSignals.fetch = true;
        setControlSignals({
          memRead: true,
          memWrite: false,
          aluOp: false,
          regWrite: false,
          branch: false
        });
        setActiveInstruction("ADD R3, R4, R5");
        setExplanation("The next instruction is fetched from memory at the updated PC address.");
        break;
      default:
        break;
    }
    
    setSignalStates(newSignals);
  };

  const updateMicroprogrammedSignals = () => {
    // For microprogrammed control, we simulate microinstruction execution
    const microprogramSequences = [
      { address: "0x00", instruction: "PC → MAR, Read", next: "0x01", phase: "fetch" },
      { address: "0x01", instruction: "MBR → IR, PC+1 → PC", next: "0x02", phase: "fetch" },
      { address: "0x02", instruction: "IR(op) → decode", next: "Branch", phase: "decode" },
      { address: "0x10", instruction: "ALU: ADD", next: "0x00", phase: "execute" },
      { address: "0x20", instruction: "ALU: SUB", next: "0x00", phase: "execute" },
      { address: "0x30", instruction: "ALU: AND", next: "0x00", phase: "execute" }
    ];
    
    const currentMicroinstruction = microprogramSequences[clockCycle % microprogramSequences.length];
    setCurrentPhase(currentMicroinstruction.phase);
    
    // Update signal visualization based on current microinstruction
    setActiveInstruction(currentMicroinstruction.instruction);
    
    switch (currentMicroinstruction.phase) {
      case "fetch":
        setExplanation("Fetching microinstruction from control memory. This microprogram controls the fetch phase of the main instruction.");
        setControlSignals({
          memRead: true,
          memWrite: false,
          aluOp: false,
          regWrite: false,
          branch: false
        });
        break;
      case "decode":
        setExplanation("Decoding the opcode and determining the next sequence of microinstructions to execute based on the instruction type.");
        setControlSignals({
          memRead: false,
          memWrite: false,
          aluOp: false,
          regWrite: false,
          branch: true
        });
        break;
      case "execute":
        setExplanation("Executing the specific ALU operation directed by the microinstruction sequence for this instruction type.");
        setControlSignals({
          memRead: false,
          memWrite: false,
          aluOp: true,
          regWrite: false,
          branch: false
        });
        break;
      default:
        break;
    }
  };

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setClockCycle(0);
    setSignalStates({
      clock: false,
      fetch: false,
      decode: false,
      execute: false,
      alu: false
    });
    setControlSignals({
      memRead: false,
      memWrite: false,
      aluOp: false,
      regWrite: false,
      branch: false
    });
    setActiveInstruction("");
    setExplanation("");
  };

  const stepForward = () => {
    setClockCycle((prev) => (prev + 1) % 6);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Timing & Control Units</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Control units generate signals that coordinate the activities of the CPU components. This simulation demonstrates hardwired vs. microprogrammed control units and timing diagrams.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-6">
          <Button
            onClick={toggleSimulation}
            variant={isRunning ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Pause" : "Start"} Simulation
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
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            Step Forward
          </Button>
          
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm">Speed:</span>
            <select 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))} 
              className="p-2 border rounded-md"
            >
              <option value="2000">Slow (2s)</option>
              <option value="1000">Normal (1s)</option>
              <option value="500">Fast (0.5s)</option>
              <option value="250">Very Fast (0.25s)</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-lg font-semibold flex flex-wrap items-center gap-2">
            <span>Current Cycle: {clockCycle}</span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-tech-teal text-white">
              Phase: {currentPhase.toUpperCase()}
            </span>
            {tab === "hardwired" && activeInstruction && (
              <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded">
                {activeInstruction}
              </span>
            )}
          </div>
        </div>

        <Tabs defaultValue="hardwired" value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="hardwired">
              <div className="flex items-center gap-2">
                <Microchip className="h-4 w-4" />
                <span>Hardwired Control</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="microprogrammed">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Microprogrammed Control</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hardwired" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hardwired Control Unit</CardTitle>
                <CardDescription>
                  A hardwired control unit uses combinational circuits to generate control signals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-lg h-64 border-2 border-slate-300 rounded-lg mb-4 p-4">
                    <div className="absolute top-0 left-0 bg-tech-teal text-white text-xs px-2 py-1 rounded-tl-md rounded-br-md">
                      Instruction Register
                    </div>
                    
                    <div className="flex h-full">
                      <div className="w-1/3 border-r border-dashed border-slate-300 flex flex-col justify-center items-center">
                        <div className={cn(
                          "border border-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-md w-24 text-center mb-4",
                          currentPhase === "decode" ? "ring-2 ring-tech-teal" : ""
                        )}>
                          Opcode
                        </div>
                        <div className="w-0 h-16 border-l border-slate-400"></div>
                      </div>
                      
                      <div className="w-2/3 flex flex-col justify-center items-center">
                        <div className={cn(
                          "border border-slate-400 bg-tech-blue text-white p-3 rounded-md w-48 text-center mb-4",
                          currentPhase === "decode" ? "ring-2 ring-white" : ""
                        )}>
                          Decoder
                        </div>
                        
                        <div className="flex justify-between w-full px-8">
                          <div className={cn(
                            "border border-slate-400 p-2 rounded-md w-24 text-center",
                            currentPhase === "execute" ? "bg-tech-teal text-white" : "bg-slate-100 dark:bg-slate-800"
                          )}>
                            Logic Gates
                          </div>
                          <div className={cn(
                            "border border-slate-400 p-2 rounded-md w-24 text-center",
                            Object.values(controlSignals).some(signal => signal) ? 
                              "bg-tech-teal text-white" : 
                              "bg-slate-100 dark:bg-slate-800"
                          )}>
                            Control Lines
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Control signal visualization */}
                  <div className="w-full max-w-lg">
                    <h4 className="text-sm font-semibold mb-2">Active Control Signals:</h4>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                      {Object.entries(controlSignals).map(([signal, isActive]) => (
                        <div 
                          key={signal}
                          className={cn(
                            "text-xs border px-2 py-1 rounded-md text-center",
                            isActive ? 
                              "bg-tech-teal text-white border-tech-teal" : 
                              "bg-slate-100 dark:bg-slate-800 border-slate-300"
                          )}
                        >
                          {signal.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-600 dark:text-slate-400 max-w-lg text-center">
                    <p><strong>Advantages:</strong> Fast execution and efficient for fixed instruction sets.</p>
                    <p><strong>Disadvantages:</strong> Less flexible; changes require hardware modifications.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
  <CardHeader>
    <CardTitle>Control Signal Timing</CardTitle>
    <CardDescription>
      Timing diagram showing control signals during instruction execution.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1000px]">
        <div className="flex flex-col gap-4">
          {/* Clock signal */}
          <div className="flex">
            <div className="w-24 font-medium">Clock</div>
            <div className="flex-1">
              <svg height="40" width="100%" className="overflow-visible">
                {/* Clock waveform */}
                <path 
                  d={`M0,20 L50,20 L50,5 L100,5 L100,20 L150,20 L150,5 L200,5 L200,20 L250,20 L250,5 L300,5 L300,20 L350,20 L350,5 L400,5 L400,20 L450,20 L450,5 L500,5 L500,20 L550,20 L550,5 L600,5 L600,20`}
                  fill="none" 
                  stroke={clockCycle % 2 === 0 ? "currentColor" : "rgb(20, 184, 166)"} 
                  strokeWidth="2" 
                />
                {/* Clock cycle indicator */}
                <circle 
                  cx={50 + 100 * (clockCycle % 6)} 
                  cy="12" 
                  r="5" 
                  fill="rgb(20, 184, 166)" 
                />
                {/* Vertical time markers */}
                {[0, 1, 2, 3, 4, 5].map(cycle => (
                  <line 
                    key={cycle}
                    x1={100 * cycle} 
                    y1="0" 
                    x2={100 * cycle} 
                    y2="40" 
                    stroke={cycle === clockCycle ? "rgb(20, 184, 166)" : "rgba(100, 116, 139, 0.2)"} 
                    strokeWidth={cycle === clockCycle ? "2" : "1"} 
                    strokeDasharray={cycle === clockCycle ? "none" : "2,2"} 
                  />
                ))}
              </svg>
            </div>
          </div>
          
          {/* Fetch signal */}
          <div className="flex">
            <div className="w-24 font-medium">Fetch</div>
            <div className="flex-1">
              <svg height="40" width="100%" className="overflow-visible">
                <path 
                  d={`M0,${clockCycle === 0 || clockCycle === 5 ? 5 : 20} 
                     L100,${clockCycle === 0 || clockCycle === 5 ? 5 : 20} 
                     L100,${clockCycle === 0 ? 5 : 20} 
                     L200,${clockCycle === 0 ? 5 : 20} 
                     L200,20 
                     L500,20
                     L500,${clockCycle === 5 ? 5 : 20} 
                     L600,${clockCycle === 5 ? 5 : 20}`}
                  fill="none" 
                  stroke={currentPhase === "fetch" ? "rgb(20, 184, 166)" : "currentColor"} 
                  strokeWidth="2" 
                  className={currentPhase === "fetch" ? "animate-pulse" : ""}
                />
                {/* Phase indicator text */}
                {currentPhase === "fetch" && (
                  <text x={clockCycle === 0 ? 50 : 550} y="0" textAnchor="middle" fontSize="10" fill="rgb(20, 184, 166)">Active</text>
                )}
              </svg>
            </div>
          </div>
          
          {/* Decode signal */}
          <div className="flex">
            <div className="w-24 font-medium">Decode</div>
            <div className="flex-1">
              <svg height="40" width="100%" className="overflow-visible">
                <path 
                  d={`M0,20 
                     L100,20 
                     L100,${clockCycle === 1 ? 5 : 20} 
                     L200,${clockCycle === 1 ? 5 : 20} 
                     L200,20 
                     L600,20`}
                  fill="none" 
                  stroke={currentPhase === "decode" ? "rgb(20, 184, 166)" : "currentColor"} 
                  strokeWidth="2" 
                  className={currentPhase === "decode" ? "animate-pulse" : ""}
                />
                {currentPhase === "decode" && (
                  <text x="150" y="0" textAnchor="middle" fontSize="10" fill="rgb(20, 184, 166)">Active</text>
                )}
              </svg>
            </div>
          </div>
          
          {/* Execute signal */}
          <div className="flex">
            <div className="w-24 font-medium">Execute</div>
            <div className="flex-1">
              <svg height="40" width="100%" className="overflow-visible">
                <path 
                  d={`M0,20 
                     L200,20 
                     L200,${clockCycle === 2 ? 5 : 20} 
                     L300,${clockCycle === 2 ? 5 : 20} 
                     L300,20 
                     L600,20`}
                  fill="none" 
                  stroke={currentPhase === "execute" ? "rgb(20, 184, 166)" : "currentColor"} 
                  strokeWidth="2" 
                  className={currentPhase === "execute" ? "animate-pulse" : ""}
                />
                {currentPhase === "execute" && (
                  <text x="250" y="0" textAnchor="middle" fontSize="10" fill="rgb(20, 184, 166)">Active</text>
                )}
              </svg>
            </div>
          </div>
          
          {/* Memory access signal */}
          <div className="flex">
            <div className="w-24 font-medium">Memory</div>
            <div className="flex-1">
              <svg height="40" width="100%" className="overflow-visible">
                <path 
                  d={`M0,20 
                     L300,20 
                     L300,${clockCycle === 3 ? 5 : 20} 
                     L400,${clockCycle === 3 ? 5 : 20} 
                     L400,20 
                     L600,20`}
                  fill="none" 
                  stroke={currentPhase === "memory" ? "rgb(20, 184, 166)" : "currentColor"} 
                  strokeWidth="2" 
                  className={currentPhase === "memory" ? "animate-pulse" : ""}
                />
                {currentPhase === "memory" && (
                  <text x="350" y="0" textAnchor="middle" fontSize="10" fill="rgb(20, 184, 166)">Active</text>
                )}
              </svg>
            </div>
          </div>
          
          {/* Write back signal */}
          <div className="flex">
            <div className="w-24 font-medium">Write Back</div>
            <div className="flex-1">
              <svg height="40" width="100%" className="overflow-visible">
                <path 
                  d={`M0,20 
                     L400,20 
                     L400,${clockCycle === 4 ? 5 : 20} 
                     L500,${clockCycle === 4 ? 5 : 20} 
                     L500,20 
                     L600,20`}
                  fill="none" 
                  stroke={currentPhase === "writeback" ? "rgb(20, 184, 166)" : "currentColor"} 
                  strokeWidth="2" 
                  className={currentPhase === "writeback" ? "animate-pulse" : ""}
                />
                {currentPhase === "writeback" && (
                  <text x="450" y="0" textAnchor="middle" fontSize="10" fill="rgb(20, 184, 166)">Active</text>
                )}
              </svg>
            </div>
          </div>
        </div>
        
        {/* Time markers - evenly spaced and properly aligned */}
        <div className="flex mt-2 text-xs">
          <div className="w-24"></div>
          <div className="flex-1 flex">
            {[0, 1, 2, 3, 4, 5].map(t => (
              <div 
                key={t}
                className={cn(
                  "text-center", 
                  clockCycle === t ? "font-bold text-tech-teal" : ""
                )} 
                style={{width: '100px'}}
              >
                T{t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

            {/* Explanation card */}
            {explanation && (
              <Card className="border-tech-teal">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-tech-teal/10">
                      <Clock className="h-5 w-5 text-tech-teal" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Current Operation</h4>
                      <p className="text-sm">{explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data Transfer Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Data Transfer Operation</CardTitle>
                <CardDescription>
                  Visualization of data movement during the instruction execution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[1000px] h-[180px] relative"> {/* Expanded from 800px to 1000px for better visualization */}
                    {/* CPU Block */}
                    <div className={cn(
                      "absolute top-0 left-0 w-32 h-32 border-2 rounded-md p-2 flex flex-col justify-center items-center",
                      currentPhase === "fetch" || currentPhase === "decode" || currentPhase === "execute" || currentPhase === "writeback" ? 
                        "border-tech-teal" : "border-gray-300"
                    )}>
                      <div className="text-sm font-medium">CPU</div>
                      <div className={cn(
                        "mt-2 w-full text-xs text-center p-1 rounded",
                        currentPhase === "decode" ? "bg-tech-teal/20" : ""
                      )}>
                        Control Unit
                      </div>
                      <div className={cn(
                        "mt-1 w-full text-xs text-center p-1 rounded",
                        currentPhase === "execute" ? "bg-tech-teal/20" : ""
                      )}>
                        ALU
                      </div>
                      <div className={cn(
                        "mt-1 w-full text-xs text-center p-1 rounded",
                        currentPhase === "writeback" ? "bg-tech-teal/20" : ""
                      )}>
                        Registers
                      </div>
                    </div>
                    
                    {/* Memory Block */}
                    <div className={cn(
                      "absolute top-0 right-0 w-32 h-32 border-2 rounded-md p-2 flex flex-col justify-center items-center",
                      currentPhase === "fetch" || currentPhase === "memory" ? 
                        "border-tech-teal" : "border-gray-300"
                    )}>
                      <div className="text-sm font-medium">Memory</div>
                      <div className={cn(
                        "mt-2 text-xs",
                        currentPhase === "fetch" || currentPhase === "memory" ? "text-tech-teal font-medium" : ""
                      )}>
                        {currentPhase === "fetch" ? "Instructions" : currentPhase === "memory" ? "Data" : "..."}
                      </div>
                    </div>
                    
                    {/* Data Bus - expanded and better aligned */}
                    <div className="absolute top-16 left-32 right-32 h-4 flex flex-col items-center">
                      <div className={cn(
                        "h-0.5 w-full",
                        (currentPhase === "fetch" && clockCycle === 0) || (currentPhase === "memory" && clockCycle === 3) ? 
                          "bg-tech-teal" : "bg-gray-300"
                      )}></div>
                      <div className="text-xs mt-1">Data Bus</div>
                      
                      {/* Data movement animation */}
                      {((currentPhase === "fetch" && clockCycle === 0) || (currentPhase === "memory" && clockCycle === 3)) && (
                        <div className="absolute top-0 left-0 right-0 flex justify-center">
                          <div className="w-3 h-3 bg-tech-teal rounded-full animate-[ping_1s_ease-in-out_infinite]"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Address Bus - expanded and better aligned */}
                    <div className="absolute top-24 left-32 right-32 h-4 flex flex-col items-center">
                      <div className={cn(
                        "h-0.5 w-full",
                        currentPhase === "fetch" || currentPhase === "memory" ? 
                          "bg-tech-teal" : "bg-gray-300"
                      )}></div>
                      <div className="text-xs mt-1">Address Bus</div>
                      
                      {/* Address sent animation */}
                      {(currentPhase === "fetch" || currentPhase === "memory") && (
                        <div className="absolute top-0 left-0 right-0 flex justify-center">
                          <div className={cn(
                            "w-3 h-3 rounded-full animate-[bounce_1s_ease-in-out_infinite]",
                            currentPhase === "fetch" || currentPhase === "memory" ? "bg-tech-teal" : "bg-gray-300"
                          )}></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Control Bus - expanded and better aligned */}
                    <div className="absolute top-32 left-32 right-32 h-4 flex flex-col items-center">
                      <div className={cn(
                        "h-0.5 w-full",
                        Object.values(controlSignals).some(signal => signal) ? 
                          "bg-tech-teal" : "bg-gray-300"
                      )}></div>
                      <div className="text-xs mt-1">Control Bus</div>
                      
                      {/* Control signals animation */}
                      {Object.values(controlSignals).some(signal => signal) && (
                        <div className="absolute top-0 left-0 right-0 flex justify-around">
                          {Object.entries(controlSignals).filter(([_, active]) => active).map(([signal], index) => (
                            <div key={index} className="w-2 h-2 bg-tech-teal rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" style={{
                              animationDelay: `${index * 0.2}s`
                            }}></div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Active phase indicator */}
                    <div className="absolute bottom-0 left-0 w-full flex justify-center">
                      <div className="text-xs text-tech-teal font-medium">
                        {currentPhase === "fetch" ? "Fetching Instruction" : 
                         currentPhase === "decode" ? "Decoding Instruction" :
                         currentPhase === "execute" ? "Executing Operation" : 
                         currentPhase === "memory" ? "Memory Access" : 
                         currentPhase === "writeback" ? "Writing Result" : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="microprogrammed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Microprogrammed Control Unit</CardTitle>
                <CardDescription>
                  A microprogrammed control unit uses microcode stored in memory to generate control signals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-lg h-64 border-2 border-slate-300 rounded-lg mb-4 p-4">
                    <div className="absolute top-0 left-0 bg-tech-teal text-white text-xs px-2 py-1 rounded-tl-md rounded-br-md">
                      Control Memory System
                    </div>
                    
                    <div className="flex h-full">
                      <div className="w-1/2 flex flex-col justify-center items-center">
                        <div className={cn(
                          "border border-slate-400 p-2 rounded-md w-32 text-center mb-4",
                          currentPhase === "fetch" ? "bg-tech-teal text-white" : "bg-slate-100 dark:bg-slate-800"
                        )}>
                          Control Address Register
                        </div>
                        <div className="w-0 h-8 border-l border-slate-400"></div>
                        <div className={cn(
                          "border border-slate-400 p-3 rounded-md w-32 text-center",
                          currentPhase === "fetch" ? "ring-2 ring-tech-teal" : "",
                          "bg-tech-blue text-white"
                        )}>
                          Control Memory
                        </div>
                        <div className="w-0 h-8 border-l border-slate-400"></div>
                        <div className={cn(
                          "border border-slate-400 p-2 rounded-md w-32 text-center",
                          currentPhase === "decode" ? "bg-tech-teal text-white" : "bg-slate-100 dark:bg-slate-800"
                        )}>
                          Microinstruction Register
                        </div>
                      </div>
                      
                      <div className="w-1/2 flex flex-col justify-center items-center">
                        <div className={cn(
                          "border border-slate-400 p-2 rounded-md w-32 text-center mb-4",
                          currentPhase === "decode" ? "bg-tech-teal text-white" : "text-white bg-tech-teal"
                        )}>
                          Next Address Generator
                        </div>
                        <div className="mt-8 border border-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-md w-32 text-center">
                          Control Signal Outputs
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-600 dark:text-slate-400 max-w-lg text-center">
                    <p><strong>Advantages:</strong> Flexible and easier to modify; supports complex instructions.</p>
                    <p><strong>Disadvantages:</strong> Slower execution due to memory access for microcode.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Microprogram Flow</CardTitle>
                <CardDescription>
                  Visualization of microprogram execution sequence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <div className="w-full min-w-[1000px] bg-slate-100 dark:bg-slate-800 rounded-lg p-4"> {/* Expanded from 800px to 1000px */}
                    <div className="grid grid-cols-4 gap-2 text-sm font-mono">
                      <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded">Address</div>
                      <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded col-span-2">Microinstruction</div>
                      <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded">Next Address</div>
                      
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600",
                        clockCycle === 0 ? "bg-tech-teal text-white" : ""
                      )}>0x00</div>
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600 col-span-2",
                        clockCycle === 0 ? "bg-tech-teal text-white" : ""
                      )}>PC → MAR, Read</div>
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600",
                        clockCycle === 0 ? "bg-tech-teal text-white" : ""
                      )}>0x01</div>
                      
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600",
                        clockCycle === 1 ? "bg-tech-teal text-white" : ""
                      )}>0x01</div>
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600 col-span-2",
                        clockCycle === 1 ? "bg-tech-teal text-white" : ""
                      )}>MBR → IR, PC+1 → PC</div>
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600",
                        clockCycle === 1 ? "bg-tech-teal text-white" : ""
                      )}>0x02</div>
                      
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600",
                        clockCycle === 2 ? "bg-tech-teal text-white" : ""
                      )}>0x02</div>
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600 col-span-2",
                        clockCycle === 2 ? "bg-tech-teal text-white" : ""
                      )}>IR(op) → decode</div>
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600",
                        clockCycle === 2 ? "bg-tech-teal text-white" : ""
                      )}>Branch</div>
                      
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600",
                        clockCycle === 3 ? "bg-tech-teal text-white" : ""
                      )}>0x10</div>
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600 col-span-2",
                        clockCycle === 3 ? "bg-tech-teal text-white" : ""
                      )}>ALU: ADD</div>
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600",
                        clockCycle === 3 ? "bg-tech-teal text-white" : ""
                      )}>0x00</div>
                      
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600",
                        clockCycle === 4 ? "bg-tech-teal text-white" : ""
                      )}>0x20</div>
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600 col-span-2",
                        clockCycle === 4 ? "bg-tech-teal text-white" : ""
                      )}>ALU: SUB</div>
                      <div className={cn(
                        "p-2 border-b border-slate-300 dark:border-slate-600",
                        clockCycle === 4 ? "bg-tech-teal text-white" : ""
                      )}>0x00</div>
                      
                      <div className={cn(
                        "p-2",
                        clockCycle === 5 ? "bg-tech-teal text-white" : ""
                      )}>0x30</div>
                      <div className={cn(
                        "p-2 col-span-2",
                        clockCycle === 5 ? "bg-tech-teal text-white" : ""
                      )}>ALU: AND</div>
                      <div className={cn(
                        "p-2",
                        clockCycle === 5 ? "bg-tech-teal text-white" : ""
                      )}>0x00</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Explanation card for microprogrammed */}
            <Card className="border-tech-teal">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-tech-teal/10">
                    <Microchip className="h-5 w-5 text-tech-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Current Microoperation</h4>
                    <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      {activeInstruction}
                    </p>
                    <p className="text-sm mt-2">{explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Alert className="mt-6">
          <AlertDescription className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              <strong>Timing & Control:</strong> The control unit orchestrates the CPU operation by generating signals in the correct 
              sequence to execute instructions. Each signal activates specific data paths and operations within the processor.
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
