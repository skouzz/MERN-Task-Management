import React from 'react';
import { Task } from '../types';
import { Draggable } from '@hello-pangea/dnd';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-lg shadow mb-2"
        >
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <p className="text-gray-600 mt-1">{task.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <div className="mt-3 flex justify-end space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};