import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Trophy } from 'lucide-react-native';

interface LevelProgressProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  xp,
  xpToNextLevel,
}) => {
  const { colors } = useTheme();
  
  const getLevelTitle = (level: number): string => {
    switch (level) {
      case 1: return 'Novice';
      case 2: return 'Apprentice';
      case 3: return 'Adept';
      case 4: return 'Expert';
      case 5: return 'Master';
      case 6: return 'Grandmaster';
      case 7: return 'Legend';
      case 8: return 'Mythic';
      case 9: return 'Transcendent';
      case 10: return 'Ascended';
      default: return `Level ${level}`;
    }
  };

  const progress = xpToNextLevel > 0 ? (xp % xpToNextLevel) / xpToNextLevel : 1;

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.levelTitle, { color: colors.text.primary }]}>
            {getLevelTitle(level)}
          </Text>
          <Text style={[styles.levelNumber, { color: colors.primary }]}>
            Level {level}
          </Text>
        </View>
        
        <View 
          style={[
            styles.iconContainer,
            { backgroundColor: colors.primary + '20' }
          ]}
        >
          <Trophy size={24} color={colors.primary} />
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          height={8}
          color={colors.primary}
          backgroundColor={colors.card}
          style={styles.progressBar}
        />
        
        <Text style={[styles.xpText, { color: colors.text.secondary }]}>
          {xpToNextLevel > 0 
            ? `${xp % xpToNextLevel} / ${xpToNextLevel} XP to next level`
            : `${xp} XP total`
          }
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  levelNumber: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    marginBottom: 8,
  },
  xpText: {
    fontSize: 12,
    textAlign: 'right',
  },
});