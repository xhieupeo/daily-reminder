import React, { useMemo } from 'react';

export const ScenicBackground: React.FC = () => {
  // Generate random positions and animation delays for floating sakura petals
  const petals = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: -10 - Math.random() * 20,
      size: 6 + Math.random() * 8,
      duration: 7 + Math.random() * 8,
      delay: Math.random() * 10,
      opacity: 0.7 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Sky Gradient: Bright Pastel Anime Morning / Spring Day */}
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: 'linear-gradient(180deg, #98c9eb 0%, #c4e0f5 35%, #ffd4e5 75%, #ffe6cf 100%)',
        }}
      />

      {/* 2. Pixel Sun with Soft Halo */}
      <div className="absolute top-8 right-16 md:right-32 w-16 h-16 bg-[#fff9db] border-4 border-[#ffd166] shadow-[0_0_40px_rgba(255,209,102,0.6)]">
        <div className="w-full h-full bg-[#ffea79] p-1 flex items-center justify-center">
          <div className="w-8 h-8 bg-[#fffbe6]" />
        </div>
      </div>

      {/* 3. Pixel Clouds */}
      <div className="absolute top-12 left-10 opacity-80 animate-cloud-slow">
        <svg width="120" height="40" viewBox="0 0 60 20" fill="none">
          <rect x="15" y="0" width="30" height="8" fill="#ffffff" />
          <rect x="5" y="5" width="50" height="10" fill="#ffffff" />
          <rect x="0" y="10" width="60" height="10" fill="#ffffff" />
          <rect x="5" y="16" width="50" height="4" fill="#e2f0fb" />
        </svg>
      </div>

      <div className="absolute top-20 right-1/4 opacity-75 animate-cloud-slower">
        <svg width="90" height="30" viewBox="0 0 60 20" fill="none">
          <rect x="15" y="2" width="25" height="6" fill="#ffffff" />
          <rect x="5" y="6" width="45" height="8" fill="#ffffff" />
          <rect x="0" y="10" width="55" height="8" fill="#ffffff" />
          <rect x="4" y="14" width="45" height="4" fill="#e2f0fb" />
        </svg>
      </div>

      {/* 4. Distant Mountains & Hill Silhouettes */}
      <svg className="absolute bottom-28 w-full h-44 text-[#a393bf] opacity-60" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <polygon points="0,200 80,110 180,150 320,60 480,160 620,90 760,150 920,40 1060,130 1200,80 1200,200" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-20 w-full h-36 text-[#7e749e] opacity-75" viewBox="0 0 1200 160" preserveAspectRatio="none">
        <polygon points="0,160 140,80 260,130 400,50 560,110 700,40 840,110 980,60 1100,100 1200,50 1200,160" fill="currentColor" />
      </svg>

      {/* 5. Cozy Townscape / Anime Houses & Telephone Poles */}
      <div className="absolute bottom-16 left-0 right-0 h-28 flex items-end justify-between px-4 md:px-12 opacity-85">
        {/* Left Side Houses & Shop */}
        <div className="flex items-end gap-2">
          {/* House 1 */}
          <div className="w-20 h-16 bg-[#e0d6c3] border-3 border-[#2b2538] relative">
            <div className="absolute -top-6 -left-2 w-24 h-6 bg-[#3d5a80] border-3 border-[#2b2538] clip-roof" />
            <div className="w-5 h-5 bg-[#ffe082] border-2 border-[#2b2538] mt-4 ml-3" />
          </div>
          {/* House 2 */}
          <div className="w-24 h-20 bg-[#f4ebe1] border-3 border-[#2b2538] relative">
            <div className="absolute -top-7 -left-2 w-28 h-7 bg-[#c05c5c] border-3 border-[#2b2538]" />
            <div className="flex gap-2 mt-4 ml-4">
              <div className="w-6 h-6 bg-[#81d4fa] border-2 border-[#2b2538]" />
              <div className="w-5 h-10 bg-[#8d6e63] border-2 border-[#2b2538]" />
            </div>
          </div>
          {/* Japanese Telephone Pole */}
          <div className="w-2 h-36 bg-[#4a4453] relative -ml-1">
            <div className="absolute top-4 -left-4 w-10 h-1.5 bg-[#4a4453]" />
            <div className="absolute top-8 -left-3 w-8 h-1.5 bg-[#4a4453]" />
            {/* Transformer Box */}
            <div className="absolute top-12 -left-2 w-5 h-6 bg-[#78716c] border border-[#2b2538]" />
          </div>
        </div>

        {/* Right Side Houses */}
        <div className="flex items-end gap-3">
          {/* Telephone Pole Right */}
          <div className="w-2 h-36 bg-[#4a4453] relative">
            <div className="absolute top-3 -left-3 w-8 h-1.5 bg-[#4a4453]" />
            <div className="absolute top-7 -left-4 w-10 h-1.5 bg-[#4a4453]" />
          </div>
          {/* House 3 */}
          <div className="w-22 h-18 bg-[#e8ded1] border-3 border-[#2b2538] relative">
            <div className="absolute -top-6 -left-2 w-26 h-6 bg-[#52796f] border-3 border-[#2b2538]" />
            <div className="w-6 h-6 bg-[#ffe082] border-2 border-[#2b2538] mt-3 ml-3" />
          </div>
          {/* House 4 / Ramen Shop with Lantern */}
          <div className="w-28 h-22 bg-[#dfd2be] border-3 border-[#2b2538] relative">
            <div className="absolute -top-7 -left-2 w-32 h-7 bg-[#bf573f] border-3 border-[#2b2538]" />
            <div className="absolute top-3 right-2 w-4 h-6 bg-[#ff5252] border border-[#2b2538] flex items-center justify-center text-[7px] text-white font-bold">
              RAMEN
            </div>
          </div>
        </div>
      </div>

      {/* 6. Road, Sidewalk & Street Markings */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#4a4e69] border-t-4 border-[#2b2538]">
        {/* Sidewalk curb */}
        <div className="w-full h-3 bg-[#b5b8cc] border-b-2 border-[#2b2538]" />
        {/* Yellow Dashed Lane Dividers */}
        <div className="w-full h-1 mt-4 flex justify-around">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div key={`lane-${idx}`} className="w-8 h-1 bg-[#ffb703] opacity-90" />
          ))}
        </div>
      </div>

      {/* 7. Lush Blooming Sakura Trees (Left & Right Flanks) */}
      {/* Left Tree */}
      <div className="absolute bottom-6 left-2 md:left-8 w-44 md:w-56 h-72 z-10">
        <svg viewBox="0 0 160 220" className="w-full h-full filter drop-shadow-[2px_2px_0px_#2b2538]">
          {/* Tree Trunk */}
          <rect x="72" y="110" width="16" height="110" fill="#5c4033" />
          <rect x="66" y="140" width="8" height="20" fill="#5c4033" />
          <rect x="86" y="130" width="10" height="15" fill="#5c4033" />
          <rect x="60" y="200" width="36" height="20" fill="#4a332a" />
          {/* Sakura Blossom Clouds (Layered Pixel Clusters) */}
          {/* Deep Pink Shadows */}
          <rect x="35" y="30" width="90" height="90" fill="#e57373" />
          <rect x="15" y="45" width="130" height="65" fill="#e57373" />
          {/* Main Sakura Blossom */}
          <rect x="25" y="20" width="110" height="85" fill="#f48fb1" />
          <rect x="10" y="35" width="140" height="60" fill="#f48fb1" />
          <rect x="40" y="5" width="80" height="40" fill="#f48fb1" />
          {/* Highlight Light Sakura Clusters */}
          <rect x="35" y="15" width="70" height="45" fill="#ffc1e3" />
          <rect x="15" y="35" width="50" height="35" fill="#ffc1e3" />
          <rect x="85" y="30" width="55" height="40" fill="#ffc1e3" />
          {/* Bright Petal Pixels */}
          <rect x="45" y="20" width="15" height="12" fill="#ffffff" opacity="0.6" />
          <rect x="95" y="40" width="18" height="14" fill="#ffffff" opacity="0.6" />
        </svg>
      </div>

      {/* Right Tree */}
      <div className="absolute bottom-6 right-2 md:right-8 w-48 md:w-60 h-76 z-10">
        <svg viewBox="0 0 160 220" className="w-full h-full filter drop-shadow-[2px_2px_0px_#2b2538]">
          {/* Tree Trunk */}
          <rect x="74" y="105" width="18" height="115" fill="#5c4033" />
          <rect x="64" y="135" width="12" height="22" fill="#5c4033" />
          <rect x="90" y="125" width="14" height="18" fill="#5c4033" />
          <rect x="62" y="195" width="40" height="25" fill="#4a332a" />
          {/* Sakura Blossom Clouds */}
          <rect x="30" y="25" width="100" height="95" fill="#e57373" />
          <rect x="10" y="40" width="140" height="70" fill="#e57373" />
          <rect x="20" y="15" width="120" height="90" fill="#f48fb1" />
          <rect x="5" y="30" width="150" height="65" fill="#f48fb1" />
          <rect x="35" y="0" width="90" height="45" fill="#f48fb1" />
          <rect x="30" y="10" width="75" height="50" fill="#ffc1e3" />
          <rect x="12" y="30" width="55" height="40" fill="#ffc1e3" />
          <rect x="90" y="25" width="60" height="45" fill="#ffc1e3" />
          <rect x="40" y="15" width="16" height="14" fill="#ffffff" opacity="0.6" />
          <rect x="100" y="35" width="20" height="15" fill="#ffffff" opacity="0.6" />
        </svg>
      </div>

      {/* 8. Floating & Drifting Sakura Petals */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-sakura-fall"
          style={{
            left: `${petal.left}%`,
            top: `${petal.top}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            backgroundColor: '#ffb7d5',
            border: '1px solid #f06292',
            boxShadow: '1px 1px 0px rgba(0,0,0,0.15)',
            opacity: petal.opacity,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

