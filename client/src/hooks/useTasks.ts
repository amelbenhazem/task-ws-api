import { useState, useCallback, useEffect } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStats } from '@/types/task';
import { useWebSocket } from '@/hooks/useWebSocket';
import { toast } from 'sonner';
import { playNotificationSound } from '@/utils/notificationSound';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useTasks = (token: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, enCours: 0, termine: 0, annule: 0 });
  const [loadingStates, setLoadingStates] = useState({
    fetch: false,
    create: false,
    update: false,
    delete: false
  });
  const [error, setError] = useState<string | null>(null);

  const { socket } = useWebSocket(token);

  const updateStats = useCallback(() => {
    const newStats = tasks.reduce((acc, task) => {
      acc.total++;
      acc[task.status === 'en_cours' ? 'enCours' : 
          task.status === 'termine' ? 'termine' : 'annule']++;
      return acc;
    }, { total: 0, enCours: 0, termine: 0, annule: 0 });
    setStats(newStats);
  }, [tasks]);

  const setLoading = (operation: keyof typeof loadingStates, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [operation]: isLoading }));
  };

  // WebSocket event handlers
  const handleTaskCreated = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
    playNotificationSound();
    toast.success('Nouvelle tâche créée', {
      description: `"${task.title}" a été créée par ${task.createdBy}`,
      duration: 5000,
      action: {
        label: 'Voir',
        onClick: () => {/* Add navigation logic if needed */}
      }
    });
  }, []);

  const handleTaskUpdated = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
    playNotificationSound();
    toast.info('Tâche mise à jour', {
      description: `"${updatedTask.title}" a été modifiée`,
      duration: 5000,
      action: {
        label: 'Voir',
        onClick: () => {/* Add navigation logic if needed */}
      }
    });
  }, []);

  const handleTaskDeleted = useCallback((taskId: string) => {
    setTasks(prev => {
      const deletedTask = prev.find(t => t._id === taskId);
      const newTasks = prev.filter(task => task._id !== taskId);
      playNotificationSound();
      toast.warning('Tâche supprimée', {
        description: deletedTask ? `"${deletedTask.title}" a été supprimée` : 'Une tâche a été supprimée',
        duration: 5000
      });
      return newTasks;
    });
  }, []);

  // Set up WebSocket listeners
  useEffect(() => {
    if (socket) {
      socket.on('taskCreated', handleTaskCreated);
      socket.on('taskUpdated', handleTaskUpdated);
      socket.on('taskDeleted', handleTaskDeleted);
    }

    return () => {
      if (socket) {
        socket.off('taskCreated');
        socket.off('taskUpdated');
        socket.off('taskDeleted');
      }
    };
  }, [socket, handleTaskCreated, handleTaskUpdated, handleTaskDeleted]);

  // Update stats whenever tasks change
  useEffect(() => {
    updateStats();
  }, [tasks, updateStats]);

  const fetchTasks = useCallback(async () => {
    if (!token) return;

    try {
      setLoading('fetch', true);
      setError(null);
      
      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Échec de la récupération des tâches');
      }

      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading('fetch', false);
    }
  }, [token]);

  const createTask = useCallback(async (taskData: CreateTaskInput) => {
    if (!token) return;

    try {
      setLoading('create', true);
      setError(null);
      
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Échec de la création de la tâche');
      }

      const data: Task = await response.json();
      setTasks(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading('create', false);
    }
  }, [token]);

  const updateTask = useCallback(async (taskData: UpdateTaskInput) => {
    if (!token) return;

    try {
      setLoading('update', true);
      setError(null);
      
      const response = await fetch(`${API_URL}/tasks/${taskData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Échec de la mise à jour de la tâche');
      }

      const data: Task = await response.json();
      setTasks(prev => prev.map(task => 
        task._id === data._id ? data : task
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading('update', false);
    }
  }, [token]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!token) return;

    try {
      setLoading('delete', true);
      setError(null);
      
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression de la tâche');
      }

      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading('delete', false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);

  return {
    tasks,
    stats,
    loadingStates,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  };
}; 