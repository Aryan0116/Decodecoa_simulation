
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComputerBlockDiagram } from "./ComputerBlockDiagram";
import { InstructionCycleSimulator } from "./InstructionCycleSimulator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircuitBoard, Cpu, Database, Layers } from "lucide-react";

export function ComputerOrganization() {
  const [activeTab, setActiveTab] = useState("block-diagram");
  
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Computer Organization</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Explore the fundamental components and operations of computer systems through interactive diagrams and simulations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card className="hover:shadow-md transition-all group cursor-pointer" onClick={() => setActiveTab("block-diagram")}>
            <CardContent className="flex flex-col items-center pt-6">
              <CircuitBoard className="h-8 w-8 text-tech-blue mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-center">Computer Architecture</h3>
              <p className="text-xs text-center text-muted-foreground mt-1">Visualize how hardware components connect</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-all group cursor-pointer" onClick={() => setActiveTab("instruction-cycle")}>
            <CardContent className="flex flex-col items-center pt-6">
              <Cpu className="h-8 w-8 text-tech-blue mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-center">Instruction Cycle</h3>
              <p className="text-xs text-center text-muted-foreground mt-1">Step through fetch-decode-execute</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="block-diagram">Computer Architecture</TabsTrigger>
          <TabsTrigger value="instruction-cycle">Instruction Cycle</TabsTrigger>
        </TabsList>
        
        <TabsContent value="block-diagram" className="min-h-[600px] animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Computer Architecture Overview</CardTitle>
              <CardDescription>
                Understanding the structure and organization of modern computers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <ComputerBlockDiagram />
              </div>
              
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Von Neumann Architecture</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Most modern computers are based on the Von Neumann architecture, which consists of:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Central Processing Unit (CPU)</strong>: Contains the ALU, control unit, and registers</li>
                    <li><strong>Memory Unit</strong>: Stores both data and instructions</li>
                    <li><strong>Input/Output System</strong>: Connects the computer to the external world</li>
                    <li><strong>System Bus</strong>: Provides communication paths between components</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Harvard Architecture</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    An alternative to Von Neumann, Harvard architecture uses physically separate storage and signal pathways for instructions and data:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Separate Buses</strong>: Distinct data and instruction buses</li>
                    <li><strong>Parallel Access</strong>: Can access instructions and data simultaneously</li>
                    <li><strong>Common in</strong>: Digital Signal Processors (DSPs), microcontrollers, and specialized systems</li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">CPU Architecture</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p><strong>Control Unit (CU)</strong>: Coordinates and controls all computer operations</p>
                      <p><strong>Arithmetic Logic Unit (ALU)</strong>: Performs arithmetic and logical operations</p>
                      <p><strong>Registers</strong>: Fast storage locations within the CPU</p>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-400 ml-4">
                        <li>Program Counter (PC): Points to the next instruction</li>
                        <li>Instruction Register (IR): Holds the current instruction</li>
                        <li>Memory Address Register (MAR): Holds the memory address</li>
                        <li>Memory Buffer Register (MBR): Holds data to/from memory</li>
                        <li>General Purpose Registers: Used for data manipulation</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Bus Architecture</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p><strong>Address Bus</strong>: Carries memory addresses from CPU to memory</p>
                      <p><strong>Data Bus</strong>: Bidirectional, carries data between CPU and memory</p>
                      <p><strong>Control Bus</strong>: Carries control signals between CPU and other components</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Bus width determines how much data can be transferred in a single operation 
                        (e.g., 32-bit vs 64-bit systems)
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Modern Enhancements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Cache Memory</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Small, fast memory located close to the CPU to store frequently accessed data
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Pipelining</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Breaking instruction execution into stages to increase throughput
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Multiple Cores</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Including multiple processing units on a single chip
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">SIMD Instructions</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Single Instruction, Multiple Data for parallel data processing
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Branch Prediction</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Guessing which branch a program will take before it's known
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">Virtual Memory</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Using disk space to extend physical memory capacity
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button variant="outline" size="sm" className="text-sm">
                  Learn More About Computer Architecture
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instruction-cycle" className="min-h-[600px] animate-fade-in">
          <InstructionCycleSimulator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
