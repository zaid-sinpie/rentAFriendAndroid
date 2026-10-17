import React, { useState } from 'react';
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
  IndianRupee,
  Users,
  CheckCircle2,
  XCircle,
  Sliders,
  TrendingUp,
  MapPin,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { AppHeader } from '../../components/common/AppHeader';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

export const ProviderDashboardScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { goBack, navigateTo, showToast } = useApp();

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'req_1',
      clientName: 'Priya Verma',
      activity: 'Coffee & Conversation',
      date: '2026-10-22',
      time: '04:00 PM',
      duration: '2 hours',
      location: 'Blue Tokai, Koregaon Park',
      payout: 1300,
    },
  ]);

  const handleAcceptRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    showToast('Booking Request Accepted', 'The client has been notified to meet at the public venue', 'success');
  };

  const handleDeclineRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    showToast('Request Declined', 'Slot freed up on your schedule', 'info');
  };

  // Mock Earnings
  const grossEarnings = 4800;
  const platformFee = Math.round(grossEarnings * 0.05); // 5%
  const netEarnings = grossEarnings - platformFee;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Companion Dashboard" showBack onBack={goBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Bar */}
        <View
          style={[
            styles.statusBanner,
            { backgroundColor: colors.successLight, borderColor: colors.success, borderRadius: borderRadius.md },
          ]}
        >
          <CheckCircle2 size={18} color={colors.success} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={[typography.captionMedium, { color: colors.success, fontWeight: '700' }]}>
              Companion Profile Active
            </Text>
            <Text style={[typography.caption, { color: colors.success, marginTop: 1 }]}>
              You are visible to clients looking for companions in Pune.
            </Text>
          </View>
        </View>

        {/* Earnings Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                Estimated Net Earnings
              </Text>
              <Text style={[typography.pageTitle, { color: colors.text, marginTop: 2 }]}>
                ₹{netEarnings.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <TrendingUp size={22} color={colors.primaryDark} />
            </View>
          </View>

          <View style={[styles.earningsBreakdown, { borderTopColor: colors.borderSubtle }]}>
            <View style={styles.statItem}>
              <Text style={[typography.small, { color: colors.textSecondary }]}>Completed Outings</Text>
              <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700' }]}>
                4
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[typography.small, { color: colors.textSecondary }]}>Gross Booked</Text>
              <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700' }]}>
                ₹{grossEarnings.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[typography.small, { color: colors.textSecondary }]}>Platform Fee (5%)</Text>
              <Text style={[typography.bodyMedium, { color: colors.textSecondary, fontWeight: '700' }]}>
                -₹{platformFee.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Incoming Client Booking Requests */}
        <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 20, marginBottom: 10 }]}>
          Incoming Booking Requests ({pendingRequests.length})
        </Text>

        {pendingRequests.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
            ]}
          >
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              No pending client requests right now.
            </Text>
          </View>
        ) : (
          pendingRequests.map((req) => (
            <View
              key={req.id}
              style={[
                styles.requestCard,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
              ]}
            >
              <View style={styles.requestHeader}>
                <Avatar name={req.clientName} size={44} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[typography.sectionTitle, { color: colors.text, fontSize: 16 }]}>
                    {req.clientName}
                  </Text>
                  <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
                    {req.activity}
                  </Text>
                </View>
                <Text style={[typography.sectionTitle, { color: colors.primaryDark, fontSize: 16 }]}>
                  ₹{req.payout}
                </Text>
              </View>

              <View style={[styles.detailBox, { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.md }]}>
                <View style={styles.row}>
                  <Calendar size={14} color={colors.textSecondary} />
                  <Text style={[typography.caption, { color: colors.text, marginLeft: 6 }]}>
                    {req.date} at {req.time} ({req.duration})
                  </Text>
                </View>

                <View style={[styles.row, { marginTop: 4 }]}>
                  <MapPin size={14} color={colors.textSecondary} />
                  <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 6 }]}>
                    {req.location}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtonsRow}>
                <Button
                  title="Decline"
                  onPress={() => handleDeclineRequest(req.id)}
                  variant="outline"
                  size="sm"
                  style={{ flex: 1, marginRight: 6 }}
                />
                <Button
                  title="Accept Request"
                  onPress={() => handleAcceptRequest(req.id)}
                  variant="primary"
                  size="sm"
                  style={{ flex: 1, marginLeft: 6 }}
                />
              </View>
            </View>
          ))
        )}

        {/* Quick Management Shortcuts */}
        <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 24, marginBottom: 10 }]}>
          Schedule & Profile Controls
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigateTo('manage_availability')}
          style={[
            styles.menuItem,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
          ]}
        >
          <Clock size={18} color={colors.primary} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={[typography.bodyMedium, { color: colors.text }]}>
              Manage Weekly Working Hours
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Update active days and available slots
            </Text>
          </View>
          <Sliders size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingBottom: 36,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 14,
    borderTopWidth: 1,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  emptyCard: {
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  requestCard: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailBox: {
    padding: 10,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
});
