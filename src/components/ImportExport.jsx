import React, { useRef } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { importTasks, clearAllTasks } from '../store/taskSlice';
import { exportTasksToFile, importTasksFromFile } from '../utils/localStorage';

const ImportExport = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector(state => state.tasks);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    exportTasksToFile(tasks);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedTasks = await importTasksFromFile(file);
      const confirmed = window.confirm(
        `This will import ${importedTasks.length} tasks. Do you want to replace all existing tasks or merge with current tasks?`
      );
      
      if (confirmed) {
        const shouldReplace = window.confirm(
          'Click OK to replace all existing tasks, or Cancel to merge with current tasks.'
        );
        
        if (shouldReplace) {
          dispatch(importTasks(importedTasks));
        } else {
          // Merge tasks - add new IDs to avoid conflicts
          const mergedTasks = importedTasks.map(task => ({
            ...task,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          dispatch(importTasks([...tasks, ...mergedTasks]));
        }
      }
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleClearAll = () => {
    if (tasks.length === 0) {
      alert('No tasks to clear.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete all ${tasks.length} tasks? This action cannot be undone.`
    );
    
    if (confirmed) {
      dispatch(clearAllTasks());
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleExport}
          disabled={tasks.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={18} />
          Export Tasks ({tasks.length})
        </button>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Upload size={18} />
          Import Tasks
        </button>
        
        <button
          onClick={handleClearAll}
          disabled={tasks.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 size={18} />
          Clear All
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Export your tasks to create a backup</li>
          <li>• Import tasks from a previously exported JSON file</li>
          <li>• You can choose to replace or merge tasks during import</li>
          <li>• Use Clear All to start fresh (this action cannot be undone)</li>
        </ul>
      </div>
    </div>
  );
};

export default ImportExport;