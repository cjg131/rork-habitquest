import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Habit } from '@/types';
import { Flame, ChevronRight } from 'lucide-react-native';

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
  onPress: () => void;
  isCompletedToday: boolean;
}

export const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  onToggle,
  onPress,
  isCompletedToday,
}) => {
  const { colors } = useTheme();

  const getFrequencyText = (habit: Habit) => {
    switch (habit.frequency.type) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        if (habit.frequency.days && habit.frequency.days.length > 0) {
          if (habit.frequency.days.length === 7) {
            return 'Every day';
          }
          
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return habit.frequency.days.map(day => dayNames[day]).join(', ');
        }
        return 'Weekly';
      case 'monthly':
        if (habit.frequency.dates && habit.frequency.dates.length > 0) {
          if (habit.frequency.dates.length === 1) {
            return `Day ${habit.frequency.dates[0]} of month`;
          }
          return `${habit.frequency.dates.length} days per month`;
        }
        return 'Monthly';
      case 'custom':
        if (habit.frequency.interval) {
          return `Every ${habit.frequency.interval} days`;
        }
        return 'Custom';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderBottomColor: colors.border }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={`habit-item-${habit.id}`}
    >
      <TouchableOpacity
        style={[
          styles.checkCircle,
          { 
            borderColor: colors.primary,
            backgroundColor: isCompletedToday ? colors.primary : 'transparent',
          }
        ]}
        onPress={onToggle}
        testID={`habit-toggle-${habit.id}`}
      >
        {isCompletedToday && (
          <View style={styles.checkmark} />
        )}
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text 
          style={[
            styles.title,
            { color: colors.text.primary },
          ]}
          numberOfLines={1}
        >
          {habit.title}
        </Text>
        
        <View style={styles.detailsContainer}>
          <Text 
            style={[
              styles.frequency,
              { color: colors.text.secondary },
            ]}
          >
            {getFrequencyText(habit)}
          </Text>
          
          {habit.streak > 0 && (
            <View style={styles.streakContainer}>
              <Flame size={14} color={colors.warning} style={styles.streakIcon} />
              <Text 
                style={[
                  styles.streakText,
                  { color: colors.warning },
                ]}
              >
                {habit.streak} day{habit.streak !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <ChevronRight size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequency: {
    fontSize: 14,
    marginRight: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    marginRight: 2,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
  },
});