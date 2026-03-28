import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  disabled?: boolean;
  size?: number;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  disabled = false,
  size = 24,
  style,
  labelStyle,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
      testID="checkbox"
    >
      <View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderRadius: size / 4,
            borderColor: checked ? colors.primary : colors.border,
            backgroundColor: checked ? colors.primary : 'transparent',
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {checked && (
          <Check
            size={size * 0.7}
            color="#FFFFFF"
            strokeWidth={3}
          />
        )}
      </View>
      
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.text.primary,
              opacity: disabled ? 0.5 : 1,
              marginLeft: size / 2,
              fontSize: size * 0.7,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  label: {
    fontWeight: '400',
  },
});