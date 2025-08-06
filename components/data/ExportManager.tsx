import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useSubscription } from '@/hooks/use-subscription-store';
import { useTasks } from '@/hooks/use-tasks-store';
import { useHabits } from '@/hooks/use-habits-store';
import { useGamification } from '@/hooks/use-gamification-store';

const ExportManager: React.FC = () => {
  const { isPremium } = useSubscription();
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const { xp, level, streak } = useGamification();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'Data export is available for Premium users only. Upgrade to unlock this feature.');
      return;
    }

    setIsExporting(true);
    try {
      const csvContent = convertToCSV({ tasks, habits, xp, level, streak });
      const fileUri = `${FileSystem.documentDirectory}stride_data.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Share Stride Data CSV' });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      Alert.alert('Error', 'Failed to export data as CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!isPremium) {
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
    return [...headers, ...taskRows, ...habitRows, ...gamificationRows].join('
');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Export</Text>
      <Text style={styles.description}>Export your Stride data as CSV or PDF. Available for Premium users only.</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isExporting && styles.disabledButton]}
          onPress={handleExportCSV}
          disabled={isExporting || !isPremium}
          testID="export-csv-button"
        >
          <Text style={styles.buttonText}>Export CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isExporting && styles.disabledButton]}
          onPress={handleExportPDF}
          disabled={isExporting || !isPremium}
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
