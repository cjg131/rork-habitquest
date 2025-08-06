import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useTheme } from '@/hooks/use-theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabits } from '@/hooks/use-habits-store';
import { useTasks } from '@/hooks/use-tasks-store';
import { useAppSettings } from '@/hooks/use-app-settings';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { X, Save, Trash2, Calendar } from 'lucide-react-native';
import type { Habit, Task, Frequency } from '@/types';
// import DateTimePicker from '@react-native-community/datetimepicker';

export default function ModalScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { settings, updatePomodoroSettings } = useAppSettings();
  
  const type = params.type as 'habit' | 'task' | 'pomodoro-settings' | 'privacy-settings' | 'help-support' | 'profile-edit' | undefined;
  const id = params.id as string | undefined;
  const isEditing = Boolean(id);
  
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [frequency, setFrequency] = useState<Frequency>({ type: 'daily' });
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<string>('09:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dueDateText, setDueDateText] = useState<string>('');
  
  // Pomodoro settings state
  const [workDuration, setWorkDuration] = useState<string>('25');
  const [breakDuration, setBreakDuration] = useState<string>('5');
  const [longBreakDuration, setLongBreakDuration] = useState<string>('15');
  const [longBreakInterval, setLongBreakInterval] = useState<string>('4');
  
  useEffect(() => {
    if (isEditing && type && id) {
      if (type === 'habit') {
        const habit = habits.find(h => h.id === id);
        if (habit) {
          setTitle(habit.title);
          setDescription(habit.description || '');
          setFrequency(habit.frequency);
          setReminderEnabled(Boolean(habit.reminder));
          setReminderTime(habit.reminder ? habit.reminder.toTimeString().slice(0, 5) : '09:00');
        }
      } else if (type === 'task') {
        const task = tasks.find(t => t.id === id);
        if (task) {
          setTitle(task.title);
          setDescription(task.description || '');
          setPriority(task.priority || 'medium');
          setReminderEnabled(Boolean(task.reminder));
          setReminderTime(task.reminder ? task.reminder.toTimeString().slice(0, 5) : '09:00');
          setDueDate(task.dueDate);
          setDueDateText(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
        }
      }
    }
    
    // Load pomodoro settings
    if (type === 'pomodoro-settings') {
      setWorkDuration(settings.pomodoroSettings.workDuration.toString());
      setBreakDuration(settings.pomodoroSettings.breakDuration.toString());
      setLongBreakDuration(settings.pomodoroSettings.longBreakDuration.toString());
      setLongBreakInterval(settings.pomodoroSettings.longBreakInterval.toString());
    }
  }, [isEditing, type, id, habits, tasks, settings]);
  
  const handleSave = () => {
    if (type === 'pomodoro-settings') {
      const workDur = parseInt(workDuration) || 25;
      const breakDur = parseInt(breakDuration) || 5;
      const longBreakDur = parseInt(longBreakDuration) || 15;
      const longBreakInt = parseInt(longBreakInterval) || 4;
      
      updatePomodoroSettings({
        workDuration: workDur,
        breakDuration: breakDur,
        longBreakDuration: longBreakDur,
        longBreakInterval: longBreakInt,
      });
      
      router.back();
      return;
    }
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    
    if (type === 'habit') {
      const habitData: Partial<Habit> = {
        title: title.trim(),
        description: description.trim(),
        frequency,
        reminder: reminderEnabled ? new Date(`2000-01-01T${reminderTime}:00`) : undefined,
      };
      
      if (isEditing && id) {
        updateHabit(id, habitData);
      } else {
        const newHabit: Habit = {
          id: Date.now().toString(),
          title: title.trim(),
          description: description.trim() || undefined,
          frequency,
          reminder: reminderEnabled ? new Date(`2000-01-01T${reminderTime}:00`) : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          completionHistory: [],
          streak: 0,
          userId: 'current-user',
          xpReward: 10,
        };
        addHabit(newHabit);
      }
    } else if (type === 'task') {
      const taskData: Partial<Task> = {
        title: title.trim(),
        description: description.trim(),
        priority,
        reminder: reminderEnabled ? new Date(`2000-01-01T${reminderTime}:00`) : undefined,
        dueDate: dueDate,
      };
      
      if (isEditing && id) {
        updateTask(id, taskData);
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          title: title.trim(),
          description: description.trim() || undefined,
          completed: false,
          priority,
          dueDate: dueDate,
          reminder: reminderEnabled ? new Date(`2000-01-01T${reminderTime}:00`) : undefined,
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'current-user',
          xpReward: 5,
        };
        addTask(newTask);
      }
    }
    
    router.back();
  };
  
  const handleDelete = () => {
    if (!isEditing || !id) return;
    
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete this ${type}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (type === 'habit') {
              deleteHabit(id);
            } else if (type === 'task') {
              deleteTask(id);
            }
            router.back();
          },
        },
      ]
    );
  };
  
  const getTitle = () => {
    if (type === 'pomodoro-settings') return 'Pomodoro Settings';
    if (type === 'privacy-settings') return 'Privacy Settings';
    if (type === 'help-support') return 'Help & Support';
    if (type === 'profile-edit') return 'Edit Profile';
    
    if (isEditing) {
      return `Edit ${type === 'habit' ? 'Habit' : 'Task'}`;
    }
    return `New ${type === 'habit' ? 'Habit' : 'Task'}`;
  };
  
  if (!type) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text.primary }]}>
          Invalid modal type
        </Text>
        <Button title="Close" onPress={() => router.back()} />
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    );
  }
  
  // Handle pomodoro settings screen
  if (type === 'pomodoro-settings') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Button
            title=""
            leftIcon={<X size={24} color={colors.text.primary} />}
            variant="ghost"
            onPress={() => router.back()}
            style={styles.headerButton}
          />
          
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Pomodoro Settings
          </Text>
          
          <Button
            title=""
            leftIcon={<Save size={24} color={colors.primary} />}
            variant="ghost"
            onPress={handleSave}
            style={styles.headerButton}
          />
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Card style={styles.formCard}>
            <Input
              label="Work Duration (minutes)"
              placeholder="25"
              value={workDuration}
              onChangeText={setWorkDuration}
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
            />
            
            <Input
              label="Break Duration (minutes)"
              placeholder="5"
              value={breakDuration}
              onChangeText={setBreakDuration}
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
            />
            
            <Input
              label="Long Break Duration (minutes)"
              placeholder="15"
              value={longBreakDuration}
              onChangeText={setLongBreakDuration}
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
            />
            
            <Input
              label="Long Break Interval (sessions)"
              placeholder="4"
              value={longBreakInterval}
              onChangeText={setLongBreakInterval}
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
            />
          </Card>
        </ScrollView>
        
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    );
  }
  
  // Handle other settings screens
  if (type === 'privacy-settings' || type === 'help-support' || type === 'profile-edit') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Button
            title=""
            leftIcon={<X size={24} color={colors.text.primary} />}
            variant="ghost"
            onPress={() => router.back()}
            style={styles.headerButton}
          />
          
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            {getTitle()}
          </Text>
          
          <View style={styles.headerButton} />
        </View>
        
        <View style={styles.content}>
          <Card style={styles.formCard}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
              {type === 'privacy-settings' ? 'This feature is coming soon! You\'ll be able to manage your data and privacy settings.' :
               type === 'help-support' ? 'This feature is coming soon! You\'ll be able to access FAQs, contact support, and report bugs.' :
               'This feature is coming soon! You\'ll be able to edit your profile information.'}
            </Text>
          </Card>
        </View>
        
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Button
          title=""
          leftIcon={<X size={24} color={colors.text.primary} />}
          variant="ghost"
          onPress={() => router.back()}
          style={styles.headerButton}
        />
        
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          {getTitle()}
        </Text>
        
        <Button
          title=""
          leftIcon={<Save size={24} color={colors.primary} />}
          variant="ghost"
          onPress={handleSave}
          style={styles.headerButton}
        />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.formCard}>
          <Input
            label="Title"
            placeholder={`Enter ${type} title`}
            value={title}
            onChangeText={setTitle}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Description (Optional)"
            placeholder={`Describe your ${type}`}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            containerStyle={styles.inputContainer}
          />
          
          {type === 'habit' && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Frequency</Text>
              <View style={styles.frequencyContainer}>
                {['daily', 'weekly', 'monthly'].map((freq) => (
                  <Button
                    key={freq}
                    title={freq.charAt(0).toUpperCase() + freq.slice(1)}
                    variant={frequency.type === freq ? 'primary' : 'outline'}
                    size="sm"
                    onPress={() => setFrequency({ type: freq as 'daily' | 'weekly' | 'monthly' })}
                    style={styles.frequencyButton}
                  />
                ))}
              </View>
            </View>
          )}
          
          {type === 'task' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text.primary }]}>Priority</Text>
                <View style={styles.frequencyContainer}>
                  {['low', 'medium', 'high'].map((prio) => (
                    <Button
                      key={prio}
                      title={prio.charAt(0).toUpperCase() + prio.slice(1)}
                      variant={priority === prio ? 'primary' : 'outline'}
                      size="sm"
                      onPress={() => setPriority(prio as 'low' | 'medium' | 'high')}
                      style={styles.frequencyButton}
                    />
                  ))}
                </View>
              </View>
              
              <Input
                label="Due Date (Optional)"
                placeholder="YYYY-MM-DD"
                value={dueDateText}
                onChangeText={(text) => {
                  setDueDateText(text);
                  // Try to parse the date
                  if (text.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    const parsedDate = new Date(text);
                    if (!isNaN(parsedDate.getTime())) {
                      setDueDate(parsedDate);
                    }
                  } else if (text === '') {
                    setDueDate(undefined);
                  }
                }}
                leftIcon={<Calendar size={20} color={colors.text.secondary} />}
                containerStyle={styles.inputContainer}
              />
            </>
          )}
          
          <View style={[styles.switchContainer, { borderTopColor: colors.border }]}>
            <View style={styles.switchContent}>
              <Text style={[styles.switchLabel, { color: colors.text.primary }]}>Reminder</Text>
              <Text style={[styles.switchDescription, { color: colors.text.secondary }]}>
                Get notified to complete this {type}
              </Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
            />
          </View>
          
          {reminderEnabled && (
            <Input
              label="Reminder Time"
              placeholder="HH:MM"
              value={reminderTime}
              onChangeText={setReminderTime}
              containerStyle={styles.inputContainer}
            />
          )}
        </Card>
        
        {isEditing && (
          <Button
            title={`Delete ${type === 'habit' ? 'Habit' : 'Task'}`}
            variant="outline"
            leftIcon={<Trash2 size={20} color={colors.error} />}
            onPress={handleDelete}
            style={[styles.deleteButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
          />
        )}
      </ScrollView>
      
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  formCard: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  switchContent: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },

});
