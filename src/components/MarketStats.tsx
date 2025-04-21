
import { TrendingUp, TrendingDown, ChartBar } from 'lucide-react';

const MarketStats = () => {
  // In a real app, these would come from an API
  const stats = [
    { 
      id: 1, 
      name: 'S&P 500', 
      value: '4,765.98', 
      change: '+0.42%', 
      isPositive: true 
    },
    { 
      id: 2, 
      name: 'NASDAQ', 
      value: '14,992.97', 
      change: '+0.71%', 
      isPositive: true 
    },
    { 
      id: 3, 
      name: 'Dow Jones', 
      value: '37,306.02', 
      change: '-0.11%', 
      isPositive: false 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto">
      {stats.map((stat) => (
        <div 
          key={stat.id} 
          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/20 transition-all duration-300 hover:shadow-lg group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">{stat.name}</h3>
            {stat.isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <span className={`text-sm ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketStats;
