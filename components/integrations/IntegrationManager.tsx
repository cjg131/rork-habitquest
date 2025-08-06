import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useSubscriptionStore } from '@/hooks/use-subscription-store';
import { useHabitsStore } from '@/hooks/use-habits-store';
import { Checkbox } from '@/components/ui/Checkbox';

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}

interface HabitIntegration {
  habitId: string;
  integrationId: string;
  enabled: boolean;
}

const IntegrationManager = () => {
  const { isPremium } = useSubscriptionStore();
  const { habits } = useHabitsStore();
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'appleHealth', name: 'Apple Health', description: 'Sync fitness and health data', connected: false },
    { id: 'zapier', name: 'Zapier', description: 'Automate workflows with other apps', connected: false },
  ]);
  const [habitIntegrations, setHabitIntegrations] = useState<HabitIntegration[]>([]);

  const toggleIntegration = (index: number) => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'Integrations are available for Premium users only. Upgrade to access this feature.');
      return;
    }

    const updatedIntegrations = [...integrations];
    updatedIntegrations[index].connected = !updatedIntegrations[index].connected;
    setIntegrations(updatedIntegrations);

    if (!updatedIntegrations[index].connected) {
      // Disconnect all habits from this integration
      const updatedHabitIntegrations = habitIntegrations.filter(
        hi => hi.integrationId !== updatedIntegrations[index].id
      );
      setHabitIntegrations(updatedHabitIntegrations);
    }
  };

  const toggleHabitIntegration = (habitId: string, integrationId: string) => {
    if (!isPremium) return;

    const existingIndex = habitIntegrations.findIndex(
      hi => hi.habitId === habitId && hi.integrationId === integrationId
    );

    if (existingIndex >= 0) {
      const updatedHabitIntegrations = [...habitIntegrations];
      updatedHabitIntegrations[existingIndex].enabled = !updatedHabitIntegrations[existingIndex].enabled;
      setHabitIntegrations(updatedHabitIntegrations);
    } else {
      setHabitIntegrations([...habitIntegrations, { habitId, integrationId, enabled: true }]);
    }

    // Require user confirmation for auto-completion
    if (existingIndex < 0 || !habitIntegrations[existingIndex].enabled) {
      Alert.alert('Confirm Auto-Completion', 'Do you want to allow auto-completion for this habit via integration?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`Auto-completion confirmed for habit ${habitId}`) },
      ]);
    }
  };

  const renderIntegrationItem = ({ item, index }: { item: Integration; index: number }) => (
    <View style={styles.integrationItem}>
      <View style={styles.integrationHeader}>
        <Text style={styles.integrationName}>{item.name}</Text>
        <TouchableOpacity
          style={[styles.connectButton, item.connected && styles.disconnectButton]}
          onPress={() => toggleIntegration(index)}
        >
          <Text style={styles.connectButtonText}>{item.connected ? 'Disconnect' : 'Connect'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.integrationDescription}>{item.description}</Text>
      {item.connected && (
        <View style={styles.habitListContainer}>
          <Text style={styles.habitListTitle}>Link Habits:</Text>
          {habits.map(habit => {
            const isLinked = habitIntegrations.some(
              hi => hi.habitId === habit.id && hi.integrationId === item.id && hi.enabled
            );
            return (
              <View key={habit.id} style={styles.habitItem}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Checkbox
                  checked={isLinked}
                  onChange={() => toggleHabitIntegration(habit.id, item.id)}
                  testId={`checkbox-${habit.id}-${item.id}`}
                />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Integrations</Text>
      {!isPremium && (
        <Text style={styles.premiumNotice}>
          Integrations are a Premium feature. Upgrade to connect with Apple Health and Zapier.
        </Text>
      )}
      <FlatList
        data={integrations}
        renderItem={renderIntegrationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Integration Summary</Text>
        <Text style={styles.summaryText}>
          {habitIntegrations.filter(hi => hi.enabled).length} habits linked to integrations
        </Text>
        {/* Placeholder for log of auto-completed habits */}
        <Text style={styles.summaryText}>Auto-completion log available for Premium users</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  premiumNotice: {
    color: '#FF3B30',
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  integrationItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  integrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  integrationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  connectButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  integrationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  habitListContainer: {
    marginTop: 12,
  },
  habitListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  habitName: {
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});

export default IntegrationManager;
