
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemoryVirtualization } from "./MemoryVirtualization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function MemoryOrganization() {
  const [activeTab, setActiveTab] = useState("virtualization");
  useEffect(() => {
    // Show tooltips on hover
    function setupTooltip(containerId: string, tooltipId: string) {
      const container = document.getElementById(containerId);
      const tooltip = document.getElementById(tooltipId);

      if (container && tooltip) {
        container.addEventListener('mouseenter', function() {
          tooltip.style.display = 'block';
          tooltip.style.top = (container.offsetTop + container.offsetHeight) + 'px';
          tooltip.style.left = (container.offsetLeft + container.offsetWidth/2 - tooltip.offsetWidth/2) + 'px';
        });

        container.addEventListener('mouseleave', function() {
          tooltip.style.display = 'none';
        });
      }
    }

    // Setup tooltips for each memory level
    setupTooltip('registers-container', 'registers-tooltip');
    setupTooltip('l1-container', 'cache-tooltip');
    setupTooltip('l2-container', 'cache-tooltip');
    setupTooltip('l3-container', 'cache-tooltip');
    setupTooltip('ram-container', 'ram-tooltip');
    setupTooltip('virtual-container', 'virtual-tooltip');

    // Simulate memory access animation
    let currentStep = 0;
    const memoryLevels = [
      'registers-container',
      'l1-container',
      'l2-container',
      'l3-container',
      'ram-container',
      'virtual-container',
      'storage-container',
      'tertiary-container'
    ];

    function pulseMemoryLevel(index: number) {
      if (index < memoryLevels.length) {
        const element = document.getElementById(memoryLevels[index]);
        if (element) {
          element.classList.add('animate-pulse');
          setTimeout(() => {
            element.classList.remove('animate-pulse');
          }, 1000);
        }
      }
    }

    // Animate memory access pattern every 3 seconds
    const intervalId = setInterval(() => {
      pulseMemoryLevel(currentStep);
      currentStep = (currentStep + 1) % memoryLevels.length;
    }, 3000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); 
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Memory Organization</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Explore memory hierarchy, caching, and virtual memory concepts through interactive simulations.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="self-start md:self-auto">
          <a 
            href="https://www.decodecoa.com/memory-organization" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            Learn More <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="virtualization">Virtual Memory</TabsTrigger>
          <TabsTrigger value="hierarchy">Memory Hierarchy</TabsTrigger>
          <TabsTrigger value="cache">Cache Design</TabsTrigger>
        </TabsList>
        
        <TabsContent value="virtualization" className="space-y-4 animate-fade-in">
          <MemoryVirtualization />
        </TabsContent>
        
        <TabsContent value="hierarchy">
  <Card>
    <CardHeader>
      <CardTitle>Advanced Memory Hierarchy Visualization</CardTitle>
      <CardDescription>
        Modern computer memory is organized in a multi-level hierarchy that balances performance, cost, and capacity constraints.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {/* Animated Memory Hierarchy Pyramid */}
      <div className="flex flex-col items-center space-y-4 mb-8">
        <div className="w-full max-w-md relative">
          <div className="flex flex-col transition-all duration-500 hover:scale-105">
            {/* CPU Registers Level */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center p-2 rounded-t-md w-20 mx-auto shadow-lg transform hover:translate-y-1 transition-transform cursor-pointer" id="registers-container">
              <div className="font-semibold">Registers</div>
              <div className="text-xs">~1 KB</div>
              <div className="hidden absolute bg-slate-900 text-white p-3 rounded w-64 text-xs z-10 -mt-2" id="registers-tooltip">
                Access time: &lt;0.5 ns<br/>
                Located directly in CPU<br/>
                Used for immediate calculations<br/>
                16-32 general purpose registers
              </div>
            </div>

            {/* Cache Memory Levels */}
            <div className="mt-1">
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center p-1.5 rounded-t-sm w-28 mx-auto shadow" id="l1-container">
                <div className="font-semibold text-sm">L1 Cache</div>
                <div className="text-xs">32-64 KB</div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center p-1.5 w-36 mx-auto shadow" id="l2-container">
                <div className="font-semibold text-sm">L2 Cache</div>
                <div className="text-xs">256 KB-1 MB</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-300 text-white text-center p-1.5 rounded-b-sm w-44 mx-auto shadow" id="l3-container">
                <div className="font-semibold text-sm">L3 Cache</div>
                <div className="text-xs">4-32 MB</div>
              </div>
              <div className="hidden absolute bg-slate-900 text-white p-3 rounded w-64 text-xs z-10" id="cache-tooltip">
                L1: ~1-2 ns access, split into instruction/data<br/>
                L2: ~4-7 ns access, unified cache<br/>
                L3: ~10-20 ns access, shared among cores<br/>
                Built with SRAM technology
              </div>
            </div>

            {/* Main Memory */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-center p-4 w-72 mx-auto mt-2 shadow-md" id="ram-container">
              <div className="font-semibold">Main Memory (RAM)</div>
              <div className="text-xs">8 GB - 128 GB</div>
              <div className="hidden absolute bg-slate-900 text-white p-3 rounded w-64 text-xs z-10" id="ram-tooltip">
                Access time: ~60-100 ns<br/>
                Built with DRAM technology<br/>
                Volatile storage (loses data when powered off)<br/>
                Direct CPU addressable storage
              </div>
            </div>

            {/* Virtual Memory */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-300 text-slate-800 text-center p-4 w-96 mx-auto mt-2 shadow-md" id="virtual-container">
              <div className="font-semibold">Virtual Memory</div>
              <div className="text-xs">32 GB - 256 GB</div>
              <div className="hidden absolute bg-slate-900 text-white p-3 rounded w-64 text-xs z-10" id="virtual-tooltip">
                Uses page files on disk as RAM extension<br/>
                Managed by Memory Management Unit (MMU)<br/>
                Page size typically 4 KB<br/>
                Uses TLB (Translation Lookaside Buffer) to speed up translation
              </div>
            </div>

            {/* Secondary Storage */}
            <div className="bg-gradient-to-r from-cyan-300 to-sky-200 text-slate-800 text-center p-4 w-full mx-auto mt-2 shadow-md" id="storage-container">
              <div className="font-semibold">Secondary Storage</div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-white/40 rounded p-1">
                  <div className="font-medium text-sm">SSD</div>
                  <div className="text-xs">500 GB - 8 TB</div>
                  <div className="text-xs">~20-100 μs access</div>
                </div>
                <div className="bg-white/40 rounded p-1">
                  <div className="font-medium text-sm">HDD</div>
                  <div className="text-xs">1 TB - 20 TB</div>
                  <div className="text-xs">~5-10 ms access</div>
                </div>
              </div>
            </div>

            {/* Tertiary Storage */}
            <div className="bg-gradient-to-r from-sky-200 to-slate-200 text-slate-800 text-center p-3 rounded-b-md w-full mx-auto mt-2 shadow-md" id="tertiary-container">
              <div className="font-semibold">Tertiary Storage</div>
              <div className="grid grid-cols-3 gap-2 mt-1 text-xs">
                <div className="bg-white/40 rounded p-1">
                  <div className="font-medium text-sm">Tape</div>
                  <div className="text-xs">10+ TB</div>
                </div>
                <div className="bg-white/40 rounded p-1">
                  <div className="font-medium text-sm">Optical</div>
                  <div className="text-xs">25-100 GB</div>
                </div>
                <div className="bg-white/40 rounded p-1">
                  <div className="font-medium text-sm">Cloud</div>
                  <div className="text-xs">TB to PB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Characteristics Indicators */}
          <div className="flex justify-between mt-6 px-2 text-sm">
            <div className="flex flex-col items-center">
              <div className="font-medium">Speed</div>
              <div className="text-xs">Fastest (~0.5 ns)</div>
              <div className="h-32 w-2 bg-gradient-to-b from-purple-600 via-teal-500 to-slate-200 rounded"></div>
              <div className="text-xs">Slowest (ms-sec)</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="font-medium">Cost</div>
              <div className="text-xs">$$$$ per byte</div>
              <div className="h-32 w-2 bg-gradient-to-b from-purple-600 via-teal-500 to-slate-200 rounded"></div>
              <div className="text-xs">$ per byte</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="font-medium">Size</div>
              <div className="text-xs">KB</div>
              <div className="h-32 w-2 bg-gradient-to-b from-purple-600 via-teal-500 to-slate-200 rounded"></div>
              <div className="text-xs">TB-PB</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="font-medium">Volatility</div>
              <div className="text-xs">Volatile</div>
              <div className="h-32 w-2 bg-gradient-to-b from-purple-600 via-cyan-500 to-slate-200 rounded"></div>
              <div className="text-xs">Non-volatile</div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Hierarchy Details */}
      <div className="text-sm space-y-4">
        <h4 className="font-semibold text-lg border-b pb-2">Memory Hierarchy Detailed Characteristics</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md hover:shadow-md transition-shadow">
            <h5 className="font-medium mb-2 text-purple-700">CPU Registers</h5>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Fastest memory with access time &lt;0.5 nanoseconds</li>
              <li>Built directly into CPU processing units</li>
              <li>Typical modern CPU has 16-32 general purpose registers</li>
              <li>Special-purpose registers: Program Counter (PC), Stack Pointer (SP)</li>
              <li>Register size typically matches CPU architecture (32/64-bit)</li>
              <li>Used for immediate calculations and temporary data storage</li>
              <li>Managed directly by compiler-generated instructions</li>
            </ul>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md hover:shadow-md transition-shadow">
            <h5 className="font-medium mb-2 text-blue-700">Cache Memory</h5>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Static RAM (SRAM) technology - fast but expensive</li>
              <li>Organized in cache lines (64-128 bytes typically)</li>
              <li>L1 cache: Split into instruction and data caches (I-cache/D-cache)</li>
              <li>L2 cache: Unified cache, larger but slightly slower than L1</li>
              <li>L3 cache: Shared among multiple CPU cores, larger capacity</li>
              <li>Uses temporal and spatial locality principles</li>
              <li>Cache coherence protocols maintain consistency in multi-core systems</li>
              <li>Cache hit ratio significantly affects overall system performance</li>
            </ul>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md hover:shadow-md transition-shadow">
            <h5 className="font-medium mb-2 text-teal-700">Main Memory (RAM)</h5>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Dynamic RAM (DRAM) technology - requires refreshing</li>
              <li>Access time: 50-100 nanoseconds</li>
              <li>Directly addressable by CPU through memory controller</li>
              <li>Organized in memory channels for parallel access</li>
              <li>DDR4/DDR5 technologies increase bandwidth through double data rate</li>
              <li>ECC (Error-Correcting Code) RAM detects/corrects single-bit errors</li>
              <li>Memory interleaving increases parallelism and throughput</li>
              <li>Bank conflicts can cause performance degradation</li>
            </ul>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md hover:shadow-md transition-shadow">
            <h5 className="font-medium mb-2 text-cyan-700">Virtual Memory</h5>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Abstracts physical memory resources from applications</li>
              <li>Creates illusion of contiguous address space for each process</li>
              <li>Managed by Memory Management Unit (MMU) in hardware</li>
              <li>Page tables map virtual addresses to physical addresses</li>
              <li>Translation Lookaside Buffer (TLB) caches recent translations</li>
              <li>Page faults occur when accessed page isn't in physical memory</li>
              <li>Demand paging loads pages only when needed</li>
              <li>Page replacement algorithms: LRU, Clock, FIFO, Random</li>
            </ul>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md hover:shadow-md transition-shadow">
            <h5 className="font-medium mb-2 text-sky-700">Secondary Storage</h5>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Persistent non-volatile storage retains data without power</li>
              <li>SSDs: 20-100 microsecond access time, no moving parts</li>
              <li>HDDs: 5-10 millisecond access time, mechanical components</li>
              <li>NAND Flash (SSD) technologies: SLC, MLC, TLC, QLC</li>
              <li>Wear-leveling algorithms extend SSD lifespan</li>
              <li>Connected via interfaces: SATA, NVMe, SAS</li>
              <li>File systems organize data: NTFS, ext4, APFS, ZFS</li>
              <li>NVMe drives connect directly to PCIe for faster throughput</li>
            </ul>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md hover:shadow-md transition-shadow">
            <h5 className="font-medium mb-2 text-slate-700">Tertiary & External Storage</h5>
            <ul className="list-disc list-inside text-xs space-y-1">
              <li>Magnetic tape: Extremely high capacity, slow sequential access</li>
              <li>Optical media: CD/DVD/Blu-ray with laser reading technology</li>
              <li>Cloud storage: Distributed remote storage systems</li>
              <li>Network Attached Storage (NAS) for local network data sharing</li>
              <li>Storage Area Networks (SAN) for enterprise environments</li>
              <li>Hierarchical Storage Management systems</li>
              <li>Backup and archive systems with long-term retention</li>
              <li>Access times range from seconds to minutes</li>
            </ul>
          </div>
        </div>

        {/* Memory Access Patterns Visualization */}
        <div className="mt-8 border border-slate-200 dark:border-slate-700 p-4 rounded-md">
          <h4 className="font-semibold text-lg mb-4">Memory Access Patterns & Performance</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium mb-2">Cache Hit vs. Miss Scenarios</h5>
              <div className="bg-slate-100 p-3 rounded">
                <div className="mb-2">
                  <div className="font-semibold text-sm">Cache Hit:</div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded text-xs w-20 text-center mr-2">CPU Request</div>
                    <div className="text-green-600">→</div>
                    <div className="bg-blue-100 p-2 rounded text-xs w-24 text-center mx-2">Cache Check</div>
                    <div className="text-green-600">→</div>
                    <div className="bg-green-100 p-2 rounded text-xs w-24 text-center ml-2">Data Found!</div>
                  </div>
                  <div className="text-xs mt-1">Time: 1-10 ns</div>
                </div>

                <div>
                  <div className="font-semibold text-sm">Cache Miss:</div>
                  <div className="flex flex-wrap items-center">
                    <div className="bg-green-100 p-2 rounded text-xs w-20 text-center mr-2">CPU Request</div>
                    <div className="text-red-600">→</div>
                    <div className="bg-blue-100 p-2 rounded text-xs w-24 text-center mx-2">Cache Miss</div>
                    <div className="text-red-600">→</div>
                    <div className="bg-yellow-100 p-2 rounded text-xs w-24 text-center mx-2">RAM Access</div>
                    <div className="text-blue-600">→</div>
                    <div className="bg-blue-100 p-2 rounded text-xs w-24 text-center ml-2">Cache Update</div>
                  </div>
                  <div className="text-xs mt-1">Time: 50-200 ns</div>
                </div>
              </div>

              <h5 className="font-medium mt-4 mb-2">Locality Principles</h5>
              <div className="space-y-2">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-semibold text-sm">Temporal Locality</div>
                  <div className="text-xs">Recently accessed data likely to be accessed again soon
                    </div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-semibold text-sm">Spatial Locality</div>
                  <div className="text-xs">Data near recently accessed data likely to be accessed soon</div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Memory Access Performance Comparison</h5>
              <div className="relative h-48 border rounded overflow-hidden bg-slate-50">
                <div className="absolute bottom-0 left-0 w-6 bg-purple-500 h-1 rounded-t"></div>
                <div className="absolute bottom-0 left-8 w-6 bg-blue-500 h-3 rounded-t"></div>
                <div className="absolute bottom-0 left-16 w-6 bg-blue-400 h-6 rounded-t"></div>
                <div className="absolute bottom-0 left-24 w-6 bg-blue-300 h-12 rounded-t"></div>
                <div className="absolute bottom-0 left-32 w-6 bg-teal-500 h-36 rounded-t"></div>
                <div className="absolute bottom-0 left-40 w-6 bg-cyan-500 h-40 rounded-t"></div>
                <div className="absolute bottom-0 left-48 w-6 bg-sky-300 h-44 rounded-t"></div>

                <div className="absolute text-[9px] text-center -rotate-90 text-white left-0 bottom-6 w-10">0.5ns</div>
                <div className="absolute text-[9px] text-center -rotate-90 text-white left-8 bottom-8 w-10">1-2ns</div>
                <div className="absolute text-[9px] text-center -rotate-90 text-white left-16 bottom-12 w-10">~7ns</div>
                <div className="absolute text-[9px] text-center -rotate-90 text-white left-24 bottom-18 w-10">~15ns</div>
                <div className="absolute text-[9px] text-center -rotate-90 text-white left-32 bottom-28 w-10">~100ns</div>
                <div className="absolute text-[9px] text-center -rotate-90 text-white left-40 bottom-32 w-10">~30μs</div>
                <div className="absolute text-[9px] text-center -rotate-90 text-white left-48 bottom-32 w-10">~10ms</div>

                <div className="absolute text-[8px] text-center w-6 -bottom-6 left-0">Reg</div>
                <div className="absolute text-[8px] text-center w-6 -bottom-6 left-8">L1</div>
                <div className="absolute text-[8px] text-center w-6 -bottom-6 left-16">L2</div>
                <div className="absolute text-[8px] text-center w-6 -bottom-6 left-24">L3</div>
                <div className="absolute text-[8px] text-center w-6 -bottom-6 left-32">RAM</div>
                <div className="absolute text-[8px] text-center w-6 -bottom-6 left-40">SSD</div>
                <div className="absolute text-[8px] text-center w-6 -bottom-6 left-48">HDD</div>

                <div className="absolute -left-6 top-0 h-full flex items-center">
                  <div className="text-[9px] transform -rotate-90">Access Time (logarithmic)</div>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="font-medium text-sm">Performance Impact Examples</h5>
                <div className="space-y-1 text-xs mt-1">
                  <div>• L1 cache miss penalty: ~7x slower</div>
                  <div>• RAM vs L1 cache: ~50-100x slower</div>
                  <div>• SSD vs RAM: ~300-500x slower</div>
                  <div>• HDD vs RAM: ~100,000x slower</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Memory Technologies */}
        <div className="mt-6">
          <h4 className="font-semibold text-lg border-b pb-2">Modern Memory Technologies & Trends</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-md">
              <h5 className="font-medium mb-1 text-indigo-700">Emerging Memory Types</h5>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Persistent Memory (PMEM)</li>
                <li>3D XPoint / Optane Memory</li>
                <li>HBM (High Bandwidth Memory)</li>
                <li>GDDR6/7 (Graphics Memory)</li>
                <li>MRAM (Magnetoresistive RAM)</li>
                <li>ReRAM (Resistive RAM)</li>
                <li>FeRAM (Ferroelectric RAM)</li>
              </ul>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-md">
              <h5 className="font-medium mb-1 text-indigo-700">Architecture Innovations</h5>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Cache prefetching algorithms</li>
                <li>Non-Uniform Memory Access (NUMA)</li>
                <li>Heterogeneous memory systems</li>
                <li>Memory-centric computing</li>
                <li>Compute-in-memory architectures</li>
                <li>Memory-side accelerators</li>
                <li>Smart memory controllers</li>
              </ul>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 p-3 rounded-md">
              <h5 className="font-medium mb-1 text-indigo-700">Software Optimizations</h5>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Cache-oblivious algorithms</li>
                <li>Memory-aware compilers</li>
                <li>NUMA-aware schedulers</li>
                <li>Memory tiering software</li>
                <li>Huge/large pages support</li>
                <li>Data-oriented design patterns</li>
                <li>Memory compression techniques</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Animation Script */}
      {/* <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
          // Show tooltips on hover
          function setupTooltip(containerId, tooltipId) {
            const container = document.getElementById(containerId);
            const tooltip = document.getElementById(tooltipId);

            if (container && tooltip) {
              container.addEventListener('mouseenter', function() {
                tooltip.style.display = 'block';
                tooltip.style.top = (container.offsetTop + container.offsetHeight) + 'px';
                tooltip.style.left = (container.offsetLeft + container.offsetWidth/2 - tooltip.offsetWidth/2) + 'px';
              });

              container.addEventListener('mouseleave', function() {
                tooltip.style.display = 'none';
              });
            }
          }

          // Setup tooltips for each memory level
          setupTooltip('registers-container', 'registers-tooltip');
          setupTooltip('l1-container', 'cache-tooltip');
          setupTooltip('l2-container', 'cache-tooltip');
          setupTooltip('l3-container', 'cache-tooltip');
          setupTooltip('ram-container', 'ram-tooltip');
          setupTooltip('virtual-container', 'virtual-tooltip');

          // Simulate memory access animation
          let currentStep = 0;
          const memoryLevels = [
            'registers-container',
            'l1-container',
            'l2-container',
            'l3-container',
            'ram-container',
            'virtual-container',
            'storage-container',
            'tertiary-container'
          ];

          function pulseMemoryLevel(index) {
            if (index < memoryLevels.length) {
              const element = document.getElementById(memoryLevels[index]);
              if (element) {
                element.classList.add('animate-pulse');
                setTimeout(() => {
                  element.classList.remove('animate-pulse');
                }, 1000);
              }
            }
          }

          // Animate memory access pattern every 3 seconds
          setInterval(() => {
            pulseMemoryLevel(currentStep);
            currentStep = (currentStep + 1) % memoryLevels.length;
          }, 3000);
        });
      </script> */}
    </CardContent>
  </Card>
</TabsContent>
        
        <TabsContent value="cache" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Memory Caching</CardTitle>
              <CardDescription>How caches improve memory access performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Cache Basics</h3>
                  <p className="text-sm mb-4">
                    A cache is a small, fast memory that stores copies of data from frequently used main memory locations.
                    When the processor needs to read from or write to a location in main memory, it first checks if a copy
                    of that data is in the cache.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium mb-2">Cache Performance Metrics</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <span className="font-medium">Hit Rate:</span> Percentage of memory accesses found in the cache
                        <div className="mt-1 bg-white dark:bg-slate-900 p-1 rounded text-xs">
                          Hit Rate = (Cache Hits / Total Memory Accesses) × 100%
                        </div>
                      </li>
                      <li>
                        <span className="font-medium">Miss Rate:</span> Percentage of memory accesses not found in the cache
                        <div className="mt-1 bg-white dark:bg-slate-900 p-1 rounded text-xs">
                          Miss Rate = (Cache Misses / Total Memory Accesses) × 100%
                        </div>
                      </li>
                      <li>
                        <span className="font-medium">Average Memory Access Time (AMAT):</span> Average time to access memory
                        <div className="mt-1 bg-white dark:bg-slate-900 p-1 rounded text-xs">
                          AMAT = Hit Time + (Miss Rate × Miss Penalty)
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Cache Hierarchy</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <div className="w-full h-full">
                      <div className="h-full flex flex-col">
                        <div className="text-center bg-blue-500 text-white p-2 rounded-t-md">
                          <span className="font-medium">CPU</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-0 flex-1 text-center">
                          <div className="bg-green-500 border-r border-white dark:border-slate-800 flex items-center justify-center text-white p-2">
                            <div>
                              <span className="text-xs">L1 Cache</span>
                              <div className="text-xs opacity-75 mt-1">32-64 KB</div>
                            </div>
                          </div>
                          <div className="bg-green-400 border-r border-white dark:border-slate-800 flex items-center justify-center text-white p-2">
                            <div>
                              <span className="text-xs">L2 Cache</span>
                              <div className="text-xs opacity-75 mt-1">256 KB - 1 MB</div>
                            </div>
                          </div>
                          <div className="bg-green-300 flex items-center justify-center text-slate-700 p-2">
                            <div>
                              <span className="text-xs">L3 Cache</span>
                              <div className="text-xs opacity-75 mt-1">2 - 32 MB</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center bg-amber-500 text-white p-2">
                          <span className="font-medium">Main Memory (RAM)</span>
                          <div className="text-xs opacity-75">4 - 64 GB</div>
                        </div>
                        
                        <div className="text-center bg-red-500 text-white p-2 rounded-b-md">
                          <span className="font-medium">Secondary Storage</span>
                          <div className="text-xs opacity-75">500 GB - Several TB</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      <div className="text-xs font-medium">Access Time</div>
                      <div className="font-mono">
                        <div className="text-green-600">~1 ns</div>
                        <div className="text-amber-600">~100 ns</div>
                        <div className="text-red-600">~10 ms</div>
                      </div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      <div className="text-xs font-medium">Capacity</div>
                      <div className="font-mono">
                        <div className="text-green-600">Small</div>
                        <div className="text-amber-600">Medium</div>
                        <div className="text-red-600">Large</div>
                      </div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      <div className="text-xs font-medium">Cost/Byte</div>
                      <div className="font-mono">
                        <div className="text-green-600">High</div>
                        <div className="text-amber-600">Medium</div>
                        <div className="text-red-600">Low</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Direct Mapped Cache</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      Each memory location maps to exactly one cache location.
                      Simple but can lead to conflict misses.
                    </p>
                    
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      <div className="text-xs font-medium mb-1">Mapping Formula</div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded text-xs font-mono">
                        Cache Line = Memory Address % Cache Size
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="border rounded">
                        <div className="grid grid-cols-4 gap-0 text-xs text-center font-medium bg-slate-200 dark:bg-slate-700">
                          <div className="border-r border-slate-300 dark:border-slate-600 p-1">Index</div>
                          <div className="border-r border-slate-300 dark:border-slate-600 p-1">Tag</div>
                          <div className="border-r border-slate-300 dark:border-slate-600 p-1">Valid</div>
                          <div className="p-1">Data</div>
                        </div>
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="grid grid-cols-4 gap-0 text-xs text-center border-t border-slate-200 dark:border-slate-700">
                            <div className="border-r border-slate-200 dark:border-slate-700 p-1">{i}</div>
                            <div className="border-r border-slate-200 dark:border-slate-700 p-1">0x{Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}</div>
                            <div className="border-r border-slate-200 dark:border-slate-700 p-1">{Math.random() > 0.3 ? '1' : '0'}</div>
                            <div className="p-1">Data...</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Fully Associative Cache</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      Any memory location can map to any cache line.
                      Most flexible but requires complex hardware.
                    </p>
                    
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      <div className="text-xs font-medium mb-1">Access Method</div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded text-xs">
                        Checks all cache lines in parallel for matching tag
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="border rounded">
                        <div className="grid grid-cols-4 gap-0 text-xs text-center font-medium bg-slate-200 dark:bg-slate-700">
                          <div className="border-r border-slate-300 dark:border-slate-600 p-1">Line</div>
                          <div className="border-r border-slate-300 dark:border-slate-600 p-1">Tag</div>
                          <div className="border-r border-slate-300 dark:border-slate-600 p-1">Valid</div>
                          <div className="p-1">Data</div>
                        </div>
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="grid grid-cols-4 gap-0 text-xs text-center border-t border-slate-200 dark:border-slate-700">
                            <div className="border-r border-slate-200 dark:border-slate-700 p-1">{i}</div>
                            <div className="border-r border-slate-200 dark:border-slate-700 p-1">0x{Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')}</div>
                            <div className="border-r border-slate-200 dark:border-slate-700 p-1">{Math.random() > 0.3 ? '1' : '0'}</div>
                            <div className="p-1">Data...</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Set Associative Cache</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      Compromise between direct mapped and fully associative.
                      Memory can map to multiple locations within a set.
                    </p>
                    
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                      <div className="text-xs font-medium mb-1">Common Configurations</div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded text-xs">
                        2-way, 4-way, or 8-way set associative
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="border rounded">
                        <div className="text-xs text-center font-medium bg-slate-200 dark:bg-slate-700 p-1">
                          Set 0 (2-way)
                        </div>
                        <div className="grid grid-cols-2 gap-0 text-xs text-center">
                          <div className="border-r border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800">
                            Way 0: Tag 0x1A, Valid 1
                          </div>
                          <div className="p-1 bg-slate-50 dark:bg-slate-800">
                            Way 1: Tag 0x3C, Valid 1
                          </div>
                        </div>
                        <div className="text-xs text-center font-medium bg-slate-200 dark:bg-slate-700 p-1 border-t border-slate-300 dark:border-slate-600">
                          Set 1 (2-way)
                        </div>
                        <div className="grid grid-cols-2 gap-0 text-xs text-center">
                          <div className="border-r border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800">
                            Way 0: Tag 0x45, Valid 1
                          </div>
                          <div className="p-1 bg-slate-50 dark:bg-slate-800">
                            Way 1: Tag 0x0F, Valid 0
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Cache Coherence</h3>
                <p className="text-sm mb-4">
                  In multi-processor systems, each processor has its own cache, which can lead to 
                  inconsistent views of memory. Cache coherence protocols ensure that changes to 
                  shared data are propagated to all caches.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">MESI Protocol</h4>
                    <p className="text-sm">A common coherence protocol with four states:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li>
                        <span className="font-medium">Modified (M):</span> Cache line has been modified; data is inconsistent with memory
                      </li>
                      <li>
                        <span className="font-medium">Exclusive (E):</span> Cache line is only in this cache, but is unmodified
                      </li>
                      <li>
                        <span className="font-medium">Shared (S):</span> Cache line is present in multiple caches
                      </li>
                      <li>
                        <span className="font-medium">Invalid (I):</span> Cache line is invalid or not present
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Write Policies</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h5 className="text-sm font-medium">Write-through</h5>
                        <p className="text-xs">
                          Writes are done to both cache and main memory. Simple but can cause performance 
                          bottlenecks due to frequent memory writes.
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium">Write-back</h5>
                        <p className="text-xs">
                          Writes are done only to cache; memory is updated only when the cache line is evicted. 
                          Better performance but more complex.
                        </p>
                      </div>
                    </div>
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
