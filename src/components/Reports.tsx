import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Users, Clock, DollarSign, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export function Reports() {
  const { employees, shifts, timeEntries, departments } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [reportType, setReportType] = useState('overview');

  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Overview' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'scheduling', label: 'Scheduling' }
  ];

  // Calculate metrics
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  const attendanceRate = timeEntries.length > 0 
    ? (timeEntries.filter(entry => entry.status !== 'missed').length / timeEntries.length * 100).toFixed(1)
    : '0.0';
  const overtimeHours = timeEntries.filter(entry => entry.overtime).reduce((sum, entry) => sum + (entry.totalHours - 8), 0);
  const payrollCost = employees.reduce((sum, emp) => {
    const empHours = timeEntries
      .filter(entry => entry.employeeId === emp.id)
      .reduce((hours, entry) => hours + entry.totalHours, 0);
    return sum + (empHours * emp.hourlyRate);
  }, 0);

  const metrics = [
    {
      name: 'Total Hours Worked',
      value: Math.round(totalHours).toString(),
      change: '+12.5%',
      changeType: 'positive',
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      name: 'Attendance Rate',
      value: `${attendanceRate}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Overtime Hours',
      value: Math.round(overtimeHours).toString(),
      change: '-8.3%',
      changeType: 'negative',
      icon: TrendingUp,
      color: 'bg-yellow-500'
    },
    {
      name: 'Payroll Cost',
      value: `$${Math.round(payrollCost).toLocaleString()}`,
      change: '+5.7%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-purple-500'
    }
  ];

  // Generate attendance data for the week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const attendanceData = Array.from({ length: 7 }, (_, i) => {
    const day = format(new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000), 'EEE');
    const dayEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getDay() === (i + 1) % 7;
    });
    
    const present = dayEntries.filter(entry => entry.status !== 'missed').length;
    const absent = dayEntries.filter(entry => entry.status === 'missed').length;
    const late = Math.floor(Math.random() * 3); // Mock data for late arrivals
    
    return { day, present, absent, late };
  });

  // Department statistics
  const departmentStats = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept.name);
    const deptHours = timeEntries
      .filter(entry => deptEmployees.some(emp => emp.id === entry.employeeId))
      .reduce((sum, entry) => sum + entry.totalHours, 0);
    const avgHours = deptEmployees.length > 0 ? deptHours / deptEmployees.length : 0;
    
    return {
      name: dept.name,
      employees: deptEmployees.length,
      hours: Math.round(deptHours),
      avgHours: Math.round(avgHours * 10) / 10
    };
  });

  const recentReports = [
    { name: 'Weekly Attendance Report', date: format(new Date(), 'yyyy-MM-dd'), type: 'Attendance', size: '2.4 MB' },
    { name: 'Monthly Payroll Summary', date: format(new Date(), 'yyyy-MM-dd'), type: 'Payroll', size: '1.8 MB' },
    { name: 'Overtime Analysis Q4', date: format(new Date(), 'yyyy-MM-dd'), type: 'Analytics', size: '3.2 MB' },
    { name: 'Schedule Effectiveness', date: format(new Date(), 'yyyy-MM-dd'), type: 'Scheduling', size: '1.1 MB' }
  ];

  const exportReport = (reportName: string) => {
    // Mock export functionality
    alert(`Exporting ${reportName}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive workforce insights and reporting</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button 
            onClick={() => exportReport('Current Report')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Attendance</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {attendanceData.map((day, index) => {
              const total = day.present + day.absent + day.late;
              const presentPercentage = total > 0 ? (day.present / total) * 100 : 0;
              
              return (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-10 text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">{day.present} present</span>
                      <span className="text-sm text-gray-500">{presentPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${presentPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 w-20 text-right">
                    {day.absent} absent, {day.late} late
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Statistics</h3>
          
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{dept.name}</h4>
                  <span className="text-sm text-gray-500">{dept.employees} employees</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Hours:</span>
                    <span className="font-medium text-gray-900 ml-1">{dept.hours}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Hours:</span>
                    <span className="font-medium text-gray-900 ml-1">{dept.avgHours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-600">{report.type} • {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">{report.date}</span>
                  <button 
                    onClick={() => exportReport(report.name)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Reports →
          </button>
        </div>
      </div>
    </div>
  );
}