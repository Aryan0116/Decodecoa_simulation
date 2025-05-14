
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function FloatingPointVisualization() {
  const [decimalValue, setDecimalValue] = useState<string>("42.625");
  const [binaryValue, setBinaryValue] = useState<string>("");
  const [signBit, setSignBit] = useState<string>("0");
  const [exponent, setExponent] = useState<string>("");
  const [mantissa, setMantissa] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [precision, setPrecision] = useState<"single" | "double">("single");
  const [animationOn, setAnimationOn] = useState<boolean>(false);
  const [normalizedBinary, setNormalizedBinary] = useState<string>("");
  const [exponentBias, setExponentBias] = useState<number>(127); // 127 for single, 1023 for double

  // Update exponent bias when precision changes
  useEffect(() => {
    setExponentBias(precision === "single" ? 127 : 1023);
    convertToIEEE(decimalValue);
  }, [precision]);

  // Convert to IEEE 754 representation
  const convertToIEEE = (value: string) => {
    // Stop animation if already running
    setAnimationOn(false);
    setStep(0);
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setBinaryValue("Invalid input");
      return;
    }

    // Step 1: Determine sign bit
    const signBitValue = numValue < 0 ? "1" : "0";
    setSignBit(signBitValue);
    
    // Step 2: Convert the absolute value to binary
    const absValue = Math.abs(numValue);
    const integerPart = Math.floor(absValue);
    const fractionalPart = absValue - integerPart;
    
    let integerBinary = integerPart.toString(2);
    
    // Convert fractional part to binary
    let fractionalBinary = "";
    let fraction = fractionalPart;
    for (let i = 0; i < 23; i++) {
      // Multiply by 2 and take the integer part as the next binary digit
      fraction *= 2;
      const digit = Math.floor(fraction);
      fractionalBinary += digit;
      if (fraction >= 1) {
        fraction -= 1;
      }
      if (fraction === 0) break;
    }
    
    const fullBinary = `${integerBinary}.${fractionalBinary}`;
    setBinaryValue(fullBinary);
    
    // Step 3: Normalize the binary representation
    let normalized = "";
    let exponentValue = 0;
    
    if (integerPart !== 0) {
      // Find the position of the first '1'
      exponentValue = integerBinary.length - 1;
      normalized = integerBinary.substring(0, 1) + "." + integerBinary.substring(1) + fractionalBinary;
    } else if (fractionalPart !== 0) {
      // Find the position of the first '1' in the fractional part
      const firstOneIndex = fractionalBinary.indexOf('1');
      exponentValue = -(firstOneIndex + 1);
      normalized = "1." + fractionalBinary.substring(firstOneIndex + 1);
    } else {
      // Zero
      normalized = "0.0";
      exponentValue = 0;
    }
    
    setNormalizedBinary(normalized);
    
    // Step 4: Calculate biased exponent
    const biasedExponent = exponentValue + exponentBias;
    const exponentBinary = biasedExponent.toString(2).padStart(precision === "single" ? 8 : 11, '0');
    setExponent(exponentBinary);
    
    // Step 5: Extract mantissa (significand) - remove leading "1." as it's implicit
    let mantissaValue = normalized.replace("1.", "");
    if (mantissaValue.length === 0) mantissaValue = "0";

    // Pad or truncate the mantissa to fit the format
    const mantissaLength = precision === "single" ? 23 : 52;
    mantissaValue = mantissaValue.padEnd(mantissaLength, '0').substring(0, mantissaLength);
    setMantissa(mantissaValue);
  };

  // Start step-by-step animation
  const startAnimation = () => {
    convertToIEEE(decimalValue);
    setAnimationOn(true);
    setStep(0);
  };

  // Go to the next step in the animation
  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setAnimationOn(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecimalValue(e.target.value);
    convertToIEEE(e.target.value);
  };

  // Show the content for the current step
  const renderStepContent = () => {
    switch(step) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 1: Determine the Sign Bit</h3>
            <p>The sign bit is {signBit === "0" ? "0 for positive numbers" : "1 for negative numbers"}.</p>
            <div className="flex items-center gap-2">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold ${signBit === "0" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {signBit}
              </div>
              <ArrowRight className="text-slate-400" />
              <div className="text-sm">
                {signBit === "0" ? "Positive value" : "Negative value"}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 2: Convert to Binary</h3>
            <p>Converting {decimalValue} to binary:</p>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-sm overflow-x-auto">
              {decimalValue} = {binaryValue}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 3: Normalize the Binary</h3>
            <p>Move the decimal point so there's only one digit before it (scientific notation):</p>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-sm overflow-x-auto">
              {binaryValue} = {normalizedBinary} × 2<sup>{exponentBias - parseInt(exponent, 2)}</sup>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 4: Calculate the Exponent</h3>
            <p>Add the bias ({exponentBias}) to the exponent:</p>
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="text-sm whitespace-nowrap">
                {exponentBias - parseInt(exponent, 2)} + {exponentBias} = {parseInt(exponent, 2)}
              </div>
              <ArrowRight className="text-slate-400 flex-shrink-0" />
              <div className="p-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded font-mono">
                {exponent}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 5: Extract the Mantissa</h3>
            <p>Take the digits after the decimal point in the normalized form (without the leading 1):</p>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-sm overflow-x-auto">
              {normalizedBinary} → mantissa = {mantissa}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render color-coded IEEE representation
  const renderIEEERepresentation = () => {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1 font-mono text-center text-xs">
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
            <div>Sign</div>
            <div className="font-bold">{signBit}</div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded flex-1">
            <div>Exponent ({precision === "single" ? "8 bits" : "11 bits"})</div>
            <div className="font-bold overflow-x-auto">{exponent}</div>
          </div>
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded flex-1">
            <div>Mantissa ({precision === "single" ? "23 bits" : "52 bits"})</div>
            <div className="font-bold overflow-x-auto">{mantissa}</div>
          </div>
        </div>

        <div className="font-mono text-xs overflow-x-auto">
          <span className="font-bold">Full {precision === "single" ? "32" : "64"}-bit representation:</span> 
          <span className="text-red-600 dark:text-red-400">{signBit}</span>
          <span className="text-blue-600 dark:text-blue-400">{exponent}</span>
          <span className="text-green-600 dark:text-green-400">{mantissa}</span>
        </div>

        <div className="text-xs text-slate-500">
          {precision === "single" ? "IEEE 754 Single Precision (32-bit)" : "IEEE 754 Double Precision (64-bit)"}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">IEEE 754 Floating Point Visualization</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Enter a decimal number to see its IEEE 754 floating-point representation with a step-by-step breakdown.
      </p>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enter a Decimal Number</CardTitle>
            <CardDescription>
              Enter any positive or negative decimal number to visualize its floating-point representation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input 
                type="text" 
                value={decimalValue} 
                onChange={handleInputChange}
                placeholder="Enter a number (e.g. 42.625)"
                className="font-mono"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Try values like 0.1, -45.5, 256, or 0 to see how they are represented</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>IEEE 754 Format:</span>
                <span>{precision === "single" ? "Single Precision (32-bit)" : "Double Precision (64-bit)"}</span>
              </div>
              <Tabs value={precision} onValueChange={(v) => setPrecision(v as "single" | "double")}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="single">Single (32-bit)</TabsTrigger>
                  <TabsTrigger value="double">Double (64-bit)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex gap-2">
              <Button className="w-full" onClick={startAnimation}>
                Show Step-by-Step Animation
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>IEEE 754 Representation</CardTitle>
            <CardDescription>
              Binary representation broken down into sign, exponent, and mantissa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderIEEERepresentation()}
          </CardContent>
        </Card>
      </div>
      
      {animationOn && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Step-by-Step Animation</CardTitle>
            <CardDescription>
              Understanding how {decimalValue} is converted to floating-point format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderStepContent()}
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm">
                Step {step + 1} of 5
              </div>
              <Button onClick={nextStep}>
                {step < 4 ? "Next Step" : "Finish"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <h3 className="font-medium mb-2">IEEE 754 Format Overview</h3>
        <ul className="space-y-2 text-sm">
          <li><strong>Sign bit:</strong> 0 for positive, 1 for negative</li>
          <li><strong>Exponent:</strong> {precision === "single" ? "8 bits, biased by 127" : "11 bits, biased by 1023"}</li>
          <li><strong>Mantissa:</strong> {precision === "single" ? "23 bits" : "52 bits"} with implied leading 1</li>
          <li><strong>Special cases:</strong> ±0, ±∞, NaN have specific bit patterns</li>
        </ul>
      </div>
    </div>
  );
}
