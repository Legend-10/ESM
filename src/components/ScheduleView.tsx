import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter, Download, Edit, Trash2 } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { useApp } from '../context/AppContext';
import { Shift } from '../types';

export function ScheduleView() {
  const { shifts, employees, addShift, updateShift, deleteShift } = useApp();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const navigateWeek = (direction: 'prev' | 'next') => {
    const days = direction === 'next' ? 7 : -7;
    setCurrentWeek(addDays(currentWeek, days));
  };

  const getShiftsForDay = (date: Date) => {
    return shifts.filter(shift => isSameDay(shift.date, date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddShift = (formData: FormData) => {
    if (!selectedDate) return;
    
    const employeeId = formData.get('employeeId') as string;
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const newShift = {
      employeeId,
      employeeName: employee.name,
      role: employee.role,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      date: selectedDate,
      status: 'scheduled' as const,
      department: employee.department,
      notes: formData.get('notes') as string || undefined,
    };
    
    addShift(newShift);
    setShowAddModal(false);
    setSelectedDate(null);
  };

  const handleEditShift = (formData: FormData) => {
    if (!selectedShift) return;
    
    const updatedShift = {
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      status: formData.get('status') as 'scheduled' | 'confirmed' | 'completed' | 'cancelled',
      notes: formData.get('notes') as string || undefined,
    };
    
    updateShift(selectedShift.id, updatedShift);
    setShowEditModal(false);
    setSelectedShift(null);
  };

  const handleDeleteShift = (shift: Shift) => {
    if (confirm(`Are you sure you want to delete this shift for ${shift.employeeName}?`)) {
      deleteShift(shift.id);
    }
  };

  const totalShifts = shifts.filter(shift => 
    shift.date >= weekStart && shift.date <= addDays(weekStart, 6)
  ).length;

  const confirmedShifts = shifts.filter(shift => 
    shift.date >= weekStart && shift.date <= addDays(weekStart, 6) && shift.status === 'confirmed'
  ).length;

  const scheduledShifts = shifts.filter(shift => 
    shift.date >= weekStart && shift.date <= addDays(weekStart, 6) && shift.status === 'scheduled'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600">Manage employee schedules and shifts</p>
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

      {/* View Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === 'week' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === 'month' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </h2>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setCurrentWeek(new Date())}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Today
          </button>
        </div>

        {/* Week View */}
        <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Time column header */}
          <div className="bg-gray-50 p-3 text-sm font-medium text-gray-900">
            Time
          </div>
          
          {/* Day headers */}
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="bg-gray-50 p-3 text-center">
              <div className="text-sm font-medium text-gray-900">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-semibold mt-1 ${
                isSameDay(day, new Date()) ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </div>
              <button
                onClick={() => {
                  setSelectedDate(day);
                  setShowAddModal(true);
                }}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800"
              >
                + Add Shift
              </button>
            </div>
          ))}

          {/* Time slots */}
          {Array.from({ length: 12 }, (_, hour) => {
            const timeSlot = `${(hour + 8).toString().padStart(2, '0')}:00`;
            return (
              <React.Fragment key={hour}>
                {/* Time label */}
                <div className="bg-white p-3 text-sm text-gray-600 border-r border-gray-100">
                  {timeSlot}
                </div>
                
                {/* Day columns */}
                {weekDays.map((day) => {
                  const dayShifts = getShiftsForDay(day);
                  const hourShifts = dayShifts.filter(shift => {
                    const shiftHour = parseInt(shift.startTime.split(':')[0]);
                    return shiftHour === hour + 8;
                  });

                  return (
                    <div key={`${day.toISOString()}-${hour}`} className="bg-white p-2 min-h-[60px] relative">
                      {hourShifts.map((shift) => (
                        <div
                          key={shift.id}
                          className={`p-2 rounded border text-xs mb-1 group relative ${getStatusColor(shift.status)}`}
                        >
                          <div className="font-medium">{shift.employeeName}</div>
                          <div className="text-xs">{shift.startTime}-{shift.endTime}</div>
                          <div className="text-xs capitalize">{shift.role}</div>
                          
                          {/* Action buttons */}
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                            <button
                              onClick={() => {
                                setSelectedShift(shift);
                                setShowEditModal(true);
                              }}
                              className="p-1 bg-white rounded shadow hover:bg-gray-50"
                            >
                              <Edit className="h-3 w-3 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteShift(shift)}
                              className="p-1 bg-white rounded shadow hover:bg-gray-50"
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Shifts</span>
              <span className="font-medium">{totalShifts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confirmed</span>
              <span className="font-medium text-green-600">{confirmedShifts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Scheduled</span>
              <span className="font-medium text-blue-600">{scheduledShifts}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Confirmed</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="font-medium">{confirmedShifts}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Scheduled</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="font-medium">{scheduledShifts}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Open</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span className="font-medium">0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full p-3 text-left bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="font-medium text-blue-900">Publish Schedule</div>
              <div className="text-sm text-blue-700">Send to all employees</div>
            </button>
            <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="font-medium text-gray-900">Copy Last Week</div>
              <div className="text-sm text-gray-600">Duplicate previous schedule</div>
            </button>
          </div>
        </div>
      </div>

      {/* Add Shift Modal */}
      {showAddModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Add Shift - {format(selectedDate, 'EEEE, MMM d, yyyy')}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddShift(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                  <select
                    name="employeeId"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Employee</option>
                    {employees.filter(emp => emp.status === 'active').map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedDate(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shift Modal */}
      {showEditModal && selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Edit Shift - {selectedShift.employeeName}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditShift(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      defaultValue={selectedShift.startTime}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue={selectedShift.endTime}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedShift.status}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    defaultValue={selectedShift.notes || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedShift(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}