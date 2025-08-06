import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { User } from '@/types';

// Mock user for development
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Demo User',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  currency: 0,
  streakCorrections: 3,
  graceDaysUsed: 0,
  graceDaysEarned: 0,
  premium: false,
  trialStartDate: new Date(),
  trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  createdAt: new Date(),
};

export const [AuthProvider, useAuthStore] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            ...parsedUser,
            createdAt: new Date(parsedUser.createdAt),
            trialStartDate: new Date(parsedUser.trialStartDate),
            trialEndDate: new Date(parsedUser.trialEndDate),
            lastAdShown: parsedUser.lastAdShown ? new Date(parsedUser.lastAdShown) : undefined,
          });
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // For now, we'll just use the mock user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setError(null);
      return true;
    } catch (error) {
      console.error('Sign in failed:', error);
      setError('Sign in failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...mockUser,
        email,
        name,
        createdAt: new Date(),
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setError(null);
      return true;
    } catch (error) {
      console.error('Sign up failed:', error);
      setError('Sign up failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Sign out failed:', error);
      setError('Sign out failed');
      return false;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return false;
    
    try {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Update user failed:', error);
      setError('Failed to update user data');
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateUser,
  };
});