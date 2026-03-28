import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth-store';
import { useTasks } from '@/hooks/use-tasks-store';
import { useHabitsStore } from '@/hooks/use-habits-store';
import { usePomodoro } from '@/hooks/use-pomodoro-store';
import { LevelProgress } from '@/components/dashboard/LevelProgress';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TaskItem } from '@/components/tasks/TaskItem';
import { HabitItem } from '@/components/habits/HabitItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Calendar, CheckCircle, Clock, Flame, ListTodo, Undo2 } from 'lucide-react-native';
import { Habit, CompletionRecord } from '@/types';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { tasks, updateTask } = useTasks();
  const { habits, markHabitComplete, markHabitIncomplete } = useHabitsStore();
  const { startSession } = usePomodoro();
  const [frictionlessMode, setFrictionlessMode] = useState(false);
  const [lastAction, setLastAction] = useState<{ type: string, id: string, previousState: boolean } | null>(null);

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          title="Not signed in"
          description="Please sign in to view your dashboard"
          icon={<ListTodo size={48} color={colors.primary} />}
          actionLabel="Sign In"
          onAction={() => router.replace('/(auth)')}
        />
      </View>
    );
  }

  // Get today's date with time set to midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter tasks that are due today or overdue
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() <= today.getTime() && !task.completed;
  }).slice(0, 3); // Show only the first 3

  // Check which habits are completed today
  const todayHabits = habits.slice(0, 3); // Show only the first 3
  
  const isHabitCompletedToday = (habit: Habit) => {
    return habit.completionHistory.some((record: CompletionRecord) => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime() && record.completed;
    });
  };

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completedHabits = habits.filter((habit: Habit) => isHabitCompletedToday(habit)).length;
  const totalHabits = habits.length;
  const longestStreak = habits.reduce((max: number, habit: Habit) => Math.max(max, habit.streak || 0), 0);

  const handleToggleTask = (taskId: string, completed: boolean) => {
    setLastAction({ type: 'task', id: taskId, previousState: !completed });
    updateTask(taskId, { completed });
  };

  const handleToggleHabit = (habitId: string, isCompleted: boolean) => {
    setLastAction({ type: 'habit', id: habitId, previousState: isCompleted });
    if (isCompleted) {
      markHabitIncomplete(habitId);
    } else {
      markHabitComplete(habitId);
    }
  };

  const handleUndo = () => {
    if (lastAction) {
      if (lastAction.type === 'task') {
        updateTask(lastAction.id, { completed: lastAction.previousState });
      } else if (lastAction.type === 'habit') {
        if (lastAction.previousState) {
          markHabitComplete(lastAction.id);
        } else {
          markHabitIncomplete(lastAction.id);
        }
      }
      setLastAction(null);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text.primary }]}>
          Hello, {user.name}
        </Text>
        <Text style={[styles.date, { color: colors.text.secondary }]}>
          {today.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          style={[styles.modeToggle, frictionlessMode && styles.modeToggleActive, { backgroundColor: frictionlessMode ? colors.primary : colors.card }]}
          onPress={() => setFrictionlessMode(!frictionlessMode)}
        >
          <Text style={[styles.modeToggleText, { color: frictionlessMode ? colors.background : colors.text.primary }]}>
            Frictionless Mode {frictionlessMode ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
        {lastAction && (
          <TouchableOpacity
            style={[styles.undoButton, { backgroundColor: colors.card }]}
            onPress={handleUndo}
          >
            <Undo2 size={16} color={colors.text.primary} />
            <Text style={[styles.undoButtonText, { color: colors.text.primary }]}>Undo Last Action</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <LevelProgress
        level={user.level}
        xp={user.xp}
        xpToNextLevel={user.xpToNextLevel}
      />
      
      <View style={styles.statsContainer}>
        <StatsCard
          title="Tasks Completed"
          value={`${completedTasks}/${totalTasks}`}
          icon={<CheckCircle size={20} color={colors.primary} />}
          subtitle="All time"
          onPress={() => router.push('/(tabs)/tasks')}
        />
        
        <StatsCard
          title="Habits Completed"
          value={`${completedHabits}/${totalHabits}`}
          icon={<Calendar size={20} color={colors.primary} />}
          subtitle="Today"
          onPress={() => router.push('/(tabs)/habits')}
        />
      </View>
      
      <View style={styles.statsContainer}>
        <StatsCard
          title="Longest Streak"
          value={longestStreak}
          icon={<Flame size={20} color={colors.warning} />}
          subtitle="Days"
        />
        
        <StatsCard
          title="Focus Sessions"
          value={0}
          icon={<Clock size={20} color={colors.primary} />}
          subtitle="Today"
        />
      </View>
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Today&apos;s Tasks
          </Text>
          <Button
            title="View All"
            variant="ghost"
            size="sm"
            onPress={() => router.push('/(tabs)/tasks')}
          />
        </View>
        
        {todayTasks.length > 0 ? (
          <View style={[styles.listContainer, { backgroundColor: colors.card }]}>
            {todayTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => handleToggleTask(task.id, !task.completed)}
                onPress={() => router.push('/(tabs)/tasks')}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No tasks for today"
            description="Add some tasks to get started"
            icon={<ListTodo size={32} color={colors.text.tertiary} />}
            actionLabel="Add Task"
            onAction={() => router.push('/(tabs)/tasks')}
            style={{ backgroundColor: colors.card, borderRadius: 16 }}
          />
        )}
      </View>
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Habits
          </Text>
          <Button
            title="View All"
            variant="ghost"
            size="sm"
            onPress={() => router.push('/(tabs)/habits')}
          />
        </View>
        
        {todayHabits.length > 0 ? (
          <View style={[styles.listContainer, { backgroundColor: colors.card }]}>
            {todayHabits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                isCompletedToday={isHabitCompletedToday(habit)}
                onToggle={() => handleToggleHabit(habit.id, isHabitCompletedToday(habit))}
                onPress={() => router.push('/(tabs)/habits')}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No habits yet"
            description="Add some habits to track"
            icon={<Calendar size={32} color={colors.text.tertiary} />}
            actionLabel="Add Habit"
            onAction={() => router.push('/(tabs)/habits')}
            style={{ backgroundColor: colors.card, borderRadius: 16 }}
          />
        )}
      </View>
      
      <View style={styles.focusButtonContainer}>
        <Button
          title="Start Focus Session"
          variant="primary"
          leftIcon={<Clock size={20} color="#FFFFFF" />}
          onPress={() => router.push('/(tabs)/pomodoro')}
          fullWidth
        />
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
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  focusButtonContainer: {
    marginTop: 8,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modeToggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  modeToggleActive: {
    // No additional styles needed as backgroundColor is set dynamically
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  undoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  undoButtonText: {
    fontSize: 14,
    marginLeft: 8,
  },
});