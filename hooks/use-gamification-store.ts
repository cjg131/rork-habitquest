import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Badge, User } from '@/types';
import { useAuth } from './use-auth-store';

// Sample badges
const sampleBadges: Omit<Badge, 'id' | 'userId' | 'unlockedAt'>[] = [
  {
    name: 'First Steps',
    description: 'Complete your first task',
    icon: '🏆',
  },
  {
    name: 'Habit Master',
    description: 'Complete a habit 7 days in a row',
    icon: '🔥',
  },
  {
    name: 'Focus Champion',
    description: 'Complete 5 Pomodoro sessions',
    icon: '⏱️',
  },
  {
    name: 'Early Bird',
    description: 'Complete a task before 9 AM',
    icon: '🌅',
  },
  {
    name: 'Night Owl',
    description: 'Complete a task after 10 PM',
    icon: '🌙',
  },
];

// XP levels
const levels = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 },
  { level: 4, xpRequired: 500 },
  { level: 5, xpRequired: 1000 },
  { level: 6, xpRequired: 2000 },
  { level: 7, xpRequired: 3500 },
  { level: 8, xpRequired: 5000 },
  { level: 9, xpRequired: 7500 },
  { level: 10, xpRequired: 10000 },
];

export const [GamificationProvider, useGamification] = createContextHook(() => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    const loadBadges = async () => {
      if (!user) {
        setBadges([]);
        setLoading(false);
        return;
      }

      try {
        const savedBadges = await AsyncStorage.getItem(`badges_${user.id}`);
        if (savedBadges) {
          const parsedBadges = JSON.parse(savedBadges);
          // Convert date strings back to Date objects
          setBadges(parsedBadges.map((badge: any) => ({
            ...badge,
            unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined,
          })));
        } else {
          // Initialize badges for new users
          const initialBadges = sampleBadges.map((badge) => ({
            ...badge,
            id: Math.random().toString(36).substring(2, 15),
            userId: user.id,
          }));
          await AsyncStorage.setItem(`badges_${user.id}`, JSON.stringify(initialBadges));
          setBadges(initialBadges);
        }
      } catch (error) {
        console.error('Failed to load badges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, [user]);

  const saveBadges = async (updatedBadges: Badge[]) => {
    if (!user) return false;
    
    try {
      await AsyncStorage.setItem(`badges_${user.id}`, JSON.stringify(updatedBadges));
      return true;
    } catch (error) {
      console.error('Failed to save badges:', error);
      return false;
    }
  };

  const unlockBadge = async (badgeId: string) => {
    if (!user) return false;
    
    try {
      const badgeIndex = badges.findIndex(b => b.id === badgeId);
      if (badgeIndex === -1) return false;
      
      // Check if already unlocked
      if (badges[badgeIndex].unlockedAt) return true;
      
      const updatedBadges = [...badges];
      updatedBadges[badgeIndex] = {
        ...updatedBadges[badgeIndex],
        unlockedAt: new Date(),
      };
      
      setBadges(updatedBadges);
      await saveBadges(updatedBadges);
      
      // Award XP for unlocking a badge
      await addXP(50);
      
      return true;
    } catch (error) {
      console.error('Failed to unlock badge:', error);
      return false;
    }
  };

  const addXP = async (amount: number) => {
    if (!user) return false;
    
    try {
      const newXP = user.xp + amount;
      
      // Check if user leveled up
      let newLevel = user.level;
      let newXpToNextLevel = user.xpToNextLevel;
      
      for (let i = 0; i < levels.length; i++) {
        if (newXP >= levels[i].xpRequired && (i === levels.length - 1 || newXP < levels[i + 1].xpRequired)) {
          newLevel = levels[i].level;
          newXpToNextLevel = i < levels.length - 1 ? levels[i + 1].xpRequired - newXP : 0;
          break;
        }
      }
      
      // Update user
      await updateUser({
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXpToNextLevel,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to add XP:', error);
      return false;
    }
  };

  const addCurrency = async (amount: number) => {
    if (!user) return false;
    
    try {
      const newCurrency = user.currency + amount;
      
      // Update user
      await updateUser({
        currency: newCurrency,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to add currency:', error);
      return false;
    }
  };

  const spendCurrency = async (amount: number) => {
    if (!user) return false;
    if (user.currency < amount) return false;
    
    try {
      const newCurrency = user.currency - amount;
      
      // Update user
      await updateUser({
        currency: newCurrency,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to spend currency:', error);
      return false;
    }
  };

  const useStreakCorrection = async () => {
    if (!user) return false;
    if (user.streakCorrections <= 0) return false;
    
    try {
      const newStreakCorrections = user.streakCorrections - 1;
      
      // Update user
      await updateUser({
        streakCorrections: newStreakCorrections,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to use streak correction:', error);
      return false;
    }
  };

  const buyStreakCorrection = async () => {
    if (!user) return false;
    
    // Cost of a streak correction
    const cost = 100;
    
    if (user.currency < cost) return false;
    
    try {
      // Spend currency
      const currencySuccess = await spendCurrency(cost);
      if (!currencySuccess) return false;
      
      // Add streak correction
      const newStreakCorrections = user.streakCorrections + 1;
      
      // Update user
      await updateUser({
        streakCorrections: newStreakCorrections,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to buy streak correction:', error);
      return false;
    }
  };

  return {
    badges,
    loading,
    unlockBadge,
    addXP,
    addCurrency,
    spendCurrency,
    useStreakCorrection,
    buyStreakCorrection,
  };
});