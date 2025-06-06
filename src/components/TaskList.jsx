import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { reorderTasks } from '../store/taskSlice';
import TaskItem from './TaskItem';
import { GripVertical } from 'lucide-react';

const TaskList = () => {
  const dispatch = useAppDispatch();
  const { tasks, filter, searchTerm, selectedCategory, selectedPriority } = useAppSelector(state => state.tasks);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'completed' && task.completed) || 
      (filter === 'active' && !task.completed);
    
    const matchesSearch = 
      !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      !selectedCategory || 
      task.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesPriority = 
      !selectedPriority || 
      task.priority === selectedPriority;

    return matchesFilter && matchesSearch && matchesCategory && matchesPriority;
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    dispatch(reorderTasks({ sourceIndex, destinationIndex }));
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No tasks found</div>
        <p className="text-gray-500">
          {tasks.length === 0 
            ? "Create your first task to get started!" 
            : "Try adjusting your filters or search term."
          }
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
          >
            {filteredTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`relative ${snapshot.isDragging ? 'z-50' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        {...provided.dragHandleProps}
                        className="p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                        aria-label="Drag to reorder"
                      >
                        <GripVertical size={16} />
                      </div>
                      <div className="flex-1">
                        <TaskItem 
                          task={task} 
                          index={index}
                          isDragDisabled={snapshot.isDragging}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;