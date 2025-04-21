
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';

const popularSearches = [
  "iPhone 15 Pro",
  "Nike Air Zoom",
  "Samsung Galaxy S24",
  "Sony WH-1000XM5",
  "MacBook Pro M3",
  "Dyson V15 Detect"
];

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Handler for clicking a popular search suggestion
  const handlePopularClick = (search: string) => {
    setQuery(search);
    console.log('Popular search selected:', search);
  };

  // New handler for direct navigation to results page with default query
  const goToResultsDirectly = () => {
    navigate('/results?query=top');
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
      {/* Dynamic, themed animated SVG background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1EAEDB" />
              <stop offset="100%" stopColor="#7E69AB" />
            </linearGradient>
            <linearGradient id="line1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="15%" stopColor="#D6BCFA" />
              <stop offset="100%" stopColor="#33C3F0" />
            </linearGradient>
            <linearGradient id="line2" x1="0" y1="1" x2="1" y2="0">
              <stop offset="30%" stopColor="#FFA99F" />
              <stop offset="100%" stopColor="#9b87f5" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgGradient)" opacity="0.85" />
          <path
            className="animate-market-float-1"
            d="M0,350 Q400,220 800,350 T1600,350"
            fill="none"
            stroke="url(#line1)"
            strokeWidth="6"
            opacity={0.18}
          />
          <path
            className="animate-market-float-2"
            d="M0,600 Q500,400 1000,600 T2000,600"
            fill="none"
            stroke="url(#line2)"
            strokeWidth="5"
            opacity={0.12}
          />
          <circle
            className="animate-market-pulse"
            cx="60%"
            cy="27%"
            r="70"
            fill="#F1F0FB"
            opacity="0.22"
          />
        </svg>
      </div>
      <style>{`
        @keyframes market-float-1 {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-22px); }
          100% { transform: translateY(0px); }
        }
        @keyframes market-float-2 {
          0% { transform: translateY(0px) scaleX(1); }
          50% { transform: translateY(30px) scaleX(1.04); }
          100% { transform: translateY(0px) scaleX(1); }
        }
        @keyframes market-pulse {
          0% { r: 70; opacity: 0.22; }
          50% { r: 90; opacity: 0.34; }
          100% { r: 70; opacity: 0.22; }
        }
        .animate-market-float-1 {
          animation: market-float-1 11s ease-in-out infinite;
        }
        .animate-market-float-2 {
          animation: market-float-2 16s ease-in-out infinite;
        }
        .animate-market-pulse {
          animation: market-pulse 8s ease-in-out infinite;
        }
      `}</style>
      <div className="relative z-20 flex flex-col items-center w-full px-4">
        <Header />
        <div className="w-full flex flex-col items-center justify-center pt-36 pb-10">
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4 drop-shadow-lg">
              Find Product Performance
            </h1>
            <p className="text-lg md:text-xl text-white/80 text-center mb-8 max-w-2xl mx-auto">
              Enter a product to instantly see its latest performance & insights.
            </p>
            <div className="w-full max-w-2xl mx-auto relative">
              <SearchBar />
            </div>
            <div
              className={`mt-8 flex flex-col items-center transition-all duration-700 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <span className="text-base text-white/70 mb-3 font-medium">Popular searches:</span>
              <div className="flex flex-wrap gap-3 justify-center">
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 hover:bg-orange-500/90 text-white transition-all shadow hover:scale-105"
                    onClick={() => handlePopularClick(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-16 flex justify-center gap-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg text-lg px-10 py-6 rounded-full animate-fade-in">
                Start Analyzing
              </Button>
              <Button size="lg" variant="secondary" className="text-white shadow-lg text-lg px-10 py-6 rounded-full animate-fade-in" onClick={goToResultsDirectly}>
                Go To Results (No Input)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;

