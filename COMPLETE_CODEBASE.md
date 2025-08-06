# Stride - Complete Codebase

## Project Structure
```
├── app/                    # App screens and navigation
│   ├── (auth)/            # Authentication screens
│   ├── (onboarding)/      # Onboarding flow
│   ├── (tabs)/            # Main tab navigation
│   └── modal.tsx          # Modal screens
├── backend/               # Backend API with tRPC
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── constants/             # App constants
├── types/                 # TypeScript types
└── assets/               # Images and static assets
```

## Key Files

### package.json
```json
{
  "name": "expo-app",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "bunx rork start -p vkgl7waseq3qcerree9bj --tunnel",
    "start-web": "bunx rork start -p vkgl7waseq3qcerree9bj --web --tunnel",
    "start-web-dev": "DEBUG=expo* bunx rork start -p vkgl7waseq3qcerree9bj --web --tunnel"
  },
  "dependencies": {
    "@expo/vector-icons": "^14.1.0",
    "@hono/trpc-server": "^0.4.0",
    "@nkzw/create-context-hook": "^1.1.0",
    "@react-native-async-storage/async-storage": "2.1.2",
    "@react-native-community/datetimepicker": "8.4.1",
    "@react-navigation/native": "^7.1.6",
    "@tanstack/react-query": "^5.84.1",
    "@trpc/client": "^11.4.4",
    "@trpc/react-query": "^11.4.4",
    "@trpc/server": "^11.4.4",
    "expo": "^53.0.4",
    "expo-blur": "~14.1.4",
    "expo-constants": "~17.1.4",
    "expo-font": "~13.3.0",
    "expo-haptics": "~14.1.4",
    "expo-image": "~2.1.6",
    "expo-image-picker": "~16.1.4",
    "expo-linear-gradient": "~14.1.4",
    "expo-linking": "~7.1.4",
    "expo-location": "~18.1.4",
    "expo-router": "~5.0.3",
    "expo-splash-screen": "~0.30.7",
    "expo-status-bar": "~2.2.3",
    "expo-symbols": "~0.4.4",
    "expo-system-ui": "~5.0.6",
    "expo-web-browser": "~14.1.6",
    "hono": "^4.8.12",
    "lucide-react-native": "^0.536.0",
    "nativewind": "^4.1.23",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-native": "0.79.1",
    "react-native-gesture-handler": "~2.24.0",
    "react-native-safe-area-context": "5.3.0",
    "react-native-screens": "~4.10.0",
    "react-native-svg": "15.11.2",
    "react-native-web": "^0.20.0",
    "superjson": "^2.2.2",
    "zod": "^4.0.15",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@expo/ngrok": "^4.1.0",
    "@types/react": "~19.0.10",
    "typescript": "~5.8.3"
  },
  "private": true
}
```

