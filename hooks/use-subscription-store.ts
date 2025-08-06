import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { SubscriptionPlan, PurchaseResult, TrialStatus, GraceDayAction } from '@/types';
import { useAuthStore } from './use-auth-store';

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '10 active tasks',
      '7 days task history',
      'Basic habits tracking',
      'Banner ads (after trial)',
      'Interstitial ads (after trial)'
    ]
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: 0.99,
    period: 'month',
    features: [
      'Unlimited tasks & habits',
      'Full tracking history',
      'Pomodoro timer',
      'AI calendar integration',
      'Advanced analytics',
      'Data export (CSV/PDF)',
      'Priority support',
      'Custom themes',
      'Streak corrections',
      'Advanced gamification',
      'Smart scheduling',
      'Habit templates'
    ]
  },
  {
    id: 'premium-annual',
    name: 'Premium Annual',
    price: 9.99,
    period: 'year',
    popular: true,
    features: [
      'All Premium Monthly features',
      'Save 17% vs monthly',
      'Priority customer support'
    ]
  },
  {
    id: 'ad-removal-basic',
    name: 'Ad-Free Basic',
    price: 4.99,
    period: 'one-time',
    features: [
      'Remove interstitial ads',
      'Keep banner ads'
    ]
  },
  {
    id: 'ad-removal-complete',
    name: 'Ad-Free Complete',
    price: 9.99,
    period: 'one-time',
    features: [
      'Remove all ads',
      'No banner ads',
      'No interstitial ads'
    ]
  }
];

