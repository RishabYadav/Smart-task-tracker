import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';
import { calculateTaskStats } from '../utils/taskStats';

const Dashboard = () => {
  const { tasks } = useAppSelector(state => state.tasks);
  const stats = calculateTaskStats(tasks);

  const priorityData = [
    { name: 'High', value: stats.byPriority.high, color: '#ef4444' },
    { name: 'Medium', value: stats.byPriority.medium, color: '#f59e0b' },
    { name: 'Low', value: stats.byPriority.low, color: '#10b981' },
  ];

  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`${color}`} size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CheckCircle}
          title="Total Tasks"
          value={stats.total}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={stats.completed}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          icon={Clock}
          title="Active"
          value={stats.active}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
        <StatCard
          icon={AlertTriangle}
          title="Overdue"
          value={stats.overdue}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      {/* Completion Rate */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-900">{completionRate}%</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {priorityData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>No categories yet</p>
                <p className="text-sm">Add categories to your tasks to see distribution</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;