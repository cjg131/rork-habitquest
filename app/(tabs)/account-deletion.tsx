import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/use-auth-store';
import * as SecureStore from 'expo-secure-store';

const AccountDeletionScreen = () => {
  const { user } = useAuth();
  const [gracePeriod, setGracePeriod] = useState('60');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;

    const days = parseInt(gracePeriod, 10);
    if (isNaN(days) || days < 1) {
      Alert.alert('Invalid Input', 'Please enter a valid number of days for the grace period.');
      return;
    }

    setIsDeleting(true);
    try {
      // Store deletion request with grace period
      const deletionData = {
        userId: user.id,
        deletionDate: new Date().toISOString(),
        gracePeriodDays: days,
      };
      await SecureStore.setItemAsync('accountDeletion', JSON.stringify(deletionData));

      // Simulate sending reminder emails (placeholder for backend integration)
      console.log(`Account deletion scheduled for user ${user.id} with a ${days} day grace period.`);
      Alert.alert('Account Deletion Scheduled', `Your account will be permanently deleted after ${days} days. You will receive reminders every 7 days. Log in before then to cancel deletion.`);
    } catch (error) {
      console.error('Error scheduling account deletion:', error);
      Alert.alert('Error', 'Failed to schedule account deletion. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDeletion = async () => {
    try {
      await SecureStore.deleteItemAsync('accountDeletion');
      Alert.alert('Cancellation Successful', 'Account deletion has been cancelled.');
    } catch (error) {
      console.error('Error cancelling account deletion:', error);
      Alert.alert('Error', 'Failed to cancel account deletion. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Account Deletion' }} />
      <Text style={styles.title}>Delete Account</Text>
      <Text style={styles.description}>
        Once you delete your account, it will be permanently removed after the grace period. You can log in before the end of the grace period to recover your account.
      </Text>
      <TextInput
        style={styles.input}
        value={gracePeriod}
        onChangeText={setGracePeriod}
        keyboardType="numeric"
        placeholder="Enter grace period in days"
      />
      <TouchableOpacity
        style={[styles.button, isDeleting && styles.buttonDisabled]}
        onPress={handleDeleteAccount}
        disabled={isDeleting}
      >
        <Text style={styles.buttonText}>Schedule Deletion</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={handleCancelDeletion}
      >
        <Text style={styles.buttonText}>Cancel Deletion</Text>
      </TouchableOpacity>
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
  description: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  cancelButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountDeletionScreen;
