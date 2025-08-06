import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useOnboarding } from '@/hooks/use-onboarding-store';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingScreen() {
  const { colors, colorScheme } = useTheme();
  const router = useRouter();
  const { updateOnboardingState, completeOnboarding } = useOnboarding();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    track: '',
    reminders: '',
    goal: ''
  });

  const handleAnswer = (question: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [question]: answer }));
    if (step < 3) {
      setStep(step + 1);
    } else {
      updateOnboardingState({ 
        trackHabits: answer === 'Habits' || answer === 'All',
        trackTasks: answer === 'Tasks' || answer === 'All',
        trackPomodoro: answer === 'Pomodoro/Focus' || answer === 'All',
        reminderFrequency: (answers.reminders || answer) as 'none' | 'daily' | 'weekly' | 'custom',
      });
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

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <View style={dynamicStyles.questionContainer}>
            <Text style={dynamicStyles.question}>What do you want to track most?</Text>
            {['Habits', 'Tasks', 'Pomodoro/Focus', 'All'].map(option => (
              <TouchableOpacity
                key={option}
                style={[dynamicStyles.option, answers.track === option && dynamicStyles.selectedOption]}
                onPress={() => handleAnswer('track', option)}
              >
                <Text style={[dynamicStyles.optionText, answers.track === option && dynamicStyles.selectedOptionText]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 2:
        return (
          <View style={dynamicStyles.questionContainer}>
            <Text style={dynamicStyles.question}>How often do you want reminders?</Text>
            {['Multiple times a day', 'Daily', 'Weekly', 'Only for important things'].map(option => (
              <TouchableOpacity
                key={option}
                style={[dynamicStyles.option, answers.reminders === option && dynamicStyles.selectedOption]}
                onPress={() => handleAnswer('reminders', option)}
              >
                <Text style={[dynamicStyles.optionText, answers.reminders === option && dynamicStyles.selectedOptionText]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 3:
        return (
          <View style={dynamicStyles.questionContainer}>
            <Text style={dynamicStyles.question}>What’s your main goal? (Optional)</Text>
            {['Productivity', 'Well-being', 'Health/Fitness', 'Custom'].map(option => (
              <TouchableOpacity
                key={option}
                style={[dynamicStyles.option, answers.goal === option && dynamicStyles.selectedOption]}
                onPress={() => handleAnswer('goal', option)}
              >
                <Text style={[dynamicStyles.optionText, answers.goal === option && dynamicStyles.selectedOptionText]}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={dynamicStyles.skipButton}
              onPress={handleSkip}
            >
              <Text style={dynamicStyles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: colors.background
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      color: colors.text.primary
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 40,
      color: colors.text.secondary
    },
    questionContainer: {
      marginBottom: 30
    },
    question: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 20,
      textAlign: 'center',
      color: colors.text.primary
    },
    option: {
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: 'center',
      backgroundColor: colors.card
    },
    selectedOption: {
      backgroundColor: colors.primary
    },
    optionText: {
      fontSize: 16,
      color: colors.text.primary
    },
    selectedOptionText: {
      color: colors.background,
      fontWeight: 'bold'
    },
    skipButton: {
      padding: 10,
      alignItems: 'center',
      marginTop: 20
    },
    skipButtonText: {
      fontSize: 16,
      color: colors.text.secondary
    },
    progressContainer: {
      alignItems: 'center',
      marginTop: 20
    },
    progressText: {
      fontSize: 14,
      color: colors.text.secondary
    }
  }), [colors]);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Text style={dynamicStyles.title}>Let’s Get Started</Text>
      <Text style={dynamicStyles.subtitle}>Answer a few questions to personalize your experience.</Text>
      {renderQuestion()}
      <View style={dynamicStyles.progressContainer}>
        <Text style={dynamicStyles.progressText}>Step {step} of 3</Text>
      </View>
    </SafeAreaView>
  );
}
