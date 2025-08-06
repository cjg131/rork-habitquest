import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useSubscription } from '@/hooks/use-subscription-store';
import { useTasks } from '@/hooks/use-tasks-store';

const ImportManager: React.FC = () => {
  const { isPremium } = useSubscription();
  const { addTask } = useTasks();
  const [isImporting, setIsImporting] = useState(false);

  const handleImportCSV = async () => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'Data import is available for Premium users only. Upgrade to unlock this feature.');
      return;
    }

    setIsImporting(true);
    try {
      // Placeholder for CSV import logic
      Alert.alert('Coming Soon', 'CSV import functionality will be available in a future update.');
      // In a real implementation, you would use a file picker to select a CSV file
      // and then parse it to add tasks or habits.
    } catch (error) {
      console.error('Error importing CSV:', error);
      Alert.alert('Error', 'Failed to import data from CSV. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Import</Text>
      <Text style={styles.description}>Import your Stride data from CSV. Available for Premium users only.</Text>
      <TouchableOpacity
        style={[styles.button, isImporting && styles.disabledButton]}
        onPress={handleImportCSV}
        disabled={isImporting || !isPremium}
        testID="import-csv-button"
      >
        <Text style={styles.buttonText}>Import CSV</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  button: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImportManager;
