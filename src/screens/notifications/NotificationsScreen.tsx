import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Bell,
  CheckCircle2,
  Calendar,
  CreditCard,
  Star,
  UserCheck,
  AlertCircle,
  XCircle,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { notificationService } from '../../services/notifications/notificationService';
import { AppHeader } from '../../components/common/AppHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { NotificationType } from '../../types';

export const NotificationsScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { notifications, goBack, refreshNotifications, navigateTo } = useApp();

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    await refreshNotifications();
  };

  const handleNotificationPress = async (id: string, targetScreen?: string, targetId?: string) => {
    await notificationService.markAsRead(id);
    await refreshNotifications();

    if (targetScreen === 'BookingDetails' && targetId) {
      navigateTo('booking_detail', { bookingId: targetId });
    } else if (targetScreen === 'FriendProfile' && targetId) {
      navigateTo('friend_detail', { friendId: targetId });
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'booking_accepted':
        return <CheckCircle2 size={20} color={colors.success} />;
      case 'payment_update':
        return <CreditCard size={20} color={colors.primary} />;
      case 'upcoming_booking':
        return <Calendar size={20} color={colors.primaryDark} />;
      case 'review_reminder':
        return <Star size={20} color="#E5A93C" />;
      case 'cancellation_update':
        return <XCircle size={20} color={colors.error} />;
      default:
        return <Bell size={20} color={colors.primary} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Notifications"
        showBack
        onBack={goBack}
        rightAction={
          notifications.some((n) => !n.isRead) ? (
            <TouchableOpacity onPress={handleMarkAllRead} style={{ padding: 4 }}>
              <Text style={[typography.captionMedium, { color: colors.primary, fontWeight: '700' }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={32} color={colors.textSecondary} />}
            title="No notifications"
            description="You are all caught up! Booking updates and messages will appear here."
          />
        ) : (
          notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => handleNotificationPress(item.id, item.targetScreen, item.targetId)}
              style={[
                styles.notifCard,
                {
                  backgroundColor: item.isRead ? colors.card : colors.primaryLight,
                  borderColor: item.isRead ? colors.border : colors.primary,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <View style={styles.iconContainer}>{getNotificationIcon(item.type)}</View>

              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      typography.bodyMedium,
                      { color: colors.text, fontWeight: item.isRead ? '500' : '700', flex: 1 },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={[typography.small, { color: colors.textMuted, marginLeft: 6 }]}>
                    {item.createdAt}
                  </Text>
                </View>

                <Text
                  style={[
                    typography.caption,
                    { color: colors.textSecondary, marginTop: 3, lineHeight: 18 },
                  ]}
                >
                  {item.body}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 36,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 14,
    borderWidth: 1,
    marginVertical: 4,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
