import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useTasks } from '@/hooks/use-tasks-store';
import { useHabits } from '@/hooks/use-habits-store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 32 - 48) / 7; // Account for padding and gaps

export default function CalendarScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getItemsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    const dayTasks = tasks.filter(task => 
      task.dueDate && task.dueDate.toDateString() === dateStr
    );
    
    return { tasks: dayTasks };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const selectedDateItems = useMemo(() => {
    return getItemsForDate(selectedDate);
  }, [selectedDate, tasks]);

  const days = getDaysInMonth(currentMonth);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Calendar Header */}
      <Card style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            onPress={() => navigateMonth('prev')}
            style={[styles.navButton, { backgroundColor: colors.card }]}
          >
            <ChevronLeft size={20} color={colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={[styles.monthTitle, { color: colors.text.primary }]}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          
          <TouchableOpacity 
            onPress={() => navigateMonth('next')}
            style={[styles.navButton, { backgroundColor: colors.card }]}
          >
            <ChevronRight size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Day Headers */}
        <View style={styles.dayHeaders}>
          {dayNames.map((day) => (
            <View key={day} style={styles.dayHeader}>
              <Text style={[styles.dayHeaderText, { color: colors.text.secondary }]}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {days.map((date, index) => {
            if (!date) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const items = getItemsForDate(date);
            const hasItems = items.tasks.length > 0;
            const today = isToday(date);
            const selected = isSelected(date);

            return (
              <TouchableOpacity
                key={date.toISOString()}
                style={[
                  styles.dayCell,
                  today && { backgroundColor: colors.primary + '20' },
                  selected && { backgroundColor: colors.primary, borderRadius: 8 }
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[
                  styles.dayText,
                  { color: selected ? '#FFFFFF' : colors.text.primary },
                  today && !selected && { color: colors.primary, fontWeight: '600' }
                ]}>
                  {date.getDate()}
                </Text>
                {hasItems && (
                  <View style={[
                    styles.itemIndicator,
                    { backgroundColor: selected ? '#FFFFFF' : colors.accent }
                  ]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Selected Date Details */}
      <View style={styles.selectedDateSection}>
        <View style={styles.selectedDateHeader}>
          <Text style={[styles.selectedDateTitle, { color: colors.text.primary }]}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          <Button
            title=""
            leftIcon={<Plus size={20} color={colors.primary} />}
            variant="ghost"
            size="sm"
            onPress={() => router.push('/modal?type=task')}
          />
        </View>

        {selectedDateItems.tasks.length > 0 && (
          <Card style={styles.itemsCard}>
            <Text style={[styles.itemsTitle, { color: colors.text.primary }]}>Tasks</Text>
            {selectedDateItems.tasks.map((task) => (
              <View key={task.id} style={styles.itemRow}>
                <View style={[styles.itemDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.itemText, { color: colors.text.primary }]}>
                  {task.title}
                </Text>
                <Badge 
                  label={task.completed ? 'Done' : 'Pending'} 
                  variant={task.completed ? 'success' : 'warning'}
                  size="sm"
                />
              </View>
            ))}
          </Card>
        )}



        {selectedDateItems.tasks.length === 0 && (
          <Card style={styles.itemsCard}>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No tasks scheduled for this day
            </Text>
            <Button
              title="Add Task"
              variant="outline"
              size="sm"
              onPress={() => router.push('/modal?type=task')}
              style={styles.addButton}
            />
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  calendarCard: {
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    width: CELL_SIZE,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 8,
  },
  selectedDateSection: {
    flex: 1,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemsCard: {
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 16,
  },
  addButton: {
    alignSelf: 'center',
  },
});