
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Page {
  id: number;
  loaded: boolean;
  frameId: number | null;
  lastAccessed: number;
  referenceCount: number;
}

interface Frame {
  id: number;
  pageId: number | null;
  occupied: boolean;
  dirty: boolean;
  accessCount: number;
}

type PageReplacementAlgorithm = "fifo" | "lru" | "opt" | "lfu";

export function VirtualMemorySimulation() {
  // Virtual memory configuration
  const [pageCount, setPageCount] = useState(8);
  const [frameCount, setFrameCount] = useState(4);
  const [algorithm, setAlgorithm] = useState<PageReplacementAlgorithm>("lru");
  const [referenceString, setReferenceString] = useState("0,1,2,3,0,1,4,0,1,2,3,4");
  const [currentStep, setCurrentStep] = useState(-1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showDetails, setShowDetails] = useState(true);

  // State management
  const [pages, setPages] = useState<Page[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [pageFaults, setPageFaults] = useState(0);
  const [pageHits, setPageHits] = useState(0);
  const [accessSequence, setAccessSequence] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("simulation");

  // Initialize the virtual memory system
  useEffect(() => {
    initializeVirtualMemory();
  }, [pageCount, frameCount]);

  // Parse and set the reference string when it changes
  useEffect(() => {
    try {
      const sequence = referenceString
        .split(",")
        .map(item => parseInt(item.trim()))
        .filter(num => !isNaN(num) && num >= 0 && num < pageCount);
      
      setAccessSequence(sequence);
      resetSimulation();
    } catch (e) {
      console.error("Invalid reference string", e);
    }
  }, [referenceString, pageCount]);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (autoPlay && currentStep < accessSequence.length - 1) {
      interval = setInterval(() => {
        handleNextStep();
      }, 1000 / speed);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, currentStep, accessSequence, speed]);

  // Initialize virtual memory system
  const initializeVirtualMemory = () => {
    // Create pages
    const newPages: Page[] = Array.from({ length: pageCount }, (_, i) => ({
      id: i,
      loaded: false,
      frameId: null,
      lastAccessed: 0,
      referenceCount: 0
    }));

    // Create frames
    const newFrames: Frame[] = Array.from({ length: frameCount }, (_, i) => ({
      id: i,
      pageId: null,
      occupied: false,
      dirty: false,
      accessCount: 0
    }));

    setPages(newPages);
    setFrames(newFrames);
    resetSimulation();
  };

  // Reset the simulation to the beginning
  const resetSimulation = () => {
    setCurrentStep(-1);
    setPageFaults(0);
    setPageHits(0);
    setAutoPlay(false);
    
    // Reset pages
    setPages(prevPages => prevPages.map(page => ({
      ...page,
      loaded: false,
      frameId: null,
      lastAccessed: 0,
      referenceCount: 0
    })));
    
    // Reset frames
    setFrames(prevFrames => prevFrames.map(frame => ({
      ...frame,
      pageId: null,
      occupied: false,
      dirty: false,
      accessCount: 0
    })));
  };

  // Perform the next page access
  const handleNextStep = () => {
    if (currentStep >= accessSequence.length - 1) {
      setAutoPlay(false);
      return;
    }

    const nextStep = currentStep + 1;
    const pageId = accessSequence[nextStep];
    
    // Update the page access step
    setCurrentStep(nextStep);
    
    // Check if the page is already in memory
    const pageInMemory = pages.find(page => page.id === pageId && page.loaded);
    
    if (pageInMemory) {
      // Page hit
      setPageHits(prev => prev + 1);
      
      // Update page and frame information
      updatePageAccess(pageId);
    } else {
      // Page fault
      setPageFaults(prev => prev + 1);
      
      // Find a free frame or apply replacement algorithm
      const freeFrame = frames.find(frame => !frame.occupied);
      
      if (freeFrame) {
        // Load page into free frame
        loadPageIntoFrame(pageId, freeFrame.id);
      } else {
        // Apply replacement algorithm
        const frameToReplace = selectFrameForReplacement();
        if (frameToReplace !== null) {
          // Remove old page from frame
          const oldPageId = frames.find(frame => frame.id === frameToReplace)?.pageId;
          if (oldPageId !== null && oldPageId !== undefined) {
            unloadPageFromFrame(oldPageId);
          }
          
          // Load new page into frame
          loadPageIntoFrame(pageId, frameToReplace);
        }
      }
    }
  };

  // Update page access information
  const updatePageAccess = (pageId: number) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          lastAccessed: currentStep + 1,
          referenceCount: page.referenceCount + 1
        };
      }
      return page;
    }));
    
    // Also update the frame that contains this page
    setFrames(prevFrames => prevFrames.map(frame => {
      if (frame.pageId === pageId) {
        return {
          ...frame,
          accessCount: frame.accessCount + 1,
          dirty: Math.random() > 0.7 // Randomly mark some pages as dirty
        };
      }
      return frame;
    }));
  };

  // Load a page into a specific frame
  const loadPageIntoFrame = (pageId: number, frameId: number) => {
    // Update the page
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          loaded: true,
          frameId: frameId,
          lastAccessed: currentStep + 1,
          referenceCount: page.referenceCount + 1
        };
      }
      return page;
    }));
    
    // Update the frame
    setFrames(prevFrames => prevFrames.map(frame => {
      if (frame.id === frameId) {
        return {
          ...frame,
          pageId: pageId,
          occupied: true,
          accessCount: frame.accessCount + 1,
          dirty: false // New page is clean initially
        };
      }
      return frame;
    }));
  };

  // Unload a page from its frame
  const unloadPageFromFrame = (pageId: number) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          loaded: false,
          frameId: null
        };
      }
      return page;
    }));
  };

  // Select a frame for replacement based on the chosen algorithm
  const selectFrameForReplacement = (): number | null => {
    let frameToReplace: number | null = null;
    
    switch(algorithm) {
      case "fifo": {
        // Find the frame that was loaded first
        let oldestAccessTime = Infinity;
        
        frames.forEach(frame => {
          if (frame.occupied && frame.pageId !== null) {
            const page = pages.find(p => p.id === frame.pageId);
            if (page && page.lastAccessed < oldestAccessTime) {
              oldestAccessTime = page.lastAccessed;
              frameToReplace = frame.id;
            }
          }
        });
        break;
      }
      
      case "lru": {
        // Find the frame that was accessed least recently
        let leastRecentAccess = Infinity;
        
        frames.forEach(frame => {
          if (frame.occupied && frame.pageId !== null) {
            const page = pages.find(p => p.id === frame.pageId);
            if (page && page.lastAccessed < leastRecentAccess) {
              leastRecentAccess = page.lastAccessed;
              frameToReplace = frame.id;
            }
          }
        });
        break;
      }
      
      case "lfu": {
        // Find the frame that was accessed least frequently
        let leastFrequentCount = Infinity;
        
        frames.forEach(frame => {
          if (frame.occupied && frame.pageId !== null) {
            const page = pages.find(p => p.id === frame.pageId);
            if (page && page.referenceCount < leastFrequentCount) {
              leastFrequentCount = page.referenceCount;
              frameToReplace = frame.id;
            }
          }
        });
        break;
      }
      
      case "opt": {
        // Find the page that won't be used for the longest time in future
        let longestFutureUse = -1;
        
        frames.forEach(frame => {
          if (frame.occupied && frame.pageId !== null) {
            // Find next use of this page in the access sequence
            const futureSteps = accessSequence.slice(currentStep + 1);
            const nextUseIndex = futureSteps.indexOf(frame.pageId);
            
            // If page is never used again, replace it
            if (nextUseIndex === -1) {
              frameToReplace = frame.id;
              return; // Exit forEach early
            }
            
            // Otherwise find the one that will be used furthest in the future
            if (nextUseIndex > longestFutureUse) {
              longestFutureUse = nextUseIndex;
              frameToReplace = frame.id;
            }
          }
        });
        break;
      }
    }
    
    return frameToReplace;
  };

  // Get color based on frame status
  const getFrameColor = (frame: Frame) => {
    if (!frame.occupied) return "bg-slate-100 dark:bg-slate-800";
    if (frame.pageId === accessSequence[currentStep]) return "bg-green-100 dark:bg-green-900";
    if (frame.dirty) return "bg-amber-100 dark:bg-amber-900";
    return "bg-blue-100 dark:bg-blue-900";
  };

  // Get color for the reference string item
  const getReferenceItemColor = (index: number, value: number) => {
    if (index < currentStep) return "bg-slate-200 dark:bg-slate-700";
    if (index === currentStep) {
      const page = pages.find(p => p.id === value);
      return page?.loaded 
        ? "bg-green-200 dark:bg-green-800" 
        : "bg-red-200 dark:bg-red-800";
    }
    return "";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="concepts">Concepts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Simulation Tab */}
        <TabsContent value="simulation" className="space-y-6">
          {/* Control Panel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Virtual Memory Simulation</CardTitle>
              <CardDescription>
                Page Replacement Algorithm: <Badge className="ml-1">{algorithm.toUpperCase()}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="referenceString" className="mb-2 block">Page Reference String</Label>
                  <Input
                    id="referenceString"
                    value={referenceString}
                    onChange={(e) => setReferenceString(e.target.value)}
                    className="font-mono"
                    placeholder="0,1,2,3,0,1,4,0,1,2,3,4"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter page numbers separated by commas
                  </p>
                </div>
                
                <div className="flex-1 flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex gap-2 items-center">
                        <Badge variant="default">Step {currentStep + 1}/{accessSequence.length}</Badge>
                        <Badge variant="secondary">Page Faults: {pageFaults}</Badge>
                        <Badge variant="outline">Fault Rate: {
                          currentStep >= 0 ? ((pageFaults / (currentStep + 1)) * 100).toFixed(1) + "%" : "0%"
                        }</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="autoPlay" className="cursor-pointer">Auto</Label>
                      <Switch
                        id="autoPlay"
                        checked={autoPlay}
                        onCheckedChange={setAutoPlay}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <Label htmlFor="speed" className="w-12 text-sm">Speed</Label>
                    <Slider
                      id="speed"
                      min={0.5}
                      max={5}
                      step={0.5}
                      value={[speed]}
                      onValueChange={([val]) => setSpeed(val)}
                      className="w-full"
                    />
                    <span className="ml-2 text-sm w-8">{speed}x</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {accessSequence.map((pageId, index) => (
                  <div
                    key={index}
                    className={cn(
                      "border rounded-md px-2 py-1 min-w-8 text-center text-sm",
                      getReferenceItemColor(index, pageId)
                    )}
                  >
                    {pageId}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={resetSimulation}>
                  Reset
                </Button>
                <div className="space-x-2">
                  <Button
                    disabled={currentStep <= -1}
                    variant="outline"
                    onClick={() => {
                      setCurrentStep(Math.max(-1, currentStep - 1));
                      setAutoPlay(false);
                      initializeVirtualMemory(); // Need to reset and replay up to the previous step
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    disabled={currentStep >= accessSequence.length - 1}
                    onClick={handleNextStep}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Memory Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frames (Physical Memory) */}
            <Card>
              <CardHeader>
                <CardTitle>Physical Memory ({frameCount} Frames)</CardTitle>
                <CardDescription>Frame status and contents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {frames.map((frame) => (
                    <div
                      key={frame.id}
                      className={cn(
                        "border rounded-lg p-3",
                        getFrameColor(frame)
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Frame {frame.id}</div>
                        {frame.occupied && frame.dirty && (
                          <Badge variant="outline" className="text-amber-600 dark:text-amber-400">
                            Dirty
                          </Badge>
                        )}
                      </div>
                      
                      {frame.occupied && frame.pageId !== null ? (
                        <div className="mt-1 flex items-center">
                          <div className="text-lg font-bold">Page {frame.pageId}</div>
                          {frame.pageId === accessSequence[currentStep] && (
                            <Badge variant="secondary" className="ml-2">
                              Current
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="mt-1 text-muted-foreground italic">
                          Empty
                        </div>
                      )}
                      
                      {showDetails && frame.occupied && (
                        <div className="text-xs text-muted-foreground mt-1 grid grid-cols-2 gap-1">
                          <div>Accesses: {frame.accessCount}</div>
                          {frame.pageId !== null && (
                            <div>Last: {pages.find(p => p.id === frame.pageId)?.lastAccessed || 0}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Pages (Virtual Memory) */}
            <Card>
              <CardHeader>
                <CardTitle>Virtual Memory ({pageCount} Pages)</CardTitle>
                <CardDescription>Page status and allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className={cn(
                        "border rounded-lg p-3",
                        page.loaded ? "bg-blue-50 dark:bg-blue-950" : "bg-slate-50 dark:bg-slate-900",
                        page.id === accessSequence[currentStep] && "ring-2 ring-offset-1 ring-blue-500"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Page {page.id}</div>
                        {page.loaded ? (
                          <Badge>In Memory</Badge>
                        ) : (
                          <Badge variant="outline">Not Loaded</Badge>
                        )}
                      </div>
                      
                      <div className="mt-1">
                        {page.loaded && page.frameId !== null ? (
                          <div className="text-sm">Loaded in Frame {page.frameId}</div>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">
                            In swap space
                          </div>
                        )}
                      </div>
                      
                      {showDetails && (
                        <div className="text-xs text-muted-foreground mt-1 grid grid-cols-2 gap-1">
                          <div>References: {page.referenceCount}</div>
                          <div>Last: {page.lastAccessed || "N/A"}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Access Log and Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Page Access Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Step</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Frame</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessSequence.slice(0, currentStep + 1).map((pageId, index) => {
                    const page = pages.find(p => p.id === pageId);
                    const wasHit = index > 0 && accessSequence.slice(0, index).includes(pageId);
                    return (
                      <TableRow key={index} className={cn({
                        "bg-green-50 dark:bg-green-950": wasHit,
                        "bg-red-50 dark:bg-red-950": !wasHit,
                      })}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{pageId}</TableCell>
                        <TableCell>
                          <Badge variant={wasHit ? "secondary" : "destructive"}>
                            {wasHit ? "Hit" : "Fault"}
                          </Badge>
                        </TableCell>
                        <TableCell>{page?.frameId !== null ? page?.frameId : '—'}</TableCell>
                        <TableCell>
                          {wasHit ? "Access" : "Load into memory"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {currentStep === -1 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Start the simulation to see results
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Concepts Tab */}
        <TabsContent value="concepts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Memory Concepts</CardTitle>
              <CardDescription>
                Understanding the fundamental concepts of virtual memory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is Virtual Memory?</h3>
                <p className="mb-2">
                  Virtual memory is a memory management technique that provides an "idealized abstraction of the storage resources 
                  that are actually available on a given machine" which "creates the illusion to users of a very large (main) memory."
                </p>
                <p>
                  It allows programs to be designed as if they have a contiguous working memory (address space), 
                  while in reality, physical memory may be fragmented and may even overflow onto disk storage.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Key Components</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Pages</strong>: Fixed-size blocks of virtual memory</li>
                    <li><strong>Frames</strong>: Fixed-size blocks of physical memory</li>
                    <li><strong>Page Table</strong>: Maps virtual pages to physical frames</li>
                    <li><strong>MMU</strong>: Hardware unit that translates virtual to physical addresses</li>
                    <li><strong>Page Fault</strong>: Occurs when a needed page is not in physical memory</li>
                    <li><strong>Swap Space</strong>: Disk storage used as an extension of physical memory</li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Benefits of Virtual Memory</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Larger Address Space</strong>: Programs can use more memory than physically available</li>
                    <li><strong>Memory Isolation</strong>: Each process has its own virtual address space</li>
                    <li><strong>Memory Protection</strong>: Hardware-enforced boundaries between processes</li>
                    <li><strong>Memory Sharing</strong>: Multiple processes can share physical memory</li>
                    <li><strong>Efficient Memory Utilization</strong>: Only needed parts of programs are loaded</li>
                    <li><strong>Reduced Fragmentation</strong>: Non-contiguous physical allocation is possible</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Page Replacement Algorithms</h3>
                <p className="mb-4">
                  When a page fault occurs and all frames are occupied, the system must choose which page to evict.
                  Different algorithms use different strategies to make this decision:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">FIFO (First-In-First-Out)</h4>
                    <p className="text-sm mb-2">
                      Replaces the page that has been in memory for the longest time.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p><strong>Advantages</strong>: Simple to implement</p>
                      <p><strong>Disadvantages</strong>: May remove frequently used pages</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">LRU (Least Recently Used)</h4>
                    <p className="text-sm mb-2">
                      Replaces the page that has not been accessed for the longest time.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p><strong>Advantages</strong>: Works well with temporal locality</p>
                      <p><strong>Disadvantages</strong>: Requires tracking access time</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">OPT (Optimal)</h4>
                    <p className="text-sm mb-2">
                      Replaces the page that will not be used for the longest time in future.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p><strong>Advantages</strong>: Lowest possible fault rate</p>
                      <p><strong>Disadvantages</strong>: Requires future knowledge (not implementable in real systems)</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">LFU (Least Frequently Used)</h4>
                    <p className="text-sm mb-2">
                      Replaces the page that has been used least frequently.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p><strong>Advantages</strong>: Works well for stable access patterns</p>
                      <p><strong>Disadvantages</strong>: May retain old but frequently accessed pages</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Common Issues</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Thrashing</h4>
                    <p className="text-sm">
                      Occurs when the system spends more time handling page faults than executing instructions,
                      usually due to insufficient physical memory for the working set of active pages.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Belady's Anomaly</h4>
                    <p className="text-sm">
                      A phenomenon where increasing the number of page frames may result in more page faults
                      for some page replacement algorithms (like FIFO).
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Translation Overhead</h4>
                    <p className="text-sm">
                      Virtual memory introduces overhead from translating virtual addresses to physical addresses,
                      which is mitigated using a Translation Lookaside Buffer (TLB).
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Settings</CardTitle>
              <CardDescription>
                Configure the virtual memory simulation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="pageCount" className="mb-2 block">Number of Pages</Label>
                  <Select value={pageCount.toString()} onValueChange={(val) => setPageCount(parseInt(val))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select page count" />
                    </SelectTrigger>
                    <SelectContent>
                      {[4, 8, 12, 16].map((count) => (
                        <SelectItem key={count} value={count.toString()}>
                          {count} Pages
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total number of pages in virtual memory
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="frameCount" className="mb-2 block">Number of Frames</Label>
                  <Select value={frameCount.toString()} onValueChange={(val) => setFrameCount(parseInt(val))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frame count" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 6, 8].map((count) => (
                        <SelectItem key={count} value={count.toString()}>
                          {count} Frames
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Available physical memory frames
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="algorithm" className="mb-2 block">Page Replacement Algorithm</Label>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant={algorithm === "fifo" ? "default" : "outline"}
                    className="justify-center"
                    onClick={() => setAlgorithm("fifo")}
                  >
                    FIFO
                  </Button>
                  <Button
                    variant={algorithm === "lru" ? "default" : "outline"}
                    className="justify-center"
                    onClick={() => setAlgorithm("lru")}
                  >
                    LRU
                  </Button>
                  <Button
                    variant={algorithm === "opt" ? "default" : "outline"}
                    className="justify-center"
                    onClick={() => setAlgorithm("opt")}
                  >
                    Optimal
                  </Button>
                  <Button
                    variant={algorithm === "lfu" ? "default" : "outline"}
                    className="justify-center"
                    onClick={() => setAlgorithm("lfu")}
                  >
                    LFU
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Algorithm used to select which page to replace when a page fault occurs
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showDetails"
                  checked={showDetails}
                  onCheckedChange={setShowDetails}
                />
                <Label htmlFor="showDetails">Show detailed page/frame information</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="presetSequences" className="mb-2 block">Preset Reference Strings</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setReferenceString("0,1,2,3,0,1,4,0,1,2,3,4")}
                  >
                    Standard Sequence
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setReferenceString("0,1,2,0,1,3,0,1,2,3")}
                  >
                    Locality Sequence
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setReferenceString("1,2,3,4,1,2,5,1,2,3,4,5")}
                  >
                    Belady's Anomaly Example
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Generate random sequence
                      const rand = Array.from({ length: 15 }, () => 
                        Math.floor(Math.random() * pageCount)
                      ).join(',');
                      setReferenceString(rand);
                    }}
                  >
                    Random Sequence
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={resetSimulation} 
                  className="w-full sm:w-auto"
                >
                  Apply Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
