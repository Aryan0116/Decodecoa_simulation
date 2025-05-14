
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProcessorArchitecture() {
  const [activeHazard, setActiveHazard] = useState<string | null>(null);
  
  const handleHazardClick = (hazardType: string) => {
    setActiveHazard(activeHazard === hazardType ? null : hazardType);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Processor Architecture</h2>
        
        <Tabs defaultValue="register-transfers">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="register-transfers">Register Transfers</TabsTrigger>
            <TabsTrigger value="instruction-format">Instruction Formats</TabsTrigger>
            <TabsTrigger value="risc-cisc">RISC vs CISC</TabsTrigger>
            <TabsTrigger value="pipelining">Pipelining & Hazards</TabsTrigger>
          </TabsList>
          
          {/* Register Transfers Section */}
          <TabsContent value="register-transfers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register Transfer and Micro-operations</CardTitle>
                <CardDescription>How data moves between registers in a processor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Register Transfer Notation</h3>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <p className="mb-3">Register Transfer Notation (RTN) is a symbolic notation used to describe the movement of data between registers and the operations performed on that data.</p>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">Basic Transfer:</p>
                          <p className="font-mono bg-white dark:bg-slate-900 p-2 rounded">R2 ← R1</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Contents of register R1 are transferred to register R2</p>
                        </div>
                        
                        <div>
                          <p className="font-medium">Conditional Transfer:</p>
                          <p className="font-mono bg-white dark:bg-slate-900 p-2 rounded">if (P = 1) then (R2 ← R1)</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Contents of R1 are transferred to R2 only if condition P is true</p>
                        </div>
                        
                        <div>
                          <p className="font-medium">Arithmetic Operation:</p>
                          <p className="font-mono bg-white dark:bg-slate-900 p-2 rounded">R3 ← R1 + R2</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Contents of R1 and R2 are added and the result is stored in R3</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Types of Micro-operations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">Arithmetic Micro-operations</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Operation</TableHead>
                                <TableHead>Example</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>+</TableCell>
                                <TableCell>Addition</TableCell>
                                <TableCell><code>R3 ← R1 + R2</code></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>-</TableCell>
                                <TableCell>Subtraction</TableCell>
                                <TableCell><code>R3 ← R1 - R2</code></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>×</TableCell>
                                <TableCell>Multiplication</TableCell>
                                <TableCell><code>R3 ← R1 × R2</code></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>÷</TableCell>
                                <TableCell>Division</TableCell>
                                <TableCell><code>R3 ← R1 ÷ R2</code></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">Logical Micro-operations</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Operation</TableHead>
                                <TableHead>Example</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>AND</TableCell>
                                <TableCell>Logical AND</TableCell>
                                <TableCell><code>R3 ← R1 ∧ R2</code></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>OR</TableCell>
                                <TableCell>Logical OR</TableCell>
                                <TableCell><code>R3 ← R1 ∨ R2</code></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>NOT</TableCell>
                                <TableCell>Complement</TableCell>
                                <TableCell><code>R3 ← R1'</code></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>XOR</TableCell>
                                <TableCell>Exclusive OR</TableCell>
                                <TableCell><code>R3 ← R1 ⊕ R2</code></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Instruction Format Section */}
          <TabsContent value="instruction-format" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Instruction Format & Addressing Modes</CardTitle>
                <CardDescription>How instructions are structured and how memory is accessed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Common Instruction Formats</h3>
                    
                    <div className="space-y-4">
                      {/* RISC Instruction Format */}
                      <div>
                        <p className="font-medium">RISC Instruction Format (32-bit)</p>
                        <div className="grid grid-cols-12 gap-1 mt-2">
                          <div className="col-span-2 bg-blue-100 dark:bg-blue-900 p-2 text-center rounded font-medium text-sm">
                            Op<br />(6 bits)
                          </div>
                          <div className="col-span-2 bg-green-100 dark:bg-green-900 p-2 text-center rounded font-medium text-sm">
                            Rs<br />(5 bits)
                          </div>
                          <div className="col-span-2 bg-amber-100 dark:bg-amber-900 p-2 text-center rounded font-medium text-sm">
                            Rt<br />(5 bits)
                          </div>
                          <div className="col-span-2 bg-purple-100 dark:bg-purple-900 p-2 text-center rounded font-medium text-sm">
                            Rd<br />(5 bits)
                          </div>
                          <div className="col-span-2 bg-red-100 dark:bg-red-900 p-2 text-center rounded font-medium text-sm">
                            Shamt<br />(5 bits)
                          </div>
                          <div className="col-span-2 bg-teal-100 dark:bg-teal-900 p-2 text-center rounded font-medium text-sm">
                            Funct<br />(6 bits)
                          </div>
                        </div>
                        <div className="text-sm mt-2">
                          <p><strong>Op</strong>: Operation code</p>
                          <p><strong>Rs</strong>: First source register</p>
                          <p><strong>Rt</strong>: Second source register</p>
                          <p><strong>Rd</strong>: Destination register</p>
                          <p><strong>Shamt</strong>: Shift amount</p>
                          <p><strong>Funct</strong>: Function code</p>
                        </div>
                      </div>
                      
                      {/* Immediate Instruction Format */}
                      <div className="mt-4">
                        <p className="font-medium">Immediate Instruction Format (32-bit)</p>
                        <div className="grid grid-cols-12 gap-1 mt-2">
                          <div className="col-span-2 bg-blue-100 dark:bg-blue-900 p-2 text-center rounded font-medium text-sm">
                            Op<br />(6 bits)
                          </div>
                          <div className="col-span-2 bg-green-100 dark:bg-green-900 p-2 text-center rounded font-medium text-sm">
                            Rs<br />(5 bits)
                          </div>
                          <div className="col-span-2 bg-amber-100 dark:bg-amber-900 p-2 text-center rounded font-medium text-sm">
                            Rt<br />(5 bits)
                          </div>
                          <div className="col-span-6 bg-purple-100 dark:bg-purple-900 p-2 text-center rounded font-medium text-sm">
                            Immediate<br />(16 bits)
                          </div>
                        </div>
                      </div>
                      
                      {/* Jump Instruction Format */}
                      <div className="mt-4">
                        <p className="font-medium">Jump Instruction Format (32-bit)</p>
                        <div className="grid grid-cols-12 gap-1 mt-2">
                          <div className="col-span-2 bg-blue-100 dark:bg-blue-900 p-2 text-center rounded font-medium text-sm">
                            Op<br />(6 bits)
                          </div>
                          <div className="col-span-10 bg-green-100 dark:bg-green-900 p-2 text-center rounded font-medium text-sm">
                            Address<br />(26 bits)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-3">Addressing Modes</h3>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Addressing Mode</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Example</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Immediate</TableCell>
                          <TableCell>Operand is part of the instruction</TableCell>
                          <TableCell><code>ADD R1, R2, #100</code></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Direct</TableCell>
                          <TableCell>Instruction contains the address of operand</TableCell>
                          <TableCell><code>LOAD R1, [200]</code></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Register</TableCell>
                          <TableCell>Operand is in a register</TableCell>
                          <TableCell><code>ADD R1, R2, R3</code></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Register Indirect</TableCell>
                          <TableCell>Register contains address of operand</TableCell>
                          <TableCell><code>LOAD R1, [R2]</code></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Indexed</TableCell>
                          <TableCell>Address is sum of a base and an index</TableCell>
                          <TableCell><code>LOAD R1, [R2 + R3]</code></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* RISC vs CISC Section */}
          <TabsContent value="risc-cisc" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RISC vs CISC Architecture</CardTitle>
                <CardDescription>Comparing two fundamental approaches to processor design</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* RISC Column */}
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="bg-tech-teal p-2 rounded-lg">
                            <h3 className="text-white font-bold">RISC</h3>
                          </div>
                          <span className="text-sm">Reduced Instruction Set Computing</span>
                        </div>
                        
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Simple</Badge>
                            <span>Simple instructions that complete in one cycle</span>
                          </li>
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Fixed</Badge>
                            <span>Fixed instruction length (typically 32 bits)</span>
                          </li>
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Load/Store</Badge>
                            <span>Only load/store instructions access memory</span>
                          </li>
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Registers</Badge>
                            <span>Large number of general-purpose registers</span>
                          </li>
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Pipeline</Badge>
                            <span>Optimized for pipelining</span>
                          </li>
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Hardware</Badge>
                            <span>Simplified hardware design</span>
                          </li>
                        </ul>
                        
                        <div className="mt-4">
                          <p className="font-medium">Examples:</p>
                          <p>ARM, MIPS, RISC-V, PowerPC</p>
                        </div>
                      </div>
                      
                      {/* CISC Column */}
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="bg-tech-blue p-2 rounded-lg">
                            <h3 className="text-white font-bold">CISC</h3>
                          </div>
                          <span className="text-sm">Complex Instruction Set Computing</span>
                        </div>
                        
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Complex</Badge>
                            <span>Complex instructions that may take multiple cycles</span>
                          </li>
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Variable</Badge>
                            <span>Variable instruction length</span>
                          </li>
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Memory</Badge>
                            <span>Instructions can operate directly on memory</span>
                          </li>
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Registers</Badge>
                            <span>Fewer specialized registers</span>
                          </li>
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Microcode</Badge>
                            <span>Often uses microcode for complex instructions</span>
                          </li>
                          <li className="flex items-start">
                            <Badge variant="outline" className="mt-1 mr-2">Hardware</Badge>
                            <span>More complex hardware design</span>
                          </li>
                        </ul>
                        
                        <div className="mt-4">
                          <p className="font-medium">Examples:</p>
                          <p>x86, x86-64, VAX, System/360</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-3">Convergence in Modern Processors</h3>
                    <p className="mb-3">
                      Modern processors often incorporate elements from both RISC and CISC philosophies:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-medium">Intel/AMD x86-64</p>
                        <p className="text-sm">CISC instruction set translated to RISC-like micro-operations internally</p>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-medium">ARM with NEON Extensions</p>
                        <p className="text-sm">RISC architecture with complex SIMD instructions</p>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-medium">Apple M1/M2 Chips</p>
                        <p className="text-sm">ARM-based (RISC) with specialized accelerators for complex operations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pipelining and Hazards Section */}
          <TabsContent value="pipelining" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipelining & Pipeline Hazards</CardTitle>
                <CardDescription>Understanding pipeline execution and associated challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Pipeline Execution</h3>
                    <p className="mb-3">
                      Pipelining is a technique where multiple instructions are overlapped in execution, similar to an assembly line. This increases instruction throughput but introduces potential hazards.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time →</TableHead>
                            <TableHead>T1</TableHead>
                            <TableHead>T2</TableHead>
                            <TableHead>T3</TableHead>
                            <TableHead>T4</TableHead>
                            <TableHead>T5</TableHead>
                            <TableHead>T6</TableHead>
                            <TableHead>T7</TableHead>
                            <TableHead>T8</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Instr 1</TableCell>
                            <TableCell className="bg-tech-blue bg-opacity-20">IF</TableCell>
                            <TableCell className="bg-tech-teal bg-opacity-20">ID</TableCell>
                            <TableCell className="bg-amber-500 bg-opacity-20">EX</TableCell>
                            <TableCell className="bg-purple-500 bg-opacity-20">MEM</TableCell>
                            <TableCell className="bg-red-500 bg-opacity-20">WB</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Instr 2</TableCell>
                            <TableCell></TableCell>
                            <TableCell className="bg-tech-blue bg-opacity-20">IF</TableCell>
                            <TableCell className="bg-tech-teal bg-opacity-20">ID</TableCell>
                            <TableCell className="bg-amber-500 bg-opacity-20">EX</TableCell>
                            <TableCell className="bg-purple-500 bg-opacity-20">MEM</TableCell>
                            <TableCell className="bg-red-500 bg-opacity-20">WB</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Instr 3</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className="bg-tech-blue bg-opacity-20">IF</TableCell>
                            <TableCell className="bg-tech-teal bg-opacity-20">ID</TableCell>
                            <TableCell className="bg-amber-500 bg-opacity-20">EX</TableCell>
                            <TableCell className="bg-purple-500 bg-opacity-20">MEM</TableCell>
                            <TableCell className="bg-red-500 bg-opacity-20">WB</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Instr 4</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className="bg-tech-blue bg-opacity-20">IF</TableCell>
                            <TableCell className="bg-tech-teal bg-opacity-20">ID</TableCell>
                            <TableCell className="bg-amber-500 bg-opacity-20">EX</TableCell>
                            <TableCell className="bg-purple-500 bg-opacity-20">MEM</TableCell>
                            <TableCell className="bg-red-500 bg-opacity-20">WB</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <div className="mt-2 text-sm flex flex-wrap gap-3">
                        <span className="flex items-center"><span className="inline-block w-3 h-3 bg-tech-blue bg-opacity-20 mr-1"></span> IF: Instruction Fetch</span>
                        <span className="flex items-center"><span className="inline-block w-3 h-3 bg-tech-teal bg-opacity-20 mr-1"></span> ID: Instruction Decode</span>
                        <span className="flex items-center"><span className="inline-block w-3 h-3 bg-amber-500 bg-opacity-20 mr-1"></span> EX: Execute</span>
                        <span className="flex items-center"><span className="inline-block w-3 h-3 bg-purple-500 bg-opacity-20 mr-1"></span> MEM: Memory Access</span>
                        <span className="flex items-center"><span className="inline-block w-3 h-3 bg-red-500 bg-opacity-20 mr-1"></span> WB: Write Back</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-3">Pipeline Hazards</h3>
                    <p className="mb-4">
                      Hazards are situations that prevent the next instruction in the pipeline from executing during its designated clock cycle.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Structural Hazard */}
                      <div 
                        className={`bg-white dark:bg-slate-900 p-4 rounded-lg border-l-4 ${activeHazard === 'structural' ? 'border-tech-blue' : 'border-slate-300 dark:border-slate-700'} cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() => handleHazardClick('structural')}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-lg">Structural Hazards</h4>
                          <Switch checked={activeHazard === 'structural'} />
                        </div>
                        
                        {activeHazard === 'structural' && (
                          <div className="mt-4">
                            <p className="mb-3">
                              Occurs when two or more instructions require the same hardware resource simultaneously.
                            </p>
                            
                            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                              <h5 className="font-medium mb-2">Example:</h5>
                              <p>Single memory for both instructions and data:</p>
                              <ul className="list-disc list-inside text-sm pl-2 space-y-1">
                                <li>Instruction 1 needs to fetch data from memory</li>
                                <li>Instruction 2 needs to fetch its next instruction from memory</li>
                              </ul>
                              
                              <div className="mt-3">
                                <p className="font-medium mb-1">Solutions:</p>
                                <ul className="list-disc list-inside text-sm pl-2 space-y-1">
                                  <li>Separate instruction and data caches (Harvard architecture)</li>
                                  <li>Resource duplication</li>
                                  <li>Pipeline stalling (insert bubbles)</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Data Hazard */}
                      <div 
                        className={`bg-white dark:bg-slate-900 p-4 rounded-lg border-l-4 ${activeHazard === 'data' ? 'border-tech-blue' : 'border-slate-300 dark:border-slate-700'} cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() => handleHazardClick('data')}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-lg">Data Hazards</h4>
                          <Switch checked={activeHazard === 'data'} />
                        </div>
                        
                        {activeHazard === 'data' && (
                          <div className="mt-4">
                            <p className="mb-3">
                              Occurs when an instruction depends on the result of a previous instruction that hasn't completed execution yet.
                            </p>
                            
                            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                              <h5 className="font-medium mb-1">Types:</h5>
                              <ul className="list-disc list-inside text-sm pl-2 space-y-1 mb-3">
                                <li><strong>Read After Write (RAW)</strong>: Instruction tries to read data before a previous instruction writes it</li>
                                <li><strong>Write After Read (WAR)</strong>: Instruction tries to write data before a previous instruction reads it</li>
                                <li><strong>Write After Write (WAW)</strong>: Two instructions try to write to the same location</li>
                              </ul>
                              
                              <div className="font-mono text-xs bg-white dark:bg-slate-900 p-2 rounded mb-3">
                                <p>ADD R1, R2, R3    # R1 = R2 + R3</p>
                                <p>SUB R4, R1, R5    # R4 = R1 - R5 (RAW hazard)</p>
                              </div>
                              
                              <div>
                                <p className="font-medium mb-1">Solutions:</p>
                                <ul className="list-disc list-inside text-sm pl-2 space-y-1">
                                  <li>Forwarding/Bypassing</li>
                                  <li>Pipeline stalling</li>
                                  <li>Operand forwarding</li>
                                  <li>Compiler scheduling</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Control Hazard */}
                      <div 
                        className={`bg-white dark:bg-slate-900 p-4 rounded-lg border-l-4 ${activeHazard === 'control' ? 'border-tech-blue' : 'border-slate-300 dark:border-slate-700'} cursor-pointer hover:shadow-md transition-shadow`}
                        onClick={() => handleHazardClick('control')}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-lg">Control Hazards</h4>
                          <Switch checked={activeHazard === 'control'} />
                        </div>
                        
                        {activeHazard === 'control' && (
                          <div className="mt-4">
                            <p className="mb-3">
                              Occurs when the pipeline makes wrong decisions on branch prediction, causing instructions to be incorrectly fetched.
                            </p>
                            
                            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                              <h5 className="font-medium mb-1">Example:</h5>
                              <div className="font-mono text-xs bg-white dark:bg-slate-900 p-2 rounded mb-3">
                                <p>CMP R1, R2      # Compare R1 and R2</p>
                                <p>BEQ label      # Branch if equal</p>
                                <p>ADD R3, R4, R5  # This might not execute if branch taken</p>
                                <p>SUB R6, R7, R8  # This might not execute if branch taken</p>
                                <p>label: ...</p>
                              </div>
                              
                              <div>
                                <p className="font-medium mb-1">Solutions:</p>
                                <ul className="list-disc list-inside text-sm pl-2 space-y-1">
                                  <li>Branch prediction</li>
                                  <li>Delayed branch</li>
                                  <li>Branch target buffer</li>
                                  <li>Speculative execution</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
