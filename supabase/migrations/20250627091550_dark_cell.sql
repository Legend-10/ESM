/*
  # Initial ShiftPro Database Schema

  1. New Tables
    - `departments`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `manager_id` (uuid, foreign key to employees)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `permissions`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `module` (text)
      - `created_at` (timestamp)
    
    - `employees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `role` (text)
      - `department_id` (uuid, foreign key)
      - `status` (text, check constraint)
      - `start_date` (date)
      - `hourly_rate` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `employee_permissions`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, foreign key)
      - `permission_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `shifts`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, foreign key)
      - `start_time` (time)
      - `end_time` (time)
      - `date` (date)
      - `status` (text, check constraint)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `time_entries`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, foreign key)
      - `date` (date)
      - `clock_in` (time)
      - `clock_out` (time)
      - `break_time` (integer, default 0)
      - `total_hours` (decimal)
      - `status` (text, check constraint)
      - `overtime` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `notifications`
      - `id` (uuid, primary key)
      - `title` (text)
      - `message` (text)
      - `type` (text, check constraint)
      - `read` (boolean, default false)
      - `user_id` (uuid)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  manager_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  module text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  role text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date date NOT NULL,
  hourly_rate decimal(10,2) NOT NULL DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create employee_permissions table
CREATE TABLE IF NOT EXISTS employee_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, permission_id)
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  start_time time NOT NULL,
  end_time time NOT NULL,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create time_entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  clock_in time NOT NULL,
  clock_out time,
  break_time integer DEFAULT 0,
  total_hours decimal(4,2) DEFAULT 0.00,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'missed')),
  overtime boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for departments
CREATE POLICY "Allow all operations on departments"
  ON departments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for permissions
CREATE POLICY "Allow read access to permissions"
  ON permissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for employees
CREATE POLICY "Allow all operations on employees"
  ON employees
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for employee_permissions
CREATE POLICY "Allow all operations on employee_permissions"
  ON employee_permissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for shifts
CREATE POLICY "Allow all operations on shifts"
  ON shifts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for time_entries
CREATE POLICY "Allow all operations on time_entries"
  ON time_entries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for notifications
CREATE POLICY "Allow all operations on notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default permissions
INSERT INTO permissions (name, description, module) VALUES
  ('view_dashboard', 'View Dashboard', 'dashboard'),
  ('manage_employees', 'Manage Employees', 'employees'),
  ('manage_schedules', 'Manage Schedules', 'schedules'),
  ('view_reports', 'View Reports', 'reports'),
  ('manage_settings', 'Manage Settings', 'settings'),
  ('clock_in_out', 'Clock In/Out', 'time_tracking'),
  ('view_own_schedule', 'View Own Schedule', 'schedules'),
  ('request_time_off', 'Request Time Off', 'time_tracking')
ON CONFLICT (name) DO NOTHING;

-- Insert default departments
INSERT INTO departments (name, description) VALUES
  ('Retail', 'Customer-facing sales and service'),
  ('Management', 'Store management and administration'),
  ('Warehouse', 'Inventory and stock management')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();