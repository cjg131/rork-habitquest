import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorScheme, getColors } from '@/constants/colors';

export const useTheme = () => {
  const systemColorScheme = useColorScheme() as ColorScheme || 'light';
  const [userTheme, setUserTheme] = useState<'light' | 'system'>('system');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('userTheme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'system')) {
          setUserTheme(savedTheme as 'light' | 'system');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (theme: 'light' | 'system') => {
    try {
      await AsyncStorage.setItem('userTheme', theme);
      setUserTheme(theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  // Always use light theme for now
  const colorScheme: ColorScheme = 'light';
  const colors = getColors(colorScheme);

  return {
    colorScheme,
    colors,
    userTheme,
    setTheme,
    loading
  };
};