import { useEffect, useState } from "react";
import { Cpu, Server, Layers, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Cpu className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}

export function InitialLoader() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 100);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-blue-900 to-indigo-800 overflow-hidden">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-blue-200" 
            style={{
              height: '2px',
              width: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
        {[...Array(40)].map((_, i) => (
          <div 
            key={`dot-${i}`} 
            className="absolute h-1 w-1 rounded-full bg-blue-300" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-6 px-4">
        {/* Animated icon group */}
        <div className="relative mb-2">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-blue-500 blur opacity-30"></div>
            <Cpu className="relative h-16 w-16 text-white animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute -top-4 -right-4">
            <Server className="h-8 w-8 text-blue-300 animate-pulse" />
          </div>
          <div className="absolute -bottom-4 -left-4">
            <Layers className="h-8 w-8 text-indigo-300 animate-pulse" />
          </div>
          <div className="absolute -bottom-4 -right-4">
            <Hexagon className="h-8 w-8 text-blue-200 animate-pulse" />
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-1 tracking-wide">
            DECODE
            <span className="text-blue-300"> CO-A</span>
          </h2>
          <p className="text-blue-200 text-lg font-medium mb-4">
            Computer Organization & Architecture Simulator
          </p>
        </div>
        
        {/* Binary data stream */}
        <div className="flex gap-1 mb-2">
          {[...Array(12)].map((_, i) => (
            <div 
              key={`binary-${i}`}
              className="text-xs font-mono text-blue-300 opacity-60"
              style={{
                animation: 'fadeInOut 1.5s infinite',
                animationDelay: `${i * 0.1}s`
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="w-64 bg-blue-900 rounded-full h-2 mb-1 overflow-hidden">
          <div 
            className="bg-blue-400 h-full rounded-full" 
            style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
          />
        </div>
        
        <p className="text-blue-200 text-sm">
          {progress < 30 && "Initializing components..."}
          {progress >= 30 && progress < 60 && "Loading architecture modules..."}
          {progress >= 60 && progress < 90 && "Preparing simulation environment..."}
          {progress >= 90 && "Starting up..."}
        </p>
      </div>
      
      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}