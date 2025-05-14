
import React, { useState, useEffect } from "react";
import { Binary, ArrowRight, Calculator, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

type BaseType = "binary" | "decimal" | "octal" | "hexadecimal";

interface ConversionResult {
  binary: string;
  decimal: string;
  octal: string;
  hexadecimal: string;
  steps: ConversionStep[];
}

interface ConversionStep {
  description: string;
  calculation?: string;
  result?: string;
  highlight?: string;
}

// Regex patterns for validating input
const validationPatterns = {
  binary: /^[01]*$/,
  decimal: /^\d*$/,
  octal: /^[0-7]*$/,
  hexadecimal: /^[0-9A-Fa-f]*$/,
};

export function NumberSystemConverter() {
  const [inputValue, setInputValue] = useState<string>("");
  const [inputBase, setInputBase] = useState<BaseType>("decimal");
  const [conversionResults, setConversionResults] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("binary");
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const baseNames: Record<BaseType, string> = {
    binary: "Binary (Base 2)",
    decimal: "Decimal (Base 10)",
    octal: "Octal (Base 8)",
    hexadecimal: "Hexadecimal (Base 16)",
  };

  // Convert input value to all other bases
  useEffect(() => {
    if (!inputValue) {
      setConversionResults(null);
      setError(null);
      return;
    }

    // Validate input based on selected base
    if (!validationPatterns[inputBase].test(inputValue)) {
      setError(`Invalid ${baseNames[inputBase].toLowerCase()} input`);
      return;
    }

    try {
      // Convert input to decimal first (as an intermediate representation)
      let decimalValue: number;
      let steps: ConversionStep[] = [];

      // Conversion to decimal (if not already decimal)
      if (inputBase !== "decimal") {
        const baseValue = getBaseValue(inputBase);
        decimalValue = parseInt(inputValue, baseValue);
        
        // Generate steps for conversion to decimal
        steps = generateToDecimalSteps(inputValue, inputBase);
      } else {
        decimalValue = parseInt(inputValue, 10);
      }

      // Convert decimal to all other bases
      const results: ConversionResult = {
        binary: decimalValue.toString(2),
        decimal: decimalValue.toString(10),
        octal: decimalValue.toString(8),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
        steps: steps.concat(generateFromDecimalSteps(decimalValue, activeTab as BaseType))
      };

      setConversionResults(results);
      setError(null);
    } catch (err) {
      setError("Error converting number");
      setConversionResults(null);
    }
  }, [inputValue, inputBase, activeTab]);

  // Get the base value as a number
  const getBaseValue = (base: BaseType): number => {
    switch (base) {
      case "binary": return 2;
      case "decimal": return 10;
      case "octal": return 8;
      case "hexadecimal": return 16;
      default: return 10;
    }
  };

  // Generate steps for conversion to decimal
  const generateToDecimalSteps = (value: string, base: BaseType): ConversionStep[] => {
    const steps: ConversionStep[] = [];
    const baseValue = getBaseValue(base);
    
    steps.push({
      description: `Step 1: Identify each digit's position value in ${baseNames[base]}`
    });

    // Reverse the digits to process from right to left
    const digits = value.split("").reverse();
    let calculation = "";
    
    digits.forEach((digit, index) => {
      const positionValue = Math.pow(baseValue, index);
      const digitValue = parseInt(digit, baseValue) * positionValue;
      
      calculation += `${digit} × ${baseValue}^${index} (${positionValue}) = ${digitValue}`;
      
      if (index < digits.length - 1) {
        calculation += " + ";
      }
    });
    
    steps.push({
      description: `Step 2: Multiply each digit by its position value`,
      calculation,
    });
    
    // Calculate the sum
    const sum = parseInt(value, baseValue);
    steps.push({
      description: `Step 3: Add up all values to get the decimal result`,
      result: `= ${sum}`,
    });
    
    return steps;
  };

  // Generate steps for conversion from decimal to another base
  const generateFromDecimalSteps = (decimalValue: number, targetBase: BaseType): ConversionStep[] => {
    if (targetBase === "decimal") {
      return [];
    }
    
    const steps: ConversionStep[] = [];
    const baseValue = getBaseValue(targetBase);
    
    steps.push({
      description: `Step 1: To convert from decimal to ${baseNames[targetBase]}, we divide repeatedly by ${baseValue}`
    });
    
    let quotient = decimalValue;
    const remainders: number[] = [];
    const divisions: string[] = [];
    
    while (quotient > 0) {
      const remainder = quotient % baseValue;
      remainders.push(remainder);
      divisions.push(`${quotient} ÷ ${baseValue} = ${Math.floor(quotient / baseValue)} remainder ${remainder}`);
      quotient = Math.floor(quotient / baseValue);
    }
    
    steps.push({
      description: `Step 2: Record the division steps and remainders`,
      calculation: divisions.join("\n"),
    });
    
    // Convert remainders to the appropriate base digits
    const digits = remainders.map(r => {
      if (targetBase === "hexadecimal" && r >= 10) {
        return String.fromCharCode(55 + r); // A-F for values 10-15
      }
      return r.toString();
    });
    
    const result = digits.reverse().join("");
    steps.push({
      description: `Step 3: Read the remainders from bottom to top to get the ${baseNames[targetBase]} result`,
      result,
      highlight: "The digits are read in reverse order (bottom to top)"
    });
    
    return steps;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setAnimationStep(0);
    setIsAnimating(false);
  };

  // Handle base changes
  const handleBaseChange = (value: string) => {
    setInputBase(value as BaseType);
    setInputValue("");
    setAnimationStep(0);
    setIsAnimating(false);
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAnimationStep(0);
    setIsAnimating(false);
  };

  // Start step-by-step animation
  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
  };

  // Move to next animation step
  const nextAnimationStep = () => {
    if (conversionResults && animationStep < conversionResults.steps.length - 1) {
      setAnimationStep(animationStep + 1);
    } else {
      setIsAnimating(false);
    }
  };

  // Format conversion results for display
  const getResultForBase = (base: BaseType): string => {
    if (!conversionResults) return "";
    return conversionResults[base];
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Number System Converter</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Convert between binary, decimal, octal, and hexadecimal number systems with step-by-step explanation.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-blue-500" />
              Enter a Number
            </CardTitle>
            <CardDescription>
              Choose a base and enter a valid number
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">
                Select Number Base
              </label>
              <Select
                value={inputBase}
                onValueChange={handleBaseChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a number base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binary">Binary (Base 2)</SelectItem>
                  <SelectItem value="decimal">Decimal (Base 10)</SelectItem>
                  <SelectItem value="octal">Octal (Base 8)</SelectItem>
                  <SelectItem value="hexadecimal">Hexadecimal (Base 16)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-1 block">
                Enter a Number
              </label>
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={`Enter a ${inputBase} number`}
                className="font-mono"
              />
              {error && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </p>
              )}
              {inputBase === "binary" && (
                <p className="text-xs text-slate-500 mt-1">Only 0s and 1s are allowed</p>
              )}
              {inputBase === "octal" && (
                <p className="text-xs text-slate-500 mt-1">Only digits 0-7 are allowed</p>
              )}
              {inputBase === "hexadecimal" && (
                <p className="text-xs text-slate-500 mt-1">Digits 0-9 and letters A-F are allowed</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={startAnimation}
              disabled={!conversionResults || isAnimating}
              className="w-full"
            >
              Show Step-by-Step Conversion
            </Button>
          </CardFooter>
        </Card>
        
        {/* Results card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Binary className="h-5 w-5 mr-2 text-blue-500" />
              Conversion Results
            </CardTitle>
            <CardDescription>
              Equivalent values in different number systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="binary"
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="binary">Binary</TabsTrigger>
                <TabsTrigger value="decimal">Decimal</TabsTrigger>
                <TabsTrigger value="octal">Octal</TabsTrigger>
                <TabsTrigger value="hexadecimal">Hex</TabsTrigger>
              </TabsList>
              
              {["binary", "decimal", "octal", "hexadecimal"].map((base) => (
                <TabsContent key={base} value={base} className="space-y-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-sm text-slate-600 dark:text-slate-300">
                        {baseNames[base as BaseType]}
                      </h3>
                      {inputBase !== base && conversionResults && (
                        <Badge variant="outline">Converted</Badge>
                      )}
                      {inputBase === base && (
                        <Badge>Source</Badge>
                      )}
                    </div>
                    <div className="font-mono text-lg break-all">
                      {conversionResults ? getResultForBase(base as BaseType) : "—"}
                    </div>
                  </div>
                  
                  {/* Conversion animation */}
                  {isAnimating && conversionResults && (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-md p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">
                          {inputBase === base ? 
                            `Converting from ${baseNames[inputBase]} to Decimal` : 
                            `Converting from Decimal to ${baseNames[base as BaseType]}`}
                        </h3>
                        <div className="text-sm text-slate-500">
                          Step {animationStep + 1} of {conversionResults.steps.length}
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded mb-3 min-h-[100px]">
                        {animationStep < conversionResults.steps.length && (
                          <>
                            <p className="font-medium">{conversionResults.steps[animationStep].description}</p>
                            
                            {conversionResults.steps[animationStep].calculation && (
                              <pre className="mt-2 text-sm font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-x-auto">
                                {conversionResults.steps[animationStep].calculation}
                              </pre>
                            )}
                            
                            {conversionResults.steps[animationStep].result && (
                              <div className="mt-2 font-mono text-blue-600 dark:text-blue-400 text-lg">
                                {conversionResults.steps[animationStep].result}
                              </div>
                            )}
                            
                            {conversionResults.steps[animationStep].highlight && (
                              <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 italic">
                                {conversionResults.steps[animationStep].highlight}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      
                      <Button onClick={nextAnimationStep} disabled={animationStep >= conversionResults.steps.length - 1}>
                        {animationStep >= conversionResults.steps.length - 1 ? "Completed" : "Next Step"}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Reference Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Number System Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 border rounded-md">
              <h4 className="font-medium mb-2 flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                Binary (Base 2)
              </h4>
              <p className="text-sm">Uses only 0 and 1. Each position represents a power of 2.</p>
              <div className="text-xs mt-2 text-slate-500">Example: 1010₂ = 10₁₀</div>
            </div>
            
            <div className="p-3 border rounded-md">
              <h4 className="font-medium mb-2 flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                Decimal (Base 10)
              </h4>
              <p className="text-sm">Uses digits 0-9. Each position represents a power of 10.</p>
              <div className="text-xs mt-2 text-slate-500">Example: 42₁₀ = 101010₂</div>
            </div>
            
            <div className="p-3 border rounded-md">
              <h4 className="font-medium mb-2 flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                Octal (Base 8)
              </h4>
              <p className="text-sm">Uses digits 0-7. Each position represents a power of 8.</p>
              <div className="text-xs mt-2 text-slate-500">Example: 52₈ = 42₁₀</div>
            </div>
            
            <div className="p-3 border rounded-md">
              <h4 className="font-medium mb-2 flex items-center">
                <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                Hexadecimal (Base 16)
              </h4>
              <p className="text-sm">Uses 0-9 and A-F. Each position represents a power of 16.</p>
              <div className="text-xs mt-2 text-slate-500">Example: 2A₁₆ = 42₁₀</div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Conversion Formulas:</h4>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">From Any Base to Decimal:</span> Multiply each digit by its position value and sum</p>
              <p><span className="font-medium">From Decimal to Any Base:</span> Divide by the target base repeatedly and read remainders in reverse</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