export const [SubscriptionProvider, useSubscriptionStore] = createContextHook(() => {
  const [plans] = useState<SubscriptionPlan[]>(SUBSCRIPTION_PLANS);
  const [graceDayActions, setGraceDayActions] = useState<GraceDayAction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, updateUser } = useAuthStore();

  useEffect(() => {
    const loadGraceDayActions = async () => {
      if (!user) {
        setGraceDayActions([]);
        setLoading(false);
        return;
      }

      try {
        const savedActions = await AsyncStorage.getItem(`graceDayActions_${user.id}`);
        if (savedActions) {
          const parsedActions = JSON.parse(savedActions);
          setGraceDayActions(parsedActions.map((action: any) => ({
            ...action,
            date: new Date(action.date)
          })));
        }
      } catch (error) {
        console.error('Failed to load grace day actions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGraceDayActions();
  }, [user]);

  const saveGraceDayActions = async (actions: GraceDayAction[]) => {
    if (!user) return false;
    
    try {
      await AsyncStorage.setItem(`graceDayActions_${user.id}`, JSON.stringify(actions));
      return true;
    } catch (error) {
      console.error('Failed to save grace day actions:', error);
      return false;
    }
  };

  const getTrialStatus = (): TrialStatus => {
    if (!user) {
      return { isActive: false, daysRemaining: 0, hasExpired: true };
    }

    const now = new Date();
    const trialEnd = new Date(user.trialEndDate);
    const daysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    return {
      isActive: daysRemaining > 0,
      daysRemaining,
      hasExpired: daysRemaining === 0
    };
  };

  const canShowAd = (): boolean => {
    if (!user) return false;
    
    const trialStatus = getTrialStatus();
    if (trialStatus.isActive) return false;
    
    if (user.premium || user.adRemoval === 'complete') return false;
    
    // Check if enough time has passed since last interstitial ad (5 minutes)
    if (user.lastAdShown) {
      const timeSinceLastAd = Date.now() - new Date(user.lastAdShown).getTime();
      const fiveMinutes = 5 * 60 * 1000;
      return timeSinceLastAd >= fiveMinutes;
    }
    
    return true;
  };

  const shouldShowBannerAd = (): boolean => {
    if (!user) return false;
    
    const trialStatus = getTrialStatus();
    if (trialStatus.isActive) return false;
    
    return !user.premium && user.adRemoval !== 'complete' && user.adRemoval !== 'basic';
  };

  const markAdShown = async () => {
    if (!user) return;
    
    await updateUser({ lastAdShown: new Date() });
  };

  const isFeatureUnlocked = (feature: string): boolean => {
    if (!user) return false;
    
    const trialStatus = getTrialStatus();
    if (trialStatus.isActive) return true;
    
    if (user.premium) return true;
    
    // Free tier limitations
    const restrictedFeatures = [
      'ai-calendar',
      'data-export',
      'zapier-integration',
      'unlimited-tasks',
      'full-history'
    ];
    
    return !restrictedFeatures.includes(feature);
  };

  const getTaskLimit = (): number => {
    if (!user) return 0;
    
    const trialStatus = getTrialStatus();
    if (trialStatus.isActive || user.premium) return -1; // Unlimited
    
    return 10; // Free tier limit
  };

  const getHistoryLimit = (): number => {
    if (!user) return 0;
    
    const trialStatus = getTrialStatus();
    if (trialStatus.isActive || user.premium) return -1; // Unlimited
    
    return 7; // Free tier limit (7 days)
  };

  const purchasePlan = async (planId: string): Promise<PurchaseResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      // Mock purchase logic - in a real app, this would integrate with App Store/Google Play
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        return { success: false, error: 'Plan not found' };
      }

      let updates: any = {};

      switch (planId) {
        case 'premium-monthly':
          updates = {
            premium: true,
            premiumType: 'monthly'
          };
          break;
        case 'premium-annual':
          updates = {
            premium: true,
            premiumType: 'annual'
          };
          break;
        case 'ad-removal-basic':
          updates = {
            adRemoval: 'basic'
          };
          break;
        case 'ad-removal-complete':
          updates = {
            adRemoval: 'complete'
          };
          break;
      }

      await updateUser(updates);
      
      return { success: true, planId };
    } catch (error) {
      console.error('Purchase failed:', error);
      return { success: false, error: 'Purchase failed. Please try again.' };
    }
  };

  const getGraceDaysRemaining = (): number => {
    if (!user) return 0;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Count grace days used this month
    const usedThisMonth = graceDayActions.filter(action => {
      const actionDate = new Date(action.date);
      return actionDate.getMonth() === currentMonth && 
             actionDate.getFullYear() === currentYear &&
             action.type === 'manual';
    }).length;
    
    const baseGraceDays = 3;
    const earnedGraceDays = Math.min(3, user.graceDaysEarned);
    const totalAvailable = baseGraceDays + earnedGraceDays;
    
    return Math.max(0, totalAvailable - usedThisMonth);
  };

  const applyGraceDay = async (habitId: string, type: 'manual' | 'skip-conversion' = 'manual'): Promise<boolean> => {
    if (!user) return false;
    
    const remaining = getGraceDaysRemaining();
    if (remaining <= 0) return false;
    
    try {
      const newAction: GraceDayAction = {
        id: Math.random().toString(36).substring(2, 15),
        type,
        date: new Date(),
        habitId
      };
      
      const updatedActions = [...graceDayActions, newAction];
      setGraceDayActions(updatedActions);
      await saveGraceDayActions(updatedActions);
      
      return true;
    } catch (error) {
      console.error('Failed to use grace day:', error);
      return false;
    }
  };

  const purchaseGraceDaysWithXP = async (count: number): Promise<boolean> => {
    if (!user) return false;
    
    const xpCostPerDay = 100;
    const totalCost = count * xpCostPerDay;
    
    if (user.xp < totalCost) return false;
    
    const currentEarned = user.graceDaysEarned || 0;
    const maxEarned = 3;
    
    if (currentEarned + count > maxEarned) return false;
    
    try {
      await updateUser({
        xp: user.xp - totalCost,
        graceDaysEarned: currentEarned + count
      });
      
      const newAction: GraceDayAction = {
        id: Math.random().toString(36).substring(2, 15),
        type: 'xp-purchase',
        date: new Date(),
        xpCost: totalCost
      };
      
      const updatedActions = [...graceDayActions, newAction];
      setGraceDayActions(updatedActions);
      await saveGraceDayActions(updatedActions);
      
      return true;
    } catch (error) {
      console.error('Failed to purchase grace days with XP:', error);
      return false;
    }
  };

  const getAdjustedPrice = (planId: string): number => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return 0;
    
    // If user has basic ad removal and wants complete, reduce price
    if (planId === 'ad-removal-complete' && user?.adRemoval === 'basic') {
      return 4.99;
    }
    
    return plan.price;
  };

  return {
    plans,
    graceDayActions,
    loading,
    getTrialStatus,
    canShowAd,
    shouldShowBannerAd,
    markAdShown,
    isFeatureUnlocked,
    getTaskLimit,
    getHistoryLimit,
    purchasePlan,
    getGraceDaysRemaining,
    applyGraceDay,
    purchaseGraceDaysWithXP,
    getAdjustedPrice
  };
});