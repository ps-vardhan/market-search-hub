
import { useState } from 'react';
import { Button } from './ui/button';
import { ChartLine } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ChartLine className="h-8 w-8 text-orange-500 mr-2" />
            <span className="text-xl font-bold text-white">MarketSearch</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white/80 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Markets</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Trends</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white">
              Sign In
            </Button>
          </nav>
          
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/90 backdrop-blur-md mt-4 p-4 rounded-lg">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-white/80 hover:text-white py-2 transition-colors">Home</a>
              <a href="#" className="text-white/80 hover:text-white py-2 transition-colors">Markets</a>
              <a href="#" className="text-white/80 hover:text-white py-2 transition-colors">Trends</a>
              <a href="#" className="text-white/80 hover:text-white py-2 transition-colors">About</a>
              <Button variant="outline" className="text-white border-white/20 w-full mt-2">
                Sign In
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
