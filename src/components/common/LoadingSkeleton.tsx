import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../ui/Skeleton';
import { useTheme } from '../../theme/ThemeContext';

export const FriendCardSkeleton: React.FC = () => {
  const { colors, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.cardSkeleton,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
        },
      ]}
    >
      <View style={styles.row}>
        <Skeleton width={70} height={70} borderRadius={borderRadius.full} />
        <View style={styles.textColumn}>
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={14} style={{ marginTop: 6 }} />
          <Skeleton width="80%" height={14} style={{ marginTop: 6 }} />
        </View>
      </View>
      <View style={styles.tagRow}>
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={80} height={24} borderRadius={12} style={{ marginLeft: 6 }} />
        <Skeleton width={70} height={24} borderRadius={12} style={{ marginLeft: 6 }} />
      </View>
      <View style={styles.bottomRow}>
        <Skeleton width="30%" height={20} />
        <Skeleton width="35%" height={36} borderRadius={8} />
      </View>
    </View>
  );
};

export const FriendListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <FriendCardSkeleton key={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
  cardSkeleton: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textColumn: {
    flex: 1,
    marginLeft: 14,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
  },
});
