import React from 'react';

interface CelestialCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'crimson' | 'blue' | 'stealth' | 'active' | 'celestial' | 'lunar' | 'rose' | 'gold';
  interactive?: boolean;
  glow?: boolean;
  webAccent?: boolean;
  onClick?: () => void;
  id?: string;
}

export const CelestialCard: React.FC<CelestialCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  glow = false,
  onClick,
  id,
}) => {
  const variantStyles = {
    default: 'bg-[#090d22]/80 border-[#a78bfa]/20 hover:border-[#c4b5fd]/40 shadow-[0_4px_25px_rgba(0,0,0,0.4)]',
    active: 'bg-[#101533]/90 border-[#c4b5fd]/50 shadow-[0_0_25px_rgba(167,139,250,0.18)]',
    crimson: 'bg-gradient-to-br from-[#2a1322]/80 via-[#0a0e20] to-[#0a0e20] border-[#f472b6]/30 hover:border-[#f472b6]/60 shadow-[0_0_20px_rgba(244,114,182,0.12)]',
    blue: 'bg-gradient-to-br from-[#131c38]/80 via-[#0a0e20] to-[#0a0e20] border-[#60a5fa]/30 hover:border-[#60a5fa]/60 shadow-[0_0_20px_rgba(96,165,250,0.12)]',
    stealth: 'bg-[#060918]/90 border-[#334155]/50 hover:border-[#64748b]/50',
    celestial: 'bg-gradient-to-br from-[#14143a]/80 via-[#090d22] to-[#1a1233] border-[#c4b5fd]/30 shadow-[0_0_25px_rgba(196,181,253,0.15)]',
    lunar: 'bg-[#0a0e24]/85 border-[#c4b5fd]/25 shadow-[0_0_20px_rgba(167,139,250,0.1)]',
    rose: 'bg-gradient-to-br from-[#251224]/80 to-[#0a0e20] border-[#f472b6]/35 shadow-[0_0_20px_rgba(244,114,182,0.12)]',
    gold: 'bg-gradient-to-br from-[#241a0e]/80 to-[#0a0e20] border-[#fbbf24]/35 shadow-[0_0_20px_rgba(251,191,36,0.12)]',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        relative rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden
        ${variantStyles[variant] || variantStyles.default}
        ${interactive ? 'cursor-pointer active:scale-[0.99] hover:-translate-y-0.5' : ''}
        ${glow ? 'shadow-[0_0_30px_rgba(167,139,250,0.2)]' : ''}
        ${className}
      `}
    >
      {/* Delicate celestial constellation corner stars */}
      <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#c4b5fd]/70 pointer-events-none z-10" />
      <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-[#fef08a]/70 pointer-events-none z-10" />
      <div className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full bg-[#fbcfe8]/70 pointer-events-none z-10" />
      <div className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#c4b5fd]/70 pointer-events-none z-10" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const HudCard = CelestialCard;
