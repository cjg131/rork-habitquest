import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth-store';
import { useSubscriptionStore } from '@/hooks/use-subscription-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Crown, 
  Check, 
  Calendar, 
  Download, 
  Zap, 
  Shield,
  Star,
  RefreshCcw
} from 'lucide-react-native';

export default function SubscriptionScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { 
    plans, 
    getTrialStatus, 
    purchasePlan, 
    getAdjustedPrice,
    loading: subscriptionLoading 
  } = useSubscriptionStore();
  const [loading, setLoading] = useState<boolean>(false);

  const getCurrentPlan = () => {
    if (!user) return 'free';
    
    if (user.premium) {
      return user.premiumType === 'annual' ? 'premium-annual' : 'premium-monthly';
    }
    
    if (user.adRemoval === 'complete') {
      return 'ad-removal-complete';
    }
    
    if (user.adRemoval === 'basic') {
      return 'ad-removal-basic';
    }
    
    return 'free';
  };
  
  const currentPlan = getCurrentPlan();
  const trialStatus = getTrialStatus();

  const handlePurchase = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const price = getAdjustedPrice(planId);
    const priceText = price === 0 ? 'Free' : `${price.toFixed(2)}`;
    const periodText = plan.period ? ` (${plan.period})` : '';

    Alert.alert(
      'Confirm Purchase',
      `Purchase ${plan.name} for ${priceText}${periodText}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: async () => {
            setLoading(true);
            const result = await purchasePlan(planId);
            setLoading(false);
            
            if (result.success) {
              Alert.alert('Purchase Successful', 'Thank you for your purchase!');
            } else {
              Alert.alert('Purchase Failed', result.error || 'Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleRestorePurchases = () => {
    Alert.alert(
      'Restore Purchases',
      'This will check for any previous purchases and restore them to your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          onPress: () => {
            // TODO: Implement actual restore purchase logic with RevenueCat or Stripe
            Alert.alert('Restore Successful', 'No previous purchases found to restore.');
          }
        }
      ]
    );
  };

  const getStatusBadge = () => {
    if (trialStatus.isActive) {
      return <Badge label={`${trialStatus.daysRemaining} days trial left`} variant="success" />;
    }
    if (user?.premium) {
      return <Badge label="Premium Active" variant="success" />;
    }
    if (user?.adRemoval) {
      return <Badge label={`Ad-Free ${user.adRemoval === 'complete' ? 'Complete' : 'Basic'}`} variant="warning" />;
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
      {trialStatus.isActive ? (
        <Card style={[styles.statusCard, { backgroundColor: colors.success + '10' }]}>
          <View style={styles.statusContent}>
            <Zap size={24} color={colors.success} />
            <View style={styles.statusText}>
              <Text style={[styles.statusTitle, { color: colors.text.primary }]}>
                Free Trial Active!
              </Text>
              <Text style={[styles.statusDescription, { color: colors.text.secondary }]}>
                You have {trialStatus.daysRemaining} days left to try all premium features for free.
              </Text>
            </View>
          </View>
        </Card>
      ) : trialStatus.hasExpired && !user?.premium && !user?.adRemoval ? (
        <Card style={[styles.statusCard, { backgroundColor: colors.warning + '10' }]}>
          <View style={styles.statusContent}>
            <Zap size={24} color={colors.warning} />
            <View style={styles.statusText}>
              <Text style={[styles.statusTitle, { color: colors.text.primary }]}>
                Trial Expired
              </Text>
              <Text style={[styles.statusDescription, { color: colors.text.secondary }]}>
                Your 14-day free trial has ended. Upgrade to Premium to continue using all features.
              </Text>
            </View>
          </View>
        </Card>
      ) : null}

      {/* Plans */}
      <View style={styles.plansContainer}>
        {plans.map((plan) => {
          const price = getAdjustedPrice(plan.id);
          const priceText = price === 0 ? 'Free' : `${price.toFixed(2)}`;
          const planColor = plan.popular ? colors.primary : colors.text.secondary;
          
          return (
            <Card 
              key={plan.id}
              style={[
                styles.planCard,
                plan.popular && styles.popularPlan
              ]}
            >
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                  <Star size={12} color="#FFFFFF" />
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={[styles.planName, { color: colors.text.primary }]}>
                  {plan.name}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.planPrice, { color: planColor }]}>
                    {priceText}
                  </Text>
                  {plan.period && (
                    <Text style={[styles.planPeriod, { color: colors.text.secondary }]}>
                      /{plan.period}
                    </Text>
                  )}
                </View>
                <Text style={[styles.planDescription, { color: colors.text.secondary }]}>
                  {plan.id === 'ad-removal-basic' ? 'Remove interstitial ads' :
                   plan.id === 'ad-removal-complete' ? 'Remove all ads' :
                   plan.features.slice(0, 3).join(', ')}
                </Text>
              </View>

              {plan.features.length > 0 && plan.id.includes('premium') && (
                <View style={styles.featuresContainer}>
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <Check size={16} color={colors.success} />
                      <Text style={[styles.featureText, { color: colors.text.primary }]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                  {plan.features.length > 6 && (
                    <Text style={[styles.moreFeatures, { color: colors.text.secondary }]}>
                      +{plan.features.length - 6} more features
                    </Text>
                  )}
                </View>
              )}

              {currentPlan !== plan.id && (
                <Button
                  title={plan.id.includes('premium') ? 
                    (plan.period === 'month' ? 'Start Monthly' : 'Start Yearly') : 
                    'Purchase'
                  }
                  variant="primary"
                  onPress={() => handlePurchase(plan.id)}
                  disabled={loading || subscriptionLoading}
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
          );
        })}
      </View>

      {/* Restore Purchases */}
      <Button
        title="Restore Purchases"
        variant="outline"
        onPress={handleRestorePurchases}
        style={styles.restoreButton}

      />

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
              Unlimited tasks and habits, full tracking history, Pomodoro timer with custom settings, advanced gamification with XP and badges, streak corrections with grace days, custom themes and colors, priority support, smart AI scheduling, habit templates, and much more
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
  moreFeatures: {
    fontSize: 12,
    marginLeft: 24,
    marginTop: 4,
    fontStyle: 'italic',
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
  restoreButton: {
    marginBottom: 24,
  },
});