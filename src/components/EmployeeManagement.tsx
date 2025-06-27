import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, Edit, Trash2, User, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Employee, Permission } from '../types';

export function EmployeeManagement() {
  const { 
    employees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee, 
    departments, 
    permissions, 
    updateEmployeePermissions,
    loading 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const handleAddEmployee = async (formData: FormData) => {
    try {
      const departmentId = formData.get('departmentId') as string;
      
      await addEmployee({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        role: formData.get('role') as string,
        department: departments.find(d => d.id === departmentId)?.name || '',
        department_id: departmentId,
        status: 'active',
        start_date: formData.get('startDate') as string,
        hourly_rate: parseFloat(formData.get('hourlyRate') as string),
      });
      
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleEditEmployee = async (formData: FormData) => {
    if (!selectedEmployee) return;
    
    try {
      const departmentId = formData.get('departmentId') as string;
      
      await updateEmployee(selectedEmployee.id, {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        role: formData.get('role') as string,
        department: departments.find(d => d.id === departmentId)?.name || '',
        department_id: departmentId,
        status: formData.get('status') as 'active' | 'inactive',
        hourly_rate: parseFloat(formData.get('hourlyRate') as string),
      });
      
      setShowEditModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try {
        await deleteEmployee(employee.id);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handlePermissionsUpdate = async (employeePermissions: Permission[]) => {
    if (!selectedEmployee) return;
    
    try {
      await updateEmployeePermissions(selectedEmployee.id, employeePermissions);
      setShowPermissionsModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Manage your workforce and employee information</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-green-600">
                {employees.filter(e => e.status === 'active').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="h-3 w-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-purple-600">
                {departments.length}
              </p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="h-3 w-3 bg-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Hourly Rate</p>
              <p className="text-3xl font-bold text-orange-600">
                ${employees.length > 0 ? (employees.reduce((sum, e) => sum + e.hourly_rate, 0) / employees.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold text-sm">$</span>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Employees ({filteredEmployees.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hourly Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.role}</div>
                    <div className="text-sm text-gray-500">{employee.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <a href={`mailto:${employee.email}`} className="text-blue-600 hover:text-blue-800">
                        <Mail className="h-4 w-4" />
                      </a>
                      <a href={`tel:${employee.phone}`} className="text-blue-600 hover:text-blue-800">
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${employee.hourly_rate.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(employee.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowPermissionsModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-800"
                        title="Manage Permissions"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(employee)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddEmployee(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    name="departmentId"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Employee</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditEmployee(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedEmployee.name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedEmployee.email}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={selectedEmployee.phone}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    defaultValue={selectedEmployee.role}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    name="departmentId"
                    defaultValue={selectedEmployee.department_id}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedEmployee.status}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    step="0.01"
                    min="0"
                    defaultValue={selectedEmployee.hourly_rate}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedEmployee && (
        <PermissionsModal
          employee={selectedEmployee}
          permissions={permissions}
          onSave={handlePermissionsUpdate}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
}

function PermissionsModal({ 
  employee, 
  permissions, 
  onSave, 
  onClose 
}: { 
  employee: Employee;
  permissions: Permission[];
  onSave: (permissions: Permission[]) => void;
  onClose: () => void;
}) {
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(employee.permissions);

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions(prev => {
      const exists = prev.find(p => p.id === permission.id);
      if (exists) {
        return prev.filter(p => p.id !== permission.id);
      } else {
        return [...prev, permission];
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Manage Permissions - {employee.name}</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {permissions.map((permission) => {
            const isSelected = selectedPermissions.find(p => p.id === permission.id);
            return (
              <div key={permission.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={permission.id}
                  checked={!!isSelected}
                  onChange={() => togglePermission(permission)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={permission.id} className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{permission.description}</div>
                  <div className="text-xs text-gray-500">{permission.module}</div>
                </label>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selectedPermissions)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}