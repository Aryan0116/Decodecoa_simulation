
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { LogicGateAnd, LogicGateOr, LogicGateNot, LogicGateXor } from "@/components/icons/LogicGateIcons";

type LogicGateType = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | "XNOR";

interface LogicGateProps {
  type: LogicGateType;
  inputs: boolean[];
  onInputChange: (index: number) => void;
}

const LogicGate: React.FC<LogicGateProps> = ({ type, inputs, onInputChange }) => {
  // Calculate the output based on the gate type and inputs
  const calculateOutput = (): boolean => {
    switch (type) {
      case "AND":
        return inputs.every(input => input === true);
      case "OR":
        return inputs.some(input => input === true);
      case "NOT":
        return !inputs[0];
      case "XOR":
        return inputs.filter(input => input === true).length % 2 === 1;
      case "NAND":
        return !inputs.every(input => input === true);
      case "NOR":
        return !inputs.some(input => input === true);
      case "XNOR":
        return inputs.filter(input => input === true).length % 2 === 0;
      default:
        return false;
    }
  };

  const output = calculateOutput();
  
  // Different gate requires different number of inputs
  const isSingleInputGate = type === "NOT";

  // Select the appropriate icon based on gate type
  const getGateIcon = () => {
    switch (type) {
      case "AND":
      case "NAND":
        return <LogicGateAnd className="h-10 w-10" />;
      case "OR":
      case "NOR":
        return <LogicGateOr className="h-10 w-10" />;
      case "NOT":
        return <LogicGateNot className="h-10 w-10" />;
      case "XOR":
      case "XNOR":
        return <LogicGateXor className="h-10 w-10" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="text-xl font-semibold mb-4">{type} Gate</div>
      <div className="relative flex items-center justify-center gap-16 mb-6">
        {/* Input wires */}
        <div className="flex flex-col gap-8">
          {inputs.map((input, index) => (
            <div key={index} className="flex items-center">
              <Toggle
                pressed={input}
                onPressedChange={() => onInputChange(index)}
                className={cn(
                  "w-12 h-12 rounded-full transition-colors duration-200",
                  input ? "bg-tech-blue text-white" : "bg-slate-200 text-slate-700"
                )}
              >
                {input ? "1" : "0"}
              </Toggle>
              <div className={cn(
                "h-1 w-16 relative overflow-hidden",
                input ? "bg-tech-blue" : "bg-slate-300"
              )}>
                {input && (
                  <div className="absolute h-full w-3 bg-white opacity-70 animate-signal-flow"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Gate with pulsing animation when active */}
        <div className={cn(
          "w-20 h-20 flex items-center justify-center rounded-md border-2 border-slate-300",
          output && "animate-pulse-node"
        )}>
          {getGateIcon()}
        </div>

        {/* Output wire */}
        <div className="flex items-center">
          <div className={cn(
            "h-1 w-16 relative overflow-hidden",
            output ? "bg-tech-blue" : "bg-slate-300"
          )}>
            {output && (
              <div className="absolute h-full w-3 bg-white opacity-70 animate-signal-flow"></div>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center font-bold",
            output ? "bg-tech-blue text-white" : "bg-slate-200 text-slate-700"
          )}>
            {output ? "1" : "0"}
          </div>
        </div>
      </div>

      <div className="text-sm text-center max-w-md">
        {type === "AND" && "The AND gate outputs 1 only if all inputs are 1."}
        {type === "OR" && "The OR gate outputs 1 if any input is 1."}
        {type === "NOT" && "The NOT gate inverts the input."}
        {type === "XOR" && "The XOR gate outputs 1 if exactly one input is 1."}
        {type === "NAND" && "The NAND gate is the inverse of an AND gate."}
        {type === "NOR" && "The NOR gate is the inverse of an OR gate."}
        {type === "XNOR" && "The XNOR gate outputs 1 when both inputs are the same."}
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
    
    // Adjust number of inputs based on gate type
    if (newType === "NOT") {
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
    if (gateType !== "NOT" && inputs.length < 3) {
      setInputs([...inputs, false]);
    }
  };

  const removeInput = () => {
    if (inputs.length > 2) {
      setInputs(inputs.slice(0, -1));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Logic Gate Simulator</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium mb-1">Gate Type</label>
            <Select value={gateType} onValueChange={handleGateTypeChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Select gate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND</SelectItem>
                <SelectItem value="OR">OR</SelectItem>
                <SelectItem value="NOT">NOT</SelectItem>
                <SelectItem value="XOR">XOR</SelectItem>
                <SelectItem value="NAND">NAND</SelectItem>
                <SelectItem value="NOR">NOR</SelectItem>
                <SelectItem value="XNOR">XNOR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {gateType !== "NOT" && (
            <div className="flex items-end gap-2">
              <Button 
                onClick={addInput} 
                disabled={inputs.length >= 3}
                variant="outline"
              >
                Add Input
              </Button>
              <Button 
                onClick={removeInput} 
                disabled={inputs.length <= 2}
                variant="outline"
              >
                Remove Input
              </Button>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <LogicGate 
            type={gateType} 
            inputs={inputs} 
            onInputChange={handleInputChange} 
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2">How Logic Gates Work</h3>
        <p className="mb-4">Logic gates are the fundamental building blocks of digital circuits. They perform basic logical operations on one or more binary inputs and produce a single binary output.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-md p-3">
            <div className="font-semibold flex items-center gap-2 mb-1">
              <LogicGateAnd className="h-5 w-5" /> AND Gate
            </div>
            <p className="text-sm">Outputs 1 only if all inputs are 1, otherwise outputs 0.</p>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-md p-3">
            <div className="font-semibold flex items-center gap-2 mb-1">
              <LogicGateOr className="h-5 w-5" /> OR Gate
            </div>
            <p className="text-sm">Outputs 1 if at least one input is 1, otherwise outputs 0.</p>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-md p-3">
            <div className="font-semibold flex items-center gap-2 mb-1">
              <LogicGateNot className="h-5 w-5" /> NOT Gate
            </div>
            <p className="text-sm">Inverts the input. Outputs 1 if the input is 0, and outputs 0 if the input is 1.</p>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-md p-3">
            <div className="font-semibold flex items-center gap-2 mb-1">
              <LogicGateXor className="h-5 w-5" /> XOR Gate
            </div>
            <p className="text-sm">Outputs 1 if an odd number of inputs are 1, otherwise outputs 0.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
