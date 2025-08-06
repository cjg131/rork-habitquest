import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SubscriptionPlan = 'free' | 'premium' | 'lifetime';

export interface SubscriptionState {
  plan: SubscriptionPlan;
  isActive: boolean;
  expiryDate?: string;
  trialDaysLeft?: number;
  updatePlan: (plan: SubscriptionPlan, isActive: boolean, expiryDate?: string, trialDaysLeft?: number) => void;
  checkSubscriptionStatus: () => Promise<void>;
}

export const [SubscriptionContext, useSubscription] = createContextHook(() => {
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<string | undefined>(undefined);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | undefined>(undefined);

  const updatePlan = (
    newPlan: SubscriptionPlan,
    active: boolean,
    expDate?: string,
    trialDays?: number
  ) => {
    setPlan(newPlan);
    setIsActive(active);
    setExpiryDate(expDate);
    setTrialDaysLeft(trialDays);
    AsyncStorage.setItem(
      'subscription',
      JSON.stringify({ plan: newPlan, isActive: active, expiryDate: expDate, trialDaysLeft: trialDays })
    );
  };

  const checkSubscriptionStatus = async () => {
    try {
      const storedSubscription = await AsyncStorage.getItem('subscription');
      if (storedSubscription) {
        const parsed = JSON.parse(storedSubscription);
        setPlan(parsed.plan || 'free');
        setIsActive(parsed.isActive || false);
        setExpiryDate(parsed.expiryDate);
        setTrialDaysLeft(parsed.trialDaysLeft);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  return {
    plan,
    isActive,
    expiryDate,
    trialDaysLeft,
    updatePlan,
    checkSubscriptionStatus
  };
});
