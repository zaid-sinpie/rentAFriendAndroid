import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookingStatus, PaymentStatus } from '../../types';
import { useTheme } from '../../theme/ThemeContext';

export interface BookingStatusBadgeProps {
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
  const { colors, typography, borderRadius } = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          bg: colors.successLight,
          textColor: colors.success,
        };
      case 'pending_confirmation':
        return {
          label: 'Pending Companion',
          bg: colors.warningLight,
          textColor: colors.warning,
        };
      case 'completed':
        return {
          label: 'Completed',
          bg: colors.surfaceSubtle,
          textColor: colors.textSecondary,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bg: colors.errorLight,
          textColor: colors.error,
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          bg: colors.primaryLight,
          textColor: colors.primaryDark,
        };
      case 'draft':
      default:
        return {
          label: 'Draft',
          bg: colors.surfaceSubtle,
          textColor: colors.textMuted,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderRadius: borderRadius.full,
        },
      ]}
    >
      <Text style={[typography.small, { color: config.textColor, fontWeight: '700' }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
});