### app.json
```json
{
  "expo": {
    "name": "HabitQuest",
    "slug": "habitquest",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "habitquest",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Root Layout (app/_layout.tsx)
```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth-store";
import { OnboardingProvider } from "@/hooks/use-onboarding-store";
import { AppSettingsProvider } from "@/hooks/use-app-settings";
import { TasksProvider } from "@/hooks/use-tasks-store";
import { HabitsProvider } from "@/hooks/use-habits-store";
import { PomodoroProvider } from "@/hooks/use-pomodoro-store";
import { GamificationProvider } from "@/hooks/use-gamification-store";
import { trpc, trpcClient } from "@/lib/trpc";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors } = useTheme();
  
  return (
    <Stack 
      screenOptions={{ 
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text.primary,
        },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal',
          headerShown: true,
          title: 'Modal'
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthProvider>
            <AppSettingsProvider>
              <OnboardingProvider>
                <TasksProvider>
                  <HabitsProvider>
                    <PomodoroProvider>
                      <GamificationProvider>
                        <RootLayoutNav />
                      </GamificationProvider>
                    </PomodoroProvider>
                  </HabitsProvider>
                </TasksProvider>
              </OnboardingProvider>
            </AppSettingsProvider>
          </AuthProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

## Main Features

### Task Management (app/(tabs)/tasks.tsx)
```typescript
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
```

### Task Store (hooks/use-tasks-store.ts)
```typescript
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Task, Subtask } from '@/types';
import { useAuth } from './use-auth-store';

// Sample tasks for new users
const sampleTasks: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Complete app setup',
    description: 'Finish setting up your new habit tracker app',
    completed: false,
    xpReward: 10,
  },
  {
    title: 'Create your first habit',
    description: 'Start tracking a new daily habit',
    completed: false,
    xpReward: 15,
  },
  {
    title: 'Try a Pomodoro session',
    description: 'Complete a focused work session using the Pomodoro timer',
    completed: false,
    xpReward: 20,
  },
];

export const [TasksProvider, useTasks] = createContextHook(() => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        const savedTasks = await AsyncStorage.getItem(`tasks_${user.id}`);
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          // Convert date strings back to Date objects
          setTasks(parsedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            reminder: task.reminder ? new Date(task.reminder) : undefined,
          })));
        } else {
          // For new users, create sample tasks
          const initialTasks = sampleTasks.map((task) => ({
            ...task,
            id: Math.random().toString(36).substring(2, 15),
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
          await AsyncStorage.setItem(`tasks_${user.id}`, JSON.stringify(initialTasks));
          setTasks(initialTasks);
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user]);

  const saveTasks = async (updatedTasks: Task[]) => {
    if (!user) return false;
    
    try {
      await AsyncStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
      return true;
    } catch (error) {
      console.error('Failed to save tasks:', error);
      return false;
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return false;
    
    try {
      const newTask: Task = {
        ...task,
        id: Math.random().toString(36).substring(2, 15),
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to add task:', error);
      return false;
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>) => {
    if (!user) return false;
    
    try {
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex === -1) return false;
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        ...updates,
        updatedAt: new Date(),
      };
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to update task:', error);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return false;
    
    try {
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      return false;
    }
  };

  const addSubtask = async (taskId: string, subtask: Omit<Subtask, 'id'>) => {
    if (!user) return false;
    
    try {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return false;
      
      const newSubtask: Subtask = {
        ...subtask,
        id: Math.random().toString(36).substring(2, 15),
      };
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        subtasks: [...(updatedTasks[taskIndex].subtasks || []), newSubtask],
        updatedAt: new Date(),
      };
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to add subtask:', error);
      return false;
    }
  };

  const updateSubtask = async (taskId: string, subtaskId: string, updates: Partial<Omit<Subtask, 'id'>>) => {
    if (!user) return false;
    
    try {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return false;
      
      const task = tasks[taskIndex];
      if (!task.subtasks) return false;
      
      const subtaskIndex = task.subtasks.findIndex(s => s.id === subtaskId);
      if (subtaskIndex === -1) return false;
      
      const updatedSubtasks = [...task.subtasks];
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        ...updates,
      };
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...task,
        subtasks: updatedSubtasks,
        updatedAt: new Date(),
      };
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to update subtask:', error);
      return false;
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    if (!user) return false;
    
    try {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return false;
      
      const task = tasks[taskIndex];
      if (!task.subtasks) return false;
      
      const updatedSubtasks = task.subtasks.filter(s => s.id !== subtaskId);
      
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...task,
        subtasks: updatedSubtasks,
        updatedAt: new Date(),
      };
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Failed to delete subtask:', error);
      return false;
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
  };
});
```

## TypeScript Types (types/index.ts)
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  trialEndsAt?: Date;
  subscriptionType?: 'free' | 'basic' | 'complete' | 'premium';
  subscriptionStatus?: 'active' | 'canceled' | 'expired';
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminder?: Date;
  xpReward: number;
  subtasks?: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customFrequency?: {
    days: number[];
    times: number;
  };
  streak: number;
  longestStreak: number;
  completedDates: string[];
  xpReward: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PomodoroSession {
  id: string;
  userId: string;
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  completedSessions: number;
  startedAt: Date;
  completedAt?: Date;
  xpReward: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: Date;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalTasksCompleted: number;
  totalHabitsCompleted: number;
  totalPomodoroSessions: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    enabled: boolean;
    habitReminders: boolean;
    taskReminders: boolean;
    pomodoroBreaks: boolean;
  };
  completedItemsDisplay: 'crossedOut' | 'moveToCompleted';
  priorityColors: {
    low: string;
    medium: string;
    high: string;
  };
  pomodoroSettings: {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
  };
}
```

## Installation & Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Start development server: `bun run start`
4. For web: `bun run start-web`

## Key Features

- **Task Management**: Create, edit, delete tasks with priorities and due dates
- **Habit Tracking**: Daily, weekly, and custom frequency habits
- **Pomodoro Timer**: Customizable work/break intervals
- **Gamification**: XP system, levels, achievements
- **Calendar Integration**: View tasks and habits in calendar format
- **Premium Features**: Ad-free experience, data export, advanced analytics
- **Cross-Platform**: iOS, Android, and Web support

## Tech Stack

- React Native + Expo
- TypeScript
- Expo Router (file-based routing)
- tRPC + Hono (backend)
- React Query (server state)
- AsyncStorage (local persistence)
- Lucide React Native (icons)

This is a comprehensive habit tracking and productivity app with modern mobile UX/UI patterns.