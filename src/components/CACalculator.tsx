import React, { useState, useEffect } from 'react';
import { Calculator, Cpu, Zap, Clock, BarChart3, ChevronDown, ChevronUp, Play, RotateCcw, Info, BookOpen, TrendingUp, Activity } from 'lucide-react';

const CACalculator = () => {
  const [activeCategory, setActiveCategory] = useState('addressing');
  const [animationState, setAnimationState] = useState({});
  const [results, setResults] = useState({});
  const [inputs, setInputs] = useState({});
  const [selectedFormula, setSelectedFormula] = useState('baseOffset');
  const [showSteps, setShowSteps] = useState(false);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const categories = {
    addressing: {
      title: '📍 Addressing Modes',
      icon: <Calculator className="w-5 h-5" />,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-cyan-500',
      formulas: {
        baseOffset: {
          name: 'Base + Offset',
          formula: 'EA = Base Register + Offset',
          inputs: ['base', 'offset'],
          calculate: (values) => values.base + values.offset,
          example: 'Base: 1000, Offset: 20 → EA = 1020',
          description: 'Calculates effective address by adding base register and offset'
        },
        indexed: {
          name: 'Indexed Addressing',
          formula: 'EA = Base + Index × Scale + Displacement',
          inputs: ['base', 'index', 'scale', 'displacement'],
          calculate: (values) => values.base + (values.index * values.scale) + values.displacement,
          example: 'Base: 1000, Index: 2, Scale: 4, Disp: 8 → EA = 1016',
          description: 'Array indexing with scaled index and displacement'
        },
        pcRelative: {
          name: 'PC-Relative',
          formula: 'EA = PC + Displacement',
          inputs: ['pc', 'displacement'],
          calculate: (values) => values.pc + values.displacement,
          example: 'PC: 2000, Displacement: 100 → EA = 2100',
          description: 'Address relative to program counter for branches'
        },
        segmentedMemory: {
          name: 'Segmented Memory',
          formula: 'Physical Address = Segment × 16 + Offset',
          inputs: ['segment', 'offset'],
          calculate: (values) => (values.segment * 16) + values.offset,
          example: 'Segment: 0x1000, Offset: 0x0200 → PA = 0x10200',
          unit: 'hex',
          description: 'x86 real mode segmented memory addressing'
        },
        pagedMemory: {
          name: 'Paged Memory Translation',
          formula: 'Physical = (Page# × Page Size) + Page Offset',
          inputs: ['pageNumber', 'pageSize', 'pageOffset'],
          calculate: (values) => (values.pageNumber * values.pageSize) + values.pageOffset,
          example: 'Page#: 5, Size: 4KB, Offset: 512 → PA = 20992',
          description: 'Virtual to physical address translation in paging'
        },
        virtualToPhysical: {
          name: 'Virtual to Physical (TLB)',
          formula: 'Hit Rate × TLB Time + Miss Rate × (TLB + Memory Time)',
          inputs: ['hitRate', 'tlbTime', 'missRate', 'memoryTime'],
          calculate: (values) => (values.hitRate * values.tlbTime) + (values.missRate * (values.tlbTime + values.memoryTime)),
          example: 'Hit: 0.95, TLB: 1ns, Miss: 0.05, Mem: 100ns → 6.05ns',
          unit: 'ns',
          description: 'Average memory access time with TLB'
        },
        cacheAddressMapping: {
          name: 'Cache Address Mapping',
          formula: 'Block Address = Address ÷ Block Size, Index = Block Address mod Cache Blocks',
          inputs: ['address', 'blockSize', 'cacheBlocks'],
          calculate: (values) => {
            const blockAddr = Math.floor(values.address / values.blockSize);
            const index = blockAddr % values.cacheBlocks;
            const tag = Math.floor(blockAddr / values.cacheBlocks);
            return { blockAddress: blockAddr, index: index, tag: tag };
          },
          example: 'Addr: 1024, Block: 64, Blocks: 16 → Index: 0, Tag: 1',
          complex: true,
          description: 'Direct-mapped cache address breakdown'
        }
      }
    },
    performance: {
      title: '⏱️ Performance Metrics',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-emerald-500',
      formulas: {
        cpuTime1: {
          name: 'CPU Time (IC × CPI × Clock)',
          formula: 'CPU Time = IC × CPI × Clock Cycle Time',
          inputs: ['instructionCount', 'cpi', 'clockCycleTime'],
          calculate: (values) => values.instructionCount * values.cpi * values.clockCycleTime,
          example: 'IC: 2M, CPI: 2, Clock: 0.5ns → 2s',
          unit: 'seconds',
          description: 'CPU execution time using instruction count method'
        },
        cpuTime2: {
          name: 'CPU Time (IC × CPI / Freq)',
          formula: 'CPU Time = (IC × CPI) / Clock Frequency',
          inputs: ['instructionCount', 'cpi', 'clockFrequency'],
          calculate: (values) => (values.instructionCount * values.cpi) / values.clockFrequency,
          example: 'IC: 2M, CPI: 2, Freq: 2GHz → 0.002s',
          unit: 'seconds',
          description: 'CPU execution time using frequency method'
        },
        mips1: {
          name: 'MIPS (IC / Time)',
          formula: 'MIPS = IC / (Execution Time × 10⁶)',
          inputs: ['instructionCount', 'executionTime'],
          calculate: (values) => values.instructionCount / (values.executionTime * 1000000),
          example: 'IC: 2M, Time: 2s → 1 MIPS',
          unit: 'MIPS',
          description: 'Million instructions per second from execution time'
        },
        mips2: {
          name: 'MIPS (Freq / CPI)',
          formula: 'MIPS = Clock Frequency / (CPI × 10⁶)',
          inputs: ['clockFrequency', 'cpi'],
          calculate: (values) => values.clockFrequency / (values.cpi * 1000000),
          example: 'Freq: 2GHz, CPI: 2 → 1000 MIPS',
          unit: 'MIPS',
          description: 'MIPS from clock frequency and CPI'
        },
        mflops: {
          name: 'MFLOPS',
          formula: 'MFLOPS = FP Operations / (Execution Time × 10⁶)',
          inputs: ['fpOperations', 'executionTime'],
          calculate: (values) => values.fpOperations / (values.executionTime * 1000000),
          example: '500M ops, 2s → 250 MFLOPS',
          unit: 'MFLOPS',
          description: 'Million floating-point operations per second'
        },
        speedup: {
          name: 'Speedup',
          formula: 'Speedup = Old Time / New Time',
          inputs: ['oldTime', 'newTime'],
          calculate: (values) => values.oldTime / values.newTime,
          example: 'Old: 10s, New: 5s → 2× speedup',
          unit: '×',
          description: 'Performance improvement ratio'
        },
        efficiency: {
          name: 'Efficiency',
          formula: 'Efficiency = Speedup / Processors',
          inputs: ['speedup', 'processors'],
          calculate: (values) => (values.speedup / values.processors) * 100,
          example: 'Speedup: 3, Processors: 4 → 75%',
          unit: '%',
          description: 'Parallel processing efficiency'
        },
        amdahlsLaw: {
          name: "Amdahl's Law",
          formula: 'Speedup = 1 / ((1 - P) + P/S)',
          inputs: ['parallelFraction', 'processorSpeedup'],
          calculate: (values) => 1 / ((1 - values.parallelFraction) + (values.parallelFraction / values.processorSpeedup)),
          example: 'P: 0.8, S: 4 → Max Speedup: 2.5×',
          unit: '×',
          description: 'Maximum speedup with parallel fraction and serial bottleneck'
        },
        gustafsonsLaw: {
          name: "Gustafson's Law",
          formula: 'Scaled Speedup = S - α(S - 1)',
          inputs: ['processorCount', 'serialFraction'],
          calculate: (values) => values.processorCount - values.serialFraction * (values.processorCount - 1),
          example: 'S: 8, α: 0.1 → Scaled Speedup: 7.3×',
          unit: '×',
          description: 'Speedup with scaled workload'
        },
        cachePerformance: {
          name: 'Cache Performance',
          formula: 'Avg Access Time = Hit Time + Miss Rate × Miss Penalty',
          inputs: ['hitTime', 'missRate', 'missPenalty'],
          calculate: (values) => values.hitTime + (values.missRate * values.missPenalty),
          example: 'Hit: 1ns, Miss Rate: 0.05, Penalty: 100ns → 6ns',
          unit: 'ns',
          description: 'Average memory access time with cache'
        },
        multiLevelCache: {
          name: 'Multi-Level Cache',
          formula: 'Avg Time = L1 Hit Time + L1 Miss Rate × (L2 Hit Time + L2 Miss Rate × Main Memory Time)',
          inputs: ['l1HitTime', 'l1MissRate', 'l2HitTime', 'l2MissRate', 'mainMemoryTime'],
          calculate: (values) => values.l1HitTime + (values.l1MissRate * (values.l2HitTime + (values.l2MissRate * values.mainMemoryTime))),
          example: 'L1: 1ns, L1Miss: 0.1, L2: 10ns, L2Miss: 0.05, Mem: 100ns → 2.5ns',
          unit: 'ns',
          description: 'Two-level cache hierarchy performance'
        },
        branchPrediction: {
          name: 'Branch Prediction Impact',
          formula: 'CPI = Base CPI + Branch Freq × Misprediction Rate × Branch Penalty',
          inputs: ['baseCPI', 'branchFrequency', 'mispredictionRate', 'branchPenalty'],
          calculate: (values) => values.baseCPI + (values.branchFrequency * values.mispredictionRate * values.branchPenalty),
          example: 'Base: 1, Freq: 0.2, Mispredict: 0.1, Penalty: 3 → CPI: 1.06',
          unit: '',
          description: 'CPI impact of branch mispredictions'
        },
        powerConsumption: {
          name: 'Dynamic Power Consumption',
          formula: 'Power = α × C × V² × f',
          inputs: ['activityFactor', 'capacitance', 'voltage', 'frequency'],
          calculate: (values) => values.activityFactor * values.capacitance * Math.pow(values.voltage, 2) * values.frequency,
          example: 'α: 0.5, C: 10pF, V: 1.2V, f: 2GHz → 14.4W',
          unit: 'W',
          description: 'Dynamic power consumption in CMOS circuits'
        }
      }
    },
    logic: {
      title: '🔁 Logic Design',
      icon: <Cpu className="w-5 h-5" />,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-500',
      formulas: {
        combDelay: {
          name: 'Combinational Delay',
          formula: 'Total Delay = Σ(Gate Delays in Critical Path)',
          inputs: ['numGates', 'gateDelay'],
          calculate: (values) => values.numGates * values.gateDelay,
          example: '3 gates, 10ns each → 30ns',
          unit: 'ns',
          description: 'Total propagation delay through logic gates'
        },
        maxFreq: {
          name: 'Max Clock Frequency',
          formula: 'Max Freq = 1 / (Setup + Hold + Propagation)',
          inputs: ['setupTime', 'holdTime', 'propagationDelay'],
          calculate: (values) => 1000000000 / (values.setupTime + values.holdTime + values.propagationDelay),
          example: 'Setup: 5ns, Hold: 2ns, Prop: 3ns → 100MHz',
          unit: 'MHz',
          description: 'Maximum operating frequency of sequential circuit'
        },
        booleanComplexity: {
          name: 'Boolean Function Complexity',
          formula: 'Gates = Literals + AND Gates + OR Gates + NOT Gates',
          inputs: ['literals', 'andGates', 'orGates', 'notGates'],
          calculate: (values) => values.literals + values.andGates + values.orGates + values.notGates,
          example: 'L: 4, AND: 2, OR: 1, NOT: 1 → Total: 8',
          unit: 'gates',
          description: 'Total gate count for boolean function implementation'
        },
        propagationDelay: {
          name: 'Multi-Stage Propagation',
          formula: 'Total Delay = Σ(Stage Delays) + Interconnect Delays',
          inputs: ['stageDelays', 'interconnectDelay'],
          calculate: (values) => values.stageDelays + values.interconnectDelay,
          example: 'Stages: 50ns, Interconnect: 10ns → 60ns',
          unit: 'ns',
          description: 'Delay through multiple logic stages with interconnects'
        },
        powerDelayProduct: {
          name: 'Power-Delay Product (PDP)',
          formula: 'PDP = Average Power × Propagation Delay',
          inputs: ['averagePower', 'propagationDelay'],
          calculate: (values) => values.averagePower * values.propagationDelay,
          example: 'Power: 10mW, Delay: 5ns → PDP: 50pJ',
          unit: 'pJ',
          description: 'Energy consumed per operation (figure of merit)'
        },
        fanoutDelay: {
          name: 'Fanout Delay Analysis',
          formula: 'Delay = Intrinsic Delay + (Fanout × Load Delay)',
          inputs: ['intrinsicDelay', 'fanout', 'loadDelay'],
          calculate: (values) => values.intrinsicDelay + (values.fanout * values.loadDelay),
          example: 'Intrinsic: 2ns, Fanout: 4, Load: 1ns → 6ns',
          unit: 'ns',
          description: 'Delay increase due to driving multiple loads'
        },
        rcDelay: {
          name: 'RC Delay Model',
          formula: 'Delay = 0.69 × R × C',
          inputs: ['resistance', 'capacitance'],
          calculate: (values) => 0.69 * values.resistance * values.capacitance,
          example: 'R: 1kΩ, C: 10pF → Delay: 6.9ns',
          unit: 'ns',
          description: 'RC time constant delay in interconnects'
        },
        clockSkew: {
          name: 'Clock Skew Impact',
          formula: 'Min Period = Logic Delay + Setup Time + Clock Skew',
          inputs: ['logicDelay', 'setupTime', 'clockSkew'],
          calculate: (values) => values.logicDelay + values.setupTime + values.clockSkew,
          example: 'Logic: 8ns, Setup: 2ns, Skew: 1ns → 11ns',
          unit: 'ns',
          description: 'Minimum clock period considering skew'
        },
        metastabilityMTBF: {
          name: 'Metastability MTBF',
          formula: 'MTBF = exp(τ/τ₀) / (f₀ × fc × τ₀)',
          inputs: ['resolutionTime', 'timeConstant', 'clockFreq', 'inputFreq'],
          calculate: (values) => Math.exp(values.resolutionTime / values.timeConstant) / (values.inputFreq * values.clockFreq * values.timeConstant),
          example: 'τ: 10ns, τ₀: 1ns, fc: 100MHz, f₀: 10MHz → MTBF',
          unit: 'years',
          description: 'Mean time between metastability failures'
        }
      }
    },
    pipeline: {
      title: '🚀 Pipelining',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-red-500',
      formulas: {
        pipelineSpeedup: {
          name: 'Pipeline Speedup',
          formula: 'Speedup = Non-pipelined Time / Pipelined Time',
          inputs: ['nonPipelinedTime', 'pipelinedTime'],
          calculate: (values) => values.nonPipelinedTime / values.pipelinedTime,
          example: 'Non-pipe: 20ns, Pipe: 10ns → 2× speedup',
          unit: '×',
          description: 'Performance gain from pipelining'
        },
        idealSpeedup: {
          name: 'Ideal Speedup',
          formula: 'Ideal Speedup = Number of Pipeline Stages',
          inputs: ['stages'],
          calculate: (values) => values.stages,
          example: '5 stages → 5× ideal speedup',
          unit: '×',
          description: 'Maximum theoretical speedup from pipelining'
        },
        throughput: {
          name: 'Pipeline Throughput',
          formula: 'Throughput = Instructions / Total Time',
          inputs: ['instructions', 'totalTime'],
          calculate: (values) => values.instructions / values.totalTime,
          example: '20 instructions, 8ns → 2.5 inst/ns',
          unit: 'inst/ns',
          description: 'Instructions completed per unit time'
        },
        pipelineEfficiency: {
          name: 'Pipeline Efficiency',
          formula: 'Efficiency = (Actual / Ideal) × 100%',
          inputs: ['actualSpeedup', 'idealSpeedup'],
          calculate: (values) => (values.actualSpeedup / values.idealSpeedup) * 100,
          example: 'Actual: 3.5, Ideal: 5 → 70%',
          unit: '%',
          description: 'How well pipeline achieves ideal performance'
        },
        pipelineExecTime: {
          name: 'Pipeline Execution Time',
          formula: 'Time = (Depth + Instructions - 1) × Cycle Time',
          inputs: ['depth', 'instructions', 'cycleTime'],
          calculate: (values) => (values.depth + values.instructions - 1) * values.cycleTime,
          example: '5 stages, 10 inst, 2ns → 28ns',
          unit: 'ns',
          description: 'Total time to execute n instructions'
        },
        hazardCPI: {
          name: 'CPI with Hazards',
          formula: 'CPI = Ideal CPI + Stall Cycles/Instruction',
          inputs: ['idealCPI', 'stallCycles'],
          calculate: (values) => values.idealCPI + values.stallCycles,
          example: 'Ideal: 1, Stalls: 0.2 → 1.2 CPI',
          unit: '',
          description: 'CPI including pipeline stalls'
        },
        stallCycles: {
          name: 'Stall Cycles',
          formula: 'Stalls = Hazard Freq × Cycles per Hazard',
          inputs: ['hazardFreq', 'cyclesPerHazard'],
          calculate: (values) => values.hazardFreq * values.cyclesPerHazard,
          example: 'Freq: 0.3, Cycles: 2 → 0.6 stalls/inst',
          unit: 'cycles/inst',
          description: 'Average stall cycles per instruction'
        },
        actualSpeedupHazards: {
          name: 'Speedup with Hazards',
          formula: 'Speedup = Depth / (1 + Stall Rate)',
          inputs: ['depth', 'stallRate'],
          calculate: (values) => values.depth / (1 + values.stallRate),
          example: '5 stages, 0.25 stall rate → 4× speedup',
          unit: '×',
          description: 'Actual speedup considering pipeline hazards'
        },
        branchPenalty: {
          name: 'Branch Penalty Impact',
          formula: 'Penalty = Branch Freq × Misprediction × Pipeline Depth',
          inputs: ['branchFreq', 'mispredictionRate', 'pipelineDepth'],
          calculate: (values) => values.branchFreq * values.mispredictionRate * values.pipelineDepth,
          example: 'Freq: 0.2, Mispredict: 0.1, Depth: 5 → 0.1 cycles',
          unit: 'cycles/inst',
          description: 'CPI penalty from branch mispredictions'
        },
        forwarding: {
          name: 'Forwarding Effectiveness',
          formula: 'Reduced Stalls = Original Stalls × (1 - Forwarding Rate)',
          inputs: ['originalStalls', 'forwardingRate'],
          calculate: (values) => values.originalStalls * (1 - values.forwardingRate),
          example: 'Original: 0.3, Forward: 0.8 → 0.06 stalls',
          unit: 'cycles/inst',
          description: 'Stall reduction from data forwarding'
        },
        superscalarIPC: {
          name: 'Superscalar IPC',
          formula: 'IPC = Issue Width × Issue Efficiency × Pipeline Efficiency',
          inputs: ['issueWidth', 'issueEfficiency', 'pipelineEfficiency'],
          calculate: (values) => values.issueWidth * values.issueEfficiency * values.pipelineEfficiency,
          example: 'Width: 4, Issue Eff: 0.8, Pipe Eff: 0.9 → IPC: 2.88',
          unit: 'IPC',
          description: 'Instructions per cycle in superscalar processor'
        },
        outOfOrderPerformance: {
          name: 'Out-of-Order Performance',
          formula: 'Speedup = 1 / (Serial Fraction + (Parallel Fraction / ROB Size))',
          inputs: ['serialFraction', 'parallelFraction', 'robSize'],
          calculate: (values) => 1 / (values.serialFraction + (values.parallelFraction / values.robSize)),
          example: 'Serial: 0.1, Parallel: 0.9, ROB: 64 → Speedup: 1.12×',
          unit: '×',
          description: 'Performance benefit from out-of-order execution'
        },
        loadStoreQueue: {
          name: 'Load-Store Queue Impact',
          formula: 'Memory Stalls = Load Freq × Store Conflicts × Conflict Penalty',
          inputs: ['loadFreq', 'storeConflicts', 'conflictPenalty'],
          calculate: (values) => values.loadFreq * values.storeConflicts * values.conflictPenalty,
          example: 'Load: 0.3, Conflicts: 0.05, Penalty: 5 → 0.075 cycles',
          unit: 'cycles/inst',
          description: 'CPI penalty from load-store conflicts'
        },
        dynamicScheduling: {
          name: 'Dynamic Scheduling Benefit',
          formula: 'ILP Speedup = Instructions / Critical Path Length',
          inputs: ['totalInstructions', 'criticalPathLength'],
          calculate: (values) => values.totalInstructions / values.criticalPathLength,
          example: 'Instructions: 100, Critical Path: 25 → ILP: 4×',
          unit: '×',
          description: 'Instruction-level parallelism exploitation'
        }
      }
    }
  };

  const formatNumber = (num, unit = '') => {
    if (typeof num === 'object') {
      return Object.entries(num).map(([key, value]) => 
        `${key}: ${formatValue(value)}`
      ).join(', ');
    }
    return formatValue(num) + (unit ? ` ${unit}` : '');
  };

  const formatValue = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'G';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    if (num < 0.001 && num > 0) return num.toExponential(2);
    return num.toFixed(6).replace(/\.?0+$/, '');
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateResult = () => {
    const formula = categories[activeCategory].formulas[selectedFormula];
    if (!formula) return;
    
    // Validate inputs
    const hasValidInputs = formula.inputs.every(input => inputs[input] !== undefined && inputs[input] !== null);
    if (!hasValidInputs) {
      alert('Please fill in all input fields');
      return;
    }
    
    const result = formula.calculate(inputs);
    setResults(prev => ({
      ...prev,
      [selectedFormula]: result
    }));
    
    // Add to history
    const historyEntry = {
      formula: formula.name,
      inputs: { ...inputs },
      result,
      timestamp: new Date().toLocaleTimeString(),
      category: activeCategory
    };
    setHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
    
    // Trigger animation
    setAnimationState(prev => ({
      ...prev,
      [selectedFormula]: true
    }));
    
    setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        [selectedFormula]: false
      }));
    }, 1500);
  };

  const resetCalculator = () => {
    setInputs({});
    setResults({});
    setAnimationState({});
  };

  const toggleFavorite = (formulaKey) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(formulaKey)) {
        newFavs.delete(formulaKey);
      } else {
        newFavs.add(formulaKey);
      }
      return newFavs;
    });
  };

  const currentFormula = categories[activeCategory].formulas[selectedFormula];

  useEffect(() => {
    setSelectedFormula(Object.keys(categories[activeCategory].formulas)[0]);
    setInputs({});
    setResults({});
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            Computer Architecture Calculator
          </h1>
          <p className="text-slate-300 text-lg">Interactive formulas with step-by-step calculations and visualizations</p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {Object.values(categories).reduce((sum, cat) => sum + Object.keys(cat.formulas).length, 0)} Formulas
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Real-time Calculations
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Step-by-step Solutions
            </span>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group ${
                activeCategory === key 
                  ? `${category.color} border-white shadow-2xl shadow-${category.color}/20` 
                  : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {category.icon}
                  <span className="font-semibold text-white">{category.title}</span>
                </div>
                <div className="text-xs text-slate-400">
                  {Object.keys(category.formulas).length} formulas
                </div>
              </div>
              {activeCategory === key && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Formula Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Available Formulas
              </h3>
              <div className="space-y-2">
                {Object.entries(categories[activeCategory].formulas).map(([key, formula]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFormula(key)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                      selectedFormula === key
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400'
                        : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white group-hover:text-blue-300 transition-colors">
                          {formula.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 truncate">
                          {formula.description}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(key);
                        }}
                        className={`p-1 rounded ${
                          favorites.has(key) ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'
                        }`}
                      >
                        ⭐
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* History Panel */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Calculations
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-slate-400 text-sm">No calculations yet</p>
                ) : (
                  history.map((entry, index) => (
                    <div key={index} className="bg-slate-700/30 p-3 rounded-lg">
                      <div className="text-sm font-medium text-white">
                        {entry.formula}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {entry.timestamp} • {typeof entry.result === 'object' ? 'Multiple results' : formatNumber(entry.result, currentFormula?.unit)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {categories[activeCategory].icon}
                  {currentFormula?.name}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                    title="Toggle steps"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  <button
                    onClick={resetCalculator}
                    className="p-2 bg-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                    title="Reset"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Formula Display */}
              <div className="bg-slate-900/50 p-4 rounded-lg mb-6 border border-slate-600">
                <div className="text-sm text-slate-400 mb-2">Formula:</div>
                <div className="font-mono text-lg text-blue-300 mb-2">
                  {currentFormula?.formula}
                </div>
                <div className="text-sm text-slate-300">
                  {currentFormula?.description}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Example: {currentFormula?.example}
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {currentFormula?.inputs.map((input) => (
                  <div key={input} className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300 capitalize">
                      {input.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={inputs[input] || ''}
                      onChange={(e) => handleInputChange(input, e.target.value)}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                      placeholder={`Enter ${input.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateResult}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 mb-6"
              >
                <Play className="w-5 h-5" />
                Calculate Result
              </button>

              {/* Results Display */}
              {results[selectedFormula] !== undefined && (
                <div className={`bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/30 p-6 rounded-lg transition-all duration-500 ${
                  animationState[selectedFormula] ? 'animate-pulse scale-105' : ''
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-bold text-white">Result</h3>
                  </div>
                  <div className="text-2xl font-mono text-green-300 mb-2">
                    {formatNumber(results[selectedFormula], currentFormula?.unit)}
                  </div>
                  
                  {showSteps && (
                    <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Calculation Steps:</h4>
                      <div className="space-y-1 text-sm font-mono text-slate-400">
                        {currentFormula?.inputs.map((input, index) => (
                          <div key={input}>
                            Step {index + 1}: {input} = {inputs[input] || 0}
                          </div>
                        ))}
                        <div className="border-t border-slate-600 pt-2 mt-2 font-semibold text-green-300">
                          Final Result = {formatNumber(results[selectedFormula], currentFormula?.unit)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400">
          <p className="text-sm">
            Built for Computer Architecture Students • Interactive Learning Tool
          </p>
        </div>
      </div>
    </div>
  );
};

export default CACalculator;