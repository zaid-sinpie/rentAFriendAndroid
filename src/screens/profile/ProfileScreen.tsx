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
  Heart,
  Calendar,
  Settings,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  LogOut,
  Edit3,
  HelpCircle,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';

export const ProfileScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { currentUser, favorites, bookings, navigateTo, setActiveTab, logoutUser } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <View style={styles.avatarRow}>
            <Avatar name={currentUser?.fullName || 'User'} size={68} />
            <View style={styles.profileInfo}>
              <Text style={[typography.sectionTitle, { color: colors.text, fontSize: 18 }]}>
                {currentUser?.fullName}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                {currentUser?.phoneNumber}
              </Text>
              <Text style={[typography.caption, { color: colors.primary, fontWeight: '600', marginTop: 1 }]}>
                {currentUser?.city || 'Pune'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigateTo('edit_profile')}
              style={[styles.editBtn, { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.full }]}
            >
              <Edit3 size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Companion Provider Mode Switcher / Banner */}
        {currentUser?.hasFriendProfile ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigateTo('provider_dashboard')}
            style={[
              styles.providerBanner,
              { backgroundColor: colors.primaryLight, borderColor: colors.primary, borderRadius: borderRadius.md },
            ]}
          >
            <Sparkles size={20} color={colors.primaryDark} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={[typography.captionMedium, { color: colors.primaryDark, fontWeight: '700' }]}>
                Companion Mode Active
              </Text>
              <Text style={[typography.small, { color: colors.textSecondary }]}>
                Manage requests, working hours & earnings
              </Text>
            </View>
            <ChevronRight size={18} color={colors.primaryDark} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigateTo('become_friend')}
            style={[
              styles.providerBanner,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
            ]}
          >
            <Sparkles size={20} color={colors.primary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={[typography.captionMedium, { color: colors.text, fontWeight: '700' }]}>
                Become a Friend (Companion)
              </Text>
              <Text style={[typography.small, { color: colors.textSecondary }]}>
                Earn by offering companionship for hobbies & outings
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Navigation Sections */}
        <Text style={[typography.captionMedium, { color: colors.textSecondary, marginTop: 16, marginBottom: 8, paddingHorizontal: 4 }]}>
          My Activity
        </Text>

        <View
          style={[
            styles.menuGroup,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigateTo('favorites')}
            style={styles.menuRow}
          >
            <Heart size={18} color={colors.primary} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 12, flex: 1 }]}>
              Saved Favorites
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginRight: 8 }]}>
              {favorites.length} friends
            </Text>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.borderSubtle }]} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('bookings')}
            style={styles.menuRow}
          >
            <Calendar size={18} color={colors.primary} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 12, flex: 1 }]}>
              Booking History
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginRight: 8 }]}>
              {bookings.length} outings
            </Text>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Safety & Preferences */}
        <Text style={[typography.captionMedium, { color: colors.textSecondary, marginTop: 16, marginBottom: 8, paddingHorizontal: 4 }]}>
          Safety & Platform
        </Text>

        <View
          style={[
            styles.menuGroup,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigateTo('safety')}
            style={styles.menuRow}
          >
            <ShieldCheck size={18} color={colors.success} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 12, flex: 1 }]}>
              Safety Guidelines & Emergency Info
            </Text>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.borderSubtle }]} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigateTo('community_guidelines')}
            style={styles.menuRow}
          >
            <FileText size={18} color={colors.primary} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 12, flex: 1 }]}>
              Community Standards & Code of Conduct
            </Text>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.borderSubtle }]} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigateTo('settings')}
            style={styles.menuRow}
          >
            <Settings size={18} color={colors.textSecondary} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 12, flex: 1 }]}>
              Settings & Theme Preferences
            </Text>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={logoutUser}
          style={[
            styles.logoutBtn,
            { borderColor: colors.error, borderRadius: borderRadius.md },
          ]}
        >
          <LogOut size={16} color={colors.error} style={{ marginRight: 8 }} />
          <Text style={[typography.bodyMedium, { color: colors.error, fontWeight: '700' }]}>
            Log Out
          </Text>
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
  profileCard: {
    padding: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  editBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginVertical: 4,
  },
  menuGroup: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    marginTop: 24,
  },
});
