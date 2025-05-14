import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SignedNumberRepresentation() {
  const [decimalValue, setDecimalValue] = useState<string>("42");
  const [representation, setRepresentation] = useState<string>("sign-magnitude");
  const [binaryResult, setBinaryResult] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [bitWidth, setBitWidth] = useState<number>(8);
  
  useEffect(() => {
    convertToBinary();
  }, [decimalValue, representation, bitWidth]);
  
  const convertToBinary = () => {
    // Clear previous error
    setError("");
    
    // Parse decimal input
    const num = parseInt(decimalValue);
    if (isNaN(num)) {
      setError("Please enter a valid number");
      setBinaryResult("");
      setExplanation("");
      return;
    }
    
    // Check if number can be represented in the given bit width
    const maxValue = Math.pow(2, bitWidth - 1) - 1;
    if (Math.abs(num) > maxValue) {
      setError(`Number too large for ${bitWidth}-bit representation (max: ±${maxValue})`);
      return;
    }
    
    let result = "";
    let explain = "";
    
    // Determine the absolute value in binary
    const absNum = Math.abs(num);
    let absBinary = absNum.toString(2);
    
    // Pad to the correct width (minus sign bit)
    absBinary = absBinary.padStart(bitWidth - 1, '0');
    
    // Different representation formats
    switch (representation) {
      case "sign-magnitude":
        // First bit is sign (0 for positive, 1 for negative)
        result = (num < 0 ? "1" : "0") + absBinary;
        explain = `Sign-magnitude: The first bit represents the sign (${num < 0 ? "1 for negative" : "0 for positive"}), followed by the absolute value in binary (${absBinary}).`;
        break;
        
      case "ones-complement":
        if (num >= 0) {
          // Positive numbers are the same as in sign-magnitude
          result = "0" + absBinary;
          explain = `One's complement: For positive numbers, format is the same as sign-magnitude.`;
        } else {
          // For negative, invert all bits
          let inverted = "";
          let padded = absBinary.padStart(bitWidth - 1, '0');
          for (let i = 0; i < padded.length; i++) {
            inverted += padded[i] === "0" ? "1" : "0";
          }
          result = "1" + inverted;
          explain = `One's complement: For negative numbers, all bits are inverted (including the sign bit).`;
        }
        break;
        
      case "twos-complement":
        if (num >= 0) {
          // Positive numbers are the same as in sign-magnitude
          result = "0" + absBinary;
          explain = `Two's complement: For positive numbers, format is the same as sign-magnitude.`;
        } else {
          // For negative, invert all bits and add 1
          let inverted = "";
          let padded = absBinary.padStart(bitWidth - 1, '0');
          for (let i = 0; i < padded.length; i++) {
            inverted += padded[i] === "0" ? "1" : "0";
          }
          
          // Add 1 to the inverted bits
          let carry = 1;
          let added = "";
          for (let i = inverted.length - 1; i >= 0; i--) {
            if (inverted[i] === "1" && carry === 1) {
              added = "0" + added;
            } else if (inverted[i] === "0" && carry === 1) {
              added = "1" + added;
              carry = 0;
            } else {
              added = inverted[i] + added;
            }
          }
          
          result = "1" + added;
          explain = `Two's complement: For negative numbers, all bits are inverted and then 1 is added to the result.`;
        }
        break;
    }
    
    // Ensure result is the correct width
    result = result.padStart(bitWidth, result[0]);
    
    setBinaryResult(result);
    setExplanation(explain);
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Signed Number Representation</h2>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Explore different methods for representing signed integers in binary: sign-magnitude, one's complement, and two's complement.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Settings</CardTitle>
            <CardDescription>Enter a decimal number and choose representation method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="decimal-input">Decimal Number</Label>
              <div className="flex gap-2">
                <Input
                  id="decimal-input"
                  type="text"
                  placeholder="Enter a decimal number"
                  value={decimalValue}
                  onChange={(e) => setDecimalValue(e.target.value)}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter a positive or negative integer</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Bit Width</Label>
              <div className="flex items-center gap-2">
                <Button 
                  variant={bitWidth === 8 ? "default" : "outline"}
                  onClick={() => setBitWidth(8)}
                  className="w-full"
                >
                  8-bit
                </Button>
                <Button 
                  variant={bitWidth === 16 ? "default" : "outline"}
                  onClick={() => setBitWidth(16)}
                  className="w-full"
                >
                  16-bit
                </Button>
                <Button 
                  variant={bitWidth === 32 ? "default" : "outline"}
                  onClick={() => setBitWidth(32)}
                  className="w-full"
                >
                  32-bit
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Representation Method</Label>
              <RadioGroup 
                value={representation}
                onValueChange={setRepresentation}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sign-magnitude" id="r1" />
                  <Label htmlFor="r1">Sign-Magnitude</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ones-complement" id="r2" />
                  <Label htmlFor="r2">One's Complement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="twos-complement" id="r3" />
                  <Label htmlFor="r3">Two's Complement</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Binary Representation</CardTitle>
            <CardDescription>
              {decimalValue || "0"} in {representation} format ({bitWidth}-bit)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {binaryResult ? (
              <>
                <div className="overflow-auto max-w-full">
                  <div className="flex flex-wrap gap-1 font-mono text-xs">
                    {binaryResult.split('').map((bit, index) => {
                      // The first bit is the sign bit
                      const isSignBit = index === 0;
                      const bitColor = isSignBit 
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
                      
                      return (
                        <div 
                          key={index} 
                          className={`${bitColor} p-2 rounded w-8 h-8 flex items-center justify-center`}
                        >
                          {bit}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-2 flex">
                    <div className="w-8 text-center text-xs">Sign</div>
                    <div className="flex-1 text-center text-xs">Magnitude/Value</div>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                  <p className="font-medium mb-1">Explanation:</p>
                  <p>{explanation}</p>
                </div>
                
                <div className="overflow-auto max-w-full">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                        <th className="p-2">Decimal</th>
                        <th className="p-2">Binary ({representation})</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2">{decimalValue}</td>
                        <td className="p-2 font-mono">{binaryResult}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-40 text-slate-500">
                Enter a valid number to see its representation
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Comparison of representations */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Representation Comparison</CardTitle>
          <CardDescription>
            Understanding the differences between signed number representations
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Feature</TableHead>
                <TableHead className="min-w-[150px]">Sign-Magnitude</TableHead>
                <TableHead className="min-w-[150px]">One's Complement</TableHead>
                <TableHead className="min-w-[150px]">Two's Complement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Representation of -0</TableCell>
                <TableCell>Has negative zero (10...0)</TableCell>
                <TableCell>Has negative zero (11...1)</TableCell>
                <TableCell>No negative zero</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Range (n bits)</TableCell>
                <TableCell>-(2^(n-1)-1) to 2^(n-1)-1</TableCell>
                <TableCell>-(2^(n-1)-1) to 2^(n-1)-1</TableCell>
                <TableCell>-2^(n-1) to 2^(n-1)-1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Arithmetic</TableCell>
                <TableCell>Complex, requires sign handling</TableCell>
                <TableCell>End-around carry needed</TableCell>
                <TableCell>Simple standard ALU operations</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Modern Usage</TableCell>
                <TableCell>Rarely used</TableCell>
                <TableCell>Rarely used</TableCell>
                <TableCell>Industry standard</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
