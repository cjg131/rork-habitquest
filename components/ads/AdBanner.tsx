import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useSubscription } from '@/hooks/use-subscription-store';
import { ExternalLink } from 'lucide-react-native';

interface AdBannerProps {
  style?: any;
}

export function AdBanner({ style }: AdBannerProps) {
  const { colors } = useTheme();
  const { shouldShowBannerAd } = useSubscription();

  if (!shouldShowBannerAd()) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      <TouchableOpacity style={styles.adContent}>
        <ExternalLink size={16} color={colors.text.secondary} />
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