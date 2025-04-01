
import React from 'react';

interface PixelFoodPatternProps {
  className?: string;
}

export default function PixelFoodPattern({ className = '' }: PixelFoodPatternProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div
        className="w-full h-full animate-float"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cpath d='M20 20c0-2.2 1.8-4 4-4h4v4h-4v4h-4v-4zm28-4h4c2.2 0 4 1.8 4 4v4h-4v-4h-4v-4zm-4 36v4h-4v-4h-4v-4h4v-4h4v4h4v4h-4zm28-8v4h-4v-4h-4v-4h4v-4h4v4h4v4h-4z' fill='%23FF7A00' fillOpacity='0.4'/%3E%3Cpath d='M0 0h4v4H0V0zm0 8h4v4H0V8zm8 0h4v4H8V8zm0-8h4v4H8V0zm24 16h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zm0 8h4v4h-4v-4zm0 8h4v4h-4v-4zm-8 0h4v4h-4v-4zm-8 0h4v4h-4v-4zm-8 0h4v4h-4v-4zm-8 0h4v4h-4v-4zm-8 0h4v4h-4v-4zm0-8h4v4h-4v-4zm0-8h4v4h-4v-4zm8 0h4v4h-4v-4z' fill='%237ED957' fillOpacity='0.3'/%3E%3Cpath d='M56 56h4v4h-4v-4zm0-8h4v4h-4v-4zm-8 0h4v4h-4v-4zm-8 0h4v4h-4v-4zm-8 0h4v4h-4v-4zm-8 0h4v4h-4v-4zm0-8h4v4h-4v-4zm0-8h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zm0 8h4v4h-4v-4z' fill='%23E94141' fillOpacity='0.3'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      ></div>
    </div>
  );
}
