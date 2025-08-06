import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useSubscription } from '@/hooks/use-subscription-store';
import { useAuth } from '@/hooks/use-auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

import { Heart, Zap, Calendar } from 'lucide-react-native';

interface GraceDayManagerProps {
  habitId: string;
  habitName: string;
  onGraceDayUsed?: () => void;
}

export function GraceDayManager({ habitId, habitName, onGraceDayUsed }: GraceDayManagerProps) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { getGraceDaysRemaining, applyGraceDay, purchaseGraceDaysWithXP } = useSubscription();
  const [loading, setLoading] = useState<boolean>(false);

  const graceDaysRemaining = getGraceDaysRemaining();
  const canPurchaseMore = user && user.graceDaysEarned < 3;
  const xpCostPerDay = 100;

  const executeUseGraceDay = async () => {
    setLoading(true);
    const success = await applyGraceDay(habitId, 'manual');
    setLoading(false);
    
    if (success) {
      Alert.alert('Grace Day Used', 'Your streak has been protected!');
      onGraceDayUsed?.();
    } else {
      Alert.alert('Error', 'Failed to use grace day. Please try again.');
    }
  };

  const handleUseGraceDay = async () => {
    if (graceDaysRemaining <= 0) {
      Alert.alert('No Grace Days', 'You have no grace days remaining this month.');
      return;
    }

    Alert.alert(
      'Use Grace Day',
      `Are you sure you want to use a grace day for "${habitName}"? This will prevent your streak from breaking.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Grace Day',
          onPress: executeUseGraceDay
        }
      ]
    );
  };

  const executePurchaseGraceDays = async (count: number) => {
    setLoading(true);
    const success = await purchaseGraceDaysWithXP(count);
    setLoading(false);
    
    if (success) {
      Alert.alert('Purchase Successful', `You now have ${count} additional grace day${count > 1 ? 's' : ''}!`);
    } else {
      Alert.alert('Purchase Failed', 'Failed to purchase grace days. Please try again.');
    }
  };

  const handlePurchaseGraceDays = async () => {
    if (!user || !canPurchaseMore) return;

    const maxCanBuy = Math.min(3 - user.graceDaysEarned, Math.floor(user.xp / xpCostPerDay));
    
    if (maxCanBuy <= 0) {
      Alert.alert(
        'Cannot Purchase',
        user.xp < xpCostPerDay 
          ? 'You need at least 100 XP to purchase a grace day.'
          : 'You already have the maximum number of earned grace days.'
      );
      return;
    }

    Alert.alert(
      'Purchase Grace Days',
      `Purchase ${maxCanBuy} grace day${maxCanBuy > 1 ? 's' : ''} for ${maxCanBuy * xpCostPerDay} XP?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: () => executePurchaseGraceDays(maxCanBuy)
        }
      ]
    );
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Heart size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Grace Days
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {graceDaysRemaining}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Remaining
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {user?.graceDaysEarned || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Earned
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: colors.text.secondary }]}>
          Grace days protect your streaks when you miss a day. You get 3 free grace days each month.
        </Text>

        <View style={styles.actions}>
          <Button
            title="Use Grace Day"
            variant="primary"
            onPress={handleUseGraceDay}
            disabled={graceDaysRemaining <= 0 || loading}
            style={styles.actionButton}
          />

          {canPurchaseMore && user && user.xp >= xpCostPerDay && (
            <Button
              title={`Buy with XP (${xpCostPerDay})`}
              variant="outline"
              onPress={handlePurchaseGraceDays}
              disabled={loading}
              style={styles.actionButton}
              icon={<Zap size={16} color={colors.primary} />}
            />
          )}
        </View>

        <View style={styles.info}>
          <Calendar size={16} color={colors.text.tertiary} />
          <Text style={[styles.infoText, { color: colors.text.tertiary }]}>
            Grace days reset monthly and don&apos;t carry over
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  actions: {
    gap: 8,
  },
  actionButton: {
    marginVertical: 4,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 6,
  },
});