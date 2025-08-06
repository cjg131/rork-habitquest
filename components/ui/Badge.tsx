import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const getBadgeStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 999,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: size === 'sm' ? 6 : size === 'md' ? 8 : 12,
      paddingVertical: size === 'sm' ? 2 : size === 'md' ? 4 : 6,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: colors.success,
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: colors.warning,
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: colors.error,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'sm' ? 10 : size === 'md' ? 12 : 14,
      fontWeight: '600',
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'success':
      case 'warning':
      case 'error':
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          ...baseStyle,
          color: colors.text.secondary,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[getBadgeStyles(), style]} testID="badge">
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[getTextStyles(), textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 4,
  },
});