import React from 'react';
import { StyleSheet, View, Text, ScrollView, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';

interface OnboardingStepProps {
  title: string;
  description?: string;
  content: React.ReactNode;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  skipLabel?: string;
  showSkip?: boolean;
  style?: ViewStyle;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  description,
  content,
  onNext,
  onSkip,
  nextLabel = 'Next',
  skipLabel = 'Skip',
  showSkip = true,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {title}
          </Text>
          
          {description && (
            <Text style={[styles.description, { color: colors.text.secondary }]}>
              {description}
            </Text>
          )}
        </View>
        
        <View style={styles.content}>
          {content}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        {showSkip && onSkip && (
          <Button
            title={skipLabel}
            onPress={onSkip}
            variant="ghost"
            style={styles.skipButton}
            testID="skip-button"
          />
        )}
        
        <Button
          title={nextLabel}
          onPress={onNext}
          variant="primary"
          style={styles.nextButton}
          testID="next-button"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  skipButton: {
    flex: 1,
    marginRight: 12,
  },
  nextButton: {
    flex: 2,
  },
});