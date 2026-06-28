import React from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { RoundedButton } from '../components/RoundedButton';
import { ShoppingCart, Sparkles } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a1f14] via-[#1b4d2e] to-[#0a1f14]">
      <div className="w-full max-w-md">
        <GlassCard className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <ShoppingCart className="w-20 h-20 text-[#fdf5e6]" />
              <Sparkles className="w-8 h-8 text-[#fdf5e6] absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          
          <h1 className="mb-2 text-[#fdf5e6]">Cart Sense</h1>
          <p className="text-[#fdf5e6]/80 mb-8">Smart Shopping Made Simple</p>
          
          <div className="space-y-4">
            <RoundedButton 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Login
            </RoundedButton>
            
            <RoundedButton 
              onClick={() => navigate('/signup')}
              variant="secondary"
              className="w-full"
            >
              Sign Up
            </RoundedButton>
          </div>
          
          <p className="mt-6 text-sm text-[#fdf5e6]/60">
            IoT-powered smart shopping experience
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
