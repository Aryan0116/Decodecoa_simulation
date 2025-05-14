
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircuitBoard, Cpu, Database, Microchip } from "lucide-react";

export function CpuComponents() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">CPU Components & Architecture</h2>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alu">ALU</TabsTrigger>
            <TabsTrigger value="registers">Registers</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">The CPU Architecture</h3>
                <p className="mb-4">
                  The Central Processing Unit (CPU) is the brain of a computer system, responsible for executing instructions and processing data. Modern CPU architecture consists of several key components working together.
                </p>
                
                <div className="flex items-start space-x-3 mb-4">
                  <CircuitBoard className="h-10 w-10 text-tech-blue mt-1" />
                  <div>
                    <h4 className="font-medium">Control Unit</h4>
                    <p className="text-sm">Directs the operation of the CPU, controlling the flow of data between the CPU and other devices.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 mb-4">
                  <Microchip className="h-10 w-10 text-tech-blue mt-1" />
                  <div>
                    <h4 className="font-medium">Arithmetic Logic Unit (ALU)</h4>
                    <p className="text-sm">Performs all arithmetic and logical operations within the CPU.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Database className="h-10 w-10 text-tech-blue mt-1" />
                  <div>
                    <h4 className="font-medium">Registers</h4>
                    <p className="text-sm">Small, high-speed storage areas within the CPU for temporarily holding data and instructions.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-tech-blue text-white p-3 text-center font-semibold">
                    Computer System Architecture
                  </div>
                  <div className="p-4">
                    <div className="flex flex-col space-y-4">
                      <div className="border-2 border-tech-blue rounded p-3">
                        <div className="font-medium text-center mb-2">CPU</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="border border-slate-300 dark:border-slate-600 rounded p-2 text-center bg-white dark:bg-slate-900">Control Unit</div>
                          <div className="border border-slate-300 dark:border-slate-600 rounded p-2 text-center bg-white dark:bg-slate-900">ALU</div>
                          <div className="border border-slate-300 dark:border-slate-600 rounded p-2 text-center bg-white dark:bg-slate-900 col-span-2">Registers</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="h-6 w-1 bg-slate-300 dark:bg-slate-600"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-slate-300 dark:border-slate-600 rounded p-2 text-center bg-white dark:bg-slate-900">Primary Memory (RAM)</div>
                        <div className="border border-slate-300 dark:border-slate-600 rounded p-2 text-center bg-white dark:bg-slate-900">Secondary Storage</div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="h-6 w-1 bg-slate-300 dark:bg-slate-600"></div>
                      </div>
                      
                      <div className="border border-slate-300 dark:border-slate-600 rounded p-2 text-center bg-white dark:bg-slate-900">
                        Input/Output Devices
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              
            <Card>
              <CardHeader>
                <CardTitle>Von Neumann Architecture</CardTitle>
                <CardDescription>
                  The fundamental design for most modern computers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3">
                  The Von Neumann architecture, proposed by mathematician John von Neumann in 1945, 
                  describes a design where a single storage structure holds both program instructions and data.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Program instructions and data share the same memory</li>
                  <li>Instructions are executed sequentially (unless directed otherwise)</li>
                  <li>The CPU fetches instructions from memory, decodes them, and executes them</li>
                  <li>Results may be stored back in memory</li>
                  <li>This architecture is the foundation of most modern computers</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alu" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Arithmetic Logic Unit (ALU)</h3>
                <p>
                  The ALU is a fundamental building block of the CPU. It performs all arithmetic operations (addition, subtraction, etc.) and logical operations (AND, OR, NOT, etc.) on data.
                </p>
                
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium">ALU Operations</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="border border-slate-200 dark:border-slate-700 rounded p-2">
                      <div className="font-medium mb-1">Arithmetic</div>
                      <ul className="list-disc list-inside">
                        <li>Addition</li>
                        <li>Subtraction</li>
                        <li>Multiplication</li>
                        <li>Division</li>
                        <li>Increment/Decrement</li>
                      </ul>
                    </div>
                    
                    <div className="border border-slate-200 dark:border-slate-700 rounded p-2">
                      <div className="font-medium mb-1">Logical</div>
                      <ul className="list-disc list-inside">
                        <li>AND</li>
                        <li>OR</li>
                        <li>NOT</li>
                        <li>XOR</li>
                        <li>Shift/Rotate</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-tech-blue text-white p-3 text-center font-semibold">
                    ALU Diagram
                  </div>
                  <div className="p-4 flex justify-center">
                    <div className="relative">
                      {/* ALU Shape */}
                      <div className="w-48 h-48 relative">
                        <div className="absolute top-0 left-0 right-0 border-t-[96px] border-l-[48px] border-r-[48px] border-transparent border-t-slate-200 dark:border-t-slate-700"></div>
                        <div className="absolute bottom-0 left-0 right-0 border-b-[96px] border-l-[48px] border-r-[48px] border-transparent border-b-slate-200 dark:border-b-slate-700"></div>
                        
                        {/* ALU Text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-xl font-bold">ALU</div>
                        </div>
                        
                        {/* Input A */}
                        <div className="absolute top-1/4 -left-20 flex items-center">
                          <div className="w-20 h-1 bg-tech-blue"></div>
                          <div className="text-sm ml-2">Input A</div>
                        </div>
                        
                        {/* Input B */}
                        <div className="absolute top-2/4 -left-20 flex items-center">
                          <div className="w-20 h-1 bg-tech-blue"></div>
                          <div className="text-sm ml-2">Input B</div>
                        </div>
                        
                        {/* Output */}
                        <div className="absolute top-1/3 -right-20 flex items-center">
                          <div className="text-sm mr-2">Result</div>
                          <div className="w-20 h-1 bg-tech-blue"></div>
                        </div>
                        
                        {/* Control */}
                        <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
                          <div className="text-sm">Control Signals</div>
                          <div className="h-10 w-1 bg-tech-blue mx-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>ALU in Modern CPUs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">
                  Modern CPUs contain multiple specialized ALUs to handle different types of operations:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Integer ALU: Handles whole number arithmetic</li>
                  <li>Floating Point Unit (FPU): Handles decimal arithmetic</li>
                  <li>SIMD (Single Instruction, Multiple Data) units: Process multiple data elements simultaneously</li>
                  <li>Vector Processing Units: Handle operations on vectors and matrices</li>
                  <li>Cryptographic Units: Accelerate encryption/decryption operations</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="registers" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">CPU Registers</h3>
                <p className="mb-4">
                  Registers are small, high-speed storage areas within the CPU that temporarily hold data and instructions. They are the fastest form of data storage in a computer.
                </p>
                
                <h4 className="font-medium mt-4 mb-2">Common Register Types</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-6 bg-tech-blue bg-opacity-20 border border-tech-blue text-center text-xs flex items-center justify-center rounded">
                      PC
                    </div>
                    <div>
                      <span className="font-medium">Program Counter</span> - Contains the address of the next instruction to be executed
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-6 bg-tech-blue bg-opacity-20 border border-tech-blue text-center text-xs flex items-center justify-center rounded">
                      IR
                    </div>
                    <div>
                      <span className="font-medium">Instruction Register</span> - Holds the current instruction being executed
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-6 bg-tech-blue bg-opacity-20 border border-tech-blue text-center text-xs flex items-center justify-center rounded">
                      AX, BX
                    </div>
                    <div>
                      <span className="font-medium">General Purpose Registers</span> - Hold data for processing
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-6 bg-tech-blue bg-opacity-20 border border-tech-blue text-center text-xs flex items-center justify-center rounded">
                      FLAGS
                    </div>
                    <div>
                      <span className="font-medium">Status Register</span> - Contains flags indicating the status of operations (zero, carry, overflow)
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-6 bg-tech-blue bg-opacity-20 border border-tech-blue text-center text-xs flex items-center justify-center rounded">
                      SP
                    </div>
                    <div>
                      <span className="font-medium">Stack Pointer</span> - Points to the top of the stack in memory
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-tech-blue text-white p-3 text-center font-semibold">
                    CPU Register Organization
                  </div>
                  <div className="p-4">
                    <div className="grid gap-3">
                      {/* Control Registers */}
                      <div>
                        <div className="text-sm font-medium mb-1">Control Registers</div>
                        <div className="flex gap-2">
                          <div className="flex-1 border border-tech-blue bg-white dark:bg-slate-900 p-2 text-center text-sm rounded">
                            PC
                          </div>
                          <div className="flex-1 border border-tech-blue bg-white dark:bg-slate-900 p-2 text-center text-sm rounded">
                            IR
                          </div>
                          <div className="flex-1 border border-tech-blue bg-white dark:bg-slate-900 p-2 text-center text-sm rounded">
                            SP
                          </div>
                        </div>
                      </div>
                      
                      {/* General Purpose Registers */}
                      <div>
                        <div className="text-sm font-medium mb-1">General Purpose Registers</div>
                        <div className="grid grid-cols-4 gap-2">
                          {["AX", "BX", "CX", "DX"].map((reg) => (
                            <div key={reg} className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2 text-center text-sm rounded">
                              {reg}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Status Register */}
                      <div>
                        <div className="text-sm font-medium mb-1">Status Register (FLAGS)</div>
                        <div className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-1 rounded">
                          <div className="grid grid-cols-8 gap-px text-xs">
                            {["CF", "PF", "AF", "ZF", "SF", "OF", "DF", "IF"].map((flag) => (
                              <div key={flag} className="border border-slate-200 dark:border-slate-700 p-1 text-center">
                                {flag}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Specialized Registers */}
                      <div>
                        <div className="text-sm font-medium mb-1">Specialized Registers</div>
                        <div className="flex gap-2">
                          <div className="flex-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2 text-center text-sm rounded">
                            Base
                          </div>
                          <div className="flex-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2 text-center text-sm rounded">
                            Index
                          </div>
                          <div className="flex-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2 text-center text-sm rounded">
                            Segment
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Register Usage in Instruction Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">During the execution of an instruction, registers play critical roles:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li><span className="font-medium">Fetch:</span> PC provides the address of the next instruction</li>
                  <li><span className="font-medium">Decode:</span> IR holds the instruction while the CPU decodes it</li>
                  <li><span className="font-medium">Execute:</span> General-purpose registers supply operands to the ALU</li>
                  <li><span className="font-medium">Memory Access:</span> Address registers provide memory locations</li>
                  <li><span className="font-medium">Write Back:</span> Results are stored back in registers</li>
                </ol>
                <p className="mt-3 text-sm">
                  The number and types of registers vary between CPU architectures, but the fundamental principles remain the same across most modern processors.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="memory" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Memory Hierarchy</h3>
                <p className="mb-4">
                  Computer systems use a hierarchy of memory types to balance speed, cost, and capacity. The closer memory is to the CPU, the faster and more expensive it is per byte.
                </p>
                
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium">Memory Types (Top to Bottom)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="border border-slate-200 dark:border-slate-700 rounded p-3 bg-tech-blue bg-opacity-10">
                      <div className="font-medium">Registers</div>
                      <div>Fastest, smallest, directly in CPU</div>
                      <div className="text-xs text-slate-500">Access time: &lt;1ns</div>
                    </div>
                    
                    <div className="border border-slate-200 dark:border-slate-700 rounded p-3 bg-tech-blue bg-opacity-5">
                      <div className="font-medium">Cache Memory (L1, L2, L3)</div>
                      <div>Very fast SRAM, small to medium size</div>
                      <div className="text-xs text-slate-500">Access time: 1-10ns</div>
                    </div>
                    
                    <div className="border border-slate-200 dark:border-slate-700 rounded p-3">
                      <div className="font-medium">Main Memory (RAM)</div>
                      <div>Medium speed, volatile storage</div>
                      <div className="text-xs text-slate-500">Access time: 50-100ns</div>
                    </div>
                    
                    <div className="border border-slate-200 dark:border-slate-700 rounded p-3">
                      <div className="font-medium">Solid State Drives (SSD)</div>
                      <div>Non-volatile, faster than HDDs</div>
                      <div className="text-xs text-slate-500">Access time: 10-100µs</div>
                    </div>
                    
                    <div className="border border-slate-200 dark:border-slate-700 rounded p-3">
                      <div className="font-medium">Hard Disk Drives (HDD)</div>
                      <div>Slow, non-volatile, large capacity</div>
                      <div className="text-xs text-slate-500">Access time: 5-10ms</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-tech-blue text-white p-3 text-center font-semibold">
                    Memory Hierarchy Pyramid
                  </div>
                  <div className="p-4 flex justify-center">
                    <div className="w-full max-w-xs">
                      {/* Registers */}
                      <div className="h-12 bg-tech-blue text-white text-center flex items-center justify-center text-sm rounded-t-lg">
                        Registers
                      </div>
                      
                      {/* L1 Cache */}
                      <div className="h-12 bg-tech-blue bg-opacity-80 text-white text-center flex items-center justify-center text-sm -mt-1 mx-2">
                        L1 Cache
                      </div>
                      
                      {/* L2 Cache */}
                      <div className="h-12 bg-tech-blue bg-opacity-60 text-white text-center flex items-center justify-center text-sm -mt-1 mx-6">
                        L2 Cache
                      </div>
                      
                      {/* L3 Cache */}
                      <div className="h-12 bg-tech-blue bg-opacity-40 text-white text-center flex items-center justify-center text-sm -mt-1 mx-10">
                        L3 Cache
                      </div>
                      
                      {/* Main Memory */}
                      <div className="h-12 bg-tech-blue bg-opacity-20 text-slate-800 dark:text-white text-center flex items-center justify-center text-sm -mt-1 mx-14">
                        Main Memory (RAM)
                      </div>
                      
                      {/* SSD */}
                      <div className="h-12 bg-tech-blue bg-opacity-10 text-slate-800 dark:text-white text-center flex items-center justify-center text-sm -mt-1 mx-18">
                        SSD Storage
                      </div>
                      
                      {/* HDD */}
                      <div className="h-12 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-center flex items-center justify-center text-sm -mt-1 mx-22 rounded-b-lg">
                        HDD Storage
                      </div>
                      
                      {/* Labels */}
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <div>Faster<br/>Smaller<br/>More Expensive</div>
                        <div className="text-right">Slower<br/>Larger<br/>Less Expensive</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Cache Memory and Locality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">
                  Cache memory bridges the speed gap between the CPU and main memory. It relies on the principle of locality:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><span className="font-medium">Temporal Locality:</span> If data is accessed once, it's likely to be accessed again soon</li>
                  <li><span className="font-medium">Spatial Locality:</span> If one memory location is accessed, nearby locations are likely to be accessed soon</li>
                </ul>
                
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-1">Cache Organization</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><span className="font-medium">Cache Line:</span> The smallest unit of transfer between cache and main memory (typically 64 bytes)</li>
                    <li><span className="font-medium">Cache Hit:</span> When requested data is found in the cache</li>
                    <li><span className="font-medium">Cache Miss:</span> When data must be fetched from a lower level of memory</li>
                    <li><span className="font-medium">Cache Coherence:</span> Ensuring all copies of data in different caches are consistent</li>
                  </ul>
                </div>
                
                <p className="mt-3 text-sm">
                  Modern CPUs typically have three levels of cache (L1, L2, L3), with L1 being the smallest and fastest, and L3 being the largest but slowest.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
