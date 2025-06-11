import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type LogicGateType = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | "XNOR" | "BUFFER";

interface LogicGateProps {
  type: LogicGateType;
  inputs: boolean[];
  onInputChange: (index: number) => void;
}

// Real logic gate SVG components based on IEEE standards
const AndGateSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="currentColor">
    <path d="M10 10 L40 10 A25 25 0 0 1 40 50 L10 50 Z" stroke="black" strokeWidth="2" fill="white"/>
    <line x1="0" y1="20" x2="10" y2="20" stroke="black" strokeWidth="2"/>
    <line x1="0" y1="40" x2="10" y2="40" stroke="black" strokeWidth="2"/>
    <line x1="65" y1="30" x2="85" y2="30" stroke="black" strokeWidth="2"/>
    <circle cx="67" cy="30" r="2" fill="black"/>
  </svg>
);

const OrGateSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="currentColor">
    <path d="M10 10 Q40 30 10 50 Q30 30 65 30 Q30 30 10 10 Z" stroke="black" strokeWidth="2" fill="white"/>
    <line x1="0" y1="20" x2="15" y2="20" stroke="black" strokeWidth="2"/>
    <line x1="0" y1="40" x2="15" y2="40" stroke="black" strokeWidth="2"/>
    <line x1="65" y1="30" x2="85" y2="30" stroke="black" strokeWidth="2"/>
    <circle cx="67" cy="30" r="2" fill="black"/>
  </svg>
);

const NotGateSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="currentColor">
    <path d="M10 10 L10 50 L55 30 Z" stroke="black" strokeWidth="2" fill="white"/>
    <circle cx="60" cy="30" r="5" stroke="black" strokeWidth="2" fill="white"/>
    <line x1="0" y1="30" x2="10" y2="30" stroke="black" strokeWidth="2"/>
    <line x1="65" y1="30" x2="85" y2="30" stroke="black" strokeWidth="2"/>
    <circle cx="67" cy="30" r="2" fill="black"/>
  </svg>
);

const XorGateSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="currentColor">
    <path d="M10 10 Q40 30 10 50 Q30 30 65 30 Q30 30 10 10 Z" stroke="black" strokeWidth="2" fill="white"/>
    <path d="M5 10 Q35 30 5 50" stroke="black" strokeWidth="2" fill="none"/>
    <line x1="0" y1="20" x2="10" y2="20" stroke="black" strokeWidth="2"/>
    <line x1="0" y1="40" x2="10" y2="40" stroke="black" strokeWidth="2"/>
    <line x1="65" y1="30" x2="85" y2="30" stroke="black" strokeWidth="2"/>
    <circle cx="67" cy="30" r="2" fill="black"/>
  </svg>
);

const NandGateSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="currentColor">
    <path d="M10 10 L40 10 A25 25 0 0 1 40 50 L10 50 Z" stroke="black" strokeWidth="2" fill="white"/>
    <circle cx="70" cy="30" r="5" stroke="black" strokeWidth="2" fill="white"/>
    <line x1="0" y1="20" x2="10" y2="20" stroke="black" strokeWidth="2"/>
    <line x1="0" y1="40" x2="10" y2="40" stroke="black" strokeWidth="2"/>
    <line x1="75" y1="30" x2="85" y2="30" stroke="black" strokeWidth="2"/>
    <circle cx="77" cy="30" r="2" fill="black"/>
  </svg>
);

const NorGateSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="currentColor">
    <path d="M10 10 Q40 30 10 50 Q30 30 65 30 Q30 30 10 10 Z" stroke="black" strokeWidth="2" fill="white"/>
    <circle cx="70" cy="30" r="5" stroke="black" strokeWidth="2" fill="white"/>
    <line x1="0" y1="20" x2="15" y2="20" stroke="black" strokeWidth="2"/>
    <line x1="0" y1="40" x2="15" y2="40" stroke="black" strokeWidth="2"/>
    <line x1="75" y1="30" x2="85" y2="30" stroke="black" strokeWidth="2"/>
    <circle cx="77" cy="30" r="2" fill="black"/>
  </svg>
);

const XnorGateSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="currentColor">
    <path d="M10 10 Q40 30 10 50 Q30 30 65 30 Q30 30 10 10 Z" stroke="black" strokeWidth="2" fill="white"/>
    <path d="M5 10 Q35 30 5 50" stroke="black" strokeWidth="2" fill="none"/>
    <circle cx="70" cy="30" r="5" stroke="black" strokeWidth="2" fill="white"/>
    <line x1="0" y1="20" x2="10" y2="20" stroke="black" strokeWidth="2"/>
    <line x1="0" y1="40" x2="10" y2="40" stroke="black" strokeWidth="2"/>
    <line x1="75" y1="30" x2="85" y2="30" stroke="black" strokeWidth="2"/>
    <circle cx="77" cy="30" r="2" fill="black"/>
  </svg>
);

const BufferGateSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 60" fill="currentColor">
    <path d="M10 10 L10 50 L65 30 Z" stroke="black" strokeWidth="2" fill="white"/>
    <line x1="0" y1="30" x2="10" y2="30" stroke="black" strokeWidth="2"/>
    <line x1="65" y1="30" x2="85" y2="30" stroke="black" strokeWidth="2"/>
    <circle cx="67" cy="30" r="2" fill="black"/>
  </svg>
);

const LogicGate: React.FC<LogicGateProps> = ({ type, inputs, onInputChange }) => {
  const [outputHistory, setOutputHistory] = useState<boolean[]>([]);

  // Enhanced logic calculations with proper handling
  const calculateOutput = (): boolean => {
    switch (type) {
      case "AND":
        return inputs.length > 0 && inputs.every(input => input === true);
      case "OR":
        return inputs.some(input => input === true);
      case "NOT":
        return inputs.length > 0 ? !inputs[0] : false;
      case "XOR":
        return inputs.filter(input => input === true).length === 1;
      case "NAND":
        return inputs.length > 0 ? !inputs.every(input => input === true) : true;
      case "NOR":
        return !inputs.some(input => input === true);
      case "XNOR":
        return inputs.filter(input => input === true).length % 2 === 0;
      case "BUFFER":
        return inputs.length > 0 ? inputs[0] : false;
      default:
        return false;
    }
  };

  const output = calculateOutput();

  // Track output changes for animation
  useEffect(() => {
    setOutputHistory(prev => [...prev.slice(-4), output]);
  }, [output]);

  const getGateIcon = () => {
    const className = "h-16 w-16";
    switch (type) {
      case "AND":
        return <AndGateSVG className={className} />;
      case "OR":
        return <OrGateSVG className={className} />;
      case "NOT":
        return <NotGateSVG className={className} />;
      case "XOR":
        return <XorGateSVG className={className} />;
      case "NAND":
        return <NandGateSVG className={className} />;
      case "NOR":
        return <NorGateSVG className={className} />;
      case "XNOR":
        return <XnorGateSVG className={className} />;
      case "BUFFER":
        return <BufferGateSVG className={className} />;
      default:
        return null;
    }
  };

  const getTruthTable = () => {
    if (type === "NOT" || type === "BUFFER") {
      return [
        { inputs: [false], output: calculateOutputForInputs([false]) },
        { inputs: [true], output: calculateOutputForInputs([true]) }
      ];
    } else {
      const combinations = [];
      const numInputs = Math.min(inputs.length, 3);
      for (let i = 0; i < Math.pow(2, numInputs); i++) {
        const inputCombination = [];
        for (let j = 0; j < numInputs; j++) {
          inputCombination.push((i >> j) & 1 ? true : false);
        }
        combinations.push({
          inputs: inputCombination,
          output: calculateOutputForInputs(inputCombination)
        });
      }
      return combinations;
    }
  };

  const calculateOutputForInputs = (testInputs: boolean[]): boolean => {
    switch (type) {
      case "AND":
        return testInputs.every(input => input === true);
      case "OR":
        return testInputs.some(input => input === true);
      case "NOT":
        return !testInputs[0];
      case "XOR":
        return testInputs.filter(input => input === true).length === 1;
      case "NAND":
        return !testInputs.every(input => input === true);
      case "NOR":
        return !testInputs.some(input => input === true);
      case "XNOR":
        return testInputs.filter(input => input === true).length % 2 === 0;
      case "BUFFER":
        return testInputs[0];
      default:
        return false;
    }
  };

  const getDescription = () => {
    switch (type) {
      case "AND":
        return "Outputs HIGH (1) only when ALL inputs are HIGH (1)";
      case "OR":
        return "Outputs HIGH (1) when ANY input is HIGH (1)";
      case "NOT":
        return "Inverts the input signal - HIGH becomes LOW, LOW becomes HIGH";
      case "XOR":
        return "Outputs HIGH (1) when exactly ONE input is HIGH (1)";
      case "NAND":
        return "NOT-AND: Outputs LOW (0) only when ALL inputs are HIGH (1)";
      case "NOR":
        return "NOT-OR: Outputs HIGH (1) only when ALL inputs are LOW (0)";
      case "XNOR":
        return "NOT-XOR: Outputs HIGH (1) when inputs are the same";
      case "BUFFER":
        return "Passes the input signal through unchanged (signal amplification)";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Gate Visualization */}
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
          {type} Gate
        </div>
        
        <div className="relative flex items-center justify-center gap-8 mb-6 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border-2 border-slate-200 dark:border-slate-600">
          {/* Input Section */}
          <div className="flex flex-col gap-6">
            {inputs.map((input, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">
                  {String.fromCharCode(65 + index)}
                </span>
                <Toggle
                  pressed={input}
                  onPressedChange={() => onInputChange(index)}
                  className={cn(
                    "w-14 h-14 rounded-full font-bold text-lg transition-all duration-300 shadow-lg",
                    input 
                      ? "bg-green-500 text-white shadow-green-200 hover:bg-green-600 scale-105" 
                      : "bg-red-500 text-white shadow-red-200 hover:bg-red-600"
                  )}
                >
                  {input ? "1" : "0"}
                </Toggle>
                
                {/* Animated Wire */}
                <div className={cn(
                  "h-2 w-20 rounded-full relative overflow-hidden transition-colors duration-300",
                  input ? "bg-green-400" : "bg-red-400"
                )}>
                  {input && (
                    <div className="absolute h-full w-6 bg-white opacity-80 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Gate Symbol */}
          <div className={cn(
            "flex items-center justify-center p-4 rounded-lg transition-all duration-300",
            output ? "bg-green-100 dark:bg-green-900 shadow-lg scale-105" : "bg-slate-100 dark:bg-slate-800"
          )}>
            {getGateIcon()}
          </div>

          {/* Output Section */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-2 w-20 rounded-full relative overflow-hidden transition-colors duration-300",
              output ? "bg-green-400" : "bg-red-400"
            )}>
              {output && (
                <div className="absolute h-full w-6 bg-white opacity-80 rounded-full animate-pulse"></div>
              )}
            </div>
            
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-lg",
              output 
                ? "bg-green-500 text-white shadow-green-200 scale-105" 
                : "bg-red-500 text-white shadow-red-200"
            )}>
              {output ? "1" : "0"}
            </div>
            <span className="text-sm font-medium w-8">Y</span>
          </div>
        </div>

        {/* Description */}
        <div className="text-center max-w-lg">
          <p className="text-slate-700 dark:text-slate-300 font-medium">
            {getDescription()}
          </p>
        </div>
      </div>

      {/* Truth Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200">Truth Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                {inputs.map((_, index) => (
                  <th key={index} className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </th>
                ))}
                <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium">Y</th>
              </tr>
            </thead>
            <tbody>
              {getTruthTable().map((row, index) => (
                <tr key={index} className={cn(
                  "transition-colors duration-200",
                  row.inputs.every((input, i) => input === inputs[i]) && row.output === output
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                )}>
                  {row.inputs.map((input, inputIndex) => (
                    <td key={inputIndex} className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-center">
                      <span className={cn(
                        "font-mono font-bold",
                        input ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {input ? "1" : "0"}
                      </span>
                    </td>
                  ))}
                  <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-center">
                    <span className={cn(
                      "font-mono font-bold",
                      row.output ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {row.output ? "1" : "0"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export function LogicGateSimulator() {
  const [gateType, setGateType] = useState<LogicGateType>("AND");
  const [inputs, setInputs] = useState<boolean[]>([false, false]);

  const handleGateTypeChange = (value: string) => {
    const newType = value as LogicGateType;
    setGateType(newType);
    
    // Adjust inputs based on gate type
    if (newType === "NOT" || newType === "BUFFER") {
      setInputs([false]);
    } else if (inputs.length === 1) {
      setInputs([false, false]);
    }
  };

  const handleInputChange = (index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = !newInputs[index];
    setInputs(newInputs);
  };

  const addInput = () => {
    if (gateType !== "NOT" && gateType !== "BUFFER" && inputs.length < 4) {
      setInputs([...inputs, false]);
    }
  };

  const removeInput = () => {
    if (inputs.length > 2) {
      setInputs(inputs.slice(0, -1));
    }
  };

  const resetInputs = () => {
    if (gateType === "NOT" || gateType === "BUFFER") {
      setInputs([false]);
    } else {
      setInputs([false, false]);
    }
  };

  const randomizeInputs = () => {
    const newInputs = inputs.map(() => Math.random() > 0.5);
    setInputs(newInputs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Logic Gate Simulator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Interactive digital logic gate simulator with real IEEE standard symbols
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="min-w-0 flex-1">
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Select Gate Type
              </label>
              <Select value={gateType} onValueChange={handleGateTypeChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Choose gate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND Gate</SelectItem>
                  <SelectItem value="OR">OR Gate</SelectItem>
                  <SelectItem value="NOT">NOT Gate</SelectItem>
                  <SelectItem value="XOR">XOR Gate</SelectItem>
                  <SelectItem value="NAND">NAND Gate</SelectItem>
                  <SelectItem value="NOR">NOR Gate</SelectItem>
                  <SelectItem value="XNOR">XNOR Gate</SelectItem>
                  <SelectItem value="BUFFER">Buffer Gate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {gateType !== "NOT" && gateType !== "BUFFER" && (
              <div className="flex gap-2">
                <Button 
                  onClick={addInput} 
                  disabled={inputs.length >= 4}
                  variant="outline"
                  size="sm"
                >
                  Add Input
                </Button>
                <Button 
                  onClick={removeInput} 
                  disabled={inputs.length <= 2}
                  variant="outline"
                  size="sm"
                >
                  Remove Input
                </Button>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={resetInputs} variant="outline" size="sm">
                Reset
              </Button>
              <Button onClick={randomizeInputs} variant="outline" size="sm">
                Random
              </Button>
            </div>
          </div>
        </div>

        {/* Main Simulator */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
          <LogicGate 
            type={gateType} 
            inputs={inputs} 
            onInputChange={handleInputChange} 
          />
        </div>

        {/* Information Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
            About Logic Gates
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Logic gates are the fundamental building blocks of digital circuits and computer processors. 
            They perform basic logical operations on binary inputs (0 or 1) to produce binary outputs. 
            These gates are implemented using transistors in real electronic circuits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded border">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Universal Gates</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">NAND and NOR gates can implement any logic function</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded border">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Digital Systems</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Used in computers, smartphones, and all digital devices</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded border">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Boolean Algebra</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Mathematical foundation for digital logic design</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}