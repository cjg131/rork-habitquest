import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useAppSettings } from '@/hooks/use-app-settings';
import { Checkbox } from '@/components/ui/Checkbox';
import { Task } from '@/types';
import { ChevronRight } from 'lucide-react-native';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
  showCrossedOut?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onPress,
  showCrossedOut = false,
}) => {
  const { colors } = useTheme();
  const { settings } = useAppSettings();

  const formatDueDate = (date?: Date) => {
    if (!date) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
      });
    }
  };

  const dueDate = formatDueDate(task.dueDate);
  const priorityColor = task.priority ? settings.priorityColors[task.priority] : undefined;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderBottomColor: colors.border }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={`task-item-${task.id}`}
    >
      {priorityColor && (
        <View 
          style={[
            styles.priorityIndicator,
            { backgroundColor: priorityColor }
          ]} 
        />
      )}
      
      <Checkbox
        checked={task.completed}
        onToggle={() => {
          onToggle();
        }}
        size={24}
        style={styles.checkbox}
      />
      
      <View style={styles.contentContainer}>
        <Text 
          style={[
            styles.title,
            { color: colors.text.primary },
            showCrossedOut && task.completed && styles.completedTitle,
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        
        {(task.description || dueDate || (task.subtasks && task.subtasks.length > 0)) && (
          <View style={styles.detailsContainer}>
            {task.description && (
              <Text 
                style={[
                  styles.description,
                  { color: colors.text.secondary },
                  showCrossedOut && task.completed && styles.completedText,
                ]}
                numberOfLines={1}
              >
                {task.description}
              </Text>
            )}
            
            <View style={styles.metaContainer}>
              {dueDate && (
                <View 
                  style={[
                    styles.dueDateContainer,
                    { backgroundColor: colors.card }
                  ]}
                >
                  <Text 
                    style={[
                      styles.dueDate,
                      { color: colors.text.secondary },
                      showCrossedOut && task.completed && styles.completedText,
                    ]}
                  >
                    {dueDate}
                  </Text>
                </View>
              )}
              
              {task.subtasks && task.subtasks.length > 0 && (
                <View 
                  style={[
                    styles.subtasksContainer,
                    { backgroundColor: colors.card }
                  ]}
                >
                  <Text 
                    style={[
                      styles.subtasksCount,
                      { color: colors.text.secondary },
                      showCrossedOut && task.completed && styles.completedText,
                    ]}
                  >
                    {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
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
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  checkbox: {
    marginRight: 12,
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
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  completedText: {
    opacity: 0.7,
  },
  detailsContainer: {
    flexDirection: 'column',
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  dueDate: {
    fontSize: 12,
  },
  subtasksContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  subtasksCount: {
    fontSize: 12,
  },
});