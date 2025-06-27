export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  department_id?: string;
  status: 'active' | 'inactive';
  start_date: string;
  hourly_rate: number;
  permissions: Permission[];
  avatar?: string;
}

export interface Shift {
  id: string;
  employee_id: string;
  employee_name: string;
  role: string;
  start_time: string;
  end_time: string;
  date: Date;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  department: string;
}

export interface TimeEntry {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  clock_in: string;
  clock_out?: string;
  break_time: number;
  total_hours: number;
  status: 'active' | 'completed' | 'missed';
  overtime: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  manager_id?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  user_id?: string;
}