import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SyncItem {
  id: string;
  type: 'task' | 'habit' | 'setting';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [unsyncedChanges, setUnsyncedChanges] = useState<SyncItem[]>([]);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      if (Platform.OS !== 'web') {
        const networkState = await Network.getNetworkStateAsync();
        setIsOnline(networkState.isConnected ?? true);
      } else {
        setIsOnline(navigator.onLine);
      }
    };

    checkNetworkStatus();

    const interval = setInterval(checkNetworkStatus, 10000); // Check every 10 seconds
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  useEffect(() => {
    const loadUnsyncedChanges = async () => {
      try {
        const storedChanges = await AsyncStorage.getItem('unsyncedChanges');
        if (storedChanges) {
          setUnsyncedChanges(JSON.parse(storedChanges));
        }
      } catch (error) {
        console.error('Failed to load unsynced changes:', error);
      }
    };

    loadUnsyncedChanges();
  }, []);

  useEffect(() => {
    const saveUnsyncedChanges = async () => {
      try {
        await AsyncStorage.setItem('unsyncedChanges', JSON.stringify(unsyncedChanges));
      } catch (error) {
        console.error('Failed to save unsynced changes:', error);
      }
    };

    if (unsyncedChanges.length > 0) {
      saveUnsyncedChanges();
    }
  }, [unsyncedChanges]);

  useEffect(() => {
    const syncChanges = async () => {
      if (isOnline && unsyncedChanges.length > 0) {
        console.log('Syncing changes with server...');
        // Simulate syncing with backend (placeholder for actual API calls)
        try {
          // In a real app, you would send unsyncedChanges to your backend here
          console.log('Changes synced:', unsyncedChanges);
          setUnsyncedChanges([]);
          await AsyncStorage.removeItem('unsyncedChanges');
        } catch (error) {
          console.error('Failed to sync changes:', error);
        }
      }
    };

    syncChanges();
  }, [isOnline, unsyncedChanges]);

  const queueChange = (item: Omit<SyncItem, 'id' | 'timestamp'>) => {
    const newItem: SyncItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    setUnsyncedChanges(prev => [...prev, newItem]);
  };

  return {
    isOnline,
    unsyncedChangesCount: unsyncedChanges.length,
    queueChange,
  };
};
