import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Task, Subtask } from '@/types';
import { useAuth } from './use-auth-store';

// Sample tasks for new users
const sampleTasks: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Complete app setup',
    description: 'Finish setting up your new habit tracker app',
    completed: false,
    xpReward: 10,
  },
  {
    title: 'Create your first habit',
    description: 'Start tracking a new daily habit',
    completed: false,
    xpReward: 15,
  },
  {
    title: 'Try a Pomodoro session',
    description: 'Complete a focused work session using the Pomodoro timer',
    completed: false,
    xpReward: 20,
  },
];

export const [TasksProvider, useTasks] = createContextHook(() => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        const savedTasks = await AsyncStorage.getItem(`tasks_${user.id}`);
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          // Convert date strings back to Date objects
          setTasks(parsedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            reminder: task.reminder ? new Date(task.reminder) : undefined,
          })));
        } else {
          // For new users, create sample tasks
          const initialTasks = sampleTasks.map((task) => ({
            ...task,
            id: Math.random().toString(36).substring(2, 15),
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          await AsyncStorage.setItem(`tasks_${user.id}`, JSON.stringify(initialTasks));
          setTasks(initialTasks);
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user]);

  const saveTasks = async (updatedTasks: Task[]) => {
    if (!user) return false;
    
    try {
      await AsyncStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
      return true;
    } catch (error) {
      console.error('Failed to save tasks:', error);
      return false;
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return false;
    
    try {
      const newTask: Task = {
        ...task,
        id: Math.random().toString(36).substring(2, 15),
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to add task:', error);
      return false;
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>) => {
    if (!user) return false;
    
    try {
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex === -1) return false;
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        ...updates,
        updatedAt: new Date(),
      };
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to update task:', error);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return false;
    
    try {
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      return false;
    }
  };

  const addSubtask = async (taskId: string, subtask: Omit<Subtask, 'id'>) => {
    if (!user) return false;
    
    try {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return false;
      
      const newSubtask: Subtask = {
        ...subtask,
        id: Math.random().toString(36).substring(2, 15),
      };
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        subtasks: [...(updatedTasks[taskIndex].subtasks || []), newSubtask],
        updatedAt: new Date(),
      };
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to add subtask:', error);
      return false;
    }
  };

  const updateSubtask = async (taskId: string, subtaskId: string, updates: Partial<Omit<Subtask, 'id'>>) => {
    if (!user) return false;
    
    try {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return false;
      
      const task = tasks[taskIndex];
      if (!task.subtasks) return false;
      
      const subtaskIndex = task.subtasks.findIndex(s => s.id === subtaskId);
      if (subtaskIndex === -1) return false;
      
      const updatedSubtasks = [...task.subtasks];
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        ...updates,
      };
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...task,
        subtasks: updatedSubtasks,
        updatedAt: new Date(),
      };
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to update subtask:', error);
      return false;
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    if (!user) return false;
    
    try {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return false;
      
      const task = tasks[taskIndex];
      if (!task.subtasks) return false;
      
      const updatedSubtasks = task.subtasks.filter(s => s.id !== subtaskId);
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...task,
        subtasks: updatedSubtasks,
        updatedAt: new Date(),
      };
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to delete subtask:', error);
      return false;
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
  };
});