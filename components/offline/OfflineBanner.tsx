import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useOfflineSync } from '@/hooks/use-offline-sync';

const OfflineBanner = ({ unsyncedCount }: { unsyncedCount: number }) => {
  const { retrySync } = useOfflineSync();
  if (unsyncedCount === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {unsyncedCount} unsynced change(s). Changes will sync when online.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={retrySync}>
        <Text style={styles.retryText}>Retry Sync</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFCC00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  retryButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  retryText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OfflineBanner;
