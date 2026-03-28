import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { usePomodoro } from '@/hooks/use-pomodoro-store';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppSettings } from '@/hooks/use-app-settings';
import { useRouter } from 'expo-router';
import { Clock, Settings } from 'lucide-react-native';

export default function PomodoroScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { 
    currentSession, 
    timeRemaining, 
    isActive, 
    isBreak,
    completedPomodoros,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
    startBreak,
  } = usePomodoro();
  
  const { settings } = useAppSettings();

  const handleStart = () => {
    if (currentSession) {
      resumeSession();
    } else {
      startSession();
    }
  };

  const handlePause = () => {
    pauseSession();
  };

  const handleSkip = () => {
    if (isBreak) {
      // Skip break
      completeSession();
    } else {
      // Skip work session
      completeSession();
      startBreak();
    }
  };

  const handleCancel = () => {
    cancelSession();
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {isBreak ? 'Break Time' : 'Focus Session'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {isBreak 
            ? 'Take a moment to relax' 
            : 'Stay focused on your task'
          }
        </Text>
      </View>
      
      <PomodoroTimer
        timeRemaining={timeRemaining}
        isActive={isActive}
        isBreak={isBreak}
        onStart={handleStart}
        onPause={handlePause}
        onSkip={handleSkip}
        onCancel={handleCancel}
      />
      
      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Completed Today
            </Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {completedPomodoros}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Work Duration
            </Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {settings.pomodoroSettings.workDuration} min
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Break Duration
            </Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {settings.pomodoroSettings.breakDuration} min
            </Text>
          </View>
        </View>
      </Card>
      
      <Card style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Clock size={20} color={colors.primary} />
          <Text style={[styles.tipsTitle, { color: colors.text.primary }]}>
            Pomodoro Tips
          </Text>
        </View>
        
        <Text style={[styles.tipText, { color: colors.text.secondary }]}>
          • Focus on a single task during each session
        </Text>
        <Text style={[styles.tipText, { color: colors.text.secondary }]}>
          • Take short breaks between sessions
        </Text>
        <Text style={[styles.tipText, { color: colors.text.secondary }]}>
          • After 4 sessions, take a longer break
        </Text>
        <Text style={[styles.tipText, { color: colors.text.secondary }]}>
          • Use breaks to stretch, hydrate, or rest your eyes
        </Text>
      </Card>
      
      <Button
        title="Customize Pomodoro Settings"
        variant="outline"
        leftIcon={<Settings size={20} color={colors.primary} />}
        style={styles.settingsButton}
        onPress={() => router.push('/modal?type=pomodoro-settings')}
      />
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
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  statsCard: {
    marginTop: 32,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tipsCard: {
    marginBottom: 24,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  settingsButton: {
    marginTop: 8,
  },
});