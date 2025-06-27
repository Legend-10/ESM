import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ScheduleView } from './components/ScheduleView';
import { EmployeeManagement } from './components/EmployeeManagement';
import { TimeTracking } from './components/TimeTracking';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { AppProvider } from './context/AppContext';

type ViewType = 'dashboard' | 'schedule' | 'employees' | 'time-tracking' | 'reports' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'schedule':
        return <ScheduleView />;
      case 'employees':
        return <EmployeeManagement />;
      case 'time-tracking':
        return <TimeTracking />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          isOpen={isSidebarOpen}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
          
          <main className="flex-1 overflow-auto p-6">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;