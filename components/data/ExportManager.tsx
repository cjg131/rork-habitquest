import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useSubscriptionStore } from '@/hooks/use-subscription-store';
import { useTasks } from '@/hooks/use-tasks-store';
import { useHabitsStore } from '@/hooks/use-habits-store';
import { useGamification } from '@/hooks/use-gamification-store';

const ExportManager: React.FC = () => {
  const { isFeatureUnlocked } = useSubscriptionStore();
  const { tasks } = useTasks();
  const { habits } = useHabitsStore();
  const { badges } = useGamification();
  // Using dummy data as actual properties are not available in the type
  const xp = 0;
  const level = 1;
  const streak = 0;
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    if (!isFeatureUnlocked('data-export')) {
      Alert.alert('Premium Feature', 'Data export is available for Premium users only. Upgrade to unlock this feature.');
      return;
    }

    setIsExporting(true);
    try {
      const csvContent = convertToCSV({ tasks, habits, xp, level, streak });
      const fileUri = `${FileSystem.documentDirectory}stride_data.csv`;
      if (Platform.OS !== 'web') {
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
    } else {
      console.warn('File writing is not supported on web.');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'stride_data.csv';
      link.click();
      window.URL.revokeObjectURL(url);
    }
      if (Platform.OS !== 'web') {
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Share Stride Data CSV' });
    } else {
      console.log('Sharing not supported on web, file already downloaded');
    }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      Alert.alert('Error', 'Failed to export data as CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!isFeatureUnlocked('data-export')) {
      Alert.alert('Premium Feature', 'Data export is available for Premium users only. Upgrade to unlock this feature.');
      return;
    }

    setIsExporting(true);
    try {
      // Placeholder for PDF export logic
      Alert.alert('Coming Soon', 'PDF export functionality will be available in a future update.');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      Alert.alert('Error', 'Failed to export data as PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: any) => {
    const headers = ['Type,Name,Status,Details'];
    const taskRows = data.tasks.map((task: any) => `Task,"${task.title}",${task.completed ? 'Completed' : 'Pending'},"${task.description || ''}"`);
    const habitRows = data.habits.map((habit: any) => `Habit,"${habit.name}",${habit.completed ? 'Completed' : 'Pending'},Streak: ${habit.streak}`);
    const gamificationRows = [`Gamification,XP: ${data.xp},Level: ${data.level},Streak: ${data.streak}`];
    return [...headers, ...taskRows, ...habitRows, ...gamificationRows].join('\n');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Export</Text>
      <Text style={styles.description}>Export your Stride data as CSV or PDF. Available for Premium users only.</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isExporting && styles.disabledButton]}
          onPress={handleExportCSV}
          disabled={isExporting || !isFeatureUnlocked('data-export')}
          testID="export-csv-button"
        >
          <Text style={styles.buttonText}>Export CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isExporting && styles.disabledButton]}
          onPress={handleExportPDF}
          disabled={isExporting || !isFeatureUnlocked('data-export')}
          testID="export-pdf-button"
        >
          <Text style={styles.buttonText}>Export PDF</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
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

export default ExportManager;
