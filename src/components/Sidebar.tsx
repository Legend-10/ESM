import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Clock, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
  { id: 'schedule', name: 'Schedule', icon: Calendar, permission: 'manage_schedules' },
  { id: 'employees', name: 'Employees', icon: Users, permission: 'manage_employees' },
  { id: 'time-tracking', name: 'Time Tracking', icon: Clock, permission: 'clock_in_out' },
  { id: 'reports', name: 'Reports', icon: BarChart3, permission: 'view_reports' },
  { id: 'settings', name: 'Settings', icon: Settings, permission: 'manage_settings' },
];

export function Sidebar({ isOpen, currentView, onViewChange }: SidebarProps) {
  const { currentUser } = useApp();

  if (!isOpen) return null;

  const hasPermission = (permission: string) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return currentUser.permissions.some(p => p.name === permission);
  };

  const filteredNavigation = navigation.filter(item => hasPermission(item.permission));

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ShiftPro</h1>
              <p className="text-xs text-gray-500">Workforce Scheduling</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-blue-900 mb-1">Pro Tip</h3>
          <p className="text-xs text-blue-700">
            Use bulk scheduling to assign multiple employees to shifts quickly.
          </p>
        </div>
      </div>
    </div>
  );
}