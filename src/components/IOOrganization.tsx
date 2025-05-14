
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Cpu, HardDrive, Keyboard, Monitor, Server, Printer, Database, ChevronsRight, ChevronsLeft, Play, RotateCcw, ArrowLeft, Plug, PlugZap, Terminal } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

export function IOOrganization() {
  const [activeTab, setActiveTab] = useState("overview");
  const [ioTechnique, setIoTechnique] = useState("programmed");
  const [deviceBusy, setDeviceBusy] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [transferActive, setTransferActive] = useState(false);
  const [dmaTransferProgress, setDmaTransferProgress] = useState(0);
  const [dmaTransferActive, setDmaTransferActive] = useState(false);
  const [ioMappingType, setIoMappingType] = useState("isolated");
  const [deviceAddress, setDeviceAddress] = useState("0x3F8");
  const [memoryAddress, setMemoryAddress] = useState("0x5000");
  const [selectedInterface, setSelectedInterface] = useState("usb");
  const [selectedDevice, setSelectedDevice] = useState("keyboard");

  // Start programmed I/O simulation
  const startProgrammedIO = () => {
    setDeviceBusy(true);
    setTransferActive(true);
    setTransferProgress(0);
    
    const interval = setInterval(() => {
      setTransferProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDeviceBusy(false);
          setTransferActive(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Start DMA simulation
  const startDMATransfer = () => {
    setDeviceBusy(true);
    setDmaTransferActive(true);
    setDmaTransferProgress(0);
    
    const interval = setInterval(() => {
      setDmaTransferProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDeviceBusy(false);
          setDmaTransferActive(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Reset simulations
  const resetSimulations = () => {
    setDeviceBusy(false);
    setTransferActive(false);
    setTransferProgress(0);
    setDmaTransferActive(false);
    setDmaTransferProgress(0);
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-lg shadow-lg">
        <div className="flex items-center">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Server className="h-8 w-8" />
              Input/Output Organization
            </h2>
            <p className="text-blue-100 mt-1">
              Understanding how computers communicate with peripheral devices
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="techniques">I/O Techniques</TabsTrigger>
          <TabsTrigger value="mapping">I/O Mapping</TabsTrigger>
          <TabsTrigger value="interfaces">Interfaces & Devices</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What is I/O Organization?</CardTitle>
                <CardDescription>The foundation of computer-device communication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Input/Output (I/O) organization refers to how a computer system manages the flow of data between
                  the central processing unit (CPU) and peripheral devices. Without I/O capabilities, computers
                  would be isolated systems unable to receive input or produce output.
                </p>
                
                <div className="rounded-lg border bg-slate-50 dark:bg-slate-900 p-4">
                  <h3 className="font-semibold text-lg mb-2">Key Components</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Badge>I/O Modules</Badge>
                      <span>Interface between the computer and external devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge>I/O Controllers</Badge>
                      <span>Manage data transfer between peripherals and main memory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge>I/O Addresses</Badge>
                      <span>Unique identifiers for peripheral devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge>Buses</Badge>
                      <span>Communication pathways for data transfer</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>I/O System Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <AspectRatio ratio={16/9} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <div className="w-full h-full flex flex-col items-center">
                    <div className="text-center mb-4">
                      <h3 className="font-semibold">Computer System I/O Architecture</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Basic diagram of I/O organization</p>
                    </div>
                    
                    {/* Basic I/O Architecture Diagram */}
                    <div className="flex flex-col items-center w-full max-w-2xl">
                      {/* CPU and System Bus */}
                      <div className="flex gap-6 mb-8 w-full justify-center">
                        <div className="bg-blue-500 text-white p-4 rounded-lg flex items-center justify-center shadow-md min-w-32">
                          <Cpu className="mr-2" />
                          <span>CPU</span>
                        </div>
                        <div className="bg-amber-500 text-white p-4 rounded-lg flex items-center justify-center shadow-md min-w-32">
                          <Database className="mr-2" />
                          <span>Memory</span>
                        </div>
                      </div>
                      
                      {/* System Bus */}
                      <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8 relative">
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">System Bus</span>
                      </div>
                      
                      {/* I/O Controller */}
                      <div className="bg-green-500 text-white p-4 rounded-lg mb-8 w-1/2 text-center shadow-md">
                        <span className="font-medium">I/O Controllers</span>
                      </div>
                      
                      {/* I/O Devices */}
                      <div className="flex gap-4 justify-center flex-wrap">
                        <div className="bg-purple-500 text-white p-3 rounded-lg flex items-center shadow-md">
                          <Keyboard className="mr-2 h-4 w-4" />
                          <span className="text-sm">Keyboard</span>
                        </div>
                        <div className="bg-purple-500 text-white p-3 rounded-lg flex items-center shadow-md">
                          <Monitor className="mr-2 h-4 w-4" />
                          <span className="text-sm">Display</span>
                        </div>
                        <div className="bg-purple-500 text-white p-3 rounded-lg flex items-center shadow-md">
                          <HardDrive className="mr-2 h-4 w-4" />
                          <span className="text-sm">Disk</span>
                        </div>
                        <div className="bg-purple-500 text-white p-3 rounded-lg flex items-center shadow-md">
                          <Printer className="mr-2 h-4 w-4" />
                          <span className="text-sm">Printer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AspectRatio>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>I/O Performance Considerations</CardTitle>
              <CardDescription>Challenges and solutions in I/O operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">Challenges</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Speed mismatch between CPU and I/O devices</li>
                    <li>Different data formats and transfer rates</li>
                    <li>Protocol complexities</li>
                    <li>Resource contention</li>
                    <li>Error detection and correction</li>
                  </ul>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold text-lg mb-2 text-amber-600 dark:text-amber-400">Solutions</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Buffering to manage speed differences</li>
                    <li>Interrupts to handle asynchronous events</li>
                    <li>DMA for efficient data transfer</li>
                    <li>I/O processors for offloading tasks</li>
                    <li>Standardized interfaces</li>
                  </ul>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">Benefits</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Improved system throughput</li>
                    <li>Better CPU utilization</li>
                    <li>Enhanced user experience</li>
                    <li>Support for diverse peripherals</li>
                    <li>Reliability and error recovery</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* I/O Techniques Tab */}
        <TabsContent value="techniques" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>I/O Data Transfer Techniques</CardTitle>
                <CardDescription>Different methods for transferring data between CPU and peripherals</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={ioTechnique} 
                  onValueChange={setIoTechnique} 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    ioTechnique === "programmed" ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""
                  )}>
                    <RadioGroupItem value="programmed" id="programmed" className="mb-2" />
                    <Label htmlFor="programmed" className="font-semibold text-lg block mb-2">Programmed I/O</Label>
                    <p className="text-sm mb-2">CPU directly controls I/O operations and constantly checks device status</p>
                    <Badge className="bg-amber-500">CPU Intensive</Badge>
                  </div>
                  
                  <div className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    ioTechnique === "interrupt" ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""
                  )}>
                    <RadioGroupItem value="interrupt" id="interrupt" className="mb-2" />
                    <Label htmlFor="interrupt" className="font-semibold text-lg block mb-2">Interrupt-Driven I/O</Label>
                    <p className="text-sm mb-2">Devices signal the CPU when they need attention or complete a task</p>
                    <Badge className="bg-green-500">Efficient</Badge>
                  </div>
                  
                  <div className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    ioTechnique === "dma" ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""
                  )}>
                    <RadioGroupItem value="dma" id="dma" className="mb-2" />
                    <Label htmlFor="dma" className="font-semibold text-lg block mb-2">DMA (Direct Memory Access)</Label>
                    <p className="text-sm mb-2">External controller handles data transfer without CPU intervention</p>
                    <Badge className="bg-blue-500">Most Efficient</Badge>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Programmed I/O Simulation */}
            {ioTechnique === "programmed" && (
              <Card>
                <CardHeader>
                  <CardTitle>Programmed I/O Simulation</CardTitle>
                  <CardDescription>CPU continuously checks device status (polling)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center">
                    {/* Visual representation */}
                    <div className="w-full flex justify-between items-center mb-6">
                      <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
                        <Cpu className="h-10 w-10 mx-auto" />
                        <span className="block text-center mt-2">CPU</span>
                      </div>
                      
                      <div className="flex-1 mx-4 relative">
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full">
                          {transferActive && (
                            <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${transferProgress}%` }}
                            />
                          )}
                        </div>
                        <div className="flex justify-between mt-1">
                          <ArrowRight className={cn("h-4 w-4 transition-opacity", transferActive ? "opacity-100" : "opacity-30")} />
                          <ArrowLeft className={cn("h-4 w-4 transition-opacity", transferActive ? "opacity-100" : "opacity-30")} />
                        </div>
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Data Bus
                        </div>
                      </div>

                      <div className="bg-purple-600 text-white p-4 rounded-lg shadow">
                        <HardDrive className="h-10 w-10 mx-auto" />
                        <span className="block text-center mt-2">Device</span>
                        <Badge variant={deviceBusy ? "destructive" : "outline"} className="mt-2">
                          {deviceBusy ? "Busy" : "Ready"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="w-full max-w-md">
                      <div className="text-center mb-4">
                        <h4 className="font-medium">Status Check</h4>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <span>Polling:</span>
                          <Switch checked={transferActive} disabled />
                          <span>{transferActive ? "Active" : "Idle"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono">
                          {transferActive ? `CPU is busy: Transferring data (${transferProgress}%)` : "CPU is available for other tasks"}
                        </div>
                        <div className="flex gap-2 justify-center mt-4">
                          <Button onClick={startProgrammedIO} disabled={deviceBusy}>
                            <Play className="mr-2 h-4 w-4" />
                            Start Transfer
                          </Button>
                          <Button variant="outline" onClick={resetSimulations}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Programmed I/O Details</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>CPU executes I/O instructions and controls the entire process</li>
                      <li>Constantly checks device status (polling) which wastes CPU cycles</li>
                      <li>Simple to implement but inefficient for performance</li>
                      <li>CPU remains busy during the entire data transfer operation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Interrupt-Driven I/O */}
            {ioTechnique === "interrupt" && (
              <Card>
                <CardHeader>
                  <CardTitle>Interrupt-Driven I/O Simulation</CardTitle>
                  <CardDescription>Device interrupts CPU when ready or done</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center">
                    {/* Visual representation */}
                    <div className="w-full flex justify-between items-center mb-6">
                      <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
                        <Cpu className="h-10 w-10 mx-auto" />
                        <span className="block text-center mt-2">CPU</span>
                        <Badge variant="outline" className="mt-2">
                          {transferActive ? "Handling Interrupt" : "Doing Other Work"}
                        </Badge>
                      </div>

                      <div className="flex-1 mx-4 relative flex flex-col">
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full mb-2">
                          {transferActive && (
                            <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${transferProgress}%` }}
                            />
                          )}
                        </div>
                        <div className="text-center text-sm">Data Bus</div>
                        
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full mt-4">
                          {deviceBusy && transferActive && transferProgress > 95 && (
                            <div className="absolute h-2 bg-red-500 rounded-full transition-all duration-300 w-full" />
                          )}
                        </div>
                        <div className="text-center text-sm">Interrupt Line</div>
                        <div className="flex justify-center">
                          {deviceBusy && transferProgress > 95 && (
                            <ArrowLeft className="h-4 w-4 text-red-500 animate-pulse" />
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-purple-600 text-white p-4 rounded-lg shadow">
                        <HardDrive className="h-10 w-10 mx-auto" />
                        <span className="block text-center mt-2">Device</span>
                        <Badge variant={deviceBusy ? "destructive" : "outline"} className="mt-2">
                          {deviceBusy ? "Busy" : "Ready"}
                        </Badge>
                      </div>
                    </div>

                    <div className="w-full max-w-md">
                      <div className="text-center mb-4">
                        <h4 className="font-medium">CPU Status</h4>
                        <div className="text-sm">
                          {transferActive && transferProgress < 95
                            ? "CPU free to do other work while device processes"
                            : transferActive && transferProgress >= 95
                              ? "Device interrupts CPU: Transfer complete!"
                              : "CPU ready to initiate transfer"
                          }
                        </div>
                      </div>

                      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono mb-4">
                        {deviceBusy 
                          ? transferProgress >= 95 
                            ? "IRQ Received: Handling interrupt service routine" 
                            : "CPU executing other tasks while device works"
                          : "Waiting for I/O request"
                        }
                      </div>
                      
                      <div className="flex gap-2 justify-center">
                        <Button onClick={startProgrammedIO} disabled={deviceBusy}>
                          <Play className="mr-2 h-4 w-4" />
                          Start Transfer
                        </Button>
                        <Button variant="outline" onClick={resetSimulations}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Interrupt-Driven I/O Details</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>CPU initiates I/O operation and then continues with other tasks</li>
                      <li>Device signals CPU with an interrupt when ready or operation complete</li>
                      <li>CPU processes the interrupt using an Interrupt Service Routine (ISR)</li>
                      <li>More efficient than programmed I/O but still requires CPU for data transfer</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* DMA */}
            {ioTechnique === "dma" && (
              <Card>
                <CardHeader>
                  <CardTitle>Direct Memory Access (DMA) Simulation</CardTitle>
                  <CardDescription>External controller manages data transfer without CPU</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center">
                    {/* Visual representation */}
                    <div className="w-full flex justify-between items-center mb-6">
                      <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
                        <Cpu className="h-10 w-10 mx-auto" />
                        <span className="block text-center mt-2">CPU</span>
                        <Badge variant="outline" className="mt-2">
                          {dmaTransferActive ? "Doing Other Work" : "Available"}
                        </Badge>
                      </div>

                      <div className="bg-green-600 text-white p-4 rounded-lg shadow">
                        <Server className="h-10 w-10 mx-auto" />
                        <span className="block text-center mt-2">DMA Controller</span>
                        <Badge variant={dmaTransferActive ? "default" : "outline"} className="mt-2">
                          {dmaTransferActive ? "Active" : "Idle"}
                        </Badge>
                      </div>

                      <div className="bg-amber-600 text-white p-4 rounded-lg shadow">
                        <Database className="h-10 w-10 mx-auto" />
                        <span className="block text-center mt-2">Memory</span>
                      </div>
                      
                      <div className="bg-purple-600 text-white p-4 rounded-lg shadow">
                        <HardDrive className="h-10 w-10 mx-auto" />
                        <span className="block text-center mt-2">Device</span>
                        <Badge variant={deviceBusy ? "destructive" : "outline"} className="mt-2">
                          {deviceBusy ? "Busy" : "Ready"}
                        </Badge>
                      </div>
                    </div>

                    {/* DMA Visualization */}
                    <div className="w-full h-24 relative mb-4 border rounded-lg p-2 bg-slate-50 dark:bg-slate-900">
                      <div className="absolute top-2 left-2 text-xs font-medium">System Bus Activity</div>
                      
                      {/* Flow arrows */}
                      {dmaTransferActive && (
                        <>
                          {/* Device to Memory (DMA transfer) */}
                          <div 
                            className="absolute h-1 bg-green-500 transition-all duration-300 top-10"
                            style={{ 
                              left: '25%', 
                              width: `${dmaTransferProgress/2}%`,
                              maxWidth: '50%'
                            }}
                          />
                          <ArrowRight 
                            className="absolute h-3 w-3 text-green-500 transition-all duration-300 top-9"
                            style={{ 
                              left: `${25 + (dmaTransferProgress/2)}%`,
                              opacity: dmaTransferProgress > 0 ? 1 : 0,
                            }}
                          />
                        </>
                      )}

                      {/* End of Transfer Notification */}
                      {dmaTransferActive && dmaTransferProgress === 100 && (
                        <div className="absolute top-16 w-full text-center text-sm text-green-600 dark:text-green-400">
                          Transfer Complete - DMA signals CPU with interrupt
                        </div>
                      )}
                    </div>

                    <div className="w-full max-w-md">
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Transfer Progress: {dmaTransferProgress}%</span>
                        <span>
                          {dmaTransferActive 
                            ? "DMA controlling transfer" 
                            : "Ready"
                          }
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-4">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{width: `${dmaTransferProgress}%`}}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono">
                          {dmaTransferActive 
                            ? "CPU free for other tasks - DMA handling transfer" 
                            : "Waiting for DMA transfer request"
                          }
                        </div>
                        <div className="flex gap-2 justify-center mt-4">
                          <Button onClick={startDMATransfer} disabled={deviceBusy}>
                            <Play className="mr-2 h-4 w-4" />
                            Start DMA Transfer
                          </Button>
                          <Button variant="outline" onClick={resetSimulations}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">DMA Operation Details</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>CPU initializes DMA controller with transfer details (source, destination, length)</li>
                      <li>DMA controller takes over and manages the entire data transfer</li>
                      <li>CPU is free to perform other tasks during transfer</li>
                      <li>DMA uses cycle stealing to access system bus when needed</li>
                      <li>DMA signals CPU with an interrupt when transfer is complete</li>
                    </ol>
                    
                    <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-700 dark:text-green-300">Advantages</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm mt-1">
                        <li>Significantly reduces CPU overhead</li>
                        <li>Higher throughput for large data transfers</li>
                        <li>Better multitasking capabilities</li>
                        <li>Essential for high-speed devices like disk drives, network adapters</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Comparison of I/O Techniques</CardTitle>
                <CardDescription>Performance and efficiency considerations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Technique</TableHead>
                      <TableHead>CPU Usage</TableHead>
                      <TableHead>Throughput</TableHead>
                      <TableHead>Complexity</TableHead>
                      <TableHead>Best For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Programmed I/O</TableCell>
                      <TableCell>
                        <Badge variant="destructive">High</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Low</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Simple</Badge>
                      </TableCell>
                      <TableCell>Simple devices, debugging</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Interrupt-Driven I/O</TableCell>
                      <TableCell>
                        <Badge variant="default">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Moderate</Badge>
                      </TableCell>
                      <TableCell>Medium-speed devices, keyboards</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">DMA</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Low</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">High</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">Complex</Badge>
                      </TableCell>
                      <TableCell>High-speed devices, bulk transfers</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium text-center mb-2">CPU Utilization</h4>
                    <div className="flex items-end h-32 gap-4 justify-center">
                      <div className="w-8 bg-red-500 rounded-t-md" style={{ height: '90%' }}>
                        <div className="text-center text-xs mt-2 transform -rotate-90">Programmed</div>
                      </div>
                      <div className="w-8 bg-yellow-500 rounded-t-md" style={{ height: '50%' }}>
                        <div className="text-center text-xs mt-2 transform -rotate-90">Interrupt</div>
                      </div>
                      <div className="w-8 bg-green-500 rounded-t-md" style={{ height: '20%' }}>
                        <div className="text-center text-xs mt-2 transform -rotate-90">DMA</div>
                      </div>
                    </div>
                    <div className="text-center text-xs mt-1">CPU Usage %</div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium text-center mb-2">Transfer Speed</h4>
                    <div className="flex items-end h-32 gap-4 justify-center">
                      <div className="w-8 bg-red-500 rounded-t-md" style={{ height: '30%' }}>
                        <div className="text-center text-xs mt-2 transform -rotate-90">Programmed</div>
                      </div>
                      <div className="w-8 bg-yellow-500 rounded-t-md" style={{ height: '60%' }}>
                        <div className="text-center text-xs mt-2 transform -rotate-90">Interrupt</div>
                      </div>
                      <div className="w-8 bg-green-500 rounded-t-md" style={{ height: '90%' }}>
                        <div className="text-center text-xs mt-2 transform -rotate-90">DMA</div>
                      </div>
                    </div>
                    <div className="text-center text-xs mt-1">Transfer Speed</div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium text-center mb-2">Implementation Complexity</h4>
                    <div className="flex items-end h-32 gap-4 justify-center">
                      <div className="w-8 bg-green-500 rounded-t-md" style={{ height: '20%' }}>
                        <div className="text-center text-xs mt-2 transform -rotate-90">Programmed</div>
                      </div>
                      <div className="w-8 bg-yellow-500 rounded-t-md" style={{ height: '60%' }}>
                        <div className="text-center text-xs mt-2 transform -rotate-90">Interrupt</div>
                      </div>
                      <div className="w-8 bg-red-500 rounded-t-md" style={{ height: '90%' }}>
                        <div className="text-center text-xs mt-2 transform -rotate-90">DMA</div>
                      </div>
                    </div>
                    <div className="text-center text-xs mt-1">Complexity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* I/O Mapping Tab - NEW SECTION */}
        <TabsContent value="mapping" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>I/O Address Mapping</CardTitle>
                <CardDescription>How CPUs locate and communicate with I/O devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  I/O mapping refers to how the CPU addresses and accesses peripheral devices. 
                  Two primary methods exist: isolated I/O and memory-mapped I/O.
                </p>
                
                <RadioGroup 
                  value={ioMappingType} 
                  onValueChange={setIoMappingType} 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                >
                  <div className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    ioMappingType === "isolated" ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""
                  )}>
                    <RadioGroupItem value="isolated" id="isolated" className="mb-2" />
                    <Label htmlFor="isolated" className="font-semibold text-lg block mb-2">Isolated I/O</Label>
                    <p className="text-sm mb-2">Uses separate address spaces and special I/O instructions</p>
                    <Badge variant="outline">Port-Mapped I/O</Badge>
                  </div>
                  
                  <div className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    ioMappingType === "memory" ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""
                  )}>
                    <RadioGroupItem value="memory" id="memory" className="mb-2" />
                    <Label htmlFor="memory" className="font-semibold text-lg block mb-2">Memory-Mapped I/O</Label>
                    <p className="text-sm mb-2">Treats I/O devices as memory locations, using same address space</p>
                    <Badge variant="outline">Unified Addressing</Badge>
                  </div>
                </RadioGroup>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Address Configuration</h3>
                  {ioMappingType === "isolated" ? (
                    <div className="flex flex-col space-y-4">
                      <div>
                        <Label htmlFor="devicePort">Device Port Address</Label>
                        <div className="flex gap-2 items-center mt-1">
                          <Input 
                            id="devicePort"
                            value={deviceAddress}
                            onChange={(e) => setDeviceAddress(e.target.value)}
                            className="font-mono"
                          />
                          <Badge>I/O Space</Badge>
                        </div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                        <code className="text-sm block mb-2">// Accessing device using port I/O</code>
                        <code className="text-sm block">OUT {deviceAddress}, AL  <span className="text-green-600">// Write to device</span></code>
                        <code className="text-sm block">IN AL, {deviceAddress}   <span className="text-green-600">// Read from device</span></code>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <div>
                        <Label htmlFor="memoryAddr">Device Memory Address</Label>
                        <div className="flex gap-2 items-center mt-1">
                          <Input 
                            id="memoryAddr"
                            value={memoryAddress}
                            onChange={(e) => setMemoryAddress(e.target.value)}
                            className="font-mono"
                          />
                          <Badge>Memory Space</Badge>
                        </div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                        <code className="text-sm block mb-2">// Accessing device using memory-mapped I/O</code>
                        <code className="text-sm block">MOV [0x{memoryAddress.replace('0x', '')}], AL  <span className="text-green-600">// Write to device</span></code>
                        <code className="text-sm block">MOV AL, [0x{memoryAddress.replace('0x', '')}]  <span className="text-green-600">// Read from device</span></code>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>I/O Mapping Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-lg border p-4 relative">
                  {/* CPU */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-3 rounded-lg shadow-md w-32 text-center">
                    <Cpu className="h-6 w-6 mx-auto mb-1" />
                    <div className="font-medium">CPU</div>
                  </div>
                  
                  {/* Address Bus */}
                  <div className="absolute top-28 left-0 w-full h-3 bg-amber-400 rounded-full" />
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xs text-center">
                    Address Bus
                  </div>
                  
                  {/* Data Bus */}
                  <div className="absolute top-40 left-0 w-full h-3 bg-blue-400 rounded-full" />
                  <div className="absolute top-32 left-1/2 transform -translate-x-1/2 text-xs text-center">
                    Data Bus
                  </div>
                  
                  {/* Control Bus */}
                  <div className="absolute top-52 left-0 w-full h-3 bg-green-400 rounded-full" />
                  <div className="absolute top-44 left-1/2 transform -translate-x-1/2 text-xs text-center">
                    Control Bus
                  </div>
                  
                  {/* Memory */}
                  <div className="absolute bottom-6 left-1/4 transform -translate-x-1/2 bg-amber-600 text-white p-3 rounded-lg shadow-md w-32 text-center">
                    <Database className="h-6 w-6 mx-auto mb-1" />
                    <div className="font-medium">Memory</div>
                    <div className="text-xs mt-1">0x0000-0xFFFF</div>
                  </div>
                  
                  {/* I/O Ports */}
                  <div className={cn(
                    "absolute bottom-6 right-1/4 transform translate-x-1/2 text-white p-3 rounded-lg shadow-md w-32 text-center",
                    ioMappingType === "isolated" ? "bg-purple-600" : "bg-gray-400"
                  )}>
                    <Plug className="h-6 w-6 mx-auto mb-1" />
                    <div className="font-medium">I/O Ports</div>
                    <div className="text-xs mt-1">0x00-0xFF</div>
                  </div>
                  
                  {/* Memory-Mapped I/O */}
                  {ioMappingType === "memory" && (
                    <div className="absolute bottom-28 left-1/4 transform -translate-x-1/2 bg-green-600 text-white p-2 rounded shadow-md w-28 text-center">
                      <div className="text-xs">Memory-mapped devices</div>
                      <div className="text-xs mt-1">{memoryAddress}</div>
                    </div>
                  )}
                  
                  {/* Active connections */}
                  {ioMappingType === "isolated" ? (
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                      <line x1="50%" y1="22%" x2="25%" y2="28%" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4" />
                      <line x1="50%" y1="22%" x2="75%" y2="28%" stroke="#F59E0B" strokeWidth="2" />
                    </svg>
                  ) : (
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                      <line x1="50%" y1="22%" x2="25%" y2="28%" stroke="#F59E0B" strokeWidth="2" />
                      <line x1="25%" y1="56%" x2="25%" y2="82%" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4" />
                    </svg>
                  )}
                </div>
                
                <div className="mt-6 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border">
                  <h3 className="font-medium mb-2">{ioMappingType === "isolated" ? "Isolated I/O" : "Memory-Mapped I/O"} Characteristics:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {ioMappingType === "isolated" ? (
                      <>
                        <li>Separate address spaces for memory and I/O devices</li>
                        <li>Uses dedicated CPU instructions (IN/OUT) for I/O operations</li>
                        <li>I/O addresses are typically shorter (8 or 16 bits)</li>
                        <li>Provides better isolation between memory and devices</li>
                        <li>Common in x86 architectures</li>
                      </>
                    ) : (
                      <>
                        <li>Devices share the same address space as memory</li>
                        <li>Uses regular memory instructions (LOAD/STORE) for I/O operations</li>
                        <li>Allows for more flexible addressing modes</li>
                        <li>No need for special I/O instructions</li>
                        <li>Common in ARM, MIPS, and RISC architectures</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Address Decoding</CardTitle>
              <CardDescription>How the system identifies which device is being addressed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Address Decoding Process</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>CPU places address on address bus</li>
                    <li>Address decoder reads the address</li>
                    <li>Decoder determines which device is being accessed</li>
                    <li>Decoder activates the chip select line for the target device</li>
                    <li>Device responds to the read/write operation</li>
                  </ol>
                  
                  <div className="mt-4 bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Benefits of Proper Address Decoding</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Prevents conflicts between devices sharing address space</li>
                      <li>Enables efficient addressing of multiple devices</li>
                      <li>Provides address protection and security</li>
                      <li>Allows for flexible system configuration</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border p-4 h-full flex flex-col justify-center">
                    <div className="w-full flex flex-col items-center">
                      {/* Address Bus */}
                      <div className="w-3/4 h-6 bg-amber-400 flex items-center justify-center text-xs font-medium rounded-md mb-4">
                        Address Bus: {ioMappingType === "isolated" ? deviceAddress : memoryAddress}
                      </div>
                      
                      {/* Address Decoder */}
                      <div className="w-1/2 h-24 border-2 border-blue-600 rounded-lg flex items-center justify-center mb-4 bg-white dark:bg-slate-800">
                        <div className="text-center">
                          <div className="font-medium">Address Decoder</div>
                          <div className="text-xs mt-1">Decoding {ioMappingType === "isolated" ? "I/O Port" : "Memory Address"}</div>
                        </div>
                      </div>
                      
                      {/* Device Select Lines */}
                      <div className="w-full flex justify-center space-x-8 mb-4">
                        <div className="flex flex-col items-center">
                          <div className="h-10 w-1 bg-green-500" />
                          <div className="text-xs mt-1">Device 1 Select</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-10 w-1 bg-red-500" />
                          <div className="text-xs mt-1">Device 2 Select</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-10 w-1 bg-blue-500" />
                          <div className="text-xs mt-1">Device 3 Select</div>
                        </div>
                      </div>
                      
                      {/* Devices */}
                      <div className="w-full flex justify-around">
                        <div className="w-20 h-16 bg-purple-600 text-white rounded-lg flex items-center justify-center text-center">
                          <div>
                            <div className="text-xs font-medium">Device 1</div>
                            <div className="text-xs">0x3F8</div>
                          </div>
                        </div>
                        <div className="w-20 h-16 bg-purple-600 text-white rounded-lg flex items-center justify-center text-center">
                          <div>
                            <div className="text-xs font-medium">Device 2</div>
                            <div className="text-xs">0x2F8</div>
                          </div>
                        </div>
                        <div className="w-20 h-16 bg-purple-600 text-white rounded-lg flex items-center justify-center text-center">
                          <div>
                            <div className="text-xs font-medium">Device 3</div>
                            <div className="text-xs">0x378</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interfaces & Devices Tab - NEW SECTION */}
        <TabsContent value="interfaces" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>I/O Interfaces & Standards</CardTitle>
                <CardDescription>Standard ways of connecting peripheral devices to computers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  I/O interfaces standardize how devices connect to computer systems, defining 
                  electrical characteristics, data formats, protocols, and physical connectors.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <Button 
                    variant={selectedInterface === "usb" ? "default" : "outline"}
                    onClick={() => setSelectedInterface("usb")}
                    className="justify-start"
                  >
                    <Plug className="mr-2 h-4 w-4" />
                    USB
                  </Button>
                  <Button 
                    variant={selectedInterface === "sata" ? "default" : "outline"}
                    onClick={() => setSelectedInterface("sata")}
                    className="justify-start"
                  >
                    <HardDrive className="mr-2 h-4 w-4" />
                    SATA
                  </Button>
                  <Button 
                    variant={selectedInterface === "pcie" ? "default" : "outline"}
                    onClick={() => setSelectedInterface("pcie")}
                    className="justify-start"
                  >
                    <Server className="mr-2 h-4 w-4" />
                    PCIe
                  </Button>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border p-4 mt-4">
                  {selectedInterface === "usb" && (
                    <>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Plug className="mr-2 h-5 w-5" />
                        Universal Serial Bus (USB)
                      </h3>
                      <p className="text-sm mb-3">
                        A widely used interface for connecting peripherals to computers, offering
                        hot-swappable connections and power delivery.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm">Speeds</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs mt-1">
                            <li>USB 1.x: 12 Mbps (Full Speed)</li>
                            <li>USB 2.0: 480 Mbps (High Speed)</li>
                            <li>USB 3.0: 5 Gbps (SuperSpeed)</li>
                            <li>USB 3.1: 10 Gbps (SuperSpeed+)</li>
                            <li>USB 3.2: 20 Gbps</li>
                            <li>USB4: 40 Gbps</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Features</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs mt-1">
                            <li>Hot-pluggable</li>
                            <li>Power delivery (up to 100W)</li>
                            <li>Plug-and-play</li>
                            <li>Multiple device classes</li>
                            <li>Standardized connectors (Type-A, B, C)</li>
                            <li>Self-identifying devices</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedInterface === "sata" && (
                    <>
                      <h3 className="font-medium mb-2 flex items-center">
                        <HardDrive className="mr-2 h-5 w-5" />
                        Serial ATA (SATA)
                      </h3>
                      <p className="text-sm mb-3">
                        The standard interface for connecting storage devices in computers,
                        replacing the older Parallel ATA (PATA) interface.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm">Speeds</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs mt-1">
                            <li>SATA 1.0: 1.5 Gbps</li>
                            <li>SATA 2.0: 3 Gbps</li>
                            <li>SATA 3.0: 6 Gbps</li>
                            <li>SATA Express: Up to 16 Gbps</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Features</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs mt-1">
                            <li>Hot-pluggable (with OS support)</li>
                            <li>Thinner cables than PATA</li>
                            <li>Native Command Queuing (NCQ)</li>
                            <li>Power management features</li>
                            <li>Backward compatible</li>
                            <li>AHCI interface standard</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedInterface === "pcie" && (
                    <>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Server className="mr-2 h-5 w-5" />
                        PCI Express (PCIe)
                      </h3>
                      <p className="text-sm mb-3">
                        A high-speed serial computer expansion bus standard designed to replace
                        the older PCI, PCI-X, and AGP standards.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm">Speeds (per lane)</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs mt-1">
                            <li>PCIe 1.0: 250 MB/s</li>
                            <li>PCIe 2.0: 500 MB/s</li>
                            <li>PCIe 3.0: 985 MB/s</li>
                            <li>PCIe 4.0: 1.97 GB/s</li>
                            <li>PCIe 5.0: 3.94 GB/s</li>
                            <li>PCIe 6.0: 7.88 GB/s</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Features</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs mt-1">
                            <li>Point-to-point serial connection</li>
                            <li>Full-duplex communication</li>
                            <li>Multiple lane configurations (x1, x4, x8, x16)</li>
                            <li>Hot-plugging (with proper hardware)</li>
                            <li>DMA support</li>
                            <li>Power management</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>I/O Devices</CardTitle>
                <CardDescription>Different types of peripheral devices and their characteristics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Computer systems connect to a wide variety of I/O devices, each with different
                  speeds, data formats, and communication requirements.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  <Button 
                    variant={selectedDevice === "keyboard" ? "default" : "outline"}
                    onClick={() => setSelectedDevice("keyboard")}
                    className="justify-start"
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    Keyboard
                  </Button>
                  <Button 
                    variant={selectedDevice === "monitor" ? "default" : "outline"}
                    onClick={() => setSelectedDevice("monitor")}
                    className="justify-start"
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    Display
                  </Button>
                  <Button 
                    variant={selectedDevice === "storage" ? "default" : "outline"}
                    onClick={() => setSelectedDevice("storage")}
                    className="justify-start"
                  >
                    <HardDrive className="mr-2 h-4 w-4" />
                    Storage
                  </Button>
                  <Button 
                    variant={selectedDevice === "printer" ? "default" : "outline"}
                    onClick={() => setSelectedDevice("printer")}
                    className="justify-start"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Printer
                  </Button>
                  <Button 
                    variant={selectedDevice === "network" ? "default" : "outline"}
                    onClick={() => setSelectedDevice("network")}
                    className="justify-start"
                  >
                    <Terminal className="mr-2 h-4 w-4" />
                    Network
                  </Button>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border p-4 mt-4">
                  {selectedDevice === "keyboard" && (
                    <>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Keyboard className="mr-2 h-5 w-5" />
                        Keyboard
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Characteristics</h4>
                          <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                            <li>Human input device</li>
                            <li>Low data transfer rate</li>
                            <li>Interrupt-driven I/O</li>
                            <li>Buffer for keystrokes</li>
                            <li>Often uses USB or PS/2 interface</li>
                          </ul>
                          
                          <h4 className="text-sm font-medium mt-3">Data Format</h4>
                          <p className="text-xs mt-1">
                            Keyboards transmit scan codes representing key press/release events, 
                            which are then translated by software into character codes.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">I/O Process</h4>
                          <ol className="list-decimal list-inside text-xs space-y-1 mt-1">
                            <li>Key press generates scan code</li>
                            <li>Keyboard controller buffers the code</li>
                            <li>Controller generates interrupt</li>
                            <li>CPU executes keyboard ISR</li>
                            <li>ISR reads scan code from keyboard port</li>
                            <li>OS translates to character code</li>
                            <li>Character delivered to application</li>
                          </ol>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedDevice === "monitor" && (
                    <>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Monitor className="mr-2 h-5 w-5" />
                        Display
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Characteristics</h4>
                          <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                            <li>Output device</li>
                            <li>High data transfer rate</li>
                            <li>Uses graphics controller/GPU</li>
                            <li>Frame buffer in dedicated memory</li>
                            <li>Modern displays use HDMI, DisplayPort, or USB-C</li>
                          </ul>
                          
                          <h4 className="text-sm font-medium mt-3">Resolution Impact</h4>
                          <p className="text-xs mt-1">
                            Higher resolutions require more bandwidth. A 4K display at 60Hz with 
                            24-bit color requires about 12 Gbps of raw bandwidth.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">I/O Process</h4>
                          <ol className="list-decimal list-inside text-xs space-y-1 mt-1">
                            <li>CPU/GPU writes to frame buffer</li>
                            <li>Graphics controller reads frame buffer</li>
                            <li>Pixel data converted to video signal</li>
                            <li>Signal transmitted via display interface</li>
                            <li>Display receives and renders image</li>
                            <li>Process repeats (refresh rate)</li>
                          </ol>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedDevice === "storage" && (
                    <>
                      <h3 className="font-medium mb-2 flex items-center">
                        <HardDrive className="mr-2 h-5 w-5" />
                        Storage Devices
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Characteristics</h4>
                          <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                            <li>Persistent data storage</li>
                            <li>Block-oriented access</li>
                            <li>Variable data rates (HDD vs SSD)</li>
                            <li>Uses DMA for data transfer</li>
                            <li>Common interfaces: SATA, NVMe, USB</li>
                          </ul>
                          
                          <h4 className="text-sm font-medium mt-3">Comparison</h4>
                          <div className="text-xs mt-1">
                            <p><strong>HDD:</strong> ~200 MB/s, high latency, mechanical</p>
                            <p><strong>SSD:</strong> 500-7000 MB/s, low latency, electronic</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">I/O Process</h4>
                          <ol className="list-decimal list-inside text-xs space-y-1 mt-1">
                            <li>OS issues read/write command</li>
                            <li>Command translated to device-specific format</li>
                            <li>Controller accesses physical storage</li>
                            <li>DMA transfers data between device and memory</li>
                            <li>Controller signals completion with interrupt</li>
                            <li>OS processes data and notifies application</li>
                          </ol>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedDevice === "printer" && (
                    <>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Printer className="mr-2 h-5 w-5" />
                        Printer
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Characteristics</h4>
                          <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                            <li>Output device</li>
                            <li>Moderate data transfer rate</li>
                            <li>Buffered operation</li>
                            <li>Uses page description languages</li>
                            <li>Common interfaces: USB, Network (Ethernet/WiFi)</li>
                          </ul>
                          
                          <h4 className="text-sm font-medium mt-3">Data Format</h4>
                          <p className="text-xs mt-1">
                            Modern printers use PDLs like PostScript or PCL. The computer sends 
                            high-level commands that the printer interprets and renders.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">I/O Process</h4>
                          <ol className="list-decimal list-inside text-xs space-y-1 mt-1">
                            <li>Application creates print job</li>
                            <li>OS converts to printer commands</li>
                            <li>Data sent to printer via interface</li>
                            <li>Printer receives and buffers data</li>
                            <li>Printer processes and renders output</li>
                            <li>Status information sent back to computer</li>
                          </ol>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedDevice === "network" && (
                    <>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Terminal className="mr-2 h-5 w-5" />
                        Network Devices
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Characteristics</h4>
                          <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                            <li>Bidirectional I/O</li>
                            <li>Packet-based communication</li>
                            <li>Buffered operations</li>
                            <li>Interrupt-driven and DMA transfers</li>
                            <li>Common interfaces: PCIe, USB</li>
                          </ul>
                          
                          <h4 className="text-sm font-medium mt-3">Performance</h4>
                          <p className="text-xs mt-1">
                            Network speeds range from 100 Mbps (Fast Ethernet) to 
                            400 Gbps (400GBASE) depending on the technology.
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">I/O Process</h4>
                          <ol className="list-decimal list-inside text-xs space-y-1 mt-1">
                            <li>Network stack prepares packet</li>
                            <li>Driver copies packet to NIC buffer via DMA</li>
                            <li>NIC processes and transmits packet</li>
                            <li>For receiving, NIC buffers incoming packets</li>
                            <li>NIC generates interrupt when packet received</li>
                            <li>Driver reads packet via DMA to system memory</li>
                            <li>Network stack processes packet</li>
                          </ol>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Device Controllers</CardTitle>
              <CardDescription>The bridge between peripherals and the computer system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-4">
                    Device controllers are specialized hardware components that manage the communication 
                    and data transfer between the CPU and peripheral devices. They handle the low-level 
                    details of device operation, allowing the CPU to focus on other tasks.
                  </p>
                  
                  <h3 className="font-medium mb-2">Key Functions</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Interface translation between device and system bus</li>
                    <li>Data buffering to manage speed differences</li>
                    <li>Error detection and correction</li>
                    <li>Protocol handling specific to the device</li>
                    <li>Status reporting to the CPU</li>
                    <li>Command interpretation and execution</li>
                  </ul>
                  
                  <h3 className="font-medium mb-2 mt-4">Controller Components</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Data registers</strong> - Buffer for data transfer</li>
                    <li><strong>Status registers</strong> - Report device state</li>
                    <li><strong>Control registers</strong> - Accept commands from CPU</li>
                    <li><strong>Interface logic</strong> - For system bus connection</li>
                    <li><strong>Device interface</strong> - For peripheral connection</li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                  <h3 className="font-medium mb-3 text-center">Device Controller Architecture</h3>
                  <div className="w-full h-64 relative">
                    {/* System Bus Interface */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 bg-blue-500 text-white text-center py-2 rounded-lg">
                      System Bus Interface
                    </div>
                    
                    {/* Connection lines */}
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-400"></div>
                    
                    {/* Controller Internals */}
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-3/4 border-2 border-green-600 rounded-lg p-2 bg-white dark:bg-slate-800">
                      <div className="text-center font-medium mb-2">Controller Internals</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="border border-gray-300 p-1 rounded bg-gray-100 dark:bg-gray-700">Data Registers</div>
                        <div className="border border-gray-300 p-1 rounded bg-gray-100 dark:bg-gray-700">Status Registers</div>
                        <div className="border border-gray-300 p-1 rounded bg-gray-100 dark:bg-gray-700">Control Registers</div>
                        <div className="border border-gray-300 p-1 rounded bg-gray-100 dark:bg-gray-700">Buffer Memory</div>
                      </div>
                    </div>
                    
                    {/* Connection lines */}
                    <div className="absolute top-52 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-400"></div>
                    
                    {/* Device Interface */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 bg-purple-500 text-white text-center py-2 rounded-lg">
                      Device-Specific Interface
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium mb-1">Controller Execution Flow</h4>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>CPU writes command to control register</li>
                      <li>Controller interprets command</li>
                      <li>Controller communicates with device</li>
                      <li>Data transfer occurs (in either direction)</li>
                      <li>Controller updates status register</li>
                      <li>Controller may generate interrupt when done</li>
                      <li>CPU reads status and/or data registers</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
