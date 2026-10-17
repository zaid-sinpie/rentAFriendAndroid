import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, CheckCircle2, MapPin } from 'lucide-react-native';
import { FriendProfile } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { Avatar } from '../ui/Avatar';
import { RatingDisplay } from '../common/RatingDisplay';
import { PriceDisplay } from '../common/PriceDisplay';
import { InterestTag } from './InterestTag';

export interface FriendCardProps {
  friend: FriendProfile;
  onPress: () => void;
  onBookPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  compact?: boolean;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onPress,
  onBookPress,
  isFavorite = false,
  onToggleFavorite,
  compact = false,
}) => {
  const { colors, typography, borderRadius, shadows } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          ...shadows.card,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Avatar source={friend.avatarUrl} name={friend.displayName} size={compact ? 54 : 64} />

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={[typography.sectionTitle, { color: colors.text, flex: 1 }]}>
              {friend.displayName}, {friend.age}
            </Text>

            {friend.verificationStatus === 'verified' && (
              <CheckCircle2 size={16} color={colors.success} style={styles.verifiedIcon} />
            )}

            {onToggleFavorite && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onToggleFavorite}
                style={styles.favoriteBtn}
              >
                <Heart
                  size={20}
                  color={isFavorite ? colors.error : colors.textSecondary}
                  fill={isFavorite ? colors.error : 'transparent'}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.locationRow}>
            <MapPin size={13} color={colors.textSecondary} />
            <Text numberOfLines={1} style={[typography.caption, { color: colors.textSecondary, marginLeft: 3 }]}>
              {friend.city} • {friend.serviceArea.split(',')[0]}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <RatingDisplay rating={friend.averageRating} reviewCount={friend.reviewCount} />
          </View>
        </View>
      </View>

      {!compact && (
        <Text numberOfLines={2} style={[typography.body, styles.bio, { color: colors.textSecondary }]}>
          {friend.bio}
        </Text>
      )}

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {friend.interests.slice(0, compact ? 2 : 3).map((tag, i) => (
          <InterestTag key={i} label={tag} />
        ))}
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.borderSubtle }]}>
        <PriceDisplay amount={friend.hourlyRate} period="/hr" size={compact ? 'sm' : 'md'} />

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onBookPress || onPress}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Text style={[typography.captionMedium, { color: colors.white, fontWeight: '700' }]}>
            Book Companion
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifiedIcon: {
    marginLeft: 4,
    marginRight: 6,
  },
  favoriteBtn: {
    padding: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingRow: {
    marginTop: 4,
  },
  bio: {
    marginTop: 10,
    fontSize: 13.5,
    lineHeight: 19,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
