import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../../components/GlassCard';
import { RoundedButton } from '../../components/RoundedButton';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { ArrowLeft, Bell } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationSettings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    lowStockAlerts: true,
    promotions: false,
    orderUpdates: true,
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false
  });

  const handleSave = () => {
    toast.success('Notification preferences saved');
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
              <Bell className="w-6 h-6 text-[#fdf5e6]" />
            </div>
            <div>
              <h1 className="text-[#fdf5e6]">Notifications</h1>
              <p className="text-[#fdf5e6]/70 text-sm">Manage your notification preferences</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-4">
          <h3 className="text-[#fdf5e6] mb-4">Alert Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="budgetAlerts" className="text-[#fdf5e6]">Budget Alerts</Label>
                <p className="text-[#fdf5e6]/60 text-sm">Get notified when you exceed your budget</p>
              </div>
              <Switch
                id="budgetAlerts"
                checked={notifications.budgetAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, budgetAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="lowStockAlerts" className="text-[#fdf5e6]">Low Stock Alerts</Label>
                <p className="text-[#fdf5e6]/60 text-sm">Notify when products are running low</p>
              </div>
              <Switch
                id="lowStockAlerts"
                checked={notifications.lowStockAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, lowStockAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="orderUpdates" className="text-[#fdf5e6]">Order Updates</Label>
                <p className="text-[#fdf5e6]/60 text-sm">Get updates on your orders</p>
              </div>
              <Switch
                id="orderUpdates"
                checked={notifications.orderUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="promotions" className="text-[#fdf5e6]">Promotions & Offers</Label>
                <p className="text-[#fdf5e6]/60 text-sm">Receive promotional emails and offers</p>
              </div>
              <Switch
                id="promotions"
                checked={notifications.promotions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-4">
          <h3 className="text-[#fdf5e6] mb-4">Notification Channels</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="text-[#fdf5e6]">Email Notifications</Label>
                <p className="text-[#fdf5e6]/60 text-sm">Receive notifications via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications" className="text-[#fdf5e6]">Push Notifications</Label>
                <p className="text-[#fdf5e6]/60 text-sm">Get push notifications on your device</p>
              </div>
              <Switch
                id="pushNotifications"
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications" className="text-[#fdf5e6]">SMS Notifications</Label>
                <p className="text-[#fdf5e6]/60 text-sm">Receive text message alerts</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
              />
            </div>
          </div>
        </GlassCard>

        <RoundedButton onClick={handleSave} className="w-full">
          Save Preferences
        </RoundedButton>
      </div>
    </div>
  );
}
