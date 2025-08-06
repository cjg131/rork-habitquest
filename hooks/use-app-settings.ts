import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { AppSettings } from '@/types';

const defaultSettings: AppSettings = {
  theme: 'system',
  notificationsEnabled: true,
  completedItemsDisplay: 'crossedOut',
  priorityColors: {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
  },
  pomodoroSettings: {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
  },
  accessibility: {
    largeText: false,
    highContrast: false,
    reduceMotion: false,
  },
};

export const [AppSettingsProvider, useAppSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('appSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load app settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...updates };
      await AsyncStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
      return true;
    } catch (error) {
      console.error('Failed to update app settings:', error);
      return false;
    }
  };

  const updatePomodoroSettings = async (pomodoroUpdates: Partial<AppSettings['pomodoroSettings']>) => {
    return updateSettings({
      pomodoroSettings: {
        ...settings.pomodoroSettings,
        ...pomodoroUpdates,
      },
    });
  };

  const resetSettings = async () => {
    try {
      await AsyncStorage.removeItem('appSettings');
      setSettings(defaultSettings);
      return true;
    } catch (error) {
      console.error('Failed to reset app settings:', error);
      return false;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    updatePomodoroSettings,
    resetSettings,
  };
});