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
  Sun,
  Moon,
  Smartphone,
  Bell,
  Lock,
  FileText,
  HelpCircle,
  Trash2,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme, ThemeMode } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { storage } from '../../services/storage/storage';
import { AppHeader } from '../../components/common/AppHeader';
import { Switch } from '../../components/ui/Switch';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

export const SettingsScreen: React.FC = () => {
  const { colors, typography, borderRadius, mode, setThemeMode } = useTheme();
  const { goBack, logoutUser, showToast } = useApp();

  const [bookingNotifs, setBookingNotifs] = useState(true);
  const [chatNotifs, setChatNotifs] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const bn = await storage.getItem('setting_booking_notifs');
        if (bn !== null) setBookingNotifs(bn === 'true');
        const cn = await storage.getItem('setting_chat_notifs');
        if (cn !== null) setChatNotifs(cn === 'true');
        const ls = await storage.getItem('setting_location_sharing');
        if (ls !== null) setLocationSharing(ls === 'true');
      } catch {
        // default to true
      }
    };
    loadPreferences();
  }, []);

  const handleBookingNotifsChange = (val: boolean) => {
    setBookingNotifs(val);
    storage.setItem('setting_booking_notifs', String(val)).catch(() => {});
  };

  const handleChatNotifsChange = (val: boolean) => {
    setChatNotifs(val);
    storage.setItem('setting_chat_notifs', String(val)).catch(() => {});
  };

  const handleLocationSharingChange = (val: boolean) => {
    setLocationSharing(val);
    storage.setItem('setting_location_sharing', String(val)).catch(() => {});
  };

  const themeOptions: { id: ThemeMode; label: string; icon: any }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System Default', icon: Smartphone },
  ];

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    showToast('Account Deletion Requested', 'In prototype mode, account deletion is simulated.', 'info');
    logoutUser();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Settings" showBack onBack={goBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Theme Settings */}
        <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 8 }]}>
          Appearance & Theme
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 12 }]}>
          Choose your preferred app interface color theme.
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          {themeOptions.map((opt, i) => {
            const isSelected = mode === opt.id;
            const Icon = opt.icon;

            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.75}
                onPress={() => setThemeMode(opt.id)}
                style={[
                  styles.themeRow,
                  i > 0 && { borderTopWidth: 1, borderTopColor: colors.borderSubtle },
                ]}
              >
                <View style={styles.themeLeft}>
                  <Icon
                    size={18}
                    color={isSelected ? colors.primary : colors.textSecondary}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={[
                      typography.bodyMedium,
                      { color: isSelected ? colors.primaryDark : colors.text, fontWeight: isSelected ? '700' : '500' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notifications */}
        <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 24, marginBottom: 8 }]}>
          Notification Preferences
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <Switch
            label="Booking Status Updates"
            description="Reminders, confirmations, and schedule updates"
            value={bookingNotifs}
            onValueChange={handleBookingNotifsChange}
          />
          <View style={[styles.cardDivider, { backgroundColor: colors.borderSubtle }]} />
          <Switch
            label="Companion Messages"
            description="Instant alerts for direct chat messages"
            value={chatNotifs}
            onValueChange={handleChatNotifsChange}
          />
        </View>

        {/* Privacy & Location */}
        <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 24, marginBottom: 8 }]}>
          Privacy & Location
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <Switch
            label="City-Level Discovery"
            description="Allows verified companions in your city to discover your booking inquiries"
            value={locationSharing}
            onValueChange={handleLocationSharingChange}
          />
        </View>

        {/* Legal & Policies */}
        <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 24, marginBottom: 8 }]}>
          About & Policies
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <View style={styles.policyRow}>
            <FileText size={18} color={colors.textSecondary} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 12, flex: 1 }]}>
              Terms of Service
            </Text>
            <ChevronRight size={16} color={colors.textSecondary} />
          </View>

          <View style={[styles.cardDivider, { backgroundColor: colors.borderSubtle }]} />

          <View style={styles.policyRow}>
            <Lock size={18} color={colors.textSecondary} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 12, flex: 1 }]}>
              Privacy Policy & Security
            </Text>
            <ChevronRight size={16} color={colors.textSecondary} />
          </View>

          <View style={[styles.cardDivider, { backgroundColor: colors.borderSubtle }]} />

          <View style={styles.policyRow}>
            <HelpCircle size={18} color={colors.textSecondary} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 12, flex: 1 }]}>
              Help & Customer Support
            </Text>
            <ChevronRight size={16} color={colors.textSecondary} />
          </View>
        </View>

        {/* Account Deletion */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setDeleteModalVisible(true)}
          style={[
            styles.deleteCard,
            { borderColor: colors.errorLight, backgroundColor: colors.errorLight, borderRadius: borderRadius.md },
          ]}
        >
          <Trash2 size={18} color={colors.error} style={{ marginRight: 8 }} />
          <Text style={[typography.bodyMedium, { color: colors.error, fontWeight: '700' }]}>
            Delete Account
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            typography.small,
            { color: colors.textMuted, textAlign: 'center', marginTop: 20, marginBottom: 20 },
          ]}
        >
          Rent a Friend Mobile • Version 1.0.0 (Build 2026.10)
        </Text>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account"
        message="Are you sure you want to permanently delete your account? All your personal profile data, booking history, and companion records will be erased. This action cannot be undone."
        confirmLabel="Permanently Delete"
        isDestructive
      />
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
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  cardDivider: {
    height: 1,
    marginVertical: 4,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    marginTop: 24,
  },
});
