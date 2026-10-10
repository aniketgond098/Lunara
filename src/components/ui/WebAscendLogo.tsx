import React from 'react';
import { LunaraLogo } from './LunaraLogo';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const WebAscendLogo: React.FC<LogoProps> = (props) => {
  return <LunaraLogo {...props} />;
};
