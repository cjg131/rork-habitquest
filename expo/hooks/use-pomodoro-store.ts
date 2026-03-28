import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { PomodoroSession } from '@/types';
import { useAuth } from './use-auth-store';
import { useAppSettings } from './use-app-settings';

export const [PomodoroProvider, usePomodoro] = createContextHook(() => {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { user } = useAuth();
  const { settings } = useAppSettings();

  useEffect(() => {
    const loadSessions = async () => {
      if (!user) {
        setSessions([]);
        setLoading(false);
        return;
      }

      try {
        const savedSessions = await AsyncStorage.getItem(`pomodoro_sessions_${user.id}`);
        if (savedSessions) {
          const parsedSessions = JSON.parse(savedSessions);
          // Convert date strings back to Date objects
          setSessions(parsedSessions.map((session: any) => ({
            ...session,
            startTime: session.startTime ? new Date(session.startTime) : undefined,
            endTime: session.endTime ? new Date(session.endTime) : undefined,
          })));
        }
      } catch (error) {
        console.error('Failed to load pomodoro sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  const saveSessions = async (updatedSessions: PomodoroSession[]) => {
    if (!user) return false;
    
    try {
      await AsyncStorage.setItem(`pomodoro_sessions_${user.id}`, JSON.stringify(updatedSessions));
      return true;
    } catch (error) {
      console.error('Failed to save pomodoro sessions:', error);
      return false;
    }
  };

  const startSession = (taskId?: string, habitId?: string) => {
    if (!user) return false;
    
    try {
      const workDuration = settings.pomodoroSettings.workDuration;
      
      const newSession: PomodoroSession = {
        id: Math.random().toString(36).substring(2, 15),
        taskId,
        habitId,
        duration: workDuration * 60, // Convert to seconds
        breakDuration: settings.pomodoroSettings.breakDuration * 60, // Convert to seconds
        completed: false,
        startTime: new Date(),
        userId: user.id,
      };
      
      setCurrentSession(newSession);
      setTimeRemaining(newSession.duration);
      setIsActive(true);
      setIsBreak(false);
      
      return true;
    } catch (error) {
      console.error('Failed to start pomodoro session:', error);
      return false;
    }
  };

  const pauseSession = () => {
    setIsActive(false);
    return true;
  };

  const resumeSession = () => {
    setIsActive(true);
    return true;
  };

  const completeSession = async () => {
    if (!currentSession) return false;
    
    try {
      const completedSession: PomodoroSession = {
        ...currentSession,
        completed: true,
        endTime: new Date(),
      };
      
      const updatedSessions = [...sessions, completedSession];
      setSessions(updatedSessions);
      await saveSessions(updatedSessions);
      
      setCurrentSession(null);
      setIsActive(false);
      setCompletedPomodoros(prev => prev + 1);
      
      return true;
    } catch (error) {
      console.error('Failed to complete pomodoro session:', error);
      return false;
    }
  };

  const cancelSession = () => {
    setCurrentSession(null);
    setIsActive(false);
    setTimeRemaining(0);
    return true;
  };

  const startBreak = () => {
    if (!currentSession) return false;
    
    const breakDuration = currentSession.breakDuration;
    setTimeRemaining(breakDuration);
    setIsBreak(true);
    setIsActive(true);
    
    return true;
  };

  const completeBreak = () => {
    setIsBreak(false);
    setIsActive(false);
    
    // Check if we should start a new pomodoro or take a long break
    const shouldTakeLongBreak = completedPomodoros > 0 && 
      completedPomodoros % settings.pomodoroSettings.longBreakInterval === 0;
    
    if (shouldTakeLongBreak) {
      setTimeRemaining(settings.pomodoroSettings.longBreakDuration * 60);
    } else {
      setTimeRemaining(settings.pomodoroSettings.workDuration * 60);
    }
    
    return true;
  };

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      if (isBreak) {
        completeBreak();
      } else {
        completeSession();
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, isBreak]);

  return {
    sessions,
    currentSession,
    timeRemaining,
    isActive,
    isBreak,
    completedPomodoros,
    loading,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
    startBreak,
    completeBreak,
  };
});