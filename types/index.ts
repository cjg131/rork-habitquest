export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  currency: number;
  streakCorrections: number;
  graceDaysUsed: number;
  graceDaysEarned: number;
  premium: boolean;
  premiumType?: 'monthly' | 'annual';
  adRemoval?: 'basic' | 'complete';
  trialStartDate: Date;
  trialEndDate: Date;
  lastAdShown?: Date;
  createdAt: Date;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  reminder?: Date;
  subtasks?: Subtask[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  xpReward: number;
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: Frequency;
  timeOfDay?: string;
  reminder?: Date;
  streak: number;
  completionHistory: CompletionRecord[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  xpReward: number;
};

export type Frequency = {
  type: "daily" | "weekly" | "monthly" | "custom";
  days?: number[]; // 0-6 for days of week
  dates?: number[]; // 1-31 for dates of month
  interval?: number; // Every X days/weeks/months
};

export type CompletionRecord = {
  date: Date;
  completed: boolean;
};

export type PomodoroSession = {
  id: string;
  taskId?: string;
  habitId?: string;
  duration: number;
  breakDuration: number;
  completed: boolean;
  startTime?: Date;
  endTime?: Date;
  userId: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  userId: string;
};

export type OnboardingState = {
  completed: boolean;
  trackHabits: boolean;
  trackTasks: boolean;
  trackPomodoro: boolean;
  reminderFrequency: "none" | "daily" | "weekly" | "custom";
  storageMethod: "local" | "cloud" | "undecided";
};

export type ThemeOption = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  locked: boolean;
};

export type AppSettings = {
  theme: "light" | "dark" | "system";
  customTheme?: string;
  notificationsEnabled: boolean;
  completedItemsDisplay: "crossedOut" | "moveToCompleted";
  priorityColors: {
    low: string;
    medium: string;
    high: string;
  };
  pomodoroSettings: {
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
  };
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    reduceMotion: boolean;
  };
  frictionlessMode: boolean;
};

export type SubscriptionPlan = {
  id: 'free' | 'premium-monthly' | 'premium-annual' | 'ad-removal-basic' | 'ad-removal-complete';
  name: string;
  price: number;
  period?: 'month' | 'year' | 'one-time';
  features: string[];
  popular?: boolean;
};

export type PurchaseResult = {
  success: boolean;
  planId?: string;
  error?: string;
};

export type TrialStatus = {
  isActive: boolean;
  daysRemaining: number;
  hasExpired: boolean;
};

export type GraceDayAction = {
  id: string;
  type: 'manual' | 'xp-purchase' | 'skip-conversion';
  date: Date;
  habitId?: string;
  xpCost?: number;
};