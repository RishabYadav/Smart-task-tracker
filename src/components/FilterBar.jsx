import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setFilter, setSearchTerm, setSelectedCategory, setSelectedPriority } from '../store/taskSlice';

const FilterBar = () => {
  const dispatch = useAppDispatch();
  const { filter, searchTerm, selectedCategory, selectedPriority, tasks } = useAppSelector(state => state.tasks);

  const categories = [...new Set(tasks.map(task => task.category).filter(Boolean))];
  const priorities = ['high', 'medium', 'low'];

  const clearFilters = () => {
    dispatch(setSearchTerm(''));
    dispatch(setSelectedCategory(''));
    dispatch(setSelectedPriority(''));
    dispatch(setFilter('all'));
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedPriority || filter !== 'all';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => dispatch(setFilter(filterType))}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                filter === filterType
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        )}

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => dispatch(setSelectedPriority(e.target.value))}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">All Priorities</option>
          {priorities.map(priority => (
            <option key={priority} value={priority} className="capitalize">{priority}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Clear all filters"
          >
            <X size={16} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;