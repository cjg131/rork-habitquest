import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, User } from 'lucide-react-native';

type AuthMode = 'signIn' | 'signUp';

interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignUp: (email: string, password: string, name: string) => Promise<boolean>;
  onForgotPassword?: () => void;
  loading: boolean;
  error?: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onSignIn,
  onSignUp,
  onForgotPassword,
  loading,
  error,
}) => {
  const { colors } = useTheme();
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    name: '',
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const errors = {
      email: '',
      password: '',
      name: '',
    };

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Name validation (only for sign up)
    if (mode === 'signUp' && !name) {
      errors.name = 'Name is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (mode === 'signIn') {
      await onSignIn(email, password);
    } else {
      await onSignUp(email, password, name);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signIn' ? 'signUp' : 'signIn');
    setFormErrors({
      email: '',
      password: '',
      name: '',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {mode === 'signIn' ? 'Sign In' : 'Create Account'}
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {mode === 'signIn' 
              ? 'Welcome back! Please sign in to continue.' 
              : 'Create an account to get started.'}
          </Text>
          
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          )}
          
          {mode === 'signUp' && (
            <Input
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={colors.text.tertiary} />}
              error={formErrors.name}
              autoCapitalize="words"
              testID="name-input"
            />
          )}
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={20} color={colors.text.tertiary} />}
            error={formErrors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="email-input"
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={20} color={colors.text.tertiary} />}
            secureTextEntry
            error={formErrors.password}
            testID="password-input"
          />
          
          {mode === 'signIn' && onForgotPassword && (
            <TouchableOpacity 
              style={styles.forgotPasswordContainer} 
              onPress={onForgotPassword}
              testID="forgot-password-button"
            >
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          )}
          
          <Button
            title={mode === 'signIn' ? 'Sign In' : 'Sign Up'}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={styles.submitButton}
            testID="submit-button"
          />
          
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleText, { color: colors.text.secondary }]}>
              {mode === 'signIn' ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <TouchableOpacity onPress={toggleMode} testID="toggle-auth-mode-button">
              <Text style={[styles.toggleButtonText, { color: colors.primary }]}>
                {mode === 'signIn' ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  submitButton: {
    marginTop: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  toggleText: {
    fontSize: 14,
    marginRight: 4,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});