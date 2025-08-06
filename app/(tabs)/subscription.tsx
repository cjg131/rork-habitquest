import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Crown, 
  Check, 
  X, 
  Calendar, 
  Download, 
  Zap, 
  Shield,
  Star
} from 'lucide-react-native';

type PlanType = 'free' | 'ad-removal-basic' | 'ad-removal-full' | 'premium' | 'premium-annual';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: PlanType;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  color: string;
}

export default function SubscriptionScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('premium');

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      color: colors.text.secondary,
      features: [
        { name: '10 tracked tasks', included: true },
        { name: '7 days tracking history', included: true },
        { name: 'Basic habits tracking', included: true },
        { name: 'Banner ads (after 14 days)', included: false },
        { name: 'Interstitial ads (after 14 days)', included: false },
        { name: 'No Pomodoro timer (after 14 days)', included: false },
        { name: 'AI calendar', included: false },
        { name: 'Data export', included: false },
        { name: 'Unlimited tasks', included: false },
        { name: 'Advanced analytics', included: false },
      ],
    },
    {
      id: 'ad-removal-basic',
      name: 'Ad-Free Basic',
      price: '$4.99',
      period: 'one-time',
      description: 'Remove interstitial ads',
      color: colors.warning,
      features: [],
    },
    {
      id: 'ad-removal-full',
      name: 'Ad-Free Complete',
      price: user?.adRemoval === 'basic' ? '$4.99' : '$9.99',
      period: 'one-time',
      description: 'Remove all ads',
      color: colors.success,
      features: [],
    },
    {
      id: 'premium',
      name: 'Premium Monthly',
      price: '$0.99',
      period: 'month',
      description: 'Full features with ads',
      color: colors.primary,
      features: [
        { name: 'Unlimited tasks & habits', included: true },
        { name: 'Full tracking history', included: true },
        { name: 'Pomodoro timer', included: true },
        { name: 'AI calendar integration', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Data export (CSV/PDF)', included: true },
        { name: 'Priority support', included: true },
        { name: 'Custom themes', included: true },
        { name: 'Streak corrections', included: true },
        { name: 'Advanced gamification', included: true },
        { name: 'Smart scheduling', included: true },
        { name: 'Habit templates', included: true },
      ],
    },
    {
      id: 'premium-annual',
      name: 'Premium Annual',
      price: '$9.99',
      period: 'year',
      description: 'Full features with ads - Best Value!',
      color: colors.primary,
      popular: true,
      features: [
        { name: 'Unlimited tasks & habits', included: true },
        { name: 'Full tracking history', included: true },
        { name: 'Pomodoro timer', included: true },
        { name: 'AI calendar integration', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Data export (CSV/PDF)', included: true },
        { name: 'Priority support', included: true },
        { name: 'Custom themes', included: true },
        { name: 'Streak corrections', included: true },
        { name: 'Advanced gamification', included: true },
        { name: 'Smart scheduling', included: true },
        { name: 'Habit templates', included: true },
        { name: 'Save 17% vs monthly', included: true },
      ],
    },
  ];

  const getCurrentPlan = (): PlanType => {
    if (!user) return 'free';
    
    if (user.premium) {
      return user.premiumType === 'annual' ? 'premium-annual' : 'premium';
    }
    
    if (user.adRemoval === 'complete') {
      return 'ad-removal-full';
    }
    
    if (user.adRemoval === 'basic') {
      return 'ad-removal-basic';
    }
    
    return 'free';
  };
  
  const currentPlan = getCurrentPlan();
  const daysUsed = user ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const trialDaysLeft = Math.max(0, 14 - daysUsed);
  const isInTrial = daysUsed <= 14;
  const isInGracePeriod = daysUsed > 14 && daysUsed <= 30;

  const handlePurchase = (planId: PlanType) => {
    Alert.alert(
      'Purchase Plan',
      `This would initiate purchase for ${plans.find(p => p.id === planId)?.name}. In a real app, this would integrate with App Store/Google Play billing.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log(`Purchasing ${planId}`) }
      ]
    );
  };

  const getStatusBadge = () => {
    if (isInTrial) {
      return <Badge label={`${trialDaysLeft} days trial left`} variant="success" />;
    }
    if (isInGracePeriod) {
      return <Badge label="Grace period" variant="warning" />;
    }
    if (user?.premium) {
      return <Badge label="Premium Active" variant="success" />;
    }
    return <Badge label="Free Plan" variant="secondary" />;
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Crown size={32} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Choose Your Plan
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Unlock your full potential with premium features
        </Text>
        {getStatusBadge()}
      </View>

      {/* Trial/Status Info */}
      {(isInTrial || isInGracePeriod) && (
        <Card style={[styles.statusCard, { backgroundColor: isInTrial ? colors.success + '10' : colors.warning + '10' }]}>
          <View style={styles.statusContent}>
            <Zap size={24} color={isInTrial ? colors.success : colors.warning} />
            <View style={styles.statusText}>
              <Text style={[styles.statusTitle, { color: colors.text.primary }]}>
                {isInTrial ? 'Free Trial Active!' : 'Grace Period'}
              </Text>
              <Text style={[styles.statusDescription, { color: colors.text.secondary }]}>
                {isInTrial 
                  ? `You have ${trialDaysLeft} days left to try all premium features for free.`
                  : 'You still have access to all features. Upgrade to continue after day 30.'
                }
              </Text>
            </View>
          </View>
        </Card>
      )}

      {/* Plans */}
      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && { borderColor: plan.color, borderWidth: 2 },
              plan.popular && styles.popularPlan
            ]}
          >
            {plan.popular && (
              <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                <Star size={12} color="#FFFFFF" />
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}
            
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: colors.text.primary }]}>
                {plan.name}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.planPrice, { color: plan.color }]}>
                  {plan.price}
                </Text>
                {plan.period && (
                  <Text style={[styles.planPeriod, { color: colors.text.secondary }]}>
                    /{plan.period}
                  </Text>
                )}
              </View>
              <Text style={[styles.planDescription, { color: colors.text.secondary }]}>
                {plan.description}
              </Text>
            </View>

            {plan.features.length > 0 && (
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    {feature.included ? (
                      <Check size={16} color={colors.success} />
                    ) : (
                      <X size={16} color={colors.error} />
                    )}
                    <Text style={[
                      styles.featureText, 
                      { color: feature.included ? colors.text.primary : colors.text.secondary }
                    ]}>
                      {feature.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {currentPlan !== plan.id && (
              <Button
                title={plan.id.includes('premium') ? (plan.period === 'month' ? 'Start Monthly' : 'Start Yearly') : 'Purchase'}
                variant={selectedPlan === plan.id ? 'primary' : 'outline'}
                onPress={() => handlePurchase(plan.id)}
                style={styles.planButton}
              />
            )}

            {currentPlan === plan.id && (
              <Badge 
                label="Current Plan" 
                variant="success" 
                style={styles.currentPlanBadge}
              />
            )}
          </Card>
        ))}
      </View>

      {/* Features Highlight */}
      <Card style={styles.featuresHighlight}>
        <Text style={[styles.featuresTitle, { color: colors.text.primary }]}>
          Why Go Premium?
        </Text>
        
        <View style={styles.highlightRow}>
          <Calendar size={24} color={colors.primary} />
          <View style={styles.highlightText}>
            <Text style={[styles.highlightTitle, { color: colors.text.primary }]}>
              AI Calendar Integration
            </Text>
            <Text style={[styles.highlightDescription, { color: colors.text.secondary }]}>
              Smart scheduling and calendar sync with Apple/Google Calendar
            </Text>
          </View>
        </View>

        <View style={styles.highlightRow}>
          <Download size={24} color={colors.primary} />
          <View style={styles.highlightText}>
            <Text style={[styles.highlightTitle, { color: colors.text.primary }]}>
              Data Export & Analytics
            </Text>
            <Text style={[styles.highlightDescription, { color: colors.text.secondary }]}>
              Export your data in CSV or PDF format with detailed analytics and insights into your productivity patterns
            </Text>
          </View>
        </View>

        <View style={styles.highlightRow}>
          <Shield size={24} color={colors.primary} />
          <View style={styles.highlightText}>
            <Text style={[styles.highlightTitle, { color: colors.text.primary }]}>
              Unlimited Everything
            </Text>
            <Text style={[styles.highlightDescription, { color: colors.text.secondary }]}>
              Unlimited tasks and habits, full tracking history, Pomodoro timer with custom settings, advanced gamification with XP and badges, streak corrections, custom themes and colors, priority support, smart AI scheduling, habit templates, and much more
            </Text>
          </View>
        </View>
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text.secondary }]}>
          All purchases are processed securely through the App Store or Google Play.
          Subscriptions can be cancelled at any time.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  statusCard: {
    marginBottom: 24,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    marginBottom: 16,
    position: 'relative',
  },
  popularPlan: {
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  planPeriod: {
    fontSize: 16,
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 14,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  planButton: {
    marginTop: 8,
  },
  currentPlanBadge: {
    alignSelf: 'center',
    marginTop: 8,
  },
  featuresHighlight: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  highlightText: {
    marginLeft: 12,
    flex: 1,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  highlightDescription: {
    fontSize: 14,
  },
  footer: {
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});