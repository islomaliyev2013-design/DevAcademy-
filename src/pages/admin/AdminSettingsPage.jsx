import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { Settings, Shield, Sparkles, Database, Save } from 'lucide-react';

export function AdminSettingsPage() {
  const { addToast } = useToast();
  const [platformName, setPlatformName] = useState('DevAcademy Pro');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [aiMentorEnabled, setAiMentorEnabled] = useState(true);
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(30);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('Platform settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Platform Configuration & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Adjust global security, AI rate limits, registration policies, and database parameters.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* General Settings */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-600" />
            <span>General Platform Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Platform Name"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
            />
            <Input
              label="Support Email"
              defaultValue="support@devacademy.pro"
              disabled
            />
          </div>
        </Card>

        {/* Security & Access */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Registration & Security Policy</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Public Student Registration</p>
                <p className="text-[11px] text-slate-500">
                  Allow visitors to create accounts (strictly student role by default).
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowRegistration}
                onChange={(e) => setAllowRegistration(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Maintenance Mode</p>
                <p className="text-[11px] text-slate-500">
                  Temporarily display a maintenance banner to non-admin visitors.
                </p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* AI Mentor Settings */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>AI Mentor & Playground Configuration</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Enable AI Mentor Service</p>
                <p className="text-[11px] text-slate-500">
                  Allows students to request code debugging and explanations via Supabase Edge Function.
                </p>
              </div>
              <input
                type="checkbox"
                checked={aiMentorEnabled}
                onChange={(e) => setAiMentorEnabled(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Rate Limit per Student (Requests / minute)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={rateLimitPerMinute}
                onChange={(e) => setRateLimitPerMinute(e.target.value)}
                className="w-36 p-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" icon={Save}>
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
