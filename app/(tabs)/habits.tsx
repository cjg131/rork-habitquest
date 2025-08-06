import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useHabits } from '@/hooks/use-habits-store';
import { HabitItem } from '@/components/habits/HabitItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Calendar, Plus, Search } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';

export default function HabitsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { habits, markHabitComplete, markHabitIncomplete, loading } = useHabits();
  const [searchQuery, setSearchQuery] = useState('');

  // Get today's date with time set to midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isHabitCompletedToday = (habit: any) => {
    return habit.completionHistory.some((record: any) => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime() && record.completed;
    });
  };

  const filteredHabits = habits.filter(habit => 
    habit.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleHabit = (habitId: string, isCompleted: boolean) => {
    if (isCompleted) {
      markHabitIncomplete(habitId);
    } else {
      markHabitComplete(habitId);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Input
          placeholder="Search habits..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.text.tertiary} />}
          containerStyle={styles.searchContainer}
        />
        
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: colors.primary }
          ]}
          onPress={() => router.push('/modal?type=habit')}
          testID="add-habit-button"
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading habits...
          </Text>
        </View>
      ) : filteredHabits.length > 0 ? (
        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitItem
              habit={item}
              isCompletedToday={isHabitCompletedToday(item)}
              onToggle={() => handleToggleHabit(item.id, isHabitCompletedToday(item))}
              onPress={() => router.push(`/modal?type=habit&id=${item.id}`)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { backgroundColor: colors.card }
          ]}
        />
      ) : (
        <EmptyState
          title="No habits found"
          description={searchQuery ? "Try a different search term" : "Add your first habit to get started"}
          icon={<Calendar size={48} color={colors.primary} />}
          actionLabel="Add Habit"
          onAction={() => router.push('/modal?type=habit')}
          style={styles.emptyState}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  listContent: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
});