import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { bookingService } from '../../services/bookings/bookingService';
import { Booking } from '../../types';
import { AppHeader } from '../../components/common/AppHeader';
import { Avatar } from '../../components/ui/Avatar';
import { BookingStatusBadge } from '../../components/booking/BookingStatusBadge';
import { PriceBreakdown } from '../../components/booking/PriceBreakdown';
import { Button } from '../../components/ui/Button';
import { Separator } from '../../components/ui/Separator';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

export const BookingDetailScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { selectedBookingId, goBack, navigateTo, showToast, refreshBookings } = useApp();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!selectedBookingId) return;
      try {
        setLoading(true);
        const b = await bookingService.getBookingById(selectedBookingId);
        setBooking(b);
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectedBookingId]);

  if (!booking) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AppHeader title="Booking Details" showBack onBack={goBack} />
        <View style={styles.loadingCenter}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Loading booking details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCancellable =
    booking.bookingStatus === 'confirmed' ||
    booking.bookingStatus === 'pending_confirmation';

  const canReview =
    booking.bookingStatus === 'completed' && !booking.isReviewed;

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      await bookingService.cancelBooking(booking.id, 'Cancelled by user request');
      await refreshBookings();
      const updated = await bookingService.getBookingById(booking.id);
      setBooking(updated);
      setCancelModalVisible(false);
      showToast('Booking Cancelled', 'Refund processed to original payment method', 'info');
    } catch {
      showToast('Cancellation Failed', 'Please try again', 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Booking Details"
        subtitle={booking.bookingReference}
        showBack
        onBack={goBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <View style={styles.statusRow}>
            <View>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Booking Status</Text>
              <View style={{ marginTop: 4 }}>
                <BookingStatusBadge status={booking.bookingStatus} />
              </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Payment</Text>
              <Text style={[typography.captionMedium, { color: colors.success, fontWeight: '700', marginTop: 4 }]}>
                {booking.paymentStatus === 'refunded' ? 'Refunded' : 'Paid (Simulated)'}
              </Text>
            </View>
          </View>
        </View>

        {/* Companion Profile Summary */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <Text style={[typography.captionMedium, { color: colors.textSecondary, marginBottom: 12 }]}>
            Companion Information
          </Text>

          <View style={styles.friendRow}>
            <Avatar source={booking.friendAvatar} name={booking.friendName} size={54} />
            <View style={styles.friendInfo}>
              <Text style={[typography.sectionTitle, { color: colors.text }]}>
                {booking.friendName}
              </Text>
              <Text style={[typography.captionMedium, { color: colors.primary, fontWeight: '700', marginTop: 2 }]}>
                Activity: {booking.activity}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                Rate: ₹{booking.friendHourlyRate}/hr
              </Text>
            </View>
          </View>

          <Button
            title="Message Companion"
            onPress={() => {
              navigateTo('chat', {
                chat: {
                  conversationId: 'conv_1',
                  participantId: booking.friendId,
                  participantName: booking.friendName,
                  participantAvatar: booking.friendAvatar,
                },
              });
            }}
            variant="outline"
            size="md"
            leftIcon={<MessageSquare size={16} color={colors.text} />}
            fullWidth
            style={{ marginTop: 14 }}
          />
        </View>

        {/* Schedule & Location */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <Text style={[typography.captionMedium, { color: colors.textSecondary, marginBottom: 12 }]}>
            Outing Schedule & Venue
          </Text>

          <View style={styles.detailRow}>
            <Calendar size={18} color={colors.primary} />
            <View style={styles.detailText}>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Date</Text>
              <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '600' }]}>
                {booking.scheduledDate}
              </Text>
            </View>
          </View>

          <View style={[styles.detailRow, { marginTop: 10 }]}>
            <Clock size={18} color={colors.primary} />
            <View style={styles.detailText}>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Time & Duration</Text>
              <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '600' }]}>
                {booking.scheduledStart} - {booking.scheduledEnd} ({booking.durationHours} hours)
              </Text>
            </View>
          </View>

          <View style={[styles.detailRow, { marginTop: 10 }]}>
            <MapPin size={18} color={colors.primary} />
            <View style={styles.detailText}>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Public Meeting Venue</Text>
              <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '600' }]}>
                {booking.meetingLocation.name}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                {booking.meetingLocation.address}, {booking.meetingLocation.city}
              </Text>
              {booking.meetingLocation.notes && (
                <Text style={[typography.small, { color: colors.textMuted, marginTop: 2 }]}>
                  Note: {booking.meetingLocation.notes}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <PriceBreakdown breakdown={booking.priceBreakdown} />
        </View>

        {/* Cancellation Info & Destructive Actions */}
        {isCancellable && (
          <View style={{ marginTop: 16 }}>
            <Button
              title="Cancel This Booking"
              onPress={() => setCancelModalVisible(true)}
              variant="destructive"
              size="md"
              fullWidth
            />
          </View>
        )}

        {canReview && (
          <View style={{ marginTop: 16 }}>
            <Button
              title="Leave Rating & Review"
              onPress={() => navigateTo('write_review')}
              variant="primary"
              size="md"
              fullWidth
            />
          </View>
        )}
      </ScrollView>

      {/* Cancellation Confirmation Dialog */}
      <ConfirmationDialog
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelBooking}
        loading={cancelling}
        title="Cancel Companion Booking"
        message={`Are you sure you want to cancel this booking? If cancelled within the eligible window, your payment of ₹${booking.totalAmount.toLocaleString('en-IN')} will be refunded automatically.`}
        confirmLabel="Confirm Cancellation"
        isDestructive
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingBottom: 36,
  },
  statusCard: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionCard: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailText: {
    flex: 1,
    marginLeft: 12,
  },
});
