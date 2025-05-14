
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export function NumberConverter() {
  const [decimal, setDecimal] = useState<string>("");
  const [binary, setBinary] = useState<string>("");
  const [hex, setHex] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("decimal");

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Convert from decimal
  const handleDecimalChange = (value: string) => {
    setDecimal(value);
    
    if (value === "") {
      setBinary("");
      setHex("");
      return;
    }

    const num = parseInt(value);
    if (isNaN(num)) {
      setError("Please enter a valid decimal number");
      return;
    }

    try {
      setBinary(num.toString(2));
      setHex(num.toString(16).toUpperCase());
      setError(null);
    } catch (err) {
      setError("Conversion error: Number might be too large");
    }
  };

  // Convert from binary
  const handleBinaryChange = (value: string) => {
    setBinary(value);
    
    if (value === "") {
      setDecimal("");
      setHex("");
      return;
    }

    if (!/^[01]+$/.test(value)) {
      setError("Please enter a valid binary number (0s and 1s only)");
      return;
    }

    try {
      const num = parseInt(value, 2);
      setDecimal(num.toString());
      setHex(num.toString(16).toUpperCase());
      setError(null);
    } catch (err) {
      setError("Conversion error: Binary number might be too large");
    }
  };

  // Convert from hexadecimal
  const handleHexChange = (value: string) => {
    setHex(value.toUpperCase());
    
    if (value === "") {
      setDecimal("");
      setBinary("");
      return;
    }

    if (!/^[0-9A-Fa-f]+$/.test(value)) {
      setError("Please enter a valid hexadecimal number (0-9, A-F)");
      return;
    }

    try {
      const num = parseInt(value, 16);
      setDecimal(num.toString());
      setBinary(num.toString(2));
      setError(null);
    } catch (err) {
      setError("Conversion error: Hex number might be too large");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="animate-fade-in">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Number Conversion Tool</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="decimal">Decimal</TabsTrigger>
            <TabsTrigger value="binary">Binary</TabsTrigger>
            <TabsTrigger value="hexadecimal">Hexadecimal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="decimal" className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="decimal-input">Enter Decimal Number:</Label>
              <Input 
                id="decimal-input"
                type="text"
                value={decimal}
                onChange={(e) => handleDecimalChange(e.target.value)}
                placeholder="Example: 42"
                className="text-lg font-mono"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Binary</CardTitle>
                  <CardDescription>Base 2 representation</CardDescription>
                </CardHeader>
                <CardContent className="break-all font-mono bg-slate-50 dark:bg-slate-800 p-3 rounded">
                  {binary || "---"}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Hexadecimal</CardTitle>
                  <CardDescription>Base 16 representation</CardDescription>
                </CardHeader>
                <CardContent className="break-all font-mono bg-slate-50 dark:bg-slate-800 p-3 rounded">
                  {hex ? `0x${hex}` : "---"}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="binary" className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="binary-input">Enter Binary Number:</Label>
              <Input 
                id="binary-input"
                type="text"
                value={binary}
                onChange={(e) => handleBinaryChange(e.target.value)}
                placeholder="Example: 101010"
                className="text-lg font-mono"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Decimal</CardTitle>
                  <CardDescription>Base 10 representation</CardDescription>
                </CardHeader>
                <CardContent className="break-all font-mono bg-slate-50 dark:bg-slate-800 p-3 rounded">
                  {decimal || "---"}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Hexadecimal</CardTitle>
                  <CardDescription>Base 16 representation</CardDescription>
                </CardHeader>
                <CardContent className="break-all font-mono bg-slate-50 dark:bg-slate-800 p-3 rounded">
                  {hex ? `0x${hex}` : "---"}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="hexadecimal" className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="hex-input">Enter Hexadecimal Number:</Label>
              <div className="flex">
                <div className="bg-slate-100 dark:bg-slate-800 px-3 flex items-center rounded-l-md border border-r-0 border-input">
                  0x
                </div>
                <Input 
                  id="hex-input"
                  type="text"
                  value={hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="Example: 2A"
                  className="text-lg font-mono rounded-l-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Decimal</CardTitle>
                  <CardDescription>Base 10 representation</CardDescription>
                </CardHeader>
                <CardContent className="break-all font-mono bg-slate-50 dark:bg-slate-800 p-3 rounded">
                  {decimal || "---"}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Binary</CardTitle>
                  <CardDescription>Base 2 representation</CardDescription>
                </CardHeader>
                <CardContent className="break-all font-mono bg-slate-50 dark:bg-slate-800 p-3 rounded">
                  {binary || "---"}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-2">Number Systems in Computing</h3>
        <div className="space-y-4">
          <p>
            Different number systems are fundamental to computer architecture and organization. Here's why they're important:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Binary (Base 2)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Used for internal circuit representation</li>
                  <li>Only uses 0 and 1 (off and on states)</li>
                  <li>Every 8 bits forms a byte</li>
                  <li>Example: 1010 = 10 in decimal</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Decimal (Base 10)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Standard human-readable number system</li>
                  <li>Uses digits 0-9</li>
                  <li>Used in high-level programming</li>
                  <li>Example: 42 = 101010 in binary</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hexadecimal (Base 16)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Compact representation of binary values</li>
                  <li>Uses digits 0-9 and letters A-F</li>
                  <li>Used for memory addresses and color codes</li>
                  <li>Example: 0x1A = 26 in decimal</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
