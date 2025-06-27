import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Employee, Shift, TimeEntry, Department, Notification, User, Permission } from '../types';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface AppContextType {
  // User Management
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Employee Management
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'permissions'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  
  // Shift Management
  shifts: Shift[];
  addShift: (shift: Omit<Shift, 'id' | 'employee_name' | 'role' | 'department'>) => Promise<void>;
  updateShift: (id: string, shift: Partial<Shift>) => Promise<void>;
  deleteShift: (id: string) => Promise<void>;
  
  // Time Tracking
  timeEntries: TimeEntry[];
  clockIn: (employeeId: string) => Promise<void>;
  clockOut: (employeeId: string) => Promise<void>;
  
  // Departments
  departments: Department[];
  addDepartment: (department: Omit<Department, 'id'>) => Promise<void>;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  
  // Permissions
  permissions: Permission[];
  updateEmployeePermissions: (employeeId: string, permissions: Permission[]) => Promise<void>;
  
  // Loading states
  loading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'admin',
    permissions: []
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadPermissions(),
        loadDepartments(),
        loadEmployees(),
        loadShifts(),
        loadTimeEntries(),
        loadNotifications()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('module', { ascending: true });

    if (error) throw error;
    setPermissions(data || []);
  };

  const loadDepartments = async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    setDepartments(data || []);
  };

  const loadEmployees = async () => {
    const { data: employeesData, error: employeesError } = await supabase
      .from('employees')
      .select(`
        *,
        departments(name),
        employee_permissions(
          permissions(*)
        )
      `)
      .order('name', { ascending: true });

    if (employeesError) throw employeesError;

    const formattedEmployees: Employee[] = (employeesData || []).map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      department: emp.departments?.name || 'Unknown',
      department_id: emp.department_id,
      status: emp.status,
      start_date: emp.start_date,
      hourly_rate: emp.hourly_rate,
      permissions: emp.employee_permissions?.map((ep: any) => ep.permissions) || []
    }));

    setEmployees(formattedEmployees);
  };

  const loadShifts = async () => {
    const { data, error } = await supabase
      .from('shifts')
      .select(`
        *,
        employees(name, role, departments(name))
      `)
      .order('date', { ascending: true });

    if (error) throw error;

    const formattedShifts: Shift[] = (data || []).map(shift => ({
      id: shift.id,
      employee_id: shift.employee_id,
      employee_name: shift.employees?.name || 'Unknown',
      role: shift.employees?.role || 'Unknown',
      start_time: shift.start_time,
      end_time: shift.end_time,
      date: new Date(shift.date),
      status: shift.status,
      notes: shift.notes,
      department: shift.employees?.departments?.name || 'Unknown'
    }));

    setShifts(formattedShifts);
  };

  const loadTimeEntries = async () => {
    const { data, error } = await supabase
      .from('time_entries')
      .select(`
        *,
        employees(name)
      `)
      .order('date', { ascending: false });

    if (error) throw error;

    const formattedTimeEntries: TimeEntry[] = (data || []).map(entry => ({
      id: entry.id,
      employee_id: entry.employee_id,
      employee_name: entry.employees?.name || 'Unknown',
      date: entry.date,
      clock_in: entry.clock_in,
      clock_out: entry.clock_out,
      break_time: entry.break_time,
      total_hours: entry.total_hours,
      status: entry.status,
      overtime: entry.overtime
    }));

    setTimeEntries(formattedTimeEntries);
  };

  const loadNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const formattedNotifications: Notification[] = (data || []).map(notif => ({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      timestamp: new Date(notif.created_at),
      read: notif.read,
      user_id: notif.user_id
    }));

    setNotifications(formattedNotifications);
  };

  const addEmployee = async (employee: Omit<Employee, 'id' | 'permissions'>) => {
    const { data, error } = await supabase
      .from('employees')
      .insert({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        department_id: employee.department_id,
        status: employee.status,
        start_date: employee.start_date,
        hourly_rate: employee.hourly_rate
      })
      .select()
      .single();

    if (error) throw error;

    // Add default permissions
    const defaultPermissions = permissions.filter(p => 
      ['view_dashboard', 'clock_in_out', 'view_own_schedule', 'request_time_off'].includes(p.name)
    );

    if (defaultPermissions.length > 0) {
      await supabase
        .from('employee_permissions')
        .insert(
          defaultPermissions.map(perm => ({
            employee_id: data.id,
            permission_id: perm.id
          }))
        );
    }

    await loadEmployees();
    await addNotification({
      title: 'Employee Added',
      message: `${employee.name} has been added to the system`,
      type: 'success',
      read: false
    });
  };

  const updateEmployee = async (id: string, updatedEmployee: Partial<Employee>) => {
    const { error } = await supabase
      .from('employees')
      .update({
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        phone: updatedEmployee.phone,
        role: updatedEmployee.role,
        department_id: updatedEmployee.department_id,
        status: updatedEmployee.status,
        hourly_rate: updatedEmployee.hourly_rate
      })
      .eq('id', id);

    if (error) throw error;

    await loadEmployees();
    await addNotification({
      title: 'Employee Updated',
      message: 'Employee information has been updated',
      type: 'info',
      read: false
    });
  };

  const deleteEmployee = async (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await loadEmployees();
    await loadShifts();
    await loadTimeEntries();

    if (employee) {
      await addNotification({
        title: 'Employee Removed',
        message: `${employee.name} has been removed from the system`,
        type: 'warning',
        read: false
      });
    }
  };

  const addShift = async (shift: Omit<Shift, 'id' | 'employee_name' | 'role' | 'department'>) => {
    const { data, error } = await supabase
      .from('shifts')
      .insert({
        employee_id: shift.employee_id,
        start_time: shift.start_time,
        end_time: shift.end_time,
        date: format(shift.date, 'yyyy-MM-dd'),
        status: shift.status,
        notes: shift.notes
      })
      .select()
      .single();

    if (error) throw error;

    await loadShifts();
    
    const employee = employees.find(emp => emp.id === shift.employee_id);
    await addNotification({
      title: 'Shift Created',
      message: `New shift assigned to ${employee?.name || 'employee'}`,
      type: 'success',
      read: false
    });
  };

  const updateShift = async (id: string, updatedShift: Partial<Shift>) => {
    const updateData: any = {};
    
    if (updatedShift.start_time) updateData.start_time = updatedShift.start_time;
    if (updatedShift.end_time) updateData.end_time = updatedShift.end_time;
    if (updatedShift.status) updateData.status = updatedShift.status;
    if (updatedShift.notes !== undefined) updateData.notes = updatedShift.notes;

    const { error } = await supabase
      .from('shifts')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    await loadShifts();
  };

  const deleteShift = async (id: string) => {
    const shift = shifts.find(s => s.id === id);
    
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await loadShifts();

    if (shift) {
      await addNotification({
        title: 'Shift Cancelled',
        message: `Shift for ${shift.employee_name} has been cancelled`,
        type: 'warning',
        read: false
      });
    }
  };

  const clockIn = async (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm:ss');

    // Check if already clocked in today
    const { data: existingEntry } = await supabase
      .from('time_entries')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .eq('status', 'active')
      .single();

    if (existingEntry) {
      await addNotification({
        title: 'Already Clocked In',
        message: `${employee.name} is already clocked in`,
        type: 'warning',
        read: false
      });
      return;
    }

    const { error } = await supabase
      .from('time_entries')
      .insert({
        employee_id: employeeId,
        date: today,
        clock_in: currentTime,
        status: 'active'
      });

    if (error) throw error;

    await loadTimeEntries();
    await addNotification({
      title: 'Clocked In',
      message: `${employee.name} clocked in at ${format(new Date(), 'HH:mm')}`,
      type: 'success',
      read: false
    });
  };

  const clockOut = async (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm:ss');

    // Find active entry
    const { data: activeEntry } = await supabase
      .from('time_entries')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .eq('status', 'active')
      .single();

    if (!activeEntry) {
      await addNotification({
        title: 'Not Clocked In',
        message: `${employee.name} is not currently clocked in`,
        type: 'warning',
        read: false
      });
      return;
    }

    // Calculate total hours
    const clockInTime = new Date(`${today} ${activeEntry.clock_in}`);
    const clockOutTime = new Date(`${today} ${currentTime}`);
    const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

    const { error } = await supabase
      .from('time_entries')
      .update({
        clock_out: currentTime,
        total_hours: Math.round(totalHours * 100) / 100,
        status: 'completed',
        overtime: totalHours > 8
      })
      .eq('id', activeEntry.id);

    if (error) throw error;

    await loadTimeEntries();
    await addNotification({
      title: 'Clocked Out',
      message: `${employee.name} clocked out at ${format(new Date(), 'HH:mm')}`,
      type: 'success',
      read: false
    });
  };

  const addDepartment = async (department: Omit<Department, 'id'>) => {
    const { error } = await supabase
      .from('departments')
      .insert({
        name: department.name,
        description: department.description,
        manager_id: department.manager_id
      });

    if (error) throw error;

    await loadDepartments();
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const { error } = await supabase
      .from('notifications')
      .insert({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        user_id: notification.user_id
      });

    if (error) throw error;

    await loadNotifications();
  };

  const markNotificationRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;

    await loadNotifications();
  };

  const updateEmployeePermissions = async (employeeId: string, newPermissions: Permission[]) => {
    // Delete existing permissions
    await supabase
      .from('employee_permissions')
      .delete()
      .eq('employee_id', employeeId);

    // Insert new permissions
    if (newPermissions.length > 0) {
      const { error } = await supabase
        .from('employee_permissions')
        .insert(
          newPermissions.map(perm => ({
            employee_id: employeeId,
            permission_id: perm.id
          }))
        );

      if (error) throw error;
    }

    await loadEmployees();
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      shifts,
      addShift,
      updateShift,
      deleteShift,
      timeEntries,
      clockIn,
      clockOut,
      departments,
      addDepartment,
      notifications,
      addNotification,
      markNotificationRead,
      permissions,
      updateEmployeePermissions,
      loading,
      error,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}