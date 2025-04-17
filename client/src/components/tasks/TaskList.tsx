"use client";

import { useState } from 'react';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function TaskList() {
  const { token } = useAuth();
  const { tasks, createTask, updateTask, deleteTask, loadingStates } = useTasks(token);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const handleCreateTask = async (data: any) => {
    try {
      await createTask(data);
      toast.success('Tâche créée avec succès');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la création de la tâche');
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!selectedTask) return;
    try {
      await updateTask({ _id: selectedTask._id, ...data });
      toast.success('Tâche mise à jour avec succès');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la tâche');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success('Tâche supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression de la tâche');
    }
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setSelectedTask(undefined);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes tâches</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          Nouvelle tâche
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      <TaskForm
        task={selectedTask}
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        isLoading={selectedTask ? loadingStates.update : loadingStates.create}
      />
    </div>
  );
} 