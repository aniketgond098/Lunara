import React from 'react';
import { CelestialIcon } from './CelestialIcon';

interface SpiderIconProps {
  className?: string;
  size?: number | string;
  color?: string;
  glow?: boolean;
}

/**
 * Backwards compatible export for Celestial Emblem in LUNARA
 */
export const SpiderIcon: React.FC<SpiderIconProps> = ({
  className = '',
  size = 24,
  color = '#c4b5fd',
  glow = true,
}) => {
  return <CelestialIcon className={className} size={size} color={color} glow={glow} />;
};
