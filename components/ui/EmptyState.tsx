import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View 
      style={[
        styles.container,
        style,
      ]}
      testID="empty-state"
    >
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      <Text 
        style={[
          styles.title,
          { color: colors.text.primary }
        ]}
      >
        {title}
      </Text>
      
      {description && (
        <Text 
          style={[
            styles.description,
            { color: colors.text.secondary }
          ]}
        >
          {description}
        </Text>
      )}
      
      {actionLabel && onAction && (
        <View style={styles.actionContainer}>
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="primary"
            size="md"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  actionContainer: {
    marginTop: 8,
  },
});