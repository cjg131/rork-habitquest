import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OfflineBanner = ({ unsyncedCount }: { unsyncedCount: number }) => {
  if (unsyncedCount === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {unsyncedCount} unsynced change(s). Changes will sync when online.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFCC00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OfflineBanner;
