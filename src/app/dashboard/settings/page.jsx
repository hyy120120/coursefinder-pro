'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Settings, Save, Lock, Bell, Eye, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    // General
    agencyName: profile?.agencyName || '',
    email: user?.email || '',
    phone: '',
    website: '',

    // Branding
    brandColor: '#0284c7',
    logoUrl: '',
    companyDescription: '',

    // Notifications
    emailNotifications: true,
    statusUpdates: true,
    weeklyReports: true,
    commissionAlerts: true,

    // Privacy
    makeProfilePublic: false,
    allowAgentDiscovery: true,
    shareCommissionData: false,
  });

  async function handleSave() {
    setLoading(true);
    try {
      // TODO: Save settings to Firestore
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-subtitle">Manage your agency profile and preferences</p>
      </div>

      {/* Tabs */}
      <div className="card">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-slate-900">Agency Information</h3>

              <div>
                <label className="label-field">Agency Name *</label>
                <input
                  type="text"
                  value={settings.agencyName}
                  onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Email *</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="input-field"
                    disabled
                  />
                </div>
                <div>
                  <label className="label-field">Phone</label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="input-field"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="label-field">Website</label>
                <input
                  type="url"
                  value={settings.website}
                  onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                  className="input-field"
                  placeholder="https://youragency.com"
                />
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="btn-secondary">Cancel</button>
              </div>
            </div>
          )}

          {/* Branding Settings */}
          {activeTab === 'branding' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-slate-900">White-Label Branding</h3>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>White-label</strong> - Customize CourseFinder with your agency's branding
                </p>
              </div>

              <div>
                <label className="label-field">Brand Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={settings.brandColor}
                    onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={settings.brandColor}
                    onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                    className="input-field flex-1"
                    placeholder="#0284c7"
                  />
                </div>
              </div>

              <div>
                <label className="label-field">Logo URL</label>
                <input
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://yoursite.com/logo.png"
                />
                {settings.logoUrl && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <img src={settings.logoUrl} alt="Logo" className="h-12" />
                  </div>
                )}
              </div>

              <div>
                <label className="label-field">Company Description</label>
                <textarea
                  value={settings.companyDescription}
                  onChange={(e) => setSettings({ ...settings, companyDescription: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Tell us about your agency..."
                />
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Branding'}
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-slate-900">Email Notifications</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Email Notifications</p>
                    <p className="text-sm text-slate-600 mt-1">Receive email updates about your account</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Status Updates</p>
                    <p className="text-sm text-slate-600 mt-1">Notify when application status changes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.statusUpdates}
                    onChange={(e) => setSettings({ ...settings, statusUpdates: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                    disabled={!settings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Weekly Reports</p>
                    <p className="text-sm text-slate-600 mt-1">Get weekly summary of your activities</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                    disabled={!settings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Commission Alerts</p>
                    <p className="text-sm text-slate-600 mt-1">Notify when commission is earned or paid</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.commissionAlerts}
                    onChange={(e) => setSettings({ ...settings, commissionAlerts: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                    disabled={!settings.emailNotifications}
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-slate-900">Privacy & Visibility</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Public Profile</p>
                    <p className="text-sm text-slate-600 mt-1">Let universities discover your agency</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.makeProfilePublic}
                    onChange={(e) => setSettings({ ...settings, makeProfilePublic: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Agent Discovery</p>
                    <p className="text-sm text-slate-600 mt-1">Allow other agents to find your profile</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowAgentDiscovery}
                    onChange={(e) => setSettings({ ...settings, allowAgentDiscovery: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Share Commission Data</p>
                    <p className="text-sm text-slate-600 mt-1">Help us improve by sharing anonymous data</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.shareCommissionData}
                    onChange={(e) => setSettings({ ...settings, shareCommissionData: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Privacy Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-2 border-red-200 bg-red-50">
        <h3 className="font-semibold text-red-900 mb-4">⚠️ Danger Zone</h3>
        <p className="text-sm text-red-800 mb-4">
          These actions are irreversible. Proceed with caution.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-100 font-medium transition-colors">
            Change Password
          </button>
          <button className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-100 font-medium transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
