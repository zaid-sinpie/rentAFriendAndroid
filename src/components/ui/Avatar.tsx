import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = 'User',
  size = 48,
  style,
  isOnline,
}) => {
  const { colors, typography, borderRadius } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <View style={[{ width: size, height: size }, style]}>
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: borderRadius.full,
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
            borderWidth: 1,
          },
        ]}
      >
        {source && !imageFailed ? (
          <Image
            source={{ uri: source }}
            onError={() => setImageFailed(true)}
            style={{ width: size, height: size, borderRadius: borderRadius.full }}
          />
        ) : (
          <Text
            style={[
              typography.captionMedium,
              {
                color: colors.primaryDark,
                fontSize: size * 0.38,
                fontWeight: '700',
              },
            ]}
          >
            {getInitials(name)}
          </Text>
        )}
      </View>

      {isOnline !== undefined && (
        <View
          style={[
            styles.onlineIndicator,
            {
              backgroundColor: isOnline ? colors.success : colors.textMuted,
              borderColor: colors.card,
              width: Math.max(10, size * 0.25),
              height: Math.max(10, size * 0.25),
              borderRadius: borderRadius.full,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});
