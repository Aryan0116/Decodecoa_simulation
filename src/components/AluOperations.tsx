
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Microchip, Calculator } from "lucide-react";

export function AluOperations() {
  const [tab, setTab] = useState("alu-basic");
  const [operation, setOperation] = useState("add");
  const [inputA, setInputA] = useState("0101");
  const [inputB, setInputB] = useState("0011");
  const [boothInput, setBoothInput] = useState("5");
  const [boothMultiplier, setBoothMultiplier] = useState("3");
  const [divisionDividend, setDivisionDividend] = useState("13");
  const [divisionDivisor, setDivisionDivisor] = useState("3");
  const [divisionAlgorithm, setDivisionAlgorithm] = useState("restoring");

  const calculateAluResult = () => {
    const a = parseInt(inputA, 2);
    const b = parseInt(inputB, 2);
    
    switch(operation) {
      case "add": return (a + b).toString(2).padStart(5, '0');
      case "sub": return (a - b).toString(2).padStart(inputA.length, '0');
      case "and": return (a & b).toString(2).padStart(inputA.length, '0');
      case "or": return (a | b).toString(2).padStart(inputA.length, '0');
      case "xor": return (a ^ b).toString(2).padStart(inputA.length, '0');
      case "not": return (~a & 0b1111).toString(2).padStart(inputA.length, '0');
      default: return "0000";
    }
  };

  // Simulated Booth's Algorithm steps
  const boothsMultiplication = () => {
    const multiplicand = parseInt(boothInput);
    const multiplier = parseInt(boothMultiplier);
    const result = multiplicand * multiplier;
    
    // Generate steps for visualization
    return [
      { step: 1, action: "Initialize", accumulator: "0000", multiplier: multiplier.toString(2).padStart(4, '0'), multiplicand: multiplicand.toString(2).padStart(4, '0') },
      { step: 2, action: "Check bit 0", accumulator: "0000", multiplier: multiplier.toString(2).padStart(4, '0'), multiplicand: multiplicand.toString(2).padStart(4, '0') },
      { step: 3, action: "Add/Subtract", accumulator: "0101", multiplier: multiplier.toString(2).padStart(4, '0'), multiplicand: multiplicand.toString(2).padStart(4, '0') },
      { step: 4, action: "Shift Right", accumulator: "0010", multiplier: multiplier.toString(2).padStart(4, '0').slice(0, -1), multiplicand: multiplicand.toString(2).padStart(4, '0') },
      { step: 5, action: "Final Result", accumulator: result.toString(2).padStart(8, '0'), multiplier: "", multiplicand: "" },
    ];
  };

  // Simulated Division Algorithm steps
  const divisionAlgorithmSteps = () => {
    const dividend = parseInt(divisionDividend);
    const divisor = parseInt(divisionDivisor);
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;
    
    // Generate steps for visualization based on algorithm type
    if (divisionAlgorithm === "restoring") {
      return [
        { step: 1, action: "Initialize", remainder: "0000", quotient: dividend.toString(2).padStart(4, '0'), divisor: divisor.toString(2).padStart(4, '0') },
        { step: 2, action: "Shift Left", remainder: "0000", quotient: dividend.toString(2).padStart(4, '0').slice(1) + "0", divisor: divisor.toString(2).padStart(4, '0') },
        { step: 3, action: "Subtract", remainder: "1101", quotient: dividend.toString(2).padStart(4, '0').slice(1), divisor: divisor.toString(2).padStart(4, '0') },
        { step: 4, action: "Restore", remainder: "0000", quotient: dividend.toString(2).padStart(4, '0').slice(1) + "0", divisor: divisor.toString(2).padStart(4, '0') },
        { step: 5, action: "Final Result", remainder: remainder.toString(2).padStart(4, '0'), quotient: quotient.toString(2).padStart(4, '0'), divisor: "" },
      ];
    } else {
      return [
        { step: 1, action: "Initialize", remainder: "0000", quotient: dividend.toString(2).padStart(4, '0'), divisor: divisor.toString(2).padStart(4, '0') },
        { step: 2, action: "Shift Left", remainder: "0000", quotient: dividend.toString(2).padStart(4, '0').slice(1) + "0", divisor: divisor.toString(2).padStart(4, '0') },
        { step: 3, action: "Subtract", remainder: "1101", quotient: dividend.toString(2).padStart(4, '0').slice(1), divisor: divisor.toString(2).padStart(4, '0') },
        { step: 4, action: "Add if Negative", remainder: "0000", quotient: dividend.toString(2).padStart(4, '0').slice(1) + "0", divisor: divisor.toString(2).padStart(4, '0') },
        { step: 5, action: "Final Result", remainder: remainder.toString(2).padStart(4, '0'), quotient: quotient.toString(2).padStart(4, '0'), divisor: "" },
      ];
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Arithmetic Logic Unit (ALU) Operations</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          The ALU is the component that performs arithmetic and logical operations within a processor.
          Explore different ALU operations and algorithms through these simulations.
        </p>

        <Tabs defaultValue="alu-basic" value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="alu-basic">
              <div className="flex items-center gap-2">
                <Microchip className="h-4 w-4" />
                <span>ALU Operations</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="booth">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Booth's Algorithm</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="division">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Division Algorithms</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alu-basic">
            <Card>
              <CardHeader>
                <CardTitle>ALU Operations Simulator</CardTitle>
                <CardDescription>
                  Perform basic arithmetic and logical operations using the ALU.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Operation</label>
                      <Select value={operation} onValueChange={setOperation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="add">Addition</SelectItem>
                          <SelectItem value="sub">Subtraction</SelectItem>
                          <SelectItem value="and">Logical AND</SelectItem>
                          <SelectItem value="or">Logical OR</SelectItem>
                          <SelectItem value="xor">Logical XOR</SelectItem>
                          <SelectItem value="not">Logical NOT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Input A (Binary)</label>
                      <Input
                        type="text"
                        value={inputA}
                        onChange={(e) => setInputA(e.target.value.replace(/[^01]/g, "").substring(0, 4))}
                        placeholder="0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Input B (Binary)</label>
                      <Input
                        type="text"
                        value={inputB}
                        onChange={(e) => setInputB(e.target.value.replace(/[^01]/g, "").substring(0, 4))}
                        placeholder="0000"
                        disabled={operation === "not"}
                      />
                    </div>
                  </div>

                  <div className="relative w-full h-64 border-2 border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center">
                    <div className="absolute top-0 left-0 bg-tech-teal text-white text-xs px-2 py-1 rounded-tl-md rounded-br-md">
                      ALU Block
                    </div>
                    
                    <div className="flex w-full justify-around mb-8">
                      <div className="flex flex-col items-center">
                        <div className="border border-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-md w-24 text-center mb-2">
                          {inputA || "0000"}
                        </div>
                        <div className="w-0 h-8 border-l border-slate-400"></div>
                        <div className="text-xs">Input A</div>
                      </div>
                      
                      {operation !== "not" && (
                        <div className="flex flex-col items-center">
                          <div className="border border-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-md w-24 text-center mb-2">
                            {inputB || "0000"}
                          </div>
                          <div className="w-0 h-8 border-l border-slate-400"></div>
                          <div className="text-xs">Input B</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-tech-blue text-white p-4 rounded-lg w-64 h-16 flex items-center justify-center mb-8">
                      <span className="font-medium">{operation.toUpperCase()} Operation</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-0 h-8 border-l border-slate-400"></div>
                      <div className="border-2 border-tech-teal bg-slate-100 dark:bg-slate-800 p-2 rounded-md w-32 text-center font-mono">
                        {calculateAluResult()}
                      </div>
                      <div className="text-xs mt-2">Result</div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <p className="font-semibold mb-1">Operation Explanation:</p>
                    {operation === "add" && <p>Addition combines two binary numbers, producing a sum with potential carry.</p>}
                    {operation === "sub" && <p>Subtraction finds the difference between two binary numbers.</p>}
                    {operation === "and" && <p>Logical AND results in 1 only when both corresponding bits are 1.</p>}
                    {operation === "or" && <p>Logical OR results in 1 when at least one corresponding bit is 1.</p>}
                    {operation === "xor" && <p>Logical XOR results in 1 when exactly one of the corresponding bits is 1.</p>}
                    {operation === "not" && <p>Logical NOT inverts each bit (0 becomes 1, 1 becomes 0).</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="booth">
            <Card>
              <CardHeader>
                <CardTitle>Booth's Multiplication Algorithm</CardTitle>
                <CardDescription>
                  A multiplication algorithm that handles both positive and negative numbers in two's complement notation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Multiplicand</label>
                      <Input
                        type="number"
                        value={boothInput}
                        onChange={(e) => setBoothInput(e.target.value)}
                        min="-8"
                        max="7"
                      />
                      <p className="text-xs text-slate-500 mt-1">Range: -8 to 7 (4-bit signed)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Multiplier</label>
                      <Input
                        type="number"
                        value={boothMultiplier}
                        onChange={(e) => setBoothMultiplier(e.target.value)}
                        min="-8"
                        max="7"
                      />
                      <p className="text-xs text-slate-500 mt-1">Range: -8 to 7 (4-bit signed)</p>
                    </div>
                  </div>

                  <div className="border-2 border-slate-300 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Booth's Algorithm Steps</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px] text-sm">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800">
                            <th className="p-2 text-left">Step</th>
                            <th className="p-2 text-left">Action</th>
                            <th className="p-2 text-left">Accumulator</th>
                            <th className="p-2 text-left">Multiplier</th>
                            <th className="p-2 text-left">Multiplicand</th>
                          </tr>
                        </thead>
                        <tbody>
                          {boothsMultiplication().map((step) => (
                            <tr key={step.step} className="border-t border-slate-200 dark:border-slate-700">
                              <td className="p-2">{step.step}</td>
                              <td className="p-2">{step.action}</td>
                              <td className="p-2 font-mono">{step.accumulator}</td>
                              <td className="p-2 font-mono">{step.multiplier}</td>
                              <td className="p-2 font-mono">{step.multiplicand}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="mt-4 text-sm">
                      <strong>Result:</strong> {parseInt(boothInput) * parseInt(boothMultiplier)} 
                      (Binary: {(parseInt(boothInput) * parseInt(boothMultiplier)).toString(2).padStart(8, '0')})
                    </p>
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <p className="font-semibold mb-1">How Booth's Algorithm Works:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Initialize registers: Accumulator = 0, Q = Multiplier, M = Multiplicand</li>
                      <li>Examine the least significant bit of Q and an appended bit Q₋₁ (initially 0)</li>
                      <li>If Q₀Q₋₁ = 10, subtract M from Accumulator</li>
                      <li>If Q₀Q₋₁ = 01, add M to Accumulator</li>
                      <li>If Q₀Q₋₁ = 00 or 11, no operation</li>
                      <li>Arithmetic shift right: Accumulator, Q, and Q₋₁</li>
                      <li>Repeat steps 2-6 for the number of bits in multiplier</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="division">
            <Card>
              <CardHeader>
                <CardTitle>Binary Division Algorithms</CardTitle>
                <CardDescription>
                  Compare restoring and non-restoring division algorithms for binary numbers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Algorithm</label>
                      <Select value={divisionAlgorithm} onValueChange={setDivisionAlgorithm}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="restoring">Restoring Division</SelectItem>
                          <SelectItem value="non-restoring">Non-Restoring Division</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Dividend</label>
                      <Input
                        type="number"
                        value={divisionDividend}
                        onChange={(e) => setDivisionDividend(e.target.value)}
                        min="1"
                        max="15"
                      />
                      <p className="text-xs text-slate-500 mt-1">Range: 1 to 15 (4-bit unsigned)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Divisor</label>
                      <Input
                        type="number"
                        value={divisionDivisor}
                        onChange={(e) => setDivisionDivisor(e.target.value)}
                        min="1"
                        max="15"
                      />
                      <p className="text-xs text-slate-500 mt-1">Range: 1 to 15 (4-bit unsigned)</p>
                    </div>
                  </div>

                  <div className="border-2 border-slate-300 rounded-lg p-4">
                    <h4 className="font-medium mb-3">{divisionAlgorithm === "restoring" ? "Restoring" : "Non-Restoring"} Division Steps</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px] text-sm">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800">
                            <th className="p-2 text-left">Step</th>
                            <th className="p-2 text-left">Action</th>
                            <th className="p-2 text-left">Remainder</th>
                            <th className="p-2 text-left">Quotient</th>
                            <th className="p-2 text-left">Divisor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {divisionAlgorithmSteps().map((step) => (
                            <tr key={step.step} className="border-t border-slate-200 dark:border-slate-700">
                              <td className="p-2">{step.step}</td>
                              <td className="p-2">{step.action}</td>
                              <td className="p-2 font-mono">{step.remainder}</td>
                              <td className="p-2 font-mono">{step.quotient}</td>
                              <td className="p-2 font-mono">{step.divisor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="mt-4 text-sm">
                      <strong>Result:</strong> {parseInt(divisionDividend)} ÷ {parseInt(divisionDivisor)} = {Math.floor(parseInt(divisionDividend) / parseInt(divisionDivisor))} 
                      remainder {parseInt(divisionDividend) % parseInt(divisionDivisor)}
                    </p>
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <p className="font-semibold mb-1">{divisionAlgorithm === "restoring" ? "Restoring" : "Non-Restoring"} Division Algorithm:</p>
                    
                    {divisionAlgorithm === "restoring" ? (
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Initialize: Remainder = 0, Quotient = Dividend</li>
                        <li>Shift Remainder and Quotient left by 1 bit</li>
                        <li>Subtract Divisor from Remainder</li>
                        <li>If Remainder is less than 0, then:
                          <ul className="list-disc list-inside ml-4">
                            <li>Set quotient bit to 0</li>
                            <li>Restore the Remainder by adding the Divisor back</li>
                          </ul>
                        </li>
                        <li>If Remainder is greater than or equal to 0, then set quotient bit to 1</li>
                        <li>Repeat steps 2-5 for each bit of the Quotient</li>
                      </ol>
                    ) : (
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Initialize: Remainder = 0, Quotient = Dividend</li>
                        <li>Shift Remainder and Quotient left by 1 bit</li>
                        <li>If Remainder is greater than or equal to 0, subtract Divisor; otherwise, add Divisor</li>
                        <li>If resulting Remainder is greater than or equal to 0, set quotient bit to 1; otherwise, set to 0</li>
                        <li>Repeat steps 2-4 for each bit of the Quotient</li>
                        <li>If final Remainder is less than 0, add Divisor once more to correct it</li>
                      </ol>
                    )}
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
