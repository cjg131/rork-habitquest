import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/Card';
import { HardDrive, Cloud, HelpCircle } from 'lucide-react-native';

interface StoragePreferencesProps {
  storageMethod: 'local' | 'cloud' | 'undecided';
  onSelectStorage: (method: 'local' | 'cloud' | 'undecided') => void;
}

export const StoragePreferences: React.FC<StoragePreferencesProps> = ({
  storageMethod,
  onSelectStorage,
}) => {
  const { colors } = useTheme();

  const options = [
    {
      id: 'local',
      title: 'Store on device',
      description: 'Data stays on your phone, no account needed',
      icon: <HardDrive size={24} color={colors.primary} />,
    },
    {
      id: 'cloud',
      title: 'Cloud sync',
      description: 'Access your data across multiple devices',
      icon: <Cloud size={24} color={colors.primary} />,
    },
    {
      id: 'undecided',
      title: 'Decide later',
      description: 'You can change this in settings anytime',
      icon: <HelpCircle size={24} color={colors.text.secondary} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
        How would you like to store your data?
      </Text>
      
      {options.map((option) => (
        <Card
          key={option.id}
          style={[
            styles.card,
            storageMethod === option.id && { 
              borderColor: colors.primary,
              borderWidth: 2,
            }
          ]}
          onPress={() => onSelectStorage(option.id as 'local' | 'cloud' | 'undecided')}
          testID={`storage-${option.id}`}
        >
          <View style={styles.optionContainer}>
            <View style={styles.optionIconContainer}>
              {option.icon}
            </View>
            
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                {option.title}
              </Text>
              <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
                {option.description}
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  optionIconContainer: {
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
});