import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { Tabs } from '../../components/ui/Tabs';
import { BookingCard } from '../../components/booking/BookingCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { bookingService } from '../../services/bookings/bookingService';

export const BookingsScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const { bookings, navigateTo, setActiveTab, refreshBookings, showToast } = useApp();

  const [activeTab, setActiveTabState] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [cancelModalBookingId, setCancelModalBookingId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBookings();
    setRefreshing(false);
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') {
      return b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending_confirmation';
    }
    if (activeTab === 'past') {
      return b.bookingStatus === 'completed';
    }
    if (activeTab === 'cancelled') {
      return b.bookingStatus === 'cancelled';
    }
    return true;
  });

  const upcomingCount = bookings.filter(
    (b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending_confirmation'
  ).length;

  const handleConfirmCancel = async () => {
    if (!cancelModalBookingId) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(cancelModalBookingId, 'Cancelled via Bookings dashboard');
      await refreshBookings();
      setCancelModalBookingId(null);
      showToast('Booking Cancelled', 'Refund processed to original payment method', 'info');
    } catch {
      showToast('Cancellation Failed', 'Please try again', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const tabItems = [
    { id: 'upcoming', label: 'Upcoming', badge: upcomingCount },
    { id: 'past', label: 'Past Outings' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[typography.pageTitle, { color: colors.text }]}>
            My Bookings
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
            Manage your companion outings and schedules
          </Text>
        </View>

        {/* Tabs: Upcoming / Past / Cancelled */}
        <Tabs
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTabState(id as any)}
          variant="pill"
        />

        <ScrollView
          contentContainerStyle={styles.scrollList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredBookings.length === 0 ? (
            <EmptyState
              icon={<CalendarDays size={32} color={colors.textSecondary} />}
              title={
                activeTab === 'upcoming'
                  ? 'No plans booked yet'
                  : activeTab === 'past'
                  ? 'No past outings'
                  : 'No cancelled bookings'
              }
              description={
                activeTab === 'upcoming'
                  ? 'Find a verified companion who shares your interests and make an outing plan today.'
                  : activeTab === 'past'
                  ? 'Once your companion outings are finished, they will appear here.'
                  : 'You have no cancelled companion bookings.'
              }
              actionTitle={activeTab === 'upcoming' ? 'Discover Companions' : undefined}
              onActionPress={activeTab === 'upcoming' ? () => setActiveTab('explore') : undefined}
            />
          ) : (
            filteredBookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onPress={() => navigateTo('booking_detail', { bookingId: b.id })}
                onCancelPress={() => setCancelModalBookingId(b.id)}
                onMessagePress={() => {
                  navigateTo('chat', {
                    chat: {
                      conversationId: 'conv_1',
                      participantId: b.friendId,
                      participantName: b.friendName,
                      participantAvatar: b.friendAvatar,
                    },
                  });
                }}
                onReviewPress={() => navigateTo('write_review')}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Cancel Modal */}
      <ConfirmationDialog
        visible={!!cancelModalBookingId}
        onClose={() => setCancelModalBookingId(null)}
        onConfirm={handleConfirmCancel}
        loading={cancelling}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? A refund will be issued as per cancellation policy terms."
        confirmLabel="Cancel Booking"
        isDestructive
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  scrollList: {
    paddingBottom: 36,
  },
});
