import React, { useState } from 'react';
import { Save, Bell, Users, Clock, Shield, Globe, Building, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    companyName: 'ABC Retail Store',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    workWeekStart: 'monday',
    defaultShiftLength: '8',
    overtimeThreshold: '40',
    autoApproveTimeOff: false,
    emailNotifications: true,
    pushNotifications: true,
    scheduleReminders: true,
    timeclockNotifications: false
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Building },
    { id: 'scheduling', name: 'Scheduling', icon: Clock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const handleSave = () => {
    addNotification({
      title: 'Settings Saved',
      message: 'Your settings have been successfully updated',
      type: 'success',
      read: false
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
        <input
          type="text"
          value={settings.companyName}
          onChange={(e) => updateSetting('companyName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => updateSetting('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.currency}
            onChange={(e) => updateSetting('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select
            value={settings.dateFormat}
            onChange={(e) => updateSetting('dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Work Week Starts On</label>
          <select
            value={settings.workWeekStart}
            onChange={(e) => updateSetting('workWeekStart', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSchedulingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Shift Length (hours)</label>
          <input
            type="number"
            value={settings.defaultShiftLength}
            onChange={(e) => updateSetting('defaultShiftLength', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Threshold (hours/week)</label>
          <input
            type="number"
            value={settings.overtimeThreshold}
            onChange={(e) => updateSetting('overtimeThreshold', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Auto-approve Time Off Requests</h4>
          <p className="text-sm text-gray-500">Automatically approve time off requests under 1 day</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoApproveTimeOff}
            onChange={(e) => updateSetting('autoApproveTimeOff', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-500">Receive push notifications in browser</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Schedule Reminders</h4>
            <p className="text-sm text-gray-500">Remind employees about upcoming shifts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.scheduleReminders}
              onChange={(e) => updateSetting('scheduleReminders', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Time Clock Notifications</h4>
            <p className="text-sm text-gray-500">Notify when employees clock in/out</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.timeclockNotifications}
              onChange={(e) => updateSetting('timeclockNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              User Management
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Manage user roles and permissions through the Employee Management section. You can assign different permission levels to control access to various features.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Current User Roles</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">Administrator</span>
              <p className="text-sm text-gray-500">Full access to all features</p>
            </div>
            <span className="text-sm text-gray-600">1 user</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">Manager</span>
              <p className="text-sm text-gray-500">Can manage schedules and employees</p>
            </div>
            <span className="text-sm text-gray-600">1 user</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">Employee</span>
              <p className="text-sm text-gray-500">Can view schedules and clock in/out</p>
            </div>
            <span className="text-sm text-gray-600">3 users</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Security Status: Good
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Your account security settings are properly configured.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Security Features</h4>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
            <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
            <button 
              onClick={() => addNotification({
                title: '2FA Setup',
                message: 'Two-factor authentication setup initiated',
                type: 'info',
                read: false
              })}
              className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enable 2FA
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-900">Session Management</h5>
            <p className="text-sm text-gray-500 mt-1">Manage active sessions and device access</p>
            <button className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              View Sessions
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-900">API Access</h5>
            <p className="text-sm text-gray-500 mt-1">Manage API keys and third-party integrations</p>
            <button className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Manage API Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'scheduling':
        return renderSchedulingSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'users':
        return renderUserManagement();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your ShiftPro configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-blue-700' : 'text-gray-500'}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {tabs.find(tab => tab.id === activeTab)?.name} Settings
            </h2>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}