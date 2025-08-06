import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useTasks } from '@/hooks/use-tasks-store';
import { useAppSettings } from '@/hooks/use-app-settings';
import { TaskItem } from '@/components/tasks/TaskItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { ListTodo, Plus, Search } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';

export default function TasksScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { tasks, updateTask, loading } = useTasks();
  const { settings } = useAppSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (settings.completedItemsDisplay === 'crossedOut') {
      // Show all tasks in active tab, only completed in completed tab
      const matchesTab = activeTab === 'completed' ? task.completed : true;
      return matchesSearch && matchesTab;
    } else {
      // Move completed tasks to completed tab
      const matchesTab = activeTab === 'completed' ? task.completed : !task.completed;
      return matchesSearch && matchesTab;
    }
  });

  const handleToggleTask = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
    // If user prefers to move completed tasks and we're completing a task,
    // and we're on the active tab, the task will automatically disappear from view
    // If user prefers crossed out, the task stays but gets crossed out
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Input
          placeholder="Search tasks..."
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
          onPress={() => router.push('/modal?type=task')}
          testID="add-task-button"
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {settings.completedItemsDisplay === 'moveToCompleted' && (
        <View style={styles.filterContainer}>
          <Button
            title="Active"
            variant={activeTab === 'active' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setActiveTab('active')}
            style={styles.filterButton}
          />
          <Button
            title="Completed"
            variant={activeTab === 'completed' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setActiveTab('completed')}
            style={styles.filterButton}
          />
        </View>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading tasks...
          </Text>
        </View>
      ) : filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={() => handleToggleTask(item.id, !item.completed)}
              onPress={() => router.push(`/modal?type=task&id=${item.id}`)}
              showCrossedOut={settings.completedItemsDisplay === 'crossedOut' && activeTab === 'active'}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { backgroundColor: colors.card }
          ]}
        />
      ) : (
        <EmptyState
          title={activeTab === 'completed' ? "No completed tasks" : "No tasks found"}
          description={searchQuery 
            ? "Try a different search term" 
            : activeTab === 'completed' 
              ? "Complete some tasks to see them here"
              : "Add your first task to get started"
          }
          icon={<ListTodo size={48} color={colors.primary} />}
          actionLabel="Add Task"
          onAction={() => router.push('/modal?type=task')}
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    marginRight: 8,
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