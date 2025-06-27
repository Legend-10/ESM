import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          manager_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          manager_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          manager_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      permissions: {
        Row: {
          id: string;
          name: string;
          description: string;
          module: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          module: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          module?: string;
          created_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          role: string;
          department_id: string | null;
          status: 'active' | 'inactive';
          start_date: string;
          hourly_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          role: string;
          department_id?: string | null;
          status?: 'active' | 'inactive';
          start_date: string;
          hourly_rate: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          role?: string;
          department_id?: string | null;
          status?: 'active' | 'inactive';
          start_date?: string;
          hourly_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      employee_permissions: {
        Row: {
          id: string;
          employee_id: string;
          permission_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          permission_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          permission_id?: string;
          created_at?: string;
        };
      };
      shifts: {
        Row: {
          id: string;
          employee_id: string;
          start_time: string;
          end_time: string;
          date: string;
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          start_time: string;
          end_time: string;
          date: string;
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          start_time?: string;
          end_time?: string;
          date?: string;
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      time_entries: {
        Row: {
          id: string;
          employee_id: string;
          date: string;
          clock_in: string;
          clock_out: string | null;
          break_time: number;
          total_hours: number;
          status: 'active' | 'completed' | 'missed';
          overtime: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          date: string;
          clock_in: string;
          clock_out?: string | null;
          break_time?: number;
          total_hours?: number;
          status?: 'active' | 'completed' | 'missed';
          overtime?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          date?: string;
          clock_in?: string;
          clock_out?: string | null;
          break_time?: number;
          total_hours?: number;
          status?: 'active' | 'completed' | 'missed';
          overtime?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          read: boolean;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          read?: boolean;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          read?: boolean;
          user_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}