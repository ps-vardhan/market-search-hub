import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import Analysis from './components/Analysis';
import Header from './components/Header';

const queryClient = new QueryClient();

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-100">
            <Header onCategorySelect={setSelectedCategory} />
            <main className="pt-20">
              {selectedCategory && <Analysis category={selectedCategory} />}
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
