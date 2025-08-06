import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  label?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showPercentage = false,
  color,
  backgroundColor,
  style,
  label,
  animated = true,
}) => {
  const { colors } = useTheme();
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(normalizedProgress * 100);

  return (
    <View style={[styles.container, style]}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label && <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>}
          {showPercentage && (
            <Text style={[styles.percentage, { color: colors.text.secondary }]}>{percentage}%</Text>
          )}
        </View>
      )}
      
      <View 
        style={[
          styles.track, 
          { 
            backgroundColor: backgroundColor || colors.card,
            height,
            borderRadius: height / 2,
          }
        ]}
      >
        <View 
          style={[
            styles.progress, 
            { 
              width: `${percentage}%`,
              backgroundColor: color || colors.primary,
              height,
              borderRadius: height / 2,
            },
            animated && styles.animated
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '500',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  animated: {
    transition: 'width 0.3s ease-in-out',
  },
});