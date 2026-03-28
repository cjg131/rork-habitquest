import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useSubscriptionStore } from '@/hooks/use-subscription-store';
import { Link } from 'lucide-react-native';

interface AdBannerProps {
  style?: any;
}

export function AdBanner({ style }: AdBannerProps) {
  const { colors } = useTheme();
  const { shouldShowBannerAd } = useSubscriptionStore();

  // AdMob is not fully supported on web, so we provide a fallback
  if (Platform.OS === 'web' || !shouldShowBannerAd()) {
    return null;
  }

  // TODO: Replace with actual AdMob Banner component and ID
  // For development, use test ID: ca-app-pub-3940256099942544/6300978111
  // Production ID placeholder: [INSERT ACTUAL BANNER AD UNIT ID HERE]
  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]} testID="ad-banner">
      <TouchableOpacity style={styles.adContent}>
        <Link size={16} color={colors.text.secondary} />
        <Text style={[styles.adText, { color: colors.text.secondary }]}>
          Advertisement
        </Text>
        <Text style={[styles.adLabel, { color: colors.text.tertiary }]}>
          Sponsored
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 8,
  },
  adContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  adText: {
    fontSize: 14,
    marginLeft: 8,
    marginRight: 'auto',
  },
  adLabel: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});