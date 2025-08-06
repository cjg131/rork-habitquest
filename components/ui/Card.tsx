import React from 'react';
import { 
  StyleSheet, 
  View, 
  ViewStyle, 
  TouchableOpacity, 
  TouchableOpacityProps 
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: boolean;
  elevation?: 'none' | 'low' | 'medium' | 'high';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding = true,
  elevation = 'low',
  ...props
}) => {
  const { colors, colorScheme } = useTheme();

  const getElevationStyle = (): ViewStyle => {
    const isDark = colorScheme === 'dark';
    
    switch (elevation) {
      case 'none':
        return {};
      case 'low':
        return {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 3,
          elevation: 2,
        };
      case 'medium':
        return {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.4 : 0.15,
          shadowRadius: 6,
          elevation: 4,
        };
      case 'high':
        return {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.5 : 0.2,
          shadowRadius: 12,
          elevation: 8,
        };
      default:
        return {};
    }
  };

  const cardStyle = [
    styles.card,
    { 
      backgroundColor: colors.card,
      borderColor: colors.border,
      padding: padding ? 16 : 0,
    },
    getElevationStyle(),
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={onPress} 
        activeOpacity={0.7}
        testID="card"
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} testID="card">
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
});