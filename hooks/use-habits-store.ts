import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Habit, CompletionRecord, Frequency } from '@/types';
import { useAuthStore } from './use-auth-store';

// Sample habits for new users
const sampleHabits: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completionHistory'>[] = [
  {
    title: 'Drink water',
    description: 'Stay hydrated by drinking water throughout the day',
    frequency: { type: 'daily' },
    streak: 0,
    xpReward: 5,
  },
  {
    title: 'Read for 10 minutes',
    description: 'Build a reading habit with just 10 minutes a day',
    frequency: { type: 'daily' },
    streak: 0,
    xpReward: 10,
  },
  {
    title: 'Take a walk',
    description: 'Get some fresh air and exercise',
    frequency: { type: 'daily' },
    streak: 0,
    xpReward: 15,
  },
];

export const [HabitsProvider, useHabitsStore] = createContextHook(() => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadHabits = async () => {
      if (!user) {
        setHabits([]);
        setLoading(false);
        return;
      }

      try {
        const savedHabits = await AsyncStorage.getItem(`habits_${user.id}`);
        if (savedHabits) {
          const parsedHabits = JSON.parse(savedHabits);
          // Convert date strings back to Date objects
          setHabits(parsedHabits.map((habit: any) => ({
            ...habit,
            createdAt: new Date(habit.createdAt),
            updatedAt: new Date(habit.updatedAt),
            reminder: habit.reminder ? new Date(habit.reminder) : undefined,
            completionHistory: habit.completionHistory.map((record: any) => ({
              ...record,
              date: new Date(record.date),
            })),
          })));
        } else {
          // For new users, create sample habits
          const initialHabits = sampleHabits.map((habit) => ({
            ...habit,
            id: Math.random().toString(36).substring(2, 15),
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            completionHistory: [],
          }));
          await AsyncStorage.setItem(`habits_${user.id}`, JSON.stringify(initialHabits));
          setHabits(initialHabits);
        }
      } catch (error) {
        console.error('Failed to load habits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, [user]);

  const saveHabits = async (updatedHabits: Habit[]) => {
    if (!user) return false;
    
    try {
      await AsyncStorage.setItem(`habits_${user.id}`, JSON.stringify(updatedHabits));
      return true;
    } catch (error) {
      console.error('Failed to save habits:', error);
      return false;
    }
  };

  const addHabit = async (habit: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'completionHistory' | 'streak'>) => {
    if (!user) return false;
    
    try {
      const newHabit: Habit = {
        ...habit,
        id: Math.random().toString(36).substring(2, 15),
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        completionHistory: [],
        streak: 0,
      };
      
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
      return true;
    } catch (error) {
      console.error('Failed to add habit:', error);
      return false;
    }
  };

  const updateHabit = async (id: string, updates: Partial<Omit<Habit, 'id' | 'userId' | 'createdAt' | 'completionHistory'>>) => {
    if (!user) return false;
    
    try {
      const habitIndex = habits.findIndex(h => h.id === id);
      if (habitIndex === -1) return false;
      
      const updatedHabits = [...habits];
      updatedHabits[habitIndex] = {
        ...updatedHabits[habitIndex],
        ...updates,
        updatedAt: new Date(),
      };
      
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
      return true;
    } catch (error) {
      console.error('Failed to update habit:', error);
      return false;
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user) return false;
    
    try {
      const updatedHabits = habits.filter(h => h.id !== id);
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
      return true;
    } catch (error) {
      console.error('Failed to delete habit:', error);
      return false;
    }
  };

  const markHabitComplete = async (id: string, date: Date = new Date()) => {
    if (!user) return false;
    
    try {
      const habitIndex = habits.findIndex(h => h.id === id);
      if (habitIndex === -1) return false;
      
      const habit = habits[habitIndex];
      
      // Format date to remove time component for comparison
      const formattedDate = new Date(date);
      formattedDate.setHours(0, 0, 0, 0);
      
      // Check if already completed today
      const alreadyCompletedToday = habit.completionHistory.some(record => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === formattedDate.getTime() && record.completed;
      });
      
      if (alreadyCompletedToday) return true; // Already marked complete
      
      // Add completion record
      const newCompletionRecord: CompletionRecord = {
        date: formattedDate,
        completed: true,
      };
      
      // Calculate new streak
      let newStreak = habit.streak;
      
      // Check if the last completion was yesterday
      const yesterday = new Date(formattedDate);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastCompletionDate = habit.completionHistory.length > 0
        ? new Date(habit.completionHistory[habit.completionHistory.length - 1].date)
        : null;
      
      if (lastCompletionDate) {
        lastCompletionDate.setHours(0, 0, 0, 0);
        
        if (lastCompletionDate.getTime() === yesterday.getTime()) {
          // Last completion was yesterday, increment streak
          newStreak += 1;
        } else if (lastCompletionDate.getTime() < yesterday.getTime()) {
          // Streak broken, reset to 1
          newStreak = 1;
        }
      } else {
        // First completion, set streak to 1
        newStreak = 1;
      }
      
      const updatedHabits = [...habits];
      updatedHabits[habitIndex] = {
        ...habit,
        completionHistory: [...habit.completionHistory, newCompletionRecord],
        streak: newStreak,
        updatedAt: new Date(),
      };
      
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
      return true;
    } catch (error) {
      console.error('Failed to mark habit complete:', error);
      return false;
    }
  };

  const markHabitIncomplete = async (id: string, date: Date = new Date()) => {
    if (!user) return false;
    
    try {
      const habitIndex = habits.findIndex(h => h.id === id);
      if (habitIndex === -1) return false;
      
      const habit = habits[habitIndex];
      
      // Format date to remove time component for comparison
      const formattedDate = new Date(date);
      formattedDate.setHours(0, 0, 0, 0);
      
      // Find the completion record for this date
      const recordIndex = habit.completionHistory.findIndex(record => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === formattedDate.getTime();
      });
      
      if (recordIndex === -1) {
        // No record for this date, add one marked as incomplete
        const newCompletionRecord: CompletionRecord = {
          date: formattedDate,
          completed: false,
        };
        
        const updatedHabits = [...habits];
        updatedHabits[habitIndex] = {
          ...habit,
          completionHistory: [...habit.completionHistory, newCompletionRecord],
          streak: 0, // Reset streak
          updatedAt: new Date(),
        };
        
        setHabits(updatedHabits);
        await saveHabits(updatedHabits);
      } else {
        // Update existing record
        const updatedCompletionHistory = [...habit.completionHistory];
        updatedCompletionHistory[recordIndex] = {
          ...updatedCompletionHistory[recordIndex],
          completed: false,
        };
        
        // Recalculate streak
        let newStreak = 0;
        let currentStreak = 0;
        
        // Sort completion history by date
        const sortedHistory = [...updatedCompletionHistory].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        for (let i = 0; i < sortedHistory.length; i++) {
          if (sortedHistory[i].completed) {
            currentStreak += 1;
            
            // Check if this is the last record or if the next day is not consecutive
            if (i === sortedHistory.length - 1) {
              newStreak = Math.max(newStreak, currentStreak);
            } else {
              const currentDate = new Date(sortedHistory[i].date);
              const nextDate = new Date(sortedHistory[i + 1].date);
              
              const dayDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
              
              if (dayDiff !== 1 || !sortedHistory[i + 1].completed) {
                newStreak = Math.max(newStreak, currentStreak);
                currentStreak = 0;
              }
            }
          } else {
            newStreak = Math.max(newStreak, currentStreak);
            currentStreak = 0;
          }
        }
        
        const updatedHabits = [...habits];
        updatedHabits[habitIndex] = {
          ...habit,
          completionHistory: updatedCompletionHistory,
          streak: newStreak,
          updatedAt: new Date(),
        };
        
        setHabits(updatedHabits);
        await saveHabits(updatedHabits);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to mark habit incomplete:', error);
      return false;
    }
  };

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    markHabitIncomplete,
  };
});