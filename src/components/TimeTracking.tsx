import React, { useState } from 'react';
import { Clock, Play, Pause, Square, Calendar, Download, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';

export function TimeTracking() {
  const { timeEntries, employees, clockIn, clockOut } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const filteredEntries = timeEntries.filter(entry => entry.date === selectedDate);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'active':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'missed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalHoursToday = filteredEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  const activeEmployees = filteredEntries.filter(entry => entry.status === 'active').length;
  const completedShifts = filteredEntries.filter(entry => entry.status === 'completed').length;
  const overtimeHours = filteredEntries.filter(entry => entry.overtime).reduce((sum, entry) => sum + (entry.totalHours - 8), 0);

  const handleClockAction = (action: 'in' | 'out', employeeId?: string) => {
    const targetEmployeeId = employeeId || selectedEmployeeId;
    if (!targetEmployeeId) {
      alert('Please select an employee');
      return;
    }

    if (action === 'in') {
      clockIn(targetEmployeeId);
    } else {
      clockOut(targetEmployeeId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-gray-600">Monitor employee attendance and working hours</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Currently Active</p>
              <p className="text-3xl font-bold text-blue-600">{activeEmployees}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours Today</p>
              <p className="text-3xl font-bold text-green-600">{Math.round(totalHoursToday * 10) / 10}</p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Shifts</p>
              <p className="text-3xl font-bold text-purple-600">{completedShifts}</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overtime Hours</p>
              <p className="text-3xl font-bold text-orange-600">{Math.round(overtimeHours * 10) / 10}</p>
            </div>
            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Clock Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Clock Actions</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose an employee...</option>
            {employees.filter(emp => emp.status === 'active').map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {employee.role}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleClockAction('in')}
            disabled={!selectedEmployeeId}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center space-x-2">
              <Play className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">Clock In</span>
            </div>
            <p className="text-sm text-green-700 mt-1">Start work shift</p>
          </button>

          <button
            onClick={() => handleClockAction('out')}
            disabled={!selectedEmployeeId}
            className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center space-x-2">
              <Square className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-900">Clock Out</span>
            </div>
            <p className="text-sm text-red-700 mt-1">End work shift</p>
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Time Entries</h3>
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Time Entries Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock In
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock Out
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Break Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Hours
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No time entries for {format(new Date(selectedDate), 'MMMM d, yyyy')}
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-medium">
                            {entry.employeeName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{entry.employeeName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.clockIn}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.clockOut || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.breakTime ? `${entry.breakTime} min` : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.totalHours ? `${entry.totalHours}h` : '-'}
                      {entry.overtime && <span className="ml-1 text-orange-600 text-xs">(OT)</span>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entry.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(entry.status)}`}>
                          {entry.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {entry.status === 'active' ? (
                        <button
                          onClick={() => handleClockAction('out', entry.employeeId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Clock Out
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}