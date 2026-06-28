import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../../components/GlassCard';
import { RoundedButton } from '../../components/RoundedButton';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { ArrowLeft, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export function BudgetSettings() {
  const navigate = useNavigate();
  const [budgetConfig, setBudgetConfig] = useState({
    defaultBudget: '100.00',
    weeklyBudget: '500.00',
    monthlyBudget: '2000.00',
    enableWeeklyLimit: false,
    enableMonthlyLimit: true,
    warningThreshold: '80',
    autoReset: true
  });

  const handleSave = () => {
    toast.success('Budget settings saved successfully');
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
              <DollarSign className="w-6 h-6 text-[#fdf5e6]" />
            </div>
            <div>
              <h1 className="text-[#fdf5e6]">Budget Settings</h1>
              <p className="text-[#fdf5e6]/70 text-sm">Configure your shopping budgets</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-4">
          <h3 className="text-[#fdf5e6] mb-4">Budget Limits</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="defaultBudget" className="text-[#fdf5e6] mb-2 block">Default Shopping Budget ($)</Label>
              <Input
                id="defaultBudget"
                type="number"
                step="0.01"
                value={budgetConfig.defaultBudget}
                onChange={(e) => setBudgetConfig({ ...budgetConfig, defaultBudget: e.target.value })}
                className="bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6]"
              />
              <p className="text-[#fdf5e6]/60 text-xs mt-1">This will be your default budget for each shopping trip</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="weeklyBudget" className="text-[#fdf5e6]">Weekly Budget Limit ($)</Label>
                <Switch
                  checked={budgetConfig.enableWeeklyLimit}
                  onCheckedChange={(checked) => setBudgetConfig({ ...budgetConfig, enableWeeklyLimit: checked })}
                />
              </div>
              <Input
                id="weeklyBudget"
                type="number"
                step="0.01"
                value={budgetConfig.weeklyBudget}
                onChange={(e) => setBudgetConfig({ ...budgetConfig, weeklyBudget: e.target.value })}
                disabled={!budgetConfig.enableWeeklyLimit}
                className="bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6] disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="monthlyBudget" className="text-[#fdf5e6]">Monthly Budget Limit ($)</Label>
                <Switch
                  checked={budgetConfig.enableMonthlyLimit}
                  onCheckedChange={(checked) => setBudgetConfig({ ...budgetConfig, enableMonthlyLimit: checked })}
                />
              </div>
              <Input
                id="monthlyBudget"
                type="number"
                step="0.01"
                value={budgetConfig.monthlyBudget}
                onChange={(e) => setBudgetConfig({ ...budgetConfig, monthlyBudget: e.target.value })}
                disabled={!budgetConfig.enableMonthlyLimit}
                className="bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6] disabled:opacity-50"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-4">
          <h3 className="text-[#fdf5e6] mb-4">Budget Alerts</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="warningThreshold" className="text-[#fdf5e6] mb-2 block">
                Warning Threshold (%)
              </Label>
              <Input
                id="warningThreshold"
                type="number"
                min="0"
                max="100"
                value={budgetConfig.warningThreshold}
                onChange={(e) => setBudgetConfig({ ...budgetConfig, warningThreshold: e.target.value })}
                className="bg-[#1b4d2e]/40 border-[#fdf5e6]/20 text-[#fdf5e6]"
              />
              <p className="text-[#fdf5e6]/60 text-xs mt-1">
                You'll be warned when you reach {budgetConfig.warningThreshold}% of your budget
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoReset" className="text-[#fdf5e6]">Auto-Reset Budget</Label>
                <p className="text-[#fdf5e6]/60 text-sm">Automatically reset budget after each shopping trip</p>
              </div>
              <Switch
                id="autoReset"
                checked={budgetConfig.autoReset}
                onCheckedChange={(checked) => setBudgetConfig({ ...budgetConfig, autoReset: checked })}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-[#fdf5e6]">Spending Insights</p>
              <p className="text-[#fdf5e6]/60 text-sm">
                Your average spending: <span className="text-green-400">$147.50</span> per trip
              </p>
            </div>
          </div>
        </GlassCard>

        <RoundedButton onClick={handleSave} className="w-full">
          Save Budget Settings
        </RoundedButton>
      </div>
    </div>
  );
}
