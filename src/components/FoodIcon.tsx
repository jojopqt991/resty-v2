
import React from 'react';

interface FoodIconProps {
  icon: string;
  color: string;
  size: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
}

export default function FoodIcon({
  icon,
  color,
  size,
  top,
  left,
  delay,
  duration,
}: FoodIconProps) {
  return (
    <div 
      className="absolute rounded-full flex items-center justify-center opacity-80"
      style={{
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        animation: `float ${duration} ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      {icon}
    </div>
  );
}
