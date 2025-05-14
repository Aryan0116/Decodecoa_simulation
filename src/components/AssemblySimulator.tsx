
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Cpu, Code, PlayCircle, StopCircle, RotateCcw, ChevronRight, BookOpen, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Register {
  name: string;
  value: number;
}

interface MemoryCell {
  address: number;
  value: number;
  label?: string;
  isActive?: boolean;
}

interface Instruction {
  line: number;
  address: number;
  label?: string;
  operation: string;
  operands: string[];
  originalText: string;
  isExecuting?: boolean;
}

export function AssemblySimulator() {
  const [code, setCode] = useState<string>(
`; Simple Assembly Program
; Add two numbers and store the result

START:  LOAD R1, #10    ; Load immediate value 10 into R1
        LOAD R2, #20    ; Load immediate value 20 into R2
        ADD R3, R1, R2  ; Add R1 and R2, store result in R3
        STORE R3, 100   ; Store R3 value at memory location 100
        HALT            ; End program execution`
  );
  const [registers, setRegisters] = useState<Register[]>([
    { name: "R0", value: 0 },
    { name: "R1", value: 0 },
    { name: "R2", value: 0 },
    { name: "R3", value: 0 },
    { name: "R4", value: 0 },
    { name: "R5", value: 0 },
    { name: "R6", value: 0 },
    { name: "R7", value: 0 },
    { name: "PC", value: 0 },
    { name: "IR", value: 0 },
  ]);
  const [memory, setMemory] = useState<MemoryCell[]>([]);
  const [parsedInstructions, setParsedInstructions] = useState<Instruction[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [currentView, setCurrentView] = useState<"registers" | "memory">("registers");
  const [instructionHighlight, setInstructionHighlight] = useState<number | null>(null);
  const [memoryAddressFilter, setMemoryAddressFilter] = useState<string>("");
  const memoryTableRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  // Initialize memory
  useEffect(() => {
    const initialMemory: MemoryCell[] = [];
    for (let i = 0; i < 200; i += 4) {
      initialMemory.push({ address: i, value: 0 });
    }
    setMemory(initialMemory);
  }, []);

  // Parse assembly code
  const parseCode = () => {
    const lines = code.split('\n');
    const instructions: Instruction[] = [];
    let address = 0;
    
    lines.forEach((line, index) => {
      // Remove comments
      const commentIndex = line.indexOf(';');
      const codeLine = commentIndex >= 0 ? line.substring(0, commentIndex).trim() : line.trim();
      
      if (codeLine.length === 0) return;
      
      // Check if line has a label
      const labelMatch = codeLine.match(/^([A-Za-z0-9_]+):/);
      let remainingCode = codeLine;
      let label: string | undefined;
      
      if (labelMatch) {
        label = labelMatch[1];
        remainingCode = codeLine.substring(labelMatch[0].length).trim();
      }
      
      // If there's no instruction after the label, just record the label
      if (remainingCode.length === 0 && label) {
        instructions.push({
          line: index + 1,
          address,
          label,
          operation: "",
          operands: [],
          originalText: line
        });
        return;
      }
      
      // Parse operation and operands
      const parts = remainingCode.split(/\s+/);
      const operation = parts[0];
      const operands = parts.slice(1).join(' ').split(',').map(op => op.trim());
      
      instructions.push({
        line: index + 1,
        address,
        label,
        operation,
        operands,
        originalText: line
      });
      
      address += 4; // Each instruction takes 4 bytes
    });
    
    setParsedInstructions(instructions);
    setCurrentInstruction(0);
    
    // Update PC register to start at first instruction
    updateRegister("PC", instructions.length > 0 ? instructions[0].address : 0);
    
    toast({
      title: "Code parsed successfully",
      description: `Found ${instructions.length} instructions`,
    });
    
    return instructions;
  };

  // Update register value
  const updateRegister = (name: string, value: number) => {
    setRegisters(prev => 
      prev.map(reg => 
        reg.name === name ? { ...reg, value } : reg
      )
    );
  };

  // Update memory cell value
  const updateMemory = (address: number, value: number) => {
    setMemory(prev => 
      prev.map(cell => 
        cell.address === address ? { ...cell, value, isActive: true } : { ...cell, isActive: false }
      )
    );
    
    // Scroll to the updated memory cell if it's visible
    setTimeout(() => {
      if (currentView === "memory" && memoryTableRef.current) {
        const activeRow = memoryTableRef.current.querySelector('.bg-yellow-100, .dark\\:bg-yellow-900\\/30');
        if (activeRow) {
          activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 100);
  };

  // Get register value
  const getRegisterValue = (name: string): number => {
    const register = registers.find(reg => reg.name === name);
    return register ? register.value : 0;
  };

  // Filter memory cells
  const filteredMemory = memory.filter(cell => {
    if (!memoryAddressFilter) return true;
    const filterValue = memoryAddressFilter.toLowerCase();
    
    // Filter by address in decimal or hex
    return cell.address.toString().includes(filterValue) || 
           cell.address.toString(16).toLowerCase().includes(filterValue);
  });

  // Execute one instruction
  const executeInstruction = (instruction: Instruction) => {
    if (!instruction) return false;
    
    const { operation, operands } = instruction;
    let newLog = `Executing: ${operation} ${operands.join(', ')}`;
    
    // Update instruction highlight
    setInstructionHighlight(instruction.line - 1);
    
    // Set the current instruction as executing
    setParsedInstructions(prev => 
      prev.map(ins => 
        ins.line === instruction.line ? { ...ins, isExecuting: true } : { ...ins, isExecuting: false }
      )
    );
    
    // Update PC register to point to next instruction
    const currentPC = getRegisterValue("PC");
    updateRegister("PC", currentPC + 4);
    
    switch (operation.toUpperCase()) {
      case "LOAD": {
        const destReg = operands[0].trim();
        const source = operands[1].trim();
        
        // Handle immediate value (e.g., #10)
        if (source.startsWith('#')) {
          const value = parseInt(source.substring(1));
          updateRegister(destReg, value);
          newLog += ` - Loaded immediate ${value} into ${destReg}`;
        }
        // Handle memory address
        else {
          const address = parseInt(source);
          const memoryCell = memory.find(cell => cell.address === address);
          if (memoryCell) {
            updateRegister(destReg, memoryCell.value);
            updateMemory(address, memoryCell.value); // Highlight the memory cell
            newLog += ` - Loaded value ${memoryCell.value} from address ${address} into ${destReg}`;
          }
        }
        break;
      }
      case "STORE": {
        const sourceReg = operands[0].trim();
        const destAddr = parseInt(operands[1].trim());
        const value = getRegisterValue(sourceReg);
        
        updateMemory(destAddr, value);
        newLog += ` - Stored value ${value} from ${sourceReg} to address ${destAddr}`;
        
        // Auto switch to memory view when storing
        setCurrentView("memory");
        break;
      }
      case "ADD": {
        const destReg = operands[0].trim();
        const src1 = operands[1].trim();
        const src2 = operands[2].trim();
        
        const val1 = getRegisterValue(src1);
        const val2 = getRegisterValue(src2);
        const result = val1 + val2;
        
        updateRegister(destReg, result);
        newLog += ` - Added ${val1} + ${val2} = ${result}, stored in ${destReg}`;
        break;
      }
      case "SUB": {
        const destReg = operands[0].trim();
        const src1 = operands[1].trim();
        const src2 = operands[2].trim();
        
        const val1 = getRegisterValue(src1);
        const val2 = getRegisterValue(src2);
        const result = val1 - val2;
        
        updateRegister(destReg, result);
        newLog += ` - Subtracted ${val1} - ${val2} = ${result}, stored in ${destReg}`;
        break;
      }
      case "MUL": {
        const destReg = operands[0].trim();
        const src1 = operands[1].trim();
        const src2 = operands[2].trim();
        
        const val1 = getRegisterValue(src1);
        const val2 = getRegisterValue(src2);
        const result = val1 * val2;
        
        updateRegister(destReg, result);
        newLog += ` - Multiplied ${val1} * ${val2} = ${result}, stored in ${destReg}`;
        break;
      }
      case "HALT": {
        newLog += " - Program execution halted";
        setIsRunning(false);
        return false;
      }
      default:
        newLog += " - Unknown operation";
        break;
    }
    
    setExecutionLog(prev => [...prev, newLog]);
    return true;
  };

  // Run one step of the program
  const step = () => {
    if (currentInstruction >= parsedInstructions.length) {
      setIsRunning(false);
      toast({
        title: "Program completed",
        description: "All instructions have been executed",
      });
      return;
    }
    
    const currentInst = parsedInstructions[currentInstruction];
    const shouldContinue = executeInstruction(currentInst);
    
    if (shouldContinue) {
      setCurrentInstruction(prev => prev + 1);
    }
  };

  // Run program automatically
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        if (currentInstruction < parsedInstructions.length) {
          step();
        } else {
          setIsRunning(false);
        }
      }, speed);
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRunning, currentInstruction, parsedInstructions, speed]);

  // Reset simulator
  const reset = () => {
    setCurrentInstruction(0);
    setIsRunning(false);
    setExecutionLog([]);
    setRegisters(registers.map(reg => ({ ...reg, value: 0 })));
    setMemory(memory.map(cell => ({ ...cell, value: 0, isActive: false })));
    setInstructionHighlight(null);
    
    // Reset PC register
    updateRegister("PC", parsedInstructions.length > 0 ? parsedInstructions[0].address : 0);
    
    toast({
      title: "Simulator reset",
      description: "All registers and memory have been cleared",
    });
  };

  // Run the program
  const run = () => {
    if (parsedInstructions.length === 0) {
      parseCode();
    }
    setIsRunning(true);
  };

  // Stop the program
  const stop = () => {
    setIsRunning(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Cpu className="h-8 w-8" />
              Assembly Language Simulator
            </h2>
            <p className="text-indigo-100 mt-1">
              Learn assembly programming concepts with this interactive simulator
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="secondary" className="gap-2" onClick={() => setActiveTab("learn")}>
              <BookOpen className="h-4 w-4" />
              Documentation
            </Button>
            <Button variant={isRunning ? "destructive" : "default"} className="gap-2" onClick={isRunning ? stop : run}>
              {isRunning ? (
                <><StopCircle className="h-4 w-4" /> Stop</>
              ) : (
                <><PlayCircle className="h-4 w-4" /> Run</>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>Editor</span>
          </TabsTrigger>
          <TabsTrigger value="simulator" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Simulator</span>
          </TabsTrigger>
          <TabsTrigger value="learn" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Learn</span>
          </TabsTrigger>
        </TabsList>

        {/* Editor Tab */}
        <TabsContent value="editor" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Assembly Code Editor</CardTitle>
              <CardDescription>
                Write your assembly program here, then parse and run it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono h-[400px] bg-slate-950 text-green-400 p-4"
                    placeholder="Write your assembly code here..."
                  />
                  {instructionHighlight !== null && (
                    <div 
                      className="absolute left-0 bg-yellow-300/20 w-full h-6"
                      style={{
                        top: `${(instructionHighlight * 24) + 16}px`,
                        transition: 'top 0.3s ease-in-out'
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={parseCode}>Parse Code</Button>
                  <Button onClick={run} disabled={isRunning || parsedInstructions.length === 0}>Run</Button>
                  <Button onClick={stop} disabled={!isRunning}>Stop</Button>
                  <Button onClick={step} disabled={isRunning || currentInstruction >= parsedInstructions.length}>Step</Button>
                  <Button variant="outline" onClick={reset}>Reset</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parsed Instructions */}
          {parsedInstructions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Parsed Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Line</TableHead>
                        <TableHead className="w-24">Address</TableHead>
                        <TableHead className="w-24">Label</TableHead>
                        <TableHead>Instruction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedInstructions.map((inst) => (
                        <TableRow 
                          key={inst.line} 
                          className={cn(
                            inst.isExecuting && "bg-green-100 dark:bg-green-900/30",
                            "transition-colors duration-300"
                          )}
                        >
                          <TableCell>{inst.line}</TableCell>
                          <TableCell>0x{inst.address.toString(16).padStart(4, '0')}</TableCell>
                          <TableCell>{inst.label || ""}</TableCell>
                          <TableCell>
                            <span className="font-semibold">{inst.operation}</span>
                            {" "}
                            {inst.operands.join(", ")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Simulator Tab */}
        <TabsContent value="simulator" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Execution Controls */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div>Execution Controls</div>
                  <Badge 
                    variant={isRunning ? "default" : "outline"} 
                    className={cn(
                      isRunning && "animate-pulse bg-green-500",
                      "ml-2"
                    )}
                  >
                    {isRunning ? "Running" : "Stopped"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button onClick={run} disabled={isRunning || parsedInstructions.length === 0} className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Run
                </Button>
                <Button onClick={stop} disabled={!isRunning} variant="destructive" className="gap-2">
                  <StopCircle className="h-4 w-4" />
                  Stop
                </Button>
                <Button onClick={step} disabled={isRunning || currentInstruction >= parsedInstructions.length} className="gap-2">
                  <ChevronRight className="h-4 w-4" />
                  Step
                </Button>
                <Button variant="outline" onClick={reset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <div className="ml-auto flex items-center gap-2">
                  <span>Speed:</span>
                  <select 
                    value={speed} 
                    onChange={(e) => setSpeed(Number(e.target.value))} 
                    className="p-2 border rounded-md"
                  >
                    <option value="2000">Slow (2s)</option>
                    <option value="1000">Normal (1s)</option>
                    <option value="500">Fast (0.5s)</option>
                    <option value="100">Very Fast (0.1s)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Register and Memory View */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>System State</CardTitle>
                  <div className="flex border rounded-md overflow-hidden">
                    <Button
                      variant={currentView === "registers" ? "default" : "ghost"}
                      className="rounded-none h-8 px-3"
                      onClick={() => setCurrentView("registers")}
                    >
                      Registers
                    </Button>
                    <Button
                      variant={currentView === "memory" ? "default" : "ghost"}
                      className="rounded-none h-8 px-3"
                      onClick={() => setCurrentView("memory")}
                    >
                      Memory
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {currentView === "registers" && (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Register</TableHead>
                          <TableHead>Value (Dec)</TableHead>
                          <TableHead>Value (Hex)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registers.map((reg) => (
                          <TableRow key={reg.name} className="transition-colors duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <TableCell className="font-medium">{reg.name}</TableCell>
                            <TableCell>{reg.value}</TableCell>
                            <TableCell>0x{reg.value.toString(16).padStart(8, '0')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {currentView === "memory" && (
                  <div>
                    <div className="mb-2">
                      <input 
                        type="text"
                        placeholder="Filter address..."
                        className="w-full p-2 border rounded-md mb-2"
                        value={memoryAddressFilter}
                        onChange={(e) => setMemoryAddressFilter(e.target.value)}
                      />
                    </div>
                    <div className="border rounded-md overflow-hidden" ref={memoryTableRef}>
                      <ScrollArea style={{ height: "350px" }}>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Address</TableHead>
                              <TableHead>Value (Dec)</TableHead>
                              <TableHead>Value (Hex)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredMemory.map((cell) => (
                              <TableRow 
                                key={cell.address}
                                className={cn(
                                  cell.isActive && "bg-yellow-100 dark:bg-yellow-900/30",
                                  "transition-colors duration-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                              >
                                <TableCell className="font-medium">0x{cell.address.toString(16).padStart(4, '0')}</TableCell>
                                <TableCell>{cell.value}</TableCell>
                                <TableCell>0x{cell.value.toString(16).padStart(8, '0')}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Execution Log */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Execution Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] overflow-auto border rounded-md p-2 bg-slate-950 text-green-400 font-mono">
                  <ScrollArea style={{ height: "100%" }}>
                    {executionLog.map((log, index) => (
                      <div key={index} className="py-1">
                        {`> ${log}`}
                      </div>
                    ))}
                    {executionLog.length === 0 && (
                      <div className="text-slate-500 italic">No instructions executed yet</div>
                    )}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Learn Tab */}
        <TabsContent value="learn" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assembly Language Basics</CardTitle>
                <CardDescription>Understanding the fundamentals of assembly programming</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">What is Assembly Language?</h3>
                  <p>
                    Assembly language is a low-level programming language that has a strong correspondence 
                    with machine code instructions. It uses mnemonics to represent the basic operations that 
                    a computer can perform. Assembly language allows direct hardware manipulation and is specific 
                    to a particular computer architecture.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Components of Assembly Language</h3>
                  
                  <div className="pl-4 border-l-4 border-indigo-500">
                    <h4 className="font-medium">Instructions (Opcodes)</h4>
                    <p>The basic operations the CPU can perform (ADD, LOAD, STORE, etc.)</p>
                  </div>
                  
                  <div className="pl-4 border-l-4 border-purple-500">
                    <h4 className="font-medium">Operands</h4>
                    <p>The data that instructions operate on (registers, memory addresses, or immediate values)</p>
                  </div>
                  
                  <div className="pl-4 border-l-4 border-blue-500">
                    <h4 className="font-medium">Directives</h4>
                    <p>Commands for the assembler, not translated into machine code</p>
                  </div>
                  
                  <div className="pl-4 border-l-4 border-green-500">
                    <h4 className="font-medium">Labels</h4>
                    <p>Symbolic names for memory addresses, making code more readable</p>
                  </div>
                  
                  <div className="pl-4 border-l-4 border-pink-500">
                    <h4 className="font-medium">Comments</h4>
                    <p>Notes in code that explain what the code does (often starting with ; or #)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">The Fetch-Execute Cycle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300">1. Fetch</h4>
                      <p className="text-sm mt-1">The CPU retrieves the instruction from memory at the location specified by the Program Counter (PC).</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-700 dark:text-green-300">2. Decode</h4>
                      <p className="text-sm mt-1">The CPU determines what the instruction is and what it needs (operands, registers, etc.).</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-md border border-purple-200 dark:border-purple-800">
                      <h4 className="font-medium text-purple-700 dark:text-purple-300">3. Execute</h4>
                      <p className="text-sm mt-1">The CPU performs the operation specified by the instruction and stores the result.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instruction Set Reference</CardTitle>
                <CardDescription>Supported instructions in this simulator</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 bg-indigo-50 dark:bg-indigo-950">
                    <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Data Movement</h3>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
                        <code className="font-bold">LOAD Rd, src</code>
                        <p className="text-sm mt-1">Loads a value into register Rd from a memory location or immediate value</p>
                        <p className="text-xs text-slate-500 mt-1">Example: LOAD R1, #10 or LOAD R1, 100</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
                        <code className="font-bold">STORE Rs, addr</code>
                        <p className="text-sm mt-1">Stores value from register Rs to memory address</p>
                        <p className="text-xs text-slate-500 mt-1">Example: STORE R1, 100</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 bg-purple-50 dark:bg-purple-950">
                    <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Arithmetic Operations</h3>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
                        <code className="font-bold">ADD Rd, Rs1, Rs2</code>
                        <p className="text-sm mt-1">Adds the values in registers Rs1 and Rs2, stores in Rd</p>
                        <p className="text-xs text-slate-500 mt-1">Example: ADD R3, R1, R2</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
                        <code className="font-bold">SUB Rd, Rs1, Rs2</code>
                        <p className="text-sm mt-1">Subtracts Rs2 from Rs1, stores in Rd</p>
                        <p className="text-xs text-slate-500 mt-1">Example: SUB R3, R1, R2</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
                        <code className="font-bold">MUL Rd, Rs1, Rs2</code>
                        <p className="text-sm mt-1">Multiplies Rs1 by Rs2, stores in Rd</p>
                        <p className="text-xs text-slate-500 mt-1">Example: MUL R3, R1, R2</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 bg-blue-50 dark:bg-blue-950">
                    <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Program Control</h3>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
                      <code className="font-bold">HALT</code>
                      <p className="text-sm mt-1">Stops program execution</p>
                      <p className="text-xs text-slate-500 mt-1">Example: HALT</p>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 bg-green-50 dark:bg-green-950">
                    <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Assembly Format</h3>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
                      <p className="text-sm">Each line can contain:</p>
                      <ul className="list-disc list-inside text-sm mt-1">
                        <li>An optional label followed by a colon</li>
                        <li>An operation mnemonic</li>
                        <li>Operands separated by commas</li>
                        <li>A comment starting with a semicolon</li>
                      </ul>
                      <p className="text-xs text-slate-500 mt-1">Example: START: ADD R1, R2, R3 ; Add R2 and R3</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory and Register Usage</CardTitle>
                <CardDescription>Understanding how memory and registers work in assembly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Registers</h3>
                    <div className="space-y-2">
                      <p>
                        Registers are small, high-speed storage locations directly inside the CPU. 
                        They are much faster to access than memory and are used for temporary data storage 
                        during execution.
                      </p>
                      <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md">
                        <h4 className="font-medium">In this simulator:</h4>
                        <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                          <li><span className="font-semibold">R0-R7:</span> General purpose registers</li>
                          <li><span className="font-semibold">PC:</span> Program Counter - points to the next instruction</li>
                          <li><span className="font-semibold">IR:</span> Instruction Register - holds the current instruction</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Memory</h3>
                    <div className="space-y-2">
                      <p>
                        Memory is used for storing both program instructions and data. It's organized 
                        into addressable locations, each with a unique address. In this simulator, each memory 
                        cell is 4 bytes (32 bits).
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                        <h4 className="font-medium">Memory access:</h4>
                        <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                          <li>Use LOAD to read from memory to register</li>
                          <li>Use STORE to write from register to memory</li>
                          <li>Memory addresses are specified as decimal numbers</li>
                          <li>Memory is displayed in both decimal and hexadecimal</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md mt-4">
                  <h3 className="text-lg font-semibold">Debugging Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <h4 className="font-medium">Step Mode</h4>
                      <p className="text-sm mt-1">
                        Use the "Step" button to execute one instruction at a time. 
                        This helps you understand the execution flow and spot issues.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Execution Log</h4>
                      <p className="text-sm mt-1">
                        The log shows exactly what happens during each instruction, 
                        including values read/written and calculations performed.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Sum of Numbers</h3>
                    <pre className="bg-slate-950 text-green-400 p-3 rounded text-xs overflow-auto">
{`; Sum numbers from 1 to 5
START:  LOAD R1, #0    ; Sum
        LOAD R2, #1    ; Counter
        LOAD R3, #5    ; Limit
LOOP:   ADD R1, R1, R2 ; Add counter to sum
        ADD R2, R2, #1 ; Increment counter
        SUB R4, R3, R2 ; Check if done
        HALT           ; End program`}
                    </pre>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                      setCode(`; Sum numbers from 1 to 5
START:  LOAD R1, #0    ; Sum
        LOAD R2, #1    ; Counter
        LOAD R3, #5    ; Limit
LOOP:   ADD R1, R1, R2 ; Add counter to sum
        ADD R2, R2, #1 ; Increment counter
        SUB R4, R3, R2 ; Check if done
        HALT           ; End program`);
                      setActiveTab("editor");
                      toast({ title: "Example loaded", description: "Sum of numbers program loaded in editor" });
                    }}>
                      Load this example
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Multiple Operations</h3>
                    <pre className="bg-slate-950 text-green-400 p-3 rounded text-xs overflow-auto">
{`; Perform various operations
START:  LOAD R1, #25   ; First number
        LOAD R2, #10   ; Second number
        ADD R3, R1, R2 ; Addition
        SUB R4, R1, R2 ; Subtraction
        MUL R5, R1, R2 ; Multiplication
        STORE R3, 100  ; Store results
        STORE R4, 104  
        STORE R5, 108
        HALT           ; End program`}
                    </pre>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                      setCode(`; Perform various operations
START:  LOAD R1, #25   ; First number
        LOAD R2, #10   ; Second number
        ADD R3, R1, R2 ; Addition
        SUB R4, R1, R2 ; Subtraction
        MUL R5, R1, R2 ; Multiplication
        STORE R3, 100  ; Store results
        STORE R4, 104  
        STORE R5, 108
        HALT           ; End program`);
                      setActiveTab("editor");
                      toast({ title: "Example loaded", description: "Multiple operations program loaded in editor" });
                    }}>
                      Load this example
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}