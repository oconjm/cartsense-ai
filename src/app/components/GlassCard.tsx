import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div 
      className={`backdrop-blur-md bg-gradient-to-br from-[#2d5a3f]/30 to-[#1b4d2e]/20 border border-[#fdf5e6]/20 rounded-2xl p-6 shadow-lg ${className}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(27, 77, 46, 0.37)',
      }}
    >
      {children}
    </div>
  );
}
