
import React from 'react';
import { Monitor, ShoppingBag, TrendingUp, ShoppingCart, ChartBar, CreditCard, Globe, Smartphone, Laptop, Package, Building, DollarSign } from 'lucide-react';

const icons = [
  { Icon: Monitor, color: 'blue', size: 24 },
  { Icon: ShoppingBag, color: 'pink', size: 32 },
  { Icon: TrendingUp, color: 'green', size: 28 },
  { Icon: ShoppingCart, color: 'orange', size: 30 },
  { Icon: ChartBar, color: 'purple', size: 26 },
  { Icon: CreditCard, color: 'blue', size: 24 },
  { Icon: Globe, color: 'cyan', size: 34 },
  { Icon: Smartphone, color: 'indigo', size: 28 },
  { Icon: Laptop, color: 'violet', size: 32 },
  { Icon: Package, color: 'rose', size: 26 },
  { Icon: Building, color: 'emerald', size: 30 },
  { Icon: DollarSign, color: 'amber', size: 24 }
];

const FloatingBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1a1f2c]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2c]/95 via-[#1EAEDB]/80 to-[#7E69AB]/90 z-10" />
      
      {/* Sketch-like pattern */}
      <img
        src="/lovable-uploads/7f14154c-e119-40a9-947e-af9f20ae94db.png"
        alt="Background Pattern"
        className="absolute w-full h-full object-cover opacity-5"
      />
      
      {/* Floating icons */}
      <div className="absolute inset-0">
        {icons.map((item, index) => {
          const { Icon, color, size } = item;
          const animations = ['animate-float-1', 'animate-float-2', 'animate-float-3'];
          const positions = [
            'top-[10%] left-[15%]',
            'top-[20%] right-[25%]',
            'bottom-[30%] left-[35%]',
            'top-[40%] right-[15%]',
            'bottom-[20%] right-[35%]',
            'top-[15%] left-[45%]',
            'bottom-[40%] left-[20%]',
            'top-[35%] right-[40%]',
            'bottom-[15%] right-[15%]',
            'top-[25%] left-[25%]',
            'bottom-[35%] right-[25%]',
            'top-[45%] right-[45%]'
          ];

          return (
            <div 
              key={index}
              className={`absolute ${positions[index]} ${animations[index % 3]}`}
            >
              <div className={`p-4 bg-${color}-500/20 rounded-full backdrop-blur-sm`}>
                <Icon
                  size={size}
                  className={`text-${color}-500/70`}
                  strokeWidth={1.5}
                />
              </div>
            </div>
          );
        })}

        {/* Additional floating elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, index) => (
            <div
              key={`dot-${index}`}
              className={`absolute ${
                index % 2 === 0 ? 'bg-blue-500/10' : 'bg-purple-500/10'
              } rounded-full ${
                index % 3 === 0 ? 'w-2 h-2' : 'w-1 h-1'
              } ${
                animations[index % 3]
              }`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingBackground;
