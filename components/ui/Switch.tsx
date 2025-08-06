import React from 'react';
import { 
  StyleSheet, 
  Switch as RNSwitch, 
  View, 
  Text, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  style,
  labelStyle,
  testID,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.text.primary,
              opacity: disabled ? 0.5 : 1,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#E5E5EA', true: colors.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E5E5EA"
        testID={testID || "switch"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
});