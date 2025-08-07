import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Alert } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useSubscriptionStore } from '@/hooks/use-subscription-store';
import { X, ExternalLink } from 'lucide-react-native';

interface InterstitialAdProps {
  visible: boolean;
  onClose: () => void;
}

export function InterstitialAd({ visible, onClose }: InterstitialAdProps) {
  const { colors } = useTheme();
  const { canShowAd, markAdShown } = useSubscriptionStore();
  const [adVisible, setAdVisible] = useState(visible);
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    if (visible && canShowAd()) {
      setAdVisible(true);
      setCountdown(5);
      // TODO: Load actual interstitial ad from AdMob or chosen ad provider
      // For development, use test ID: ca-app-pub-3940256099942544/1033173712
      // Production ID placeholder: [INSERT ACTUAL INTERSTITIAL AD UNIT ID HERE]
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setAdVisible(false);
      onClose();
    }
  }, [visible, canShowAd, onClose]);

  const handleClose = () => {
    if (countdown === 0) {
      setAdVisible(false);
      markAdShown();
      onClose();
    }
  };

  if (Platform.OS === 'web' || !adVisible) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={adVisible}
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.closeButton, { opacity: countdown === 0 ? 1 : 0.5 }]}
            onPress={handleClose}
            disabled={countdown > 0}
          >
            <X size={24} color={colors.text.primary} />
            {countdown > 0 && (
              <Text style={[styles.countdown, { color: colors.text.secondary }]}>
                {countdown}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.adContent}>
            <ExternalLink size={48} color={colors.primary} />
            <Text style={[styles.adTitle, { color: colors.text.primary }]}>
              Advertisement
            </Text>
            <Text style={[styles.adDescription, { color: colors.text.secondary }]}>
              This is a sample interstitial ad. In a real app, this would show actual ad content.
            </Text>
            <TouchableOpacity 
              style={[styles.adButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.adButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sponsoredLabel, { color: colors.text.tertiary }]}>
            Sponsored Content
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  countdown: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  adContent: {
    alignItems: 'center',
    paddingTop: 32,
  },
  adTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  adDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  adButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  adButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sponsoredLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});