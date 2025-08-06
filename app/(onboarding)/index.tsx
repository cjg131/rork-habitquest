import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { TrackingPreferences } from '@/components/onboarding/TrackingPreferences';
import { ReminderPreferences } from '@/components/onboarding/ReminderPreferences';
import { StoragePreferences } from '@/components/onboarding/StoragePreferences';
import { useOnboarding } from '@/hooks/use-onboarding-store';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { state, updateOnboardingState, completeOnboarding } = useOnboarding();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      completeOnboarding().then(() => {
        router.replace('/(tabs)');
      });
    }
  };

  const handleSkip = () => {
    completeOnboarding().then(() => {
      router.replace('/(tabs)');
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <OnboardingStep
            title="What would you like to track?"
            description="Choose what you want to focus on. You can change this later in settings."
            content={
              <TrackingPreferences
                trackHabits={state.trackHabits}
                trackTasks={state.trackTasks}
                trackPomodoro={state.trackPomodoro}
                onToggleHabits={(value) => updateOnboardingState({ trackHabits: value })}
                onToggleTasks={(value) => updateOnboardingState({ trackTasks: value })}
                onTogglePomodoro={(value) => updateOnboardingState({ trackPomodoro: value })}
              />
            }
            onNext={handleNext}
            onSkip={handleSkip}
          />
        );
      case 1:
        return (
          <OnboardingStep
            title="How often would you like reminders?"
            description="We'll help you stay on track with notifications."
            content={
              <ReminderPreferences
                reminderFrequency={state.reminderFrequency}
                onSelectFrequency={(frequency) => updateOnboardingState({ reminderFrequency: frequency })}
              />
            }
            onNext={handleNext}
            onSkip={handleSkip}
          />
        );
      case 2:
        return (
          <OnboardingStep
            title="How would you like to store your data?"
            description="Choose where to keep your habits and tasks."
            content={
              <StoragePreferences
                storageMethod={state.storageMethod}
                onSelectStorage={(method) => updateOnboardingState({ storageMethod: method })}
              />
            }
            onNext={handleNext}
            onSkip={handleSkip}
            nextLabel="Get Started"
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});