
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumberSystemConverter } from "./NumberSystemConverter";
import { SignedNumberRepresentation } from "./SignedNumberRepresentation";
import { BinaryArithmeticOperations } from "./BinaryArithmeticOperations";
import { FloatingPointVisualization } from "./FloatingPointVisualization";

export function NumberSystems() {
  const [activeTab, setActiveTab] = useState("converter");
  
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Number Systems & Data Representation</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Explore number systems, conversions, and representations with interactive visualizations.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="converter">Number System Converter</TabsTrigger>
          <TabsTrigger value="signed">Signed Number Representation</TabsTrigger>
          <TabsTrigger value="arithmetic">Binary Arithmetic</TabsTrigger>
          <TabsTrigger value="floating">Floating Point</TabsTrigger>
        </TabsList>
        
        <TabsContent value="converter" className="min-h-[600px]">
          <NumberSystemConverter />
        </TabsContent>
        
        <TabsContent value="signed" className="min-h-[600px]">
          <SignedNumberRepresentation />
        </TabsContent>
        
        <TabsContent value="arithmetic" className="min-h-[600px]">
          <BinaryArithmeticOperations />
        </TabsContent>
        
        <TabsContent value="floating" className="min-h-[600px]">
          <FloatingPointVisualization />
        </TabsContent>
      </Tabs>
    </div>
  );
}
