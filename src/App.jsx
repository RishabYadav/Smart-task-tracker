import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Plus, BarChart3, List, Undo, Redo, Download } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { undo, redo } from './store/taskSlice';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import Dashboard from './components/Dashboard';
import ImportExport from './components/ImportExport';

const AppContent = () => {
  const dispatch = useAppDispatch();
  const { tasks, history, historyIndex } = useAppSelector(state => state.tasks);
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (canUndo) {
      dispatch(undo());
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      dispatch(redo());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            TaskFlow Pro
          </h1>
          <p className="text-gray-600">Your comprehensive task management solution</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'tasks'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List size={18} />
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 size={18} />
              Dashboard
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                title="Undo"
              >
                <Undo size={18} />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                title="Redo"
              >
                <Redo size={18} />
              </button>
            </div>

            {/* Add Task Button */}
            {activeTab === 'tasks' && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={18} />
                Add Task
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'tasks' ? (
          <div>
            <FilterBar />
            <TaskList />
          </div>
        ) : (
          <div className="space-y-6">
            <Dashboard />
            <ImportExport />
          </div>
        )}

        {/* Task Form Modal */}
        <TaskForm 
          isOpen={showTaskForm} 
          onClose={() => setShowTaskForm(false)} 
        />

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with React, Redux Toolkit, and ❤️</p>
          <p className="mt-1">Total Tasks: {tasks.length} | Keyboard shortcuts: Ctrl+Z (Undo), Ctrl+Y (Redo)</p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          store.dispatch(undo());
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          store.dispatch(redo());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;