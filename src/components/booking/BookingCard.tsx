import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { Booking } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { Avatar } from '../ui/Avatar';
import { BookingStatusBadge } from './BookingStatusBadge';

export interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  onCancelPress?: () => void;
  onMessagePress?: () => void;
  onReviewPress?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  onCancelPress,
  onMessagePress,
  onReviewPress,
}) => {
  const { colors, typography, borderRadius, shadows } = useTheme();

  const isCancellable =
    booking.bookingStatus === 'confirmed' ||
    booking.bookingStatus === 'pending_confirmation';

  const canReview =
    booking.bookingStatus === 'completed' && !booking.isReviewed;

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
      {/* Header */}
      <View style={styles.header}>
        <Avatar source={booking.friendAvatar} name={booking.friendName} size={48} />
        <View style={styles.headerText}>
          <Text style={[typography.sectionTitle, { color: colors.text }]}>
            {booking.friendName}
          </Text>
          <Text style={[typography.caption, { color: colors.primary, fontWeight: '600', marginTop: 2 }]}>
            {booking.activity}
          </Text>
        </View>
        <BookingStatusBadge status={booking.bookingStatus} paymentStatus={booking.paymentStatus} />
      </View>

      {/* Details Box */}
      <View
        style={[
          styles.detailsBox,
          { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.md },
        ]}
      >
        <View style={styles.detailRow}>
          <Calendar size={14} color={colors.textSecondary} />
          <Text style={[typography.caption, { color: colors.text, marginLeft: 6 }]}>
            {booking.scheduledDate}
          </Text>
          <Clock size={14} color={colors.textSecondary} style={{ marginLeft: 16 }} />
          <Text style={[typography.caption, { color: colors.text, marginLeft: 6 }]}>
            {booking.scheduledStart} - {booking.scheduledEnd} ({booking.durationHours}h)
          </Text>
        </View>

        <View style={[styles.detailRow, { marginTop: 6 }]}>
          <MapPin size={14} color={colors.textSecondary} />
          <Text
            numberOfLines={1}
            style={[typography.caption, { color: colors.textSecondary, marginLeft: 6, flex: 1 }]}
          >
            {booking.meetingLocation.name}, {booking.meetingLocation.city}
          </Text>
        </View>
      </View>

      {/* Footer / Price & Actions */}
      <View style={[styles.footer, { borderTopColor: colors.borderSubtle }]}>
        <View>
          <Text style={[typography.small, { color: colors.textSecondary }]}>Total Paid</Text>
          <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700' }]}>
            ₹{booking.totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          {onMessagePress && (
            <TouchableOpacity
              onPress={onMessagePress}
              style={[
                styles.actionBtn,
                { borderColor: colors.border, borderRadius: borderRadius.sm },
              ]}
            >
              <Text style={[typography.small, { color: colors.text, fontWeight: '600' }]}>
                Chat
              </Text>
            </TouchableOpacity>
          )}

          {canReview && onReviewPress && (
            <TouchableOpacity
              onPress={onReviewPress}
              style={[
                styles.actionBtn,
                { backgroundColor: colors.primary, borderRadius: borderRadius.sm, marginLeft: 8 },
              ]}
            >
              <Text style={[typography.small, { color: colors.white, fontWeight: '700' }]}>
                Rate Companion
              </Text>
            </TouchableOpacity>
          )}

          {isCancellable && onCancelPress && (
            <TouchableOpacity
              onPress={onCancelPress}
              style={[
                styles.actionBtn,
                { borderColor: colors.error, borderRadius: borderRadius.sm, marginLeft: 8 },
              ]}
            >
              <Text style={[typography.small, { color: colors.error, fontWeight: '600' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onPress}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.sm, marginLeft: 8 },
            ]}
          >
            <Text style={[typography.small, { color: colors.text, fontWeight: '600' }]}>
              Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  detailsBox: {
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
});
