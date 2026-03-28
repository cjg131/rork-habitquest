import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface SocialAuthProps {
  onGoogleSignIn: () => void;
  onAppleSignIn: () => void;
  loading?: boolean;
}

export const SocialAuth: React.FC<SocialAuthProps> = ({
  onGoogleSignIn,
  onAppleSignIn,
  loading = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.text.secondary }]}>or continue with</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}
          onPress={onGoogleSignIn}
          disabled={loading}
          activeOpacity={0.7}
          testID="google-sign-in-button"
        >
          <Text style={[styles.socialButtonText, { color: colors.text.primary }]}>Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}
          onPress={onAppleSignIn}
          disabled={loading}
          activeOpacity={0.7}
          testID="apple-sign-in-button"
        >
          <Text style={[styles.socialButtonText, { color: colors.text.primary }]}>Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});