import React, { useState } from 'react';
import { Bell, Search, Menu, User, Settings, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const { currentUser, notifications, markNotificationRead } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleNotificationClick = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          {!isSidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="font-semibold text-gray-900">ShiftPro</span>
            </div>
          )}
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees, schedules..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadNotifications.length > 0 && (
                    <p className="text-sm text-gray-500">{unreadNotifications.length} unread</p>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                        notification.read ? 'border-transparent' : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <div className={`w-2 h-2 rounded-full mt-1 ${
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser?.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-gray-900">{currentUser?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{currentUser?.role}</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </a>
                <hr className="my-1" />
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}