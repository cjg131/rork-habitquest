import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useAppSettings } from '@/hooks/use-app-settings';
import { Play, Pause, SkipForward, X } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

interface PomodoroTimerProps {
  timeRemaining: number;
  isActive: boolean;
  isBreak: boolean;
  totalDuration?: number;
  onStart: () => void;
  onPause: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  timeRemaining,
  isActive,
  isBreak,
  totalDuration,
  onStart,
  onPause,
  onSkip,
  onCancel,
}) => {
  const { colors } = useTheme();
  const { settings } = useAppSettings();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (seconds: number, totalSeconds: number): number => {
    return (seconds / totalSeconds) * 100;
  };

  // Use actual duration from settings or provided totalDuration
  const totalSeconds = totalDuration || (isBreak ? settings.pomodoroSettings.breakDuration * 60 : settings.pomodoroSettings.workDuration * 60);
  const progress = getProgressPercentage(timeRemaining, totalSeconds);

  // Calculate the circumference of the circle
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke-dashoffset based on progress (inverted for countdown)
  const strokeDashoffset = circumference - ((100 - progress) / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <View style={styles.progressCircle}>
          <Svg width={280} height={280} style={styles.svgContainer}>
            {/* Background circle */}
            <Circle
              cx={140}
              cy={140}
              r={radius}
              stroke={colors.border}
              strokeWidth={8}
              fill="transparent"
            />
            {/* Progress circle */}
            <Circle
              cx={140}
              cy={140}
              r={radius}
              stroke={isBreak ? colors.secondary : colors.primary}
              strokeWidth={8}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 140 140)"
            />
          </Svg>
          
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: colors.text.primary }]}>
              {formatTime(timeRemaining)}
            </Text>
            <Text style={[styles.statusText, { color: colors.text.secondary }]}>
              {isBreak ? 'Break Time' : 'Focus Time'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.secondaryButton,
            { borderColor: colors.border }
          ]}
          onPress={onCancel}
          testID="cancel-button"
        >
          <X size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.primaryButton,
            { backgroundColor: isBreak ? colors.secondary : colors.primary }
          ]}
          onPress={isActive ? onPause : onStart}
          testID={isActive ? "pause-button" : "start-button"}
        >
          {isActive ? (
            <Pause size={24} color="#FFFFFF" />
          ) : (
            <Play size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.secondaryButton,
            { borderColor: colors.border }
          ]}
          onPress={onSkip}
          testID="skip-button"
        >
          <SkipForward size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  progressCircle: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgContainer: {
    position: 'absolute',
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  primaryButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  secondaryButton: {
    borderWidth: 1,
  },
});