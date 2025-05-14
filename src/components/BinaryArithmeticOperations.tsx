
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Plus, Minus, X, Divide, HelpCircle, ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function BinaryArithmeticOperations() {
  const [num1, setNum1] = useState<string>("1010");
  const [num2, setNum2] = useState<string>("0110");
  const [operation, setOperation] = useState<"add" | "subtract" | "multiply" | "divide">("add");
  const [result, setResult] = useState<string>("");
  const [steps, setSteps] = useState<Array<{description: string, step: string}>>([]);
  const [error, setError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    calculateResult();
  }, [num1, num2, operation]);

  // Helper function to validate binary input
  const isValidBinary = (value: string): boolean => {
    return /^[01]+$/.test(value);
  };

  // Convert binary string to decimal
  const binaryToDecimal = (binary: string): number => {
    return parseInt(binary, 2);
  };

  // Convert decimal to binary string
  const decimalToBinary = (decimal: number): string => {
    if (decimal < 0) {
      // For negative numbers, we'll use 2's complement with 8 bits
      const absValue = Math.abs(decimal);
      const absValueBinary = absValue.toString(2).padStart(8, '0');
      let inverted = '';
      for (let i = 0; i < absValueBinary.length; i++) {
        inverted += absValueBinary[i] === '0' ? '1' : '0';
      }
      const invertedDecimal = parseInt(inverted, 2) + 1;
      return invertedDecimal.toString(2).padStart(8, '0');
    }
    return decimal.toString(2);
  };

  // Pad binary strings to same length
  const padBinary = (bin1: string, bin2: string): [string, string] => {
    const maxLength = Math.max(bin1.length, bin2.length);
    return [
      bin1.padStart(maxLength, '0'),
      bin2.padStart(maxLength, '0')
    ];
  };

  // Binary addition with step tracking
  const binaryAdd = (bin1: string, bin2: string): void => {
    const newSteps: Array<{description: string, step: string}> = [];
    const [paddedBin1, paddedBin2] = padBinary(bin1, bin2);

    // Initialize result and carry
    let result = '';
    let carry = 0;

    // Display initial step
    newSteps.push({
      description: "Initial values",
      step: `  ${paddedBin1}\n+ ${paddedBin2}`
    });

    // Add bit by bit from right to left
    for (let i = paddedBin1.length - 1; i >= 0; i--) {
      const bit1 = parseInt(paddedBin1[i]);
      const bit2 = parseInt(paddedBin2[i]);
      
      // Calculate current bit sum and new carry
      const sum = bit1 + bit2 + carry;
      const resultBit = sum % 2;
      const newCarry = Math.floor(sum / 2);
      
      // Prepend to result
      result = resultBit + result;

      // Record this step
      const carryString = i > 0 ? (newCarry ? "1" : "0") : "";
      const stepDescription = `Add bit position ${paddedBin1.length - 1 - i}: ${bit1} + ${bit2} + carry(${carry}) = ${sum}`;
      const bitSumVisual = `  ${carry ? "1" : " "} carry\n  ${paddedBin1}\n+ ${paddedBin2}\n  ${"".padStart(paddedBin1.length - result.length, "-")}${result}`;
      
      newSteps.push({
        description: stepDescription,
        step: bitSumVisual
      });
      
      // Update carry for next iteration
      carry = newCarry;
    }
    
    // If there's a final carry, prepend it to the result
    if (carry > 0) {
      result = carry + result;
      newSteps.push({
        description: "Final carry",
        step: `  ${carry} carry\n  ${paddedBin1}\n+ ${paddedBin2}\n  ${result}`
      });
    }
    
    // Final result
    newSteps.push({
      description: "Final result",
      step: `  ${paddedBin1}\n+ ${paddedBin2}\n  ${"-".repeat(Math.max(paddedBin1.length, result.length))}\n  ${result}`
    });
    
    setSteps(newSteps);
    setResult(result);
  };

  // Binary subtraction using 2's complement
  const binarySubtract = (bin1: string, bin2: string): void => {
    const newSteps: Array<{description: string, step: string}> = [];
    const [paddedBin1, paddedBin2] = padBinary(bin1, bin2);
    
    // Initial values
    newSteps.push({
      description: "Initial values",
      step: `  ${paddedBin1}\n- ${paddedBin2}`
    });
    
    // Step 1: Find 2's complement of subtrahend (bin2)
    let onesComplement = '';
    for (let i = 0; i < paddedBin2.length; i++) {
      onesComplement += paddedBin2[i] === '0' ? '1' : '0';
    }
    
    newSteps.push({
      description: "Step 1: Find 1's complement of subtrahend",
      step: `  ${paddedBin2} (original)\n  ${onesComplement} (1's complement)`
    });
    
    // Step 2: Add 1 to get 2's complement
    let twosComplement = '';
    let carry = 1;
    for (let i = onesComplement.length - 1; i >= 0; i--) {
      if (onesComplement[i] === '1' && carry === 1) {
        twosComplement = '0' + twosComplement;
      } else if (onesComplement[i] === '0' && carry === 1) {
        twosComplement = '1' + twosComplement;
        carry = 0;
      } else {
        twosComplement = onesComplement[i] + twosComplement;
      }
    }
    
    newSteps.push({
      description: "Step 2: Add 1 to get 2's complement",
      step: `  ${onesComplement} (1's complement)\n+ 1\n  ${twosComplement} (2's complement)`
    });
    
    // Step 3: Add the minuend and 2's complement
    newSteps.push({
      description: "Step 3: Add minuend and 2's complement",
      step: `  ${paddedBin1}\n+ ${twosComplement}`
    });
    
    // Initialize result for addition
    let addResult = '';
    carry = 0;
    
    // Add bit by bit from right to left
    for (let i = paddedBin1.length - 1; i >= 0; i--) {
      const bit1 = parseInt(paddedBin1[i]);
      const bit2 = parseInt(twosComplement[i]);
      
      // Calculate current bit sum and new carry
      const sum = bit1 + bit2 + carry;
      const resultBit = sum % 2;
      const newCarry = Math.floor(sum / 2);
      
      // Prepend to result
      addResult = resultBit + addResult;
      
      // Record this step in addition
      if (i === paddedBin1.length - 1 || i === 0) {
        const stepDescription = `Add bit position ${paddedBin1.length - 1 - i}: ${bit1} + ${bit2} + carry(${carry}) = ${resultBit}, new carry = ${newCarry}`;
        const bitSumVisual = `  ${carry ? "1" : " "} carry\n  ${paddedBin1}\n+ ${twosComplement}\n  ${"".padStart(paddedBin1.length - addResult.length, "-")}${addResult}`;
        
        newSteps.push({
          description: stepDescription,
          step: bitSumVisual
        });
      }
      
      // Update carry for next iteration
      carry = newCarry;
    }
    
    // Step 4: Discard any carry beyond the bit width
    newSteps.push({
      description: "Step 4: Discard carry beyond bit width",
      step: `  ${paddedBin1}\n+ ${twosComplement}\n  ${"-".repeat(Math.max(paddedBin1.length, addResult.length))}\n  ${addResult}`
    });
    
    // Determine if result is negative
    const isResultNegative = paddedBin1.length === addResult.length && addResult[0] === '1';
    
    if (isResultNegative) {
      newSteps.push({
        description: "Step 5: Result is negative, convert back to positive using 2's complement",
        step: `  ${addResult} (negative result in 2's complement)`
      });
      
      // Convert negative result back to positive for display
      let onesCompResult = '';
      for (let i = 0; i < addResult.length; i++) {
        onesCompResult += addResult[i] === '0' ? '1' : '0';
      }
      
      let positiveResult = '';
      carry = 1;
      for (let i = onesCompResult.length - 1; i >= 0; i--) {
        if (onesCompResult[i] === '1' && carry === 1) {
          positiveResult = '0' + positiveResult;
        } else if (onesCompResult[i] === '0' && carry === 1) {
          positiveResult = '1' + positiveResult;
          carry = 0;
        } else {
          positiveResult = onesCompResult[i] + positiveResult;
        }
      }
      
      newSteps.push({
        description: "Final result (negative)",
        step: `  -${positiveResult}`
      });
      
      setResult(`-${positiveResult}`);
    } else {
      // Final result
      newSteps.push({
        description: "Final result",
        step: `  ${addResult}`
      });
      
      setResult(addResult);
    }
    
    setSteps(newSteps);
  };

  // Binary multiplication
  const binaryMultiply = (bin1: string, bin2: string): void => {
    const newSteps: Array<{description: string, step: string}> = [];
    
    // Initial values
    newSteps.push({
      description: "Initial values (multiplicand × multiplier)",
      step: `  ${bin1} × ${bin2}`
    });
    
    // Prepare partial products
    const partialProducts: string[] = [];
    let finalResult = '0';
    
    for (let i = bin2.length - 1; i >= 0; i--) {
      if (bin2[i] === '1') {
        // Shift multiplicand based on position
        const shiftedValue = bin1 + '0'.repeat(bin2.length - 1 - i);
        partialProducts.push(shiftedValue);
        
        newSteps.push({
          description: `Step for bit ${bin2.length - 1 - i}: Multiplier bit is 1`,
          step: `  ${bin1} << ${bin2.length - 1 - i} = ${shiftedValue}`
        });
        
        // Add to running sum
        const dec1 = parseInt(finalResult, 2);
        const dec2 = parseInt(shiftedValue, 2);
        finalResult = (dec1 + dec2).toString(2);
      } else {
        newSteps.push({
          description: `Step for bit ${bin2.length - 1 - i}: Multiplier bit is 0`,
          step: `  ${bin1} × 0 = 0 (no addition needed)`
        });
        partialProducts.push('0');
      }
    }
    
    // Show all partial products and final sum
    const formattedPartials = partialProducts.map((p, idx) => {
      const idxFromRight = bin2.length - 1 - idx;
      const indent = ' '.repeat(idxFromRight);
      return bin2[idx] === '1' ? `  ${indent}${p}` : `  ${indent}${'0'.repeat(p.length)} (bit is 0)`;
    }).join('\n');
    
    newSteps.push({
      description: "Sum all partial products",
      step: `${formattedPartials}\n  ${'='.repeat(Math.max(...partialProducts.map(p => p.length)) + 2)}\n  ${finalResult}`
    });
    
    setSteps(newSteps);
    setResult(finalResult);
  };

  // Binary division
  const binaryDivide = (bin1: string, bin2: string): void => {
    const newSteps: Array<{description: string, step: string}> = [];
    
    // Check for division by zero
    if (bin2 === '0' || /^0+$/.test(bin2)) {
      setError("Division by zero is undefined");
      setResult("Error");
      setSteps([]);
      return;
    }
    
    // Initial values
    newSteps.push({
      description: "Initial values (dividend ÷ divisor)",
      step: `  ${bin1} ÷ ${bin2}`
    });
    
    // Convert to decimal
    const dividend = parseInt(bin1, 2);
    const divisor = parseInt(bin2, 2);
    
    // Perform division
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;
    
    // Convert results back to binary
    const quotientBin = quotient.toString(2);
    const remainderBin = remainder.toString(2);
    
    // Long division process
    newSteps.push({
      description: "Decimal conversion for easier processing",
      step: `  ${bin1} (${dividend} in decimal) ÷ ${bin2} (${divisor} in decimal)`
    });
    
    newSteps.push({
      description: "Calculate quotient and remainder",
      step: `  ${dividend} ÷ ${divisor} = ${quotient} with remainder ${remainder}`
    });
    
    newSteps.push({
      description: "Convert results back to binary",
      step: `  Quotient: ${quotient} = ${quotientBin} in binary\n  Remainder: ${remainder} = ${remainderBin} in binary`
    });
    
    // Set final result with both quotient and remainder
    const finalResult = `${quotientBin} R ${remainderBin}`;
    
    newSteps.push({
      description: "Final result",
      step: `  ${bin1} ÷ ${bin2} = ${quotientBin} remainder ${remainderBin}`
    });
    
    setSteps(newSteps);
    setResult(finalResult);
  };

  // Main calculation function
  const calculateResult = () => {
    setError("");
    setCurrentStep(0);
    
    // Validate inputs
    if (!isValidBinary(num1) || !isValidBinary(num2)) {
      setError("Invalid binary input (must contain only 0s and 1s)");
      setResult("");
      setSteps([]);
      return;
    }
    
    // Perform selected operation
    switch(operation) {
      case "add":
        binaryAdd(num1, num2);
        break;
      case "subtract":
        binarySubtract(num1, num2);
        break;
      case "multiply":
        binaryMultiply(num1, num2);
        break;
      case "divide":
        binaryDivide(num1, num2);
        break;
      default:
        setError("Invalid operation");
        break;
    }
  };

  // Step navigation
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Binary Arithmetic Operations</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Perform binary arithmetic operations and see step-by-step calculations.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Binary Inputs</CardTitle>
            <CardDescription>Enter binary numbers and select an operation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">First Binary Number</label>
                <span className="text-xs text-slate-500">
                  Decimal: {isValidBinary(num1) ? binaryToDecimal(num1) : "Invalid"}
                </span>
              </div>
              <Input 
                value={num1} 
                onChange={(e) => setNum1(e.target.value)} 
                placeholder="e.g. 1010" 
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Second Binary Number</label>
                <span className="text-xs text-slate-500">
                  Decimal: {isValidBinary(num2) ? binaryToDecimal(num2) : "Invalid"}
                </span>
              </div>
              <Input 
                value={num2} 
                onChange={(e) => setNum2(e.target.value)} 
                placeholder="e.g. 0110" 
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Operation</label>
              <div className="grid grid-cols-4 gap-2">
                <Button 
                  variant={operation === "add" ? "default" : "outline"}
                  onClick={() => setOperation("add")}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
                <Button 
                  variant={operation === "subtract" ? "default" : "outline"}
                  onClick={() => setOperation("subtract")}
                  className="flex items-center gap-1"
                >
                  <Minus className="h-4 w-4" /> Sub
                </Button>
                <Button 
                  variant={operation === "multiply" ? "default" : "outline"}
                  onClick={() => setOperation("multiply")}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" /> Mult
                </Button>
                <Button 
                  variant={operation === "divide" ? "default" : "outline"}
                  onClick={() => setOperation("divide")}
                  className="flex items-center gap-1"
                >
                  <Divide className="h-4 w-4" /> Div
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-950 rounded">
                {error}
              </div>
            )}
            
            <div className="pt-2">
              <Button onClick={calculateResult} className="w-full">Calculate</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>
              {isValidBinary(num1) && isValidBinary(num2) ? (
                `${binaryToDecimal(num1)} ${
                  operation === "add" ? "+" :
                  operation === "subtract" ? "-" :
                  operation === "multiply" ? "×" : "÷"
                } ${binaryToDecimal(num2)} = ${
                  result.startsWith("-") ? 
                    -binaryToDecimal(result.substring(1)) :
                  result.includes("R") ?
                    `${binaryToDecimal(result.split("R")[0].trim())} remainder ${binaryToDecimal(result.split("R")[1].trim())}` :
                    binaryToDecimal(result)
                }`
              ) : "Enter valid binary numbers"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result && !error && (
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                {steps[currentStep]?.step || ""}
              </div>
            )}
            
            {steps.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    Step {currentStep + 1} of {steps.length}
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToPreviousStep} 
                      disabled={currentStep === 0}
                      className="mr-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToNextStep} 
                      disabled={currentStep === steps.length - 1}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-950">
                  <h4 className="text-sm font-medium mb-1">Explanation:</h4>
                  <p className="text-sm">{steps[currentStep]?.description || ""}</p>
                </div>
              </div>
            )}
            
            {result && !error && (
              <div className="pt-2 font-medium">
                Final Result: <span className="font-mono">{result}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Binary Arithmetic Reference</CardTitle>
          <CardDescription>Understanding binary arithmetic operations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="addition">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="addition">Addition</TabsTrigger>
              <TabsTrigger value="subtraction">Subtraction</TabsTrigger>
              <TabsTrigger value="multiplication">Multiplication</TabsTrigger>
              <TabsTrigger value="division">Division</TabsTrigger>
            </TabsList>
            
            <TabsContent value="addition" className="pt-4">
              <div className="space-y-2 text-sm">
                <p>Binary addition follows similar rules to decimal addition, but with only 1s and 0s:</p>
                <div className="grid grid-cols-4 gap-2 font-mono mt-2">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">0 + 0 = 0</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">0 + 1 = 1</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">1 + 0 = 1</div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">1 + 1 = 10</div>
                </div>
                <p>When adding two 1s, the result is 0 with a carry of 1 to the next position.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="subtraction" className="pt-4">
              <div className="space-y-2 text-sm">
                <p>Binary subtraction is often performed using the 2's complement method:</p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Find the 2's complement of the subtrahend (the number being subtracted)</li>
                  <li>Add this 2's complement to the minuend (the number being subtracted from)</li>
                  <li>Discard any carry beyond the bit width</li>
                </ol>
                <p>The 2's complement of a binary number is found by:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Flipping all bits (0→1, 1→0) to get the 1's complement</li>
                  <li>Adding 1 to the 1's complement</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="multiplication" className="pt-4">
              <div className="space-y-2 text-sm">
                <p>Binary multiplication follows these steps:</p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>For each bit in the multiplier (from right to left):</li>
                  <li>If the bit is 1, write down the multiplicand shifted to the appropriate position</li>
                  <li>If the bit is 0, write down all zeros</li>
                  <li>Add all the resulting rows together</li>
                </ol>
                <p>This method is similar to the long multiplication method used in decimal.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="division" className="pt-4">
              <div className="space-y-2 text-sm">
                <p>Binary division works similar to long division in decimal, with these basic rules:</p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>If the divisor can "go into" the current portion of the dividend, write 1 in the quotient</li>
                  <li>If not, write 0 in the quotient</li>
                  <li>Subtract and bring down the next bit, just like in decimal division</li>
                </ol>
                <p>For simplicity, this simulation uses decimal conversion for division calculations.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
