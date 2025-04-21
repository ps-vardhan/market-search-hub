
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import MarketStats from '@/components/MarketStats';
import { Button } from '@/components/ui/button';
import { ChartArea } from 'lucide-react';

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Market-themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#304352] to-[#243949] z-0"></div>
      
      {/* Animated graph lines for background effect */}
      <div className="absolute inset-0 z-10 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path 
            className="animate-float-1"
            d="M0,100 Q150,20 300,100 T600,100 T900,100 T1200,100 T1500,100" 
            fill="none" 
            stroke="white" 
            strokeWidth="2"
          />
          <path 
            className="animate-float-2"
            d="M0,150 Q150,70 300,150 T600,150 T900,150 T1200,150 T1500,150" 
            fill="none" 
            stroke="white" 
            strokeWidth="1.5"
          />
          <path 
            className="animate-float-3"
            d="M0,200 Q150,120 300,200 T600,200 T900,200 T1200,200 T1500,200" 
            fill="none" 
            stroke="white" 
            strokeWidth="1"
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-20">
        <Header />
        
        <div className="container mx-auto px-4 pt-28 pb-16">
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Find Your Market Insight
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
                Search for real-time market data, stock information, and industry trends all in one place
              </p>
              
              {/* Search Bar */}
              <div className={`transition-all duration-700 delay-300 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <SearchBar />
              </div>
            </div>
            
            {/* Market Stats Section */}
            <div className={`transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <MarketStats />
            </div>
            
            {/* CTA Section */}
            <div className={`mt-16 text-center transition-all duration-700 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-2xl font-bold text-white mb-4">Ready to dive deeper?</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Start Analyzing
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
                  <ChartArea className="mr-2 h-5 w-5" />
                  View Market Reports
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
