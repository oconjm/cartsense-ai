import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/GlassCard';
import { RoundedButton } from '../../components/RoundedButton';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  const handleSave = () => {
    toast.success('Profile updated successfully');
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-[#0a1f14] via-[#1b4d2e] to-[#0a1f14]">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <RoundedButton
            onClick={() => navigate('/settings')}
            variant="secondary"
            className="!px-4 !py-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </RoundedButton>
        </div>

        <GlassCard className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#2d5a3f]/50 flex items-center justify-center">
              <User className="w-6 h-6 text-[#fdf5e6]" />
            </div>
            <div>
              <h1 className="text-[#fdf5e6]">Profile Settings</h1>
              <p className="text-[#fdf5e6]/70 text-sm">Update your personal information</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-[#fdf5e6] mb-2 block">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6]"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-[#fdf5e6] mb-2 block">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6]"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-[#fdf5e6] mb-2 block">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6]"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-[#fdf5e6] mb-2 block">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St, City, State, ZIP"
                className="bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6]"
              />
            </div>
            <RoundedButton onClick={handleSave} className="w-full">
              Save Changes
            </RoundedButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
