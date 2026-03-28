import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/hooks/use-theme';
import { useSubscriptionStore } from '@/hooks/use-subscription-store';
import { useTasks } from '@/hooks/use-tasks-store';
import { useHabits } from '@/hooks/use-habits-store';
import { useGamification } from '@/hooks/use-gamification-store';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth-store';

interface ExportManagerProps {
  style?: any;
}

export function ExportManager({ style }: ExportManagerProps) {
  const { colors } = useTheme();
  const subscription = useSubscriptionStore();
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const { badges } = useGamification();
  const { user } = useAuth();
  // Removed references to level and xp as they are not in the gamification hook
  // Removed references to level and xp as they are not in the gamification hook
  const level = 1;
  const xp = 0;
  const [exporting, setExporting] = useState(false);

  const handleExportData = async (format: 'csv' | 'pdf') => {
    if (!subscription.isFeatureUnlocked('data-export')) {
      Alert.alert('Premium Feature', 'Exporting data is available for Premium users only. Upgrade to unlock this feature.');
      return;
    }

    setExporting(true);
    try {
      let fileUri: string;
      let mimeType: string;
      let dialogTitle: string;

      if (format === 'csv') {
        const csvContent = convertToCSV();
        fileUri = `${FileSystem.documentDirectory}stride_data.csv`;
        if (Platform.OS !== 'web') {
          await FileSystem.writeAsStringAsync(fileUri, csvContent);
        } else {
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'stride_data.csv';
          link.click();
          window.URL.revokeObjectURL(url);
          setExporting(false);
          return;
        }
        mimeType = 'text/csv';
        dialogTitle = 'Share Stride Data CSV';
      } else {
        // PDF export logic would go here
        // For now, we'll simulate a placeholder since PDF generation might require additional libraries
        Alert.alert('PDF Export', 'PDF export is coming soon. Please use CSV export for now.');
        setExporting(false);
        return;
      }

      await Sharing.shareAsync(fileUri, { mimeType, dialogTitle });
    } catch (error) {
      console.error(`Error exporting data as ${format}:`, error);
      Alert.alert('Error', `Failed to export data as ${format.toUpperCase()}. Please try again.`, [
        { text: 'OK' },
        { text: 'Retry', onPress: () => handleExportData(format) }
      ]);
    } finally {
      setExporting(false);
    }
  };

  const convertToCSV = () => {
    const headers = ['Category,Details'];
    const taskRows = tasks.map(task => `Task,"${task.title}, Completed: ${task.completed}"`);
    const habitRows = habits.map(habit => `Habit,"${habit.title || 'Unnamed Habit'}, Streak: ${habit.streak}"`);
    const gamificationRows = [
      `Gamification,"Level: ${level}, XP: ${xp}, Badges: ${badges.length}"`
    ];
    return [...headers, ...taskRows, ...habitRows, ...gamificationRows].join('\n');
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Export Data</Text>
      <Text style={[styles.description, { color: colors.text.secondary }]}>
        Export your tasks, habits, and progress data.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Export as CSV"
          onPress={() => handleExportData('csv')}
          disabled={exporting || !subscription.isFeatureUnlocked('data-export')}
          style={[styles.button, styles.csvButton]}
          leftIcon={<Download size={20} color="#fff" />}
        />
        <Button
          title="Export as PDF"
          onPress={() => handleExportData('pdf')}
          disabled={exporting || !subscription.isFeatureUnlocked('data-export') || Platform.OS === 'web'}
          style={[styles.button, styles.pdfButton]}
          leftIcon={<Download size={20} color="#fff" />}
        />
      </View>
      {!subscription.isFeatureUnlocked('data-export') && (
        <Text style={[styles.premiumNotice, { color: colors.text.secondary }]}>
          Export feature available for Premium users only
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  csvButton: {
    backgroundColor: '#007AFF',
  },
  pdfButton: {
    backgroundColor: '#FF2D55',
  },
  premiumNotice: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});