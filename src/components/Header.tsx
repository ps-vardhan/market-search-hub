
import { ChartLine } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <ChartLine className="h-8 w-8 text-orange-500 mr-2" />
            <span className="text-xl font-bold text-white">Product Performance</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
