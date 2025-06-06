import { createSlice } from '@reduxjs/toolkit';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/localStorage';

const initialState = {
  tasks: loadTasksFromStorage(),
  filter: 'all',
  searchTerm: '',
  selectedCategory: '',
  selectedPriority: '',
  history: [],
  historyIndex: -1,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save current state to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.tasks]);
      state.historyIndex = state.history.length - 1;
      
      state.tasks.push(newTask);
      saveTasksToStorage(state.tasks);
    },
    
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      
      if (taskIndex !== -1) {
        // Save current state to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push([...state.tasks]);
        state.historyIndex = state.history.length - 1;
        
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        saveTasksToStorage(state.tasks);
      }
    },
    
    deleteTask: (state, action) => {
      // Save current state to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.tasks]);
      state.historyIndex = state.history.length - 1;
      
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      saveTasksToStorage(state.tasks);
    },
    
    toggleTask: (state, action) => {
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload);
      
      if (taskIndex !== -1) {
        // Save current state to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push([...state.tasks]);
        state.historyIndex = state.history.length - 1;
        
        state.tasks[taskIndex].completed = !state.tasks[taskIndex].completed;
        state.tasks[taskIndex].updatedAt = new Date().toISOString();
        saveTasksToStorage(state.tasks);
      }
    },
    
    reorderTasks: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const result = Array.from(state.tasks);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      
      state.tasks = result;
      saveTasksToStorage(state.tasks);
    },
    
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    
    setSelectedPriority: (state, action) => {
      state.selectedPriority = action.payload;
    },
    
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.tasks = [...state.history[state.historyIndex]];
        saveTasksToStorage(state.tasks);
      }
    },
    
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.tasks = [...state.history[state.historyIndex]];
        saveTasksToStorage(state.tasks);
      }
    },
    
    importTasks: (state, action) => {
      // Save current state to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.tasks]);
      state.historyIndex = state.history.length - 1;
      
      state.tasks = action.payload;
      saveTasksToStorage(state.tasks);
    },
    
    clearAllTasks: (state) => {
      // Save current state to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.tasks]);
      state.historyIndex = state.history.length - 1;
      
      state.tasks = [];
      saveTasksToStorage(state.tasks);
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTask,
  reorderTasks,
  setFilter,
  setSearchTerm,
  setSelectedCategory,
  setSelectedPriority,
  undo,
  redo,
  importTasks,
  clearAllTasks,
} = taskSlice.actions;

export default taskSlice.reducer;