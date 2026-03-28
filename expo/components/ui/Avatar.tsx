import React from 'react';
import { StyleSheet, View, Text, Image, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  style,
  backgroundColor,
}) => {
  const { colors } = useTheme();

  const getSize = (): number => {
    switch (size) {
      case 'xs': return 24;
      case 'sm': return 32;
      case 'md': return 48;
      case 'lg': return 64;
      case 'xl': return 96;
      default: return 48;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'xs': return 10;
      case 'sm': return 12;
      case 'md': return 16;
      case 'lg': return 24;
      case 'xl': return 32;
      default: return 16;
    }
  };

  const getInitials = (): string => {
    if (!name) return '';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const avatarSize = getSize();
  const fontSize = getFontSize();
  const bgColor = backgroundColor || colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: source ? 'transparent' : bgColor,
        },
        style,
      ]}
      testID="avatar"
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
          resizeMode="cover"
        />
      ) : name ? (
        <Text
          style={[
            styles.initials,
            {
              fontSize,
              color: '#FFFFFF',
            },
          ]}
        >
          {getInitials()}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '600',
  },
});