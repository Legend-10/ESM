import React from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, isToday } from 'date-fns';

export function Dashboard() {
  const { employees, shifts, timeEntries, notifications } = useApp();

  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const todayShifts = shifts.filter(shift => isToday(shift.date));
  const totalHoursToday = timeEntries
    .filter(entry => entry.date === format(new Date(), 'yyyy-MM-dd'))
    .reduce((sum, entry) => sum + entry.totalHours, 0);
  
  const attendanceRate = timeEntries.length > 0 
    ? (timeEntries.filter(entry => entry.status !== 'missed').length / timeEntries.length * 100).toFixed(1)
    : '0.0';

  const stats = [
    {
      name: 'Total Employees',
      value: activeEmployees.toString(),
      change: '+5.2%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Shifts Today',
      value: todayShifts.length.toString(),
      change: '+12.1%',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Hours Today',
      value: Math.round(totalHoursToday).toString(),
      change: '+8.3%',
      changeType: 'positive',
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      name: 'Attendance Rate',
      value: `${attendanceRate}%`,
      change: '-1.2%',
      changeType: 'negative',
      icon: TrendingUp,
      color: 'bg-yellow-500'
    }
  ];

  const recentAlerts = notifications.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your workforce.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last week</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Shifts */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Today's Shifts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayShifts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No shifts scheduled for today
                </div>
              ) : (
                todayShifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{shift.employeeName}</p>
                        <p className="text-sm text-gray-600">{shift.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{shift.startTime} - {shift.endTime}</p>
                      <div className="flex items-center mt-1">
                        {shift.status === 'confirmed' ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                        )}
                        <span className={`text-xs capitalize ${
                          shift.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {shift.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent alerts
                </div>
              ) : (
                recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                    {alert.type === 'info' && <Clock className="h-5 w-5 text-blue-500 mt-0.5" />}
                    {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-700">{alert.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Schedule</h4>
            <p className="text-sm text-gray-600">Build new weekly schedules</p>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add Employee</h4>
            <p className="text-sm text-gray-600">Register new team members</p>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="h-8 w-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Time Tracking</h4>
            <p className="text-sm text-gray-600">Monitor attendance</p>
          </button>
        </div>
      </div>
    </div>
  );
}