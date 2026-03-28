import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { OnboardingState } from '@/types';

const initialOnboardingState: OnboardingState = {
  completed: false,
  trackHabits: true,
  trackTasks: true,
  trackPomodoro: false,
  reminderFrequency: 'daily',
  storageMethod: 'local',
};

export const [OnboardingProvider, useOnboarding] = createContextHook(() => {
  const [state, setState] = useState<OnboardingState>(initialOnboardingState);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOnboardingState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('onboardingState');
        if (savedState) {
          setState(JSON.parse(savedState));
        }
      } catch (error) {
        console.error('Failed to load onboarding state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOnboardingState();
  }, []);

  const updateOnboardingState = async (updates: Partial<OnboardingState>) => {
    try {
      const updatedState = { ...state, ...updates };
      await AsyncStorage.setItem('onboardingState', JSON.stringify(updatedState));
      setState(updatedState);
      return true;
    } catch (error) {
      console.error('Failed to update onboarding state:', error);
      return false;
    }
  };

  const completeOnboarding = async () => {
    return updateOnboardingState({ completed: true });
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('onboardingState');
      setState(initialOnboardingState);
      return true;
    } catch (error) {
      console.error('Failed to reset onboarding state:', error);
      return false;
    }
  };

  return {
    state,
    loading,
    updateOnboardingState,
    completeOnboarding,
    resetOnboarding,
  };
});