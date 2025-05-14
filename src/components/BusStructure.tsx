import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Server,
  Bus,
  Timer,
  ArrowRight,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Info,
  Database,
  CircuitBoard,
  Cpu,
  HardDriveDownload
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function BusStructure() {
  const [tab, setTab] = useState("arbitration");
  const [arbitrationMethod, setArbitrationMethod] = useState("daisy");
  const [transferMode, setTransferMode] = useState("sync");

  const [activeDevice, setActiveDevice] = useState<number | null>(null);
  const [requestingDevices, setRequestingDevices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [simulationStep, setSimulationStep] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [signalStates, setSignalStates] = useState({
    clock: false,
    ready: false,
    acknowledge: false,
    data: false
  });
  const { toast } = useToast();

  const intervalRef = useRef<number>();
  const [busWidth, setBusWidth] = useState(32); // New state for bus width
  const [busTopology, setBusTopology] = useState("single"); // New state for bus topology

  // Clear any running intervals when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle simulation steps
  useEffect(() => {
    if (!isRunning) return;

    const speed = 1000 / simulationSpeed;

    if (tab === "arbitration") {
      intervalRef.current = window.setInterval(() => {
        runArbitrationStep();
      }, speed);
    } else if (tab === "datatransfer") {
      intervalRef.current = window.setInterval(() => {
        runTransferStep();
      }, speed);
    } else if (tab === "topology") {
      intervalRef.current = window.setInterval(() => {
        runTopologyStep();
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, simulationSpeed, tab, arbitrationMethod, transferMode, simulationStep, requestingDevices, busTopology]);

  // Reset simulation when changing tabs or methods
  useEffect(() => {
    resetSimulation();
  }, [tab, arbitrationMethod, transferMode, busTopology]);

  const toggleSimulation = () => {
    setIsRunning(prev => !prev);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setActiveDevice(null);
    setSimulationStep(0);
    setRequestingDevices([]);
    setExplanation("");
    setSignalStates({
      clock: false,
      ready: false,
      acknowledge: false,
      data: false
    });

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    // Generate random requesting devices
    if (tab === "arbitration") {
      const newRequests = [];
      for (let i = 1; i <= 4; i++) {
        if (Math.random() > 0.3) {
          newRequests.push(i);
        }
      }

      // Ensure at least one device is requesting
      if (newRequests.length === 0) {
        newRequests.push(Math.floor(Math.random() * 4) + 1);
      }

      setRequestingDevices(newRequests);
    }
  };

  // New function for topology simulation steps
  const runTopologyStep = () => {
    const step = simulationStep;

    if (busTopology === "single") {
      if (step === 0) {
        setExplanation("Data is being prepared for transmission on the single bus.");
        setActiveDevice(1);
        setSimulationStep(1);
      } else if (step === 1) {
        setExplanation("Device 1 is transmitting data to the bus. All connected devices receive it.");
        setActiveDevice(null);
        setSimulationStep(2);
      } else if (step === 2) {
        setExplanation("Only Device 3 (the intended recipient) processes the data. Others ignore it.");
        setActiveDevice(3);
        setSimulationStep(3);
      } else if (step === 3) {
        setExplanation("Data transfer complete. The bus is now available for the next transfer.");
        setActiveDevice(null);
        setSimulationStep(0);
      }
    } else if (busTopology === "multiple") {
      if (step === 0) {
        setExplanation("Data is being prepared on the address bus from CPU.");
        setActiveDevice(0);
        setSimulationStep(1);
      } else if (step === 1) {
        setExplanation("Address is transmitted on the address bus. All devices receive it.");
        setActiveDevice(null);
        setSimulationStep(2);
      } else if (step === 2) {
        setExplanation("Data is being transmitted on the data bus to/from memory.");
        setActiveDevice(2);
        setSimulationStep(3);
      } else if (step === 3) {
        setExplanation("Control signals coordinate the transfer on the control bus.");
        setActiveDevice(null);
        setSimulationStep(0);
      }
    } else { // hierarchical
      if (step === 0) {
        setExplanation("Request initiated from CPU to high-speed system bus.");
        setActiveDevice(0);
        setSimulationStep(1);
      } else if (step === 1) {
        setExplanation("System bus communicating with bus bridge.");
        setActiveDevice(null);
        setSimulationStep(2);
      } else if (step === 2) {
        setExplanation("Bus bridge translating protocol for peripheral bus.");
        setActiveDevice(5);
        setSimulationStep(3);
      } else if (step === 3) {
        setExplanation("Peripheral bus communicating with I/O device.");
        setActiveDevice(4);
        setSimulationStep(0);
      }
    }
  };

  const runArbitrationStep = () => {
    // Different behavior based on arbitration method
    if (arbitrationMethod === "daisy") {
      runDaisyChainStep();
    } else if (arbitrationMethod === "polling") {
      runPollingStep();
    } else {
      runIndependentRequestStep();
    }
  };

  const runDaisyChainStep = () => {
    const step = simulationStep;

    // Find the highest priority device (lowest number) that's requesting
    let grantedDevice = null;
    for (let i = 1; i <= 4; i++) {
      if (requestingDevices.includes(i)) {
        grantedDevice = i;
        break;
      }
    }

    // Simulation steps
    if (step === 0) {
      setExplanation("Multiple devices requesting the bus simultaneously. Bus arbiter will grant access based on daisy chain priority.");
      setSimulationStep(1);
    } else if (step === 1) {
      setActiveDevice(0); // Arbiter active
      setExplanation("Bus arbiter activates and sends bus grant signal to the first device in the chain.");
      setSimulationStep(2);
    } else if (step < 7) {
      // Propagate through the daisy chain
      const currentPos = step - 1;

      if (currentPos === grantedDevice) {
        setActiveDevice(currentPos);
        setExplanation(`Device ${currentPos} receives bus grant and needs the bus. It blocks the grant signal from propagating further.`);
      } else if (currentPos < grantedDevice) {
        setActiveDevice(currentPos);
        setExplanation(`Device ${currentPos} receives bus grant but doesn't need the bus. It passes the grant to the next device.`);
      }

      setSimulationStep(step + 1);
    } else if (step === 7) {
      setExplanation(`Device ${grantedDevice} has been granted access to the bus and is now transferring data.`);
      setSimulationStep(8);
    } else if (step === 8) {
      setExplanation(`Device ${grantedDevice} completes its data transfer and releases the bus.`);
      setSimulationStep(9);
    } else {
      // Reset to beginning
      resetSimulation();
      toast({
        title: "Simulation Completed",
        description: "Daisy chain bus arbitration cycle has completed."
      });
    }
  };

  const runPollingStep = () => {
    const step = simulationStep;
    const maxDevices = 4;

    // Determine which device gets the bus based on polling order
    let grantedDevice = null;
    for (let i = 1; i <= maxDevices; i++) {
      if (requestingDevices.includes(i)) {
        grantedDevice = i;
        break;
      }
    }

    if (step === 0) {
      setExplanation("Bus controller begins polling devices to check for bus requests.");
      setSimulationStep(1);
    } else if (step <= maxDevices) {
      const polledDevice = step;
      setActiveDevice(polledDevice);

      if (polledDevice === grantedDevice) {
        setExplanation(`Device ${polledDevice} is being polled and has an active request. Bus controller grants it access.`);
      } else {
        setExplanation(`Device ${polledDevice} is being polled but has no active request. Controller continues polling.`);
      }

      setSimulationStep(step + 1);
    } else if (step === maxDevices + 1) {
      setExplanation(`Device ${grantedDevice} has been granted access to the bus and is now transferring data.`);
      setSimulationStep(step + 1);
    } else if (step === maxDevices + 2) {
      setExplanation(`Device ${grantedDevice} completes its data transfer and releases the bus.`);
      setSimulationStep(step + 1);
    } else {
      // Reset to beginning
      resetSimulation();
      toast({
        title: "Simulation Completed",
        description: "Polling bus arbitration cycle has completed."
      });
    }
  };

  const runIndependentRequestStep = () => {
    const step = simulationStep;

    // In independent request, lowest number has highest priority
    let grantedDevice = null;
    for (let i = 1; i <= 4; i++) {
      if (requestingDevices.includes(i)) {
        grantedDevice = i;
        break;
      }
    }

    if (step === 0) {
      setExplanation("Multiple devices are asserting their request lines to the priority arbiter simultaneously.");
      setSimulationStep(1);
    } else if (step === 1) {
      setActiveDevice(0); // Arbiter active
      setExplanation("Priority arbiter is determining which device has the highest priority.");
      setSimulationStep(2);
    } else if (step === 2) {
      setActiveDevice(grantedDevice);
      setExplanation(`Priority arbiter grants the bus to Device ${grantedDevice}, which has the highest priority.`);
      setSimulationStep(3);
    } else if (step === 3) {
      setExplanation(`Device ${grantedDevice} is transferring data over the bus.`);
      setSimulationStep(4);
    } else if (step === 4) {
      setExplanation(`Device ${grantedDevice} completes its data transfer and releases the bus.`);
      setSimulationStep(5);
    } else {
      // Reset to beginning
      resetSimulation();
      toast({
        title: "Simulation Completed",
        description: "Independent request bus arbitration cycle has completed."
      });
    }
  };

  const runTransferStep = () => {
    if (transferMode === "sync") {
      runSynchronousTransferStep();
    } else {
      runAsynchronousTransferStep();
    }
  };

  const runSynchronousTransferStep = () => {
    const step = simulationStep;
    const newSignalStates = { ...signalStates };

    if (step === 0) {
      setExplanation("Synchronous transfer starts with the rising edge of the clock signal.");
      newSignalStates.clock = true;
      setSignalStates(newSignalStates);
      setSimulationStep(1);
    } else if (step === 1) {
      setExplanation("On the first clock cycle, the address is placed on the address bus.");
      newSignalStates.clock = false;
      setSignalStates(newSignalStates);
      setSimulationStep(2);
    } else if (step === 2) {
      setExplanation("On the next clock edge, the data is placed on the data bus.");
      newSignalStates.clock = true;
      newSignalStates.data = true;
      setSignalStates(newSignalStates);
      setSimulationStep(3);
    } else if (step === 3) {
      setExplanation("When the clock goes low, the receiver samples the data.");
      newSignalStates.clock = false;
      setSignalStates(newSignalStates);
      setSimulationStep(4);
    } else if (step === 4) {
      setExplanation("For the next data word, the address changes on the rising clock edge.");
      newSignalStates.clock = true;
      newSignalStates.data = false;
      setSignalStates(newSignalStates);
      setSimulationStep(5);
    } else if (step === 5) {
      setExplanation("The next data word is placed on the data bus.");
      newSignalStates.clock = false;
      newSignalStates.data = true;
      setSignalStates(newSignalStates);
      setSimulationStep(6);
    } else {
      // Reset signals and restart
      setSignalStates({
        clock: false,
        ready: false,
        acknowledge: false,
        data: false
      });
      setSimulationStep(0);
    }
  };

  const runAsynchronousTransferStep = () => {
    const step = simulationStep;
    const newSignalStates = { ...signalStates };

    if (step === 0) {
      setExplanation("Sender places the address on the address bus.");
      setSimulationStep(1);
    } else if (step === 1) {
      setExplanation("Sender asserts the READY signal to indicate valid address.");
      newSignalStates.ready = true;
      setSignalStates(newSignalStates);
      setSimulationStep(2);
    } else if (step === 2) {
      setExplanation("Receiver detects READY and begins processing the request.");
      setSimulationStep(3);
    } else if (step === 3) {
      setExplanation("Receiver places data on the data bus and asserts the ACKNOWLEDGE signal.");
      newSignalStates.acknowledge = true;
      newSignalStates.data = true;
      setSignalStates(newSignalStates);
      setSimulationStep(4);
    } else if (step === 4) {
      setExplanation("Sender detects ACKNOWLEDGE, reads the data, and de-asserts READY.");
      newSignalStates.ready = false;
      setSignalStates(newSignalStates);
      setSimulationStep(5);
    } else if (step === 5) {
      setExplanation("Receiver detects READY de-assertion and de-asserts ACKNOWLEDGE.");
      newSignalStates.acknowledge = false;
      newSignalStates.data = false;
      setSignalStates(newSignalStates);
      setSimulationStep(6);
    } else {
      // Reset signals and restart
      setSignalStates({
        clock: false,
        ready: false,
        acknowledge: false,
        data: false
      });
      setSimulationStep(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Bus Structure and Communication</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Buses are the communication pathways that connect different components within a computer system.
          Explore various bus architectures, arbitration techniques and data transfer methods with interactive simulations.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-6">
          <Button
            onClick={toggleSimulation}
            variant={isRunning ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isRunning ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
            {isRunning ? "Pause" : "Start"} Simulation
          </Button>

          <Button
            onClick={resetSimulation}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm">Speed:</span>
            <Slider
              value={[simulationSpeed]}
              min={0.5}
              max={3}
              step={0.5}
              onValueChange={(val) => setSimulationSpeed(val[0])}
              className="w-24 sm:w-32"
            />
            <span className="text-sm">{simulationSpeed}x</span>
          </div>
        </div>

        <Tabs defaultValue="arbitration" value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="arbitration">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <span>Bus Arbitration</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="datatransfer">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>Data Transfer</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="topology">
              <div className="flex items-center gap-2">
                <CircuitBoard className="h-4 w-4" />
                <span>Bus Topology</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="arbitration">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Bus Arbitration Techniques</span>
                  {isRunning && (
                    <Badge variant="outline" className="animate-pulse bg-tech-teal/20">
                      Simulating
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Compare different methods for resolving bus access conflicts when multiple devices need to use the bus.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant={arbitrationMethod === "daisy" ? "default" : "outline"}
                      onClick={() => setArbitrationMethod("daisy")}
                      className="flex items-center gap-2 justify-center"
                    >
                      <Server className="h-4 w-4" />
                      Daisy Chain
                    </Button>

                    <Button
                      variant={arbitrationMethod === "polling" ? "default" : "outline"}
                      onClick={() => setArbitrationMethod("polling")}
                      className="flex items-center gap-2 justify-center"
                    >
                      <Server className="h-4 w-4" />
                      Polling
                    </Button>

                    <Button
                      variant={arbitrationMethod === "independent" ? "default" : "outline"}
                      onClick={() => setArbitrationMethod("independent")}
                      className="flex items-center gap-2 justify-center"
                    >
                      <Server className="h-4 w-4" />
                      Independent Request
                    </Button>
                  </div>

                  <div className="relative w-full border-2 border-slate-300 rounded-lg p-4">
                    <div className="absolute top-0 left-0 bg-tech-teal text-white text-xs px-2 py-1 rounded-tl-md rounded-br-md">
                      {arbitrationMethod === "daisy" ? "Daisy Chain" :
                        arbitrationMethod === "polling" ? "Polling" :
                          "Independent Request"}
                    </div>

                    <div className="flex flex-col items-center pt-4">
                      <div className={`
                        w-full max-w-lg h-60 flex flex-col
                        ${arbitrationMethod === "daisy" ? 'justify-center' : 'justify-around'}
                      `}>
                        {arbitrationMethod === "daisy" && (
                          <>
                            <div className="flex justify-center mb-4">
                              <div className={`
                                bg-tech-blue text-white p-3 rounded-md w-32 text-center
                                ${activeDevice === 0 ? 'ring-2 ring-tech-teal animate-pulse' : ''}
                              `}>
                                <div className="font-semibold">Bus Arbiter</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-center">
                              <div className={`flex-1 h-1 ${activeDevice !== null && activeDevice < 1 ? "bg-tech-teal" : "bg-slate-300"} transition-colors`}></div>
                              <div className="text-xs text-slate-500 px-2">Bus Grant</div>
                              <div className={`flex-1 h-1 ${activeDevice !== null && activeDevice >= 1 ? "bg-tech-teal" : "bg-slate-300"} transition-colors`}></div>
                            </div>

                            <div className="flex justify-between mt-4">
                              {[1, 2, 3, 4].map(device => (
                                <div
                                  key={device}
                                  className={`
                                    bg-slate-100 dark:bg-slate-800 border border-slate-300 p-3 rounded-md text-center
                                    ${activeDevice === device ? 'ring-2 ring-tech-teal bg-slate-200 dark:bg-slate-700 animate-pulse' : ''}
                                    ${requestingDevices.includes(device) ? 'border-tech-teal' : ''}
                                    transition-all duration-300
                                  `}
                                >
                                  <div className="text-sm font-medium">Device {device}</div>
                                  <div className="text-xs mt-1">Priority: {device}</div>
                                  {requestingDevices.includes(device) && (
                                    <div className="mt-1">
                                      <Badge variant="outline" className="bg-tech-teal/20 text-[10px]">
                                        Requesting Bus
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {arbitrationMethod === "polling" && (
                          <>
                            <div className="flex items-center gap-4">
                              <div className={`
                                bg-tech-blue text-white p-3 rounded-md w-32 text-center
                                ${activeDevice === 0 ? 'ring-2 ring-tech-teal animate-pulse' : ''}
                              `}>
                                <div className="font-semibold">Bus Controller</div>
                              </div>

                              <div className="flex flex-col">
                                <div className="text-xs mb-1">Polling Sequence:</div>
                                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 rounded p-2 text-xs font-mono">
                                  <div className={activeDevice === 1 ? "bg-tech-teal/20 px-1" : ""}>
                                    <span className="text-green-600 dark:text-green-400">POLL</span> Device1_Request
                                  </div>
                                  <div className={activeDevice === 1 ? "bg-tech-teal/20 px-1" : ""}>
                                    <span className="text-green-600 dark:text-green-400">IF</span> Request = 1 <span className="text-green-600 dark:text-green-400">THEN GRANT</span> Bus
                                  </div>
                                  <div className={activeDevice === 2 ? "bg-tech-teal/20 px-1" : ""}>
                                    <span className="text-green-600 dark:text-green-400">POLL</span> Device2_Request
                                  </div>
                                  <div className={activeDevice === 2 ? "bg-tech-teal/20 px-1" : ""}>
                                    <span className="text-green-600 dark:text-green-400">IF</span> Request = 1 <span className="text-green-600 dark:text-green-400">THEN GRANT</span> Bus
                                  </div>
                                  <div><span className="text-green-600 dark:text-green-400">...</span></div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between mt-4">
                              {[1, 2, 3, 4].map(device => (
                                <div
                                  key={device}
                                  className={`
                                    bg-slate-100 dark:bg-slate-800 border border-slate-300 p-2 rounded-md text-center
                                    ${activeDevice === device ? 'ring-2 ring-tech-teal animate-pulse' : ''}
                                    transition-all duration-300
                                  `}
                                >
                                  <div className="text-sm font-medium">Device {device}</div>
                                  <div className="flex justify-center gap-2 items-center mt-2">
                                    <div className="text-xs">Request:</div>
                                    <div
                                      className={`w-4 h-4 border border-slate-400 rounded-sm ${requestingDevices.includes(device) ? "bg-tech-teal" : "bg-slate-200"
                                        }`}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {arbitrationMethod === "independent" && (
                          <>
                            <div className="flex items-center gap-4">
                              <div className={`
                                bg-tech-blue text-white p-3 rounded-md w-40 text-center
                                ${activeDevice === 0 ? 'ring-2 ring-tech-teal animate-pulse' : ''}
                              `}>
                                <div className="font-semibold">Priority Arbiter</div>
                              </div>

                              <div className="flex flex-col">
                                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 rounded p-2 w-64">
                                  <div className="text-xs mb-1 font-medium">Priority Encoder</div>
                                  <div className={`text-xs ${activeDevice === 1 ? "bg-tech-teal/20 px-1" : ""}`}>
                                    Device 1: Priority 0 (highest)
                                  </div>
                                  <div className={`text-xs ${activeDevice === 2 ? "bg-tech-teal/20 px-1" : ""}`}>
                                    Device 2: Priority 1
                                  </div>
                                  <div className={`text-xs ${activeDevice === 3 ? "bg-tech-teal/20 px-1" : ""}`}>
                                    Device 3: Priority 2
                                  </div>
                                  <div className={`text-xs ${activeDevice === 4 ? "bg-tech-teal/20 px-1" : ""}`}>
                                    Device 4: Priority 3 (lowest)
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between mt-4">
                              {[1, 2, 3, 4].map(device => (
                                <div
                                  key={device}
                                  className={`
                                    bg-slate-100 dark:bg-slate-800 border border-slate-300 p-2 rounded-md text-center
                                    ${activeDevice === device ? 'ring-2 ring-tech-teal animate-pulse' : ''}
                                    transition-all duration-300
                                  `}
                                >
                                  <div className="text-sm font-medium">Device {device}</div>
                                  <div className="flex flex-col gap-1 items-center mt-2">
                                    <div className="text-xs">Request Line</div>
                                    <div className={`w-full h-1 ${requestingDevices.includes(device) ? "bg-tech-teal" : "bg-slate-300"}`}></div>
                                    <div className="text-xs">Grant Line</div>
                                    <div className={`w-full h-1 ${activeDevice === device ? "bg-tech-teal" : "bg-slate-300"}`}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Explanation box */}
                  {explanation && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center mb-2">
                        <Info className="h-5 w-5 mr-2 text-tech-teal" />
                        <h3 className="font-medium">Simulation Status</h3>
                      </div>
                      <p className="text-sm">{explanation}</p>
                    </div>
                  )}

                  <div className="text-sm space-y-2">
                    <h4 className="font-medium text-base mb-2">
                      {arbitrationMethod === "daisy" ? "Daisy Chain" :
                        arbitrationMethod === "polling" ? "Polling" :
                          "Independent Request"} Arbitration
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-1">How It Works</h5>
                        {arbitrationMethod === "daisy" && (
                          <p className="text-xs">
                            In a daisy chain configuration, the bus grant signal is passed sequentially from one device to the next.
                            When a device needs the bus, it blocks the grant signal from passing to lower-priority devices.
                            This creates an inherent priority ordering based on device position in the chain.
                          </p>
                        )}
                        {arbitrationMethod === "polling" && (
                          <p className="text-xs">
                            In polling arbitration, the bus controller sequentially checks each device to see if it requests
                            bus access. The controller grants the bus to the first device it finds with an active request.
                            This creates a fixed priority system based on polling order.
                          </p>
                        )}
                        {arbitrationMethod === "independent" && (
                          <p className="text-xs">
                            With independent request arbitration, each device has its own dedicated request and grant lines.
                            When multiple devices request the bus simultaneously, a priority encoder determines which
                            device gets access based on predefined priority levels.
                          </p>
                        )}
                      </div>

                      <div>
                        <h5 className="font-medium mb-1">Advantages & Disadvantages</h5>
                        {arbitrationMethod === "daisy" && (
                          <ul className="list-disc list-inside text-xs space-y-1">
                            <li><span className="font-medium text-green-600 dark:text-green-400">Pro:</span> Simple hardware implementation</li>
                            <li><span className="font-medium text-green-600 dark:text-green-400">Pro:</span> Easy to add more devices</li>
                            <li><span className="font-medium text-red-600 dark:text-red-400">Con:</span> Fixed priority based on physical position</li>
                            <li><span className="font-medium text-red-600 dark:text-red-400">Con:</span> Lower-priority devices may face starvation</li>
                            <li><span className="font-medium text-red-600 dark:text-red-400">Con:</span> Propagation delay through the chain</li>
                          </ul>
                        )}
                        {arbitrationMethod === "polling" && (
                          <ul className="list-disc list-inside text-xs space-y-1">
                            <li><span className="font-medium text-green-600 dark:text-green-400">Pro:</span> No additional hardware per device</li>
                            <li><span className="font-medium text-green-600 dark:text-green-400">Pro:</span> Controller can implement different polling strategies</li>
                            <li><span className="font-medium text-red-600 dark:text-red-400">Con:</span> Time wasted polling devices that don't need the bus</li>
                            <li><span className="font-medium text-red-600 dark:text-red-400">Con:</span> Increased response time for bus requests</li>
                            <li><span className="font-medium text-red-600 dark:text-red-400">Con:</span> Complex controller logic</li>
                          </ul>
                        )}
                        {arbitrationMethod === "independent" && (
                          <ul className="list-disc list-inside text-xs space-y-1">
                            <li><span className="font-medium text-green-600 dark:text-green-400">Pro:</span> Fastest response time</li>
                            <li><span className="font-medium text-green-600 dark:text-green-400">Pro:</span> Flexible priority assignment</li>
                            <li><span className="font-medium text-green-600 dark:text-green-400">Pro:</span> Can implement dynamic priorities</li>
                            <li><span className="font-medium text-red-600 dark:text-red-400">Con:</span> Most complex hardware</li>
                            <li><span className="font-medium text-red-600 dark:text-red-400">Con:</span> Requires more signal lines (2 per device)</li>
                            <li><span className="font-medium text-red-600 dark:text-red-400">Con:</span> Limited by number of available lines</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datatransfer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Synchronous vs Asynchronous Data Transfer</span>
                  {isRunning && (
                    <Badge variant="outline" className="animate-pulse bg-tech-teal/20">
                      Simulating
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Compare timing-based synchronous transfers with handshaking-based asynchronous transfers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant={transferMode === "sync" ? "default" : "outline"}
                      onClick={() => setTransferMode("sync")}
                      className="flex items-center gap-2 justify-center"
                    >
                      <Timer className="h-4 w-4" />
                      Synchronous Transfer
                    </Button>

                    <Button
                      variant={transferMode === "async" ? "default" : "outline"}
                      onClick={() => setTransferMode("async")}
                      className="flex items-center gap-2 justify-center"
                    >
                      <Timer className="h-4 w-4" />
                      Asynchronous Transfer
                    </Button>
                  </div>

                  <div className="relative w-full border-2 border-slate-300 rounded-lg p-4">
                    <div className="absolute top-0 left-0 bg-tech-teal text-white text-xs px-2 py-1 rounded-tl-md rounded-br-md">
                      {transferMode === "sync" ? "Synchronous" : "Asynchronous"} Data Transfer
                    </div>

                    <div className="pt-4">
                      <div className="flex mb-4 items-center justify-between">
                        <h4 className="text-sm font-medium">Timing Diagram</h4>
                        <div className="text-sm">
                          Step: <span className="font-medium">{simulationStep}</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <div className="min-w-[500px]">
                          {transferMode === "sync" ? (
                            <div className="space-y-6">
                              <div className="flex">
                                <div className="w-24 font-medium">Clock</div>
                                <div className="flex-1">

                                  <svg viewBox="0 0 1800 40" height="40" width="100%" className="overflow-visible">
  <path
    d="
      M0,20 L100,20 L100,5 L200,5 L200,20 
      L300,20 L300,5 L400,5 L400,20 
      L500,20 L500,5 L600,5 L600,20 
      L700,20 L700,5 L800,5 L800,20 
      L900,20 L900,5 L1000,5 L1000,20 
      L1100,20 L1100,5 L1200,5 L1200,20 
      L1300,20 L1300,5 L1400,5 L1400,20 
      L1500,20 L1500,5 L1600,5 L1600,20 
      L1700,20
    "
    fill="none"
    stroke={signalStates.clock ? "rgb(20, 184, 166)" : "currentColor"}
    strokeWidth="4"
  />

  {/* Active step indicator */}
  <circle
    cx={300 * (simulationStep % 6)}  // 300 spacing to match new wave length
    cy={signalStates.clock ? 5 : 20}
    r="10"
    fill="rgb(226, 25, 25)"
    className={isRunning ? "animate-pulse" : ""}
  />
</svg>

                                </div>
                              </div>

                              <div className="flex">
  <div className="w-24 font-medium">Address</div>
  <div className="flex-1">
    <svg viewBox="0 0 1800 40" height="40" width="100%" className="overflow-visible">
      <path
        d="
          M0,20 L100,20 L100,5 L200,5 L200,20 
          L300,20 L300,5 L400,5 L400,20 
          L500,20 L500,5 L600,5 L600,20 
          L700,20 L700,5 L800,5 L800,20 
          L900,20 L900,5 L1000,5 L1000,20 
          L1100,20 L1100,5 L1200,5 L1200,20 
          L1300,20 L1300,5 L1400,5 L1400,20 
          L1500,20 L1500,5 L1600,5 L1600,20 
          L1700,20
        "
        fill="none"
        stroke={
          (simulationStep >= 1 && simulationStep <= 2) ||
          (simulationStep >= 4 && simulationStep <= 5)
            ? "rgb(20, 184, 166)"
            : "currentColor"
        }
        strokeWidth="2"
      />
    </svg>
  </div>
</div>

<div className="flex">
  <div className="w-24 font-medium">Data</div>
  <div className="flex-1">
    <svg viewBox="0 0 1800 40" height="40" width="100%" className="overflow-visible">
      <path
        d="
          M0,20 L100,20 L100,5 L200,5 L200,20 
          L300,20 L300,5 L400,5 L400,20 
          L500,20 L500,5 L600,5 L600,20 
          L700,20 L700,5 L800,5 L800,20 
          L900,20 L900,5 L1000,5 L1000,20 
          L1100,20 L1100,5 L1200,5 L1200,20 
          L1300,20 L1300,5 L1400,5 L1400,20 
          L1500,20 L1500,5 L1600,5 L1600,20 
          L1700,20
        "
        fill="none"
        stroke={signalStates.data ? "rgb(20, 184, 166)" : "currentColor"}
        strokeWidth="2"
      />
    </svg>
  </div>
</div>


                              <div className="flex mt-2 text-xs">
                                <div className="w-24"></div>
                                <div className="flex-1 flex justify-between px-8">
                                  <div className="w-6 text-center">
                                    <div className={`h-4 ${simulationStep === 0 ? "bg-tech-teal/20 font-medium rounded" : ""}`}>T0</div>
                                    <div className="h-4 border-l border-slate-300 mx-auto"></div>
                                  </div>
                                  <div className="w-6 text-center">
                                    <div className={`h-4 ${simulationStep === 1 ? "bg-tech-teal/20 font-medium rounded" : ""}`}>T1</div>
                                    <div className="h-4 border-l border-slate-300 mx-auto"></div>
                                  </div>
                                  <div className="w-6 text-center">
                                    <div className={`h-4 ${simulationStep === 2 ? "bg-tech-teal/20 font-medium rounded" : ""}`}>T2</div>
                                    <div className="h-4 border-l border-slate-300 mx-auto"></div>
                                  </div>
                                  <div className="w-6 text-center">
                                    <div className={`h-4 ${simulationStep === 3 ? "bg-tech-teal/20 font-medium rounded" : ""}`}>T3</div>
                                    <div className="h-4 border-l border-slate-300 mx-auto"></div>
                                  </div>
                                  <div className="w-6 text-center">
                                    <div className={`h-4 ${simulationStep === 4 ? "bg-tech-teal/20 font-medium rounded" : ""}`}>T4</div>
                                    <div className="h-4 border-l border-slate-300 mx-auto"></div>
                                  </div>
                                  <div className="w-6 text-center">
                                    <div className={`h-4 ${simulationStep === 5 ? "bg-tech-teal/20 font-medium rounded" : ""}`}>T5</div>
                                    <div className="h-4 border-l border-slate-300 mx-auto"></div>
                                  </div>
                                </div>
                              </div>

                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="flex">
                                <div className="w-24 font-medium">Ready</div>
                                <div className="flex-1">
                                  <svg height="40" width="100%" className="overflow-visible">
                                    <path
                                      d="M0,20 L20,20 L20,5 L60,5 L60,20 L100,20 L100,5 L140,5 L140,20 L180,20"
                                      fill="none"
                                      stroke={signalStates.ready ? "rgb(20, 184, 166)" : "currentColor"}
                                      strokeWidth="2"
                                    />

                                    {/* Active step indicator */}
                                    <circle
                                      cx={30 * (simulationStep % 6)}
                                      cy={signalStates.ready ? 5 : 20}
                                      r="5"
                                      fill="rgb(20, 184, 166)"
                                      className={isRunning ? "animate-pulse" : ""}
                                      opacity={simulationStep === 1 || simulationStep === 2 ? "1" : "0"}
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="flex">
                                <div className="w-24 font-medium">Address</div>
                                <div className="flex-1">
                                  <svg height="40" width="100%" className="overflow-visible">
                                    <path
                                      d="M0,20 L30,20 L30,5 L90,5 L90,20 L180,20"
                                      fill="none"
                                      stroke={simulationStep >= 1 ? "rgb(20, 184, 166)" : "currentColor"}
                                      strokeWidth="2"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="flex">
                                <div className="w-24 font-medium">Acknowledge</div>
                                <div className="flex-1">
                                  <svg height="40" width="100%" className="overflow-visible">
                                    <path
                                      d="M0,5 L40,5 L40,20 L70,20 L70,5 L110,5 L110,20 L150,20 L150,5 L180,5"
                                      fill="none"
                                      stroke={signalStates.acknowledge ? "rgb(20, 184, 166)" : "currentColor"}
                                      strokeWidth="2"
                                    />

                                    {/* Active step indicator */}
                                    <circle
                                      cx={30 * (simulationStep % 6)}
                                      cy={signalStates.acknowledge ? 5 : 20}
                                      r="5"
                                      fill="rgb(20, 184, 166)"
                                      className={isRunning ? "animate-pulse" : ""}
                                      opacity={simulationStep === 3 || simulationStep === 4 ? "1" : "0"}
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="flex">
                                <div className="w-24 font-medium">Data</div>
                                <div className="flex-1">
                                  <svg height="40" width="100%" className="overflow-visible">
                                    <path
                                      d="M0,20 L50,20 L50,5 L80,5 L80,20 L120,20 L120,5 L160,5 L160,20 L180,20"
                                      fill="none"
                                      stroke={signalStates.data ? "rgb(20, 184, 166)" : "currentColor"}
                                      strokeWidth="2"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="flex mt-2 text-xs">
                                <div className="w-24"></div>
                                <div className="flex-1 flex px-1">
                                  <div className="flex-1 text-center border-r border-dashed border-slate-300">
                                    <span className={simulationStep < 3 ? "text-tech-teal font-medium" : ""}>
                                      Request Phase
                                    </span>
                                  </div>
                                  <div className="flex-1 text-center">
                                    <span className={simulationStep >= 3 ? "text-tech-teal font-medium" : ""}>
                                      Acknowledge Phase
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Explanation box */}
                  {explanation && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center mb-2">
                        <Database className="h-5 w-5 mr-2 text-tech-teal" />
                        <h3 className="font-medium">Data Transfer Status</h3>
                      </div>
                      <p className="text-sm">{explanation}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded">
                          <Timer className="h-4 w-4" />
                        </div>
                        {transferMode === "sync" ? "Synchronous" : "Asynchronous"} Transfer Method
                      </h4>

                      <div className="text-xs space-y-3">
                        <div>
                          <p className="font-medium mb-1">Operation:</p>
                          {transferMode === "sync" ? (
                            <p>
                              Synchronous data transfers rely on a central clock signal to coordinate the timing of all operations.
                              All devices on the bus must operate at the same clock frequency, and data validity is determined by the clock edges.
                            </p>
                          ) : (
                            <p>
                              Asynchronous data transfers use handshaking signals (ready, acknowledge) rather than a clock to coordinate operations.
                              The sender initiates a transfer with a "ready" signal, and the receiver confirms receipt with an "acknowledge" signal.
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="font-medium mb-1">Timing Control:</p>
                          {transferMode === "sync" ? (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>All operations synchronized to a common clock</li>
                              <li>Address valid on rising/falling edge of clock</li>
                              <li>Data valid after a specified number of clock cycles</li>
                              <li>Fixed timing relationships between signals</li>
                            </ul>
                          ) : (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>No central clock to coordinate transfers</li>
                              <li>Each operation waits for completion acknowledgment</li>
                              <li>Variable time between operations based on device speed</li>
                              <li>Uses control signals to manage data flow</li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Advantages & Disadvantages</h4>

                      {transferMode === "sync" ? (
                        <div className="grid grid-cols-1 gap-3 text-xs">
                          <div>
                            <p className="font-medium text-green-600 dark:text-green-400 mb-1">Advantages:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>Simple interface and control logic</li>
                              <li>Higher potential throughput for matched devices</li>
                              <li>Predictable timing for system design</li>
                              <li>Less overhead per transaction</li>
                              <li>Well-suited for closely-coupled systems</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-medium text-red-600 dark:text-red-400 mb-1">Disadvantages:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>All devices must operate at the same speed</li>
                              <li>Clock skew problems at high frequencies</li>
                              <li>Limited by slowest device on the bus</li>
                              <li>More difficult to integrate devices of varying speeds</li>
                              <li>Clock distribution challenges across large systems</li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 text-xs">
                          <div>
                            <p className="font-medium text-green-600 dark:text-green-400 mb-1">Advantages:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>Devices can operate at different speeds</li>
                              <li>No need for a common clock</li>
                              <li>Self-timed operation adapts to actual device performance</li>
                              <li>Easier to interface diverse components</li>
                              <li>More robust across varying operating conditions</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-medium text-red-600 dark:text-red-400 mb-1">Disadvantages:</p>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>More complex control logic required</li>
                              <li>Higher overhead per transaction</li>
                              <li>Usually slower than synchronous transfers</li>
                              <li>Additional handshaking signals needed</li>
                              <li>Variable timing can complicate system analysis</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-blue-800 dark:text-blue-300">
                      Click "Start Simulation" to watch the data transfer process in action. You can adjust the speed using the slider.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="topology">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Bus Topology Types</span>
                  {isRunning && (
                    <Badge variant="outline" className="animate-pulse bg-tech-teal/20">
                      Simulating
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Compare different bus architectures and their organization in a computer system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant={busTopology === "single" ? "default" : "outline"}
                      onClick={() => setBusTopology("single")}
                      className="flex items-center gap-2 justify-center"
                    >
                      <Bus className="h-4 w-4" />
                      Single Bus
                    </Button>

                    <Button
                      variant={busTopology === "multiple" ? "default" : "outline"}
                      onClick={() => setBusTopology("multiple")}
                      className="flex items-center gap-2 justify-center"
                    >
                      <Bus className="h-4 w-4" />
                      Multiple Bus
                    </Button>

                    <Button
                      variant={busTopology === "hierarchical" ? "default" : "outline"}
                      onClick={() => setBusTopology("hierarchical")}
                      className="flex items-center gap-2 justify-center"
                    >
                      <Bus className="h-4 w-4" />
                      Hierarchical Bus
                    </Button>
                  </div>

                  <div className="relative w-full border-2 border-slate-300 rounded-lg p-4">
                    <div className="absolute top-0 left-0 bg-tech-teal text-white text-xs px-2 py-1 rounded-tl-md rounded-br-md">
                      {busTopology === "single" ? "Single" :
                        busTopology === "multiple" ? "Multiple" :
                          "Hierarchical"} Bus Architecture
                    </div>

                    <div className="flex flex-col items-center pt-6">
                      <div className="w-full max-w-lg h-64">
                        {busTopology === "single" && (
                          <div className="relative h-full flex flex-col items-center">
                            {/* Devices */}
                            <div className="flex w-full justify-between mb-10">
                              <div className={`
                      bg-slate-100 dark:bg-slate-800 border border-slate-300 p-3 rounded-md text-center w-24
                      ${activeDevice === 0 ? 'ring-2 ring-tech-teal bg-slate-200 dark:bg-slate-700 animate-pulse' : ''}
                    `}>
                                <div className="text-sm font-medium">CPU</div>
                              </div>

                              <div className={`
                      bg-slate-100 dark:bg-slate-800 border border-slate-300 p-3 rounded-md text-center w-24
                      ${activeDevice === 1 ? 'ring-2 ring-tech-teal bg-slate-200 dark:bg-slate-700 animate-pulse' : ''}
                    `}>
                                <div className="text-sm font-medium">Memory</div>
                              </div>

                              <div className={`
                      bg-slate-100 dark:bg-slate-800 border border-slate-300 p-3 rounded-md text-center w-24
                      ${activeDevice === 3 ? 'ring-2 ring-tech-teal bg-slate-200 dark:bg-slate-700 animate-pulse' : ''}
                    `}>
                                <div className="text-sm font-medium">I/O Device</div>
                              </div>
                            </div>

                            {/* Single Bus */}
                            <div className="relative w-full h-8 bg-tech-teal/20 border border-tech-teal rounded-md flex items-center justify-center">
                              <span className="text-xs font-medium">Shared System Bus ({busWidth}-bit)</span>

                              {/* Data packet animation */}
                              {(simulationStep === 1 || simulationStep === 2) && (
                                <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 bg-tech-teal text-white text-xs px-2 py-1 rounded animate-pulse">
                                  Data
                                </div>
                              )}
                            </div>

                            {/* Connection lines */}
                            <div className="absolute top-[52px] left-12 w-1 h-10 bg-slate-300"></div>
                            <div className="absolute top-[52px] left-1/2 transform -translate-x-1/2 w-1 h-10 bg-slate-300"></div>
                            <div className="absolute top-[52px] right-12 w-1 h-10 bg-slate-300"></div>

                            {/* Bus Controller */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                              <div className={`
                      bg-tech-blue text-white p-2 rounded-md text-center
                      ${activeDevice === 0 ? 'ring-2 ring-tech-teal animate-pulse' : ''}
                    `}>
                                <div className="text-xs font-medium">Bus Controller</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {busTopology === "multiple" && (
                          <div className="relative h-full flex flex-col">
                            {/* Devices */}
                            <div className="flex justify-center mb-6">
                              <div className={`
                      bg-slate-100 dark:bg-slate-800 border border-slate-300 p-3 rounded-md text-center w-32
                      ${activeDevice === 0 ? 'ring-2 ring-tech-teal bg-slate-200 dark:bg-slate-700 animate-pulse' : ''}
                    `}>
                                <div className="text-sm font-medium">CPU</div>
                              </div>
                            </div>

                            {/* Address Bus */}
                            <div className="w-full h-6 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-md flex items-center justify-center mb-4">
                              <span className="text-xs font-medium">Address Bus</span>

                              {/* Data packet animation */}
                              {simulationStep === 1 && (
                                <div className="absolute right-4 bg-blue-500 text-white text-xs px-2 py-0.5 rounded animate-pulse">
                                  Address
                                </div>
                              )}
                            </div>

                            {/* Data Bus */}
                            <div className="w-full h-6 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-md flex items-center justify-center mb-4">
                              <span className="text-xs font-medium">Data Bus</span>

                              {/* Data packet animation */}
                              {simulationStep === 2 && (
                                <div className="absolute right-4 bg-green-500 text-white text-xs px-2 py-0.5 rounded animate-pulse">
                                  Data
                                </div>
                              )}
                            </div>

                            {/* Control Bus */}
                            <div className="w-full h-6 bg-amber-100 dark:bg-amber-900 border border-amber-300 dark:border-amber-700 rounded-md flex items-center justify-center mb-6">
                              <span className="text-xs font-medium">Control Bus</span>

                              {/* Control signal animation */}
                              {simulationStep === 3 && (
                                <div className="absolute right-4 bg-amber-500 text-white text-xs px-2 py-0.5 rounded animate-pulse">
                                  Control
                                </div>
                              )}
                            </div>

                            {/* Memory and I/O Devices */}
                            <div className="flex justify-between">
                              <div className={`
                      bg-slate-100 dark:bg-slate-800 border border-slate-300 p-3 rounded-md text-center w-32
                      ${activeDevice === 2 ? 'ring-2 ring-tech-teal bg-slate-200 dark:bg-slate-700 animate-pulse' : ''}
                    `}>
                                <div className="text-sm font-medium">Memory</div>
                              </div>

                              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 p-3 rounded-md text-center w-32">
                                <div className="text-sm font-medium">I/O Devices</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {busTopology === "hierarchical" && (
                          <div className="relative h-full flex flex-col">
                            {/* CPU */}
                            <div className="flex justify-center mb-4">
                              <div className={`
                      bg-slate-100 dark:bg-slate-800 border border-slate-300 p-2 rounded-md text-center w-32
                      ${activeDevice === 0 ? 'ring-2 ring-tech-teal bg-slate-200 dark:bg-slate-700 animate-pulse' : ''}
                    `}>
                                <div className="text-sm font-medium">CPU</div>
                                <div className="text-xs text-slate-500">High Speed</div>
                              </div>
                            </div>

                            {/* System Bus */}
                            <div className="w-full h-6 bg-tech-teal/20 border border-tech-teal rounded-md flex items-center justify-center mb-6">
                              <span className="text-xs font-medium">System Bus (High Speed)</span>

                              {/* Data animation */}
                              {simulationStep === 1 && (
                                <div className="absolute right-1/4 bg-tech-teal text-white text-xs px-2 py-0.5 rounded animate-pulse">
                                  Request
                                </div>
                              )}
                            </div>

                            {/* Memory and Bridge */}
                            <div className="flex justify-around mb-6">
                              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 p-2 rounded-md text-center w-32">
                                <div className="text-sm font-medium">Memory</div>
                                <div className="text-xs text-slate-500">Cache/RAM</div>
                              </div>

                              <div className={`
                      bg-tech-blue text-white p-2 rounded-md text-center w-32
                      ${activeDevice === 5 ? 'ring-2 ring-tech-teal animate-pulse' : ''}
                    `}>
                                <div className="text-sm font-medium">Bus Bridge</div>
                                <div className="text-xs opacity-80">Protocol Converter</div>
                              </div>
                            </div>

                            {/* Peripheral Bus */}
                            <div className="w-full h-6 bg-purple-100 dark:bg-purple-900 border border-purple-300 dark:border-purple-700 rounded-md flex items-center justify-center mb-6">
                              <span className="text-xs font-medium">Peripheral Bus (Medium/Low Speed)</span>

                              {/* Data animation */}
                              {simulationStep === 3 && (
                                <div className="absolute right-1/4 bg-purple-500 text-white text-xs px-2 py-0.5 rounded animate-pulse">
                                  I/O Request
                                </div>
                              )}
                            </div>

                            {/* Peripheral Devices */}
                            <div className="flex justify-around">
                              <div className={`
                      bg-slate-100 dark:bg-slate-800 border border-slate-300 p-2 rounded-md text-center w-28
                      ${activeDevice === 4 ? 'ring-2 ring-tech-teal bg-slate-200 dark:bg-slate-700 animate-pulse' : ''}
                    `}>
                                <div className="text-sm font-medium">Disk</div>
                                <div className="text-xs text-slate-500">Storage</div>
                              </div>

                              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 p-2 rounded-md text-center w-28">
                                <div className="text-sm font-medium">Network</div>
                                <div className="text-xs text-slate-500">I/O</div>
                              </div>

                              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 p-2 rounded-md text-center w-28">
                                <div className="text-sm font-medium">USB</div>
                                <div className="text-xs text-slate-500">Peripheral</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Explanation box */}
                  {explanation && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center mb-2">
                        <CircuitBoard className="h-5 w-5 mr-2 text-tech-teal" />
                        <h3 className="font-medium">Bus Topology Status</h3>
                      </div>
                      <p className="text-sm">{explanation}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-1 rounded">
                          <Bus className="h-4 w-4" />
                        </div>
                        Bus Characteristics
                      </h4>

                      <div className="text-xs space-y-4">
                        <div>
                          <p className="font-medium mb-1">Bus Width:</p>
                          <div className="flex items-center gap-3">
                            <Slider
                              value={[busWidth]}
                              min={8}
                              max={128}
                              step={8}
                              onValueChange={(val) => setBusWidth(val[0])}
                              className="flex-1"
                            />
                            <span className="w-16 text-center">{busWidth} bits</span>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium mb-1">{busTopology === "single" ? "Single" : busTopology === "multiple" ? "Multiple" : "Hierarchical"} Bus Architecture:</p>
                          {busTopology === "single" && (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>One shared bus connects all system components</li>
                              <li>Simple design with lower cost</li>
                              <li>All devices share the same communication path</li>
                              <li>Bus contention can become a bottleneck</li>
                              <li>Common in simpler computer systems</li>
                            </ul>
                          )}
                          {busTopology === "multiple" && (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>Separate buses for address, data, and control signals</li>
                              <li>Allows simultaneous transmission of different signal types</li>
                              <li>Higher throughput than single bus systems</li>
                              <li>More complex design with additional routing</li>
                              <li>Classic von Neumann architecture implementation</li>
                            </ul>
                          )}
                          {busTopology === "hierarchical" && (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>Multiple buses with different speeds and widths</li>
                              <li>High-speed system bus for CPU and memory</li>
                              <li>Medium/low-speed peripheral buses for I/O devices</li>
                              <li>Bus bridges connect different bus types</li>
                              <li>Standard in modern computer architectures</li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Performance Characteristics</h4>

                      <div className="grid grid-cols-1 gap-3 text-xs">
                        <div>
                          <p className="font-medium text-green-600 dark:text-green-400 mb-1">Advantages:</p>
                          {busTopology === "single" && (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>Simple design and implementation</li>
                              <li>Lower cost with fewer components</li>
                              <li>Easier to understand and debug</li>
                              <li>Sufficient for basic computing tasks</li>
                              <li>Reduces complexity of device interfaces</li>
                            </ul>
                          )}
                          {busTopology === "multiple" && (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>Higher potential throughput</li>
                              <li>Parallel transfer of address and data</li>
                              <li>Dedicated control signals improve coordination</li>
                              <li>Reduces bottlenecks from shared paths</li>
                              <li>Better performance for memory-intensive operations</li>
                            </ul>
                          )}
                          {busTopology === "hierarchical" && (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>Optimized performance for different device types</li>
                              <li>Isolates high-speed and low-speed components</li>
                              <li>Scalable design for complex systems</li>
                              <li>Better overall system performance</li>
                              <li>Allows for future expansion</li>
                            </ul>
                          )}
                        </div>

                        <div>
                          <p className="font-medium text-red-600 dark:text-red-400 mb-1">Limitations:</p>
                          {busTopology === "single" && (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>Becomes a bottleneck at higher speeds</li>
                              <li>Limited by slowest device on the bus</li>
                              <li>All components compete for bus access</li>
                              <li>Lower maximum theoretical throughput</li>
                              <li>Not well-suited for high-performance systems</li>
                            </ul>
                          )}
                          {busTopology === "multiple" && (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>More complex design and implementation</li>
                              <li>Higher cost with additional signal paths</li>
                              <li>More complex arbitration required</li>
                              <li>Potential for timing issues between buses</li>
                              <li>Still limited by shared access to each bus</li>
                            </ul>
                          )}
                          {busTopology === "hierarchical" && (
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              <li>Most complex bus architecture</li>
                              <li>Bus bridge can become a bottleneck</li>
                              <li>Protocol translation overhead</li>
                              <li>Highest cost implementation</li>
                              <li>More complex to design and debug</li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-blue-800 dark:text-blue-300">
                      Real-world computer systems often use combinations of these bus architectures to balance performance, cost, and complexity.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
