import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  reviewCount,
  size = 'sm',
}) => {
  const { colors, typography } = useTheme();
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <View style={styles.container}>
      <Star size={iconSize} color="#E5A93C" fill="#E5A93C" />
      <Text
        style={[
          size === 'sm' ? typography.captionMedium : typography.bodyMedium,
          { color: colors.text, marginLeft: 4, fontWeight: '700' },
        ]}
      >
        {rating.toFixed(1)}
      </Text>
      {reviewCount !== undefined && (
        <Text
          style={[
            size === 'sm' ? typography.small : typography.caption,
            { color: colors.textSecondary, marginLeft: 3 },
          ]}
        >
          ({reviewCount})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
