export const calculateTaskStats = (tasks) => {
  const now = new Date();
  
  const stats = {
    total: tasks.length,
    completed: 0,
    active: 0,
    overdue: 0,
    byPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
    byCategory: {},
  };

  tasks.forEach(task => {
    if (task.completed) {
      stats.completed++;
    } else {
      stats.active++;
      if (task.dueDate && new Date(task.dueDate) < now) {
        stats.overdue++;
      }
    }

    stats.byPriority[task.priority]++;

    if (task.category) {
      stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
    }
  });

  return stats;
};