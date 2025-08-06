import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  onPress?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  onPress,
}) => {
  const { colors } = useTheme();

  const CardContent = (
    <>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.secondary }]}>
          {title}
        </Text>
        <View style={styles.iconContainer}>
          {icon}
        </View>
      </View>
      
      <Text style={[styles.value, { color: colors.text.primary }]}>
        {value}
      </Text>
      
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>
          {subtitle}
        </Text>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Card style={styles.cardContent}>
          {CardContent}
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <Card style={styles.container}>
      {CardContent}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '48%',
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
});