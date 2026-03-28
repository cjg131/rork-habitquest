import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Calendar, CheckCircle, Clock } from 'lucide-react-native';

interface TrackingPreferencesProps {
  trackHabits: boolean;
  trackTasks: boolean;
  trackPomodoro: boolean;
  onToggleHabits: (value: boolean) => void;
  onToggleTasks: (value: boolean) => void;
  onTogglePomodoro: (value: boolean) => void;
}

export const TrackingPreferences: React.FC<TrackingPreferencesProps> = ({
  trackHabits,
  trackTasks,
  trackPomodoro,
  onToggleHabits,
  onToggleTasks,
  onTogglePomodoro,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
        What would you like to track?
      </Text>
      
      <Card style={styles.card}>
        <View style={styles.optionContainer}>
          <View style={styles.optionIconContainer}>
            <Calendar size={24} color={colors.primary} />
          </View>
          
          <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
              Habits
            </Text>
            <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
              Track recurring activities and build streaks
            </Text>
          </View>
          
          <Switch
            value={trackHabits}
            onValueChange={onToggleHabits}
          />
        </View>
      </Card>
      
      <Card style={styles.card}>
        <View style={styles.optionContainer}>
          <View style={styles.optionIconContainer}>
            <CheckCircle size={24} color={colors.primary} />
          </View>
          
          <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
              To-dos
            </Text>
            <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
              Manage one-time tasks and projects
            </Text>
          </View>
          
          <Switch
            value={trackTasks}
            onValueChange={onToggleTasks}
          />
        </View>
      </Card>
      
      <Card style={styles.card}>
        <View style={styles.optionContainer}>
          <View style={styles.optionIconContainer}>
            <Clock size={24} color={colors.primary} />
          </View>
          
          <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
              Focus sessions
            </Text>
            <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
              Use Pomodoro timer for focused work
            </Text>
          </View>
          
          <Switch
            value={trackPomodoro}
            onValueChange={onTogglePomodoro}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  optionIconContainer: {
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
});