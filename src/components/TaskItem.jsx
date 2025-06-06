import React, { useState } from 'react';
import { Check, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { useAppDispatch } from '../hooks/redux';
import { toggleTask, deleteTask, updateTask } from '../store/taskSlice';

const TaskItem = ({ task, index, isDragDisabled }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate || '',
  });

  const handleToggle = () => {
    dispatch(toggleTask(task.id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateTask({
      id: task.id,
      updates: {
        title: editData.title.trim(),
        description: editData.description.trim(),
        priority: editData.priority,
        category: editData.category.trim(),
        dueDate: editData.dueDate || undefined,
      }
    }));
    setIsEditing(false);
  };

  const handleChange = (field) => (e) => {
    setEditData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const priorityColors = {
    high: 'border-l-red-500 bg-red-50/50',
    medium: 'border-l-yellow-500 bg-yellow-50/50',
    low: 'border-l-green-500 bg-green-50/50',
  };

  const priorityBadgeColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  if (isEditing) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={handleChange('title')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <textarea
            value={editData.description}
            onChange={handleChange('description')}
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              value={editData.priority}
              onChange={handleChange('priority')}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="text"
              value={editData.category}
              onChange={handleChange('category')}
              placeholder="Category"
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              value={editData.dueDate}
              onChange={handleChange('dueDate')}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-white/80 backdrop-blur-sm border-l-4 ${priorityColors[task.priority]} border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 ${task.completed ? 'opacity-75' : ''} ${isOverdue ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-400'
          }`}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed && <Check size={12} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 ml-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityBadgeColors[task.priority]}`}>
                {task.priority}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Edit task"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            {task.category && (
              <div className="flex items-center gap-1">
                <Tag size={12} />
                <span>{task.category}</span>
              </div>
            )}
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                <Calendar size={12} />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                {isOverdue && <span className="text-red-600">(Overdue)</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;