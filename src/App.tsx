
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InitialLoader } from "./components/LoadingSpinner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const App = () => {
  // Create a client
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <InitialLoader />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pipeline" element={<Index />} />
            <Route path="/converter" element={<Index />} />
            <Route path="/cpu" element={<Index />} />
            <Route path="/organization" element={<Index />} />
            <Route path="/number-systems" element={<Index />} />
            <Route path="/processor" element={<Index />} />
            <Route path="/timing-control" element={<Index />} />
            <Route path="/alu" element={<Index />} />
            <Route path="/memory" element={<Index />} />
            <Route path="/io" element={<Index />} />
            <Route path="/bus" element={<Index />} />
            <Route path="/assembly" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
