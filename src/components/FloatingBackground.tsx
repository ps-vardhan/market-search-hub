
import React from 'react';

const FloatingBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2c]/95 via-[#1EAEDB]/80 to-[#7E69AB]/90 z-10" />
      
      {/* Floating items */}
      <div className="absolute inset-0">
        {/* Smartphones */}
        <img
          src="/lovable-uploads/9ffcff96-798c-46d7-8cb5-bc2a3da99492.png"
          alt="Background Items"
          className="absolute w-full h-full object-cover opacity-30"
        />
        
        <div className="absolute top-[10%] left-[15%] animate-float-1">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full backdrop-blur-sm" />
        </div>
        
        <div className="absolute top-[20%] right-[25%] animate-float-2">
          <div className="w-20 h-20 bg-pink-500/20 rounded-full backdrop-blur-sm" />
        </div>
        
        <div className="absolute bottom-[30%] left-[35%] animate-float-3">
          <div className="w-24 h-24 bg-green-500/20 rounded-full backdrop-blur-sm" />
        </div>
        
        <div className="absolute top-[40%] right-[15%] animate-float-1">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full backdrop-blur-sm" />
        </div>
        
        <div className="absolute bottom-[20%] right-[35%] animate-float-2">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full backdrop-blur-sm" />
        </div>
      </div>
    </div>
  );
};

export default FloatingBackground;
