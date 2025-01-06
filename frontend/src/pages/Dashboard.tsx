import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { getTasks, updateTask, deleteTask, createTask } from '../api';
import { Task } from '../types';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId as 'pending' | 'in_progress' | 'done';
    
    try {
      await updateTask(task._id, { status: newStatus });
      fetchTasks();
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleCreateTask = async (data: { title: string; description: string; dueDate: string }) => {
    try {
      await createTask(data);
      fetchTasks();
      setShowForm(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (data: { title: string; description: string; dueDate: string }) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask._id, data);
      fetchTasks();
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      fetchTasks();
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>

        {(showForm || editingTask) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <TaskForm
                task={editingTask || undefined}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['pending', 'in_progress', 'done'].map((status) => (
              <div key={status} className="bg-gray-200 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4 capitalize">
                  {status.replace('_', ' ')}
                </h2>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[200px]"
                    >
                      {getTasksByStatus(status).map((task, index) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          index={index}
                          onEdit={setEditingTask}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};