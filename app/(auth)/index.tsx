import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { AuthForm } from '@/components/auth/AuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { useAuth } from '@/hooks/use-auth-store';
import { useOnboarding } from '@/hooks/use-onboarding-store';
import { StatusBar } from 'expo-status-bar';

export default function AuthScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, signIn, signUp, loading, error } = useAuth();
  const { state: onboardingState } = useOnboarding();

  useEffect(() => {
    if (user) {
      if (onboardingState.completed) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)');
      }
    }
  }, [user, onboardingState.completed, router]);

  const handleSignIn = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    return await signUp(email, password, name);
  };

  const handleGoogleSignIn = () => {
    // In a real app, this would integrate with Google Sign-In
    console.log('Google Sign In pressed');
  };

  const handleAppleSignIn = () => {
    // In a real app, this would integrate with Apple Sign-In
    console.log('Apple Sign In pressed');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      
      <View style={styles.headerContainer}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.logoText, { color: colors.primary }]}>HT</Text>
        </View>
        <Text style={[styles.appName, { color: colors.text.primary }]}>
          Habit Tracker
        </Text>
      </View>
      
      <AuthForm
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        loading={loading}
        error={error}
      />
      
      <SocialAuth
        onGoogleSignIn={handleGoogleSignIn}
        onAppleSignIn={handleAppleSignIn}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});