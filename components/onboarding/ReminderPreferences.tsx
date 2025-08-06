import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/Card';
import { Bell, BellOff, CalendarClock, Settings } from 'lucide-react-native';

interface ReminderPreferencesProps {
  reminderFrequency: 'none' | 'daily' | 'weekly' | 'custom';
  onSelectFrequency: (frequency: 'none' | 'daily' | 'weekly' | 'custom') => void;
}

export const ReminderPreferences: React.FC<ReminderPreferencesProps> = ({
  reminderFrequency,
  onSelectFrequency,
}) => {
  const { colors } = useTheme();

  const options = [
    {
      id: 'none',
      title: 'No reminders',
      description: 'I&apos;ll check the app on my own',
      icon: <BellOff size={24} color={colors.text.secondary} />,
    },
    {
      id: 'daily',
      title: 'Daily reminders',
      description: 'Get a reminder every day',
      icon: <Bell size={24} color={colors.primary} />,
    },
    {
      id: 'weekly',
      title: 'Weekly reminders',
      description: 'Get a reminder once a week',
      icon: <CalendarClock size={24} color={colors.primary} />,
    },
    {
      id: 'custom',
      title: 'Custom schedule',
      description: 'Set your own reminder schedule',
      icon: <Settings size={24} color={colors.primary} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
        How often would you like reminders?
      </Text>
      
      {options.map((option) => (
        <Card
          key={option.id}
          style={[
            styles.card,
            reminderFrequency === option.id && { 
              borderColor: colors.primary,
              borderWidth: 2,
            }
          ]}
          onPress={() => onSelectFrequency(option.id as 'none' | 'daily' | 'weekly' | 'custom')}
          testID={`reminder-${option.id}`}
        >
          <View style={styles.optionContainer}>
            <View style={styles.optionIconContainer}>
              {option.icon}
            </View>
            
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                {option.title}
              </Text>
              <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
                {option.description}
              </Text>
            </View>
          </View>
        </Card>
      ))}
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