import React from 'react';

export const CelestialBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20 select-none">
      {/* Base Midnight Sky Gradient */}
      <div className="absolute inset-0 bg-[#050814]" />

      {/* Luminous Nebula Glows (Lavender, Violet, Dusty Rose) */}
      <div className="absolute -top-24 left-1/4 w-[600px] h-[600px] bg-[#8b5cf6]/[0.07] rounded-full blur-[150px]" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#c4b5fd]/[0.06] rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 left-10 w-[550px] h-[550px] bg-[#f472b6]/[0.05] rounded-full blur-[160px]" />
      <div className="absolute -bottom-20 right-1/3 w-[600px] h-[600px] bg-[#3b82f6]/[0.05] rounded-full blur-[150px]" />

      {/* Soft Moon Aura in Top Right */}
      <div className="absolute top-6 right-16 w-32 h-32 rounded-full bg-gradient-to-tr from-[#c4b5fd]/20 via-[#fef08a]/10 to-transparent blur-2xl" />

      {/* Constellation & Starlight Mesh Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.25]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="starlight-mesh"
            width="180"
            height="180"
            patternUnits="userSpaceOnUse"
          >
            {/* Subtle Star Points */}
            <circle cx="20" cy="30" r="1" fill="#ffffff" opacity="0.6" />
            <circle cx="140" cy="40" r="1.5" fill="#fef08a" opacity="0.8" />
            <circle cx="90" cy="90" r="1.2" fill="#c4b5fd" opacity="0.7" />
            <circle cx="50" cy="150" r="0.8" fill="#ffffff" opacity="0.5" />
            <circle cx="160" cy="130" r="1" fill="#fbcfe8" opacity="0.6" />
            <circle cx="110" cy="160" r="1.5" fill="#ffffff" opacity="0.9" />

            {/* Faint Constellation Vectors */}
            <line x1="20" y1="30" x2="90" y2="90" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3" />
            <line x1="90" y1="90" x2="140" y2="40" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3" />
            <line x1="90" y1="90" x2="110" y2="160" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3" />
            <line x1="110" y1="160" x2="160" y2="130" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#starlight-mesh)" />
      </svg>

      {/* Subtle Celestial Horizon Glow */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0e132c]/50 to-transparent pointer-events-none" />
    </div>
  );
};

export const WebBackground = CelestialBackground;
