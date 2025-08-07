import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useTasks } from '@/hooks/use-tasks-store';
import { useHabits } from '@/hooks/use-habits-store';
import { useGamification } from '@/hooks/use-gamification-store';
import { useSubscriptionStore } from '@/hooks/use-subscription-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart, PieChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Download } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const AnalyticsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const { badges } = useGamification();
  const subscription = useSubscriptionStore();
  // Removed unused isPremium variable
// Feature gating is handled by isFeatureUnlocked checks
  const [exporting, setExporting] = useState(false);

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const habitCompletionRate = habits.length > 0 ? (habits.filter(habit => habit.completionHistory?.length > 0).length / habits.length) * 100 : 0;
  const totalHabitCompletions = habits.reduce((sum, habit) => sum + (habit.completionHistory?.length || 0), 0);

  const taskData = {
    labels: ['Completed', 'Pending'],
    datasets: [{ data: [completedTasks, pendingTasks] }],
  };

  const habitData = [
    { name: 'Completed', population: habitCompletionRate, color: colors.success, legendFontColor: colors.text.primary, legendFontSize: 14 },
    { name: 'Incomplete', population: 100 - habitCompletionRate, color: colors.warning, legendFontColor: colors.text.primary, legendFontSize: 14 },
  ];

  const handleExportAnalytics = async () => {
    if (!subscription.isFeatureUnlocked('data-export')) {
      Alert.alert('Premium Feature', 'Exporting analytics data is available for Premium users only. Upgrade to unlock this feature.');
      return;
    }

    setExporting(true);
    try {
      const csvContent = convertToCSV();
      const fileUri = `${FileSystem.documentDirectory}stride_analytics.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Share Stride Analytics CSV' });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      Alert.alert('Error', 'Failed to export analytics data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const convertToCSV = () => {
    const headers = ['Category,Value'];
    const rows = [
      `Total Tasks,${tasks.length}`,
      `Completed Tasks,${completedTasks}`,
      `Pending Tasks,${pendingTasks}`,
      `Task Completion Rate,${completionRate.toFixed(2)}%`,
      `Total Habits,${habits.length}`,
      `Habit Completion Rate,${habitCompletionRate.toFixed(2)}%`,
      `Total Habit Completions,${totalHabitCompletions}`
    ];
    return [...headers, ...rows].join('\n');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.header, { color: colors.text.primary }]}>Analytics</Text>

      <Card style={styles.chartCard}>
        <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Task Completion</Text>
        <BarChart
          data={taskData}
          width={width - 48}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          showValuesOnTopOfBars={true}
          fromZero={true}
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix=""
        />
      </Card>

      <Card style={styles.chartCard}>
        <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Habit Completion Rate</Text>
        <PieChart
          data={habitData}
          width={width - 48}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </Card>

      <Card style={styles.statsCard}>
        <Text style={[styles.statsTitle, { color: colors.text.primary }]}>Gamification Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{badges.length}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Badges</Text>
          </View>
        </View>
      </Card>

      <View style={styles.exportContainer}>
        <Button
          title="Export Analytics"
          leftIcon={<Download size={20} color="#fff" />}
          onPress={handleExportAnalytics}
          disabled={exporting || !subscription.isFeatureUnlocked('data-export')}
          style={[styles.exportButton, !subscription.isFeatureUnlocked('data-export') && styles.disabledButton]}
        />
        {!subscription.isFeatureUnlocked('data-export') && (
          <Text style={[styles.premiumNotice, { color: colors.text.secondary }]}>
            Export feature available for Premium users only
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartCard: {
    marginBottom: 24,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    paddingRight: 0,
  },
  statsCard: {
    marginBottom: 24,
    padding: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  exportContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  exportButton: {
    width: '100%',
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  premiumNotice: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default AnalyticsScreen;
