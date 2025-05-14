import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
  const location = useLocation();
  const [dotCount, setDotCount] = useState(1);
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Animate the loading dots
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev < 3 ? prev + 1 : 1));
    }, 500);
    
    return () => clearInterval(dotInterval);
  }, [location.pathname]);

  // Create an array of elements for the floating circuit elements
  const circuitElements = Array(12).fill().map((_, i) => (
    <div 
      key={i}
      className={`absolute rounded-full opacity-75 animate-float-${i % 4 + 1}`}
      style={{
        background: `linear-gradient(135deg, #4B0082 0%, #9370DB ${30 + i * 5}%)`,
        width: `${10 + Math.random() * 30}px`,
        height: `${10 + Math.random() * 30}px`,
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 80}%`,
        animationDelay: `${i * 0.2}s`,
        animationDuration: `${4 + Math.random() * 4}s`
      }}
    >
      <div className="w-full h-full opacity-80" 
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`
        }}
      />
    </div>
  ));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden relative">
      {/* Floating circuit elements */}
      {circuitElements}
      
      {/* Main content */}
      <div className="relative z-10 text-center px-6 py-10 rounded-xl bg-black bg-opacity-30 backdrop-blur-md border border-gray-700 shadow-xl max-w-md w-full">
        <div className="animate-pulse mb-4">
          <div className="inline-block w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
            404
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2 text-white">Page Not Found</h1>
        
        <div className="w-16 h-1 mx-auto my-4 bg-blue-500 rounded"></div>
        
        <p className="text-xl text-blue-200 mb-6">This part of our simulator is still under development.</p>
        
        <div className="text-lg text-blue-300 mb-8 animate-pulse">
          <p>Updating soon, stay tuned{Array(dotCount).fill('.').join('')}</p>
        </div>
        
        <div className="mt-8 animate-bounce">
          <a 
            href="/" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;