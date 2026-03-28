import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/use-auth-store';
import { useTheme } from '@/hooks/use-theme';
import * as SecureStore from 'expo-secure-store';

const AccountDeletionScreen = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Account Deletion' }} />
      <Text style={[styles.title, { color: colors.text.primary }]}>Delete Account</Text>
      <Text style={[styles.description, { color: colors.text.secondary }]}>
        Once you delete your account, it will be permanently removed after the grace period. You can log in before the end of the grace period to recover your account. You will receive reminder emails every 7 days until deletion is permanent.
      </Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.text.primary }]}
        value={gracePeriod}
        onChangeText={setGracePeriod}
        keyboardType="numeric"
        placeholder="Enter grace period in days"
        placeholderTextColor={colors.text.tertiary}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.error }, isDeleting && styles.buttonDisabled]}
        onPress={handleDeleteAccount}
        disabled={isDeleting}
      >
        <Text style={styles.buttonText}>Schedule Deletion</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton, { backgroundColor: colors.primary }]}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountDeletionScreen;
