
import React, { useState } from "react";
import { VirtualMemorySimulation } from "./VirtualMemorySimulation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function MemoryVirtualization() {
  const [activeTab, setActiveTab] = useState("simulation");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Virtual Memory</CardTitle>
          <CardDescription>
            Explore how virtual memory systems manage memory allocation and page replacement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simulation">Interactive Simulation</TabsTrigger>
              <TabsTrigger value="concepts">Key Concepts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simulation">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Experiment with different page replacement algorithms to see how they affect system performance.
                  Adjust parameters like frame count, page count, and reference string to see the effects on page faults.
                </p>
                <VirtualMemorySimulation />
              </div>
            </TabsContent>
            
            <TabsContent value="concepts">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What is Virtual Memory?</h3>
                  <p className="text-muted-foreground">
                    Virtual memory is a memory management technique that provides an "idealized abstraction of the storage resources 
                    that are actually available on a given machine" which "creates the illusion to users of a very large (main) memory."
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Key Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Programs can use more memory than physically available</li>
                        <li>Efficient memory utilization through on-demand loading</li>
                        <li>Memory protection between processes</li>
                        <li>Simplified memory management for developers</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Page Replacement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li><strong>FIFO</strong>: First-in, first-out replacement policy</li>
                        <li><strong>LRU</strong>: Least recently used pages are replaced</li>
                        <li><strong>OPT</strong>: Optimal algorithm (theoretical best-case)</li>
                        <li><strong>LFU</strong>: Least frequently used pages are replaced</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setActiveTab("simulation")}>
                  Try the Simulation
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
