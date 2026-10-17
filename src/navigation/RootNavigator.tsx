import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useApp } from '../store/AppContext';
import { BottomTabBar } from '../components/common/BottomTabBar';
import { Toast } from '../components/ui/Toast';

// Auth Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { OtpScreen } from '../screens/auth/OtpScreen';
import { RoleIntroScreen } from '../screens/auth/RoleIntroScreen';

// Main Tab Screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { ExploreScreen } from '../screens/explore/ExploreScreen';
import { BookingsScreen } from '../screens/bookings/BookingsScreen';
import { MessagesScreen } from '../screens/messages/MessagesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

// Sub Screens
import { FriendDetailScreen } from '../screens/friends/FriendDetailScreen';
import { BookingFlowScreen } from '../screens/booking/BookingFlowScreen';
import { BookingDetailScreen } from '../screens/booking/BookingDetailScreen';
import { ChatScreen } from '../screens/messages/ChatScreen';
import { BecomeAFriendScreen } from '../screens/provider/BecomeAFriendScreen';
import { ProviderDashboardScreen } from '../screens/provider/ProviderDashboardScreen';
import { ManageAvailabilityScreen } from '../screens/provider/ManageAvailabilityScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { FavoritesScreen } from '../screens/profile/FavoritesScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { SafetyScreen } from '../screens/settings/SafetyScreen';
import { CommunityGuidelinesScreen } from '../screens/settings/CommunityGuidelinesScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { WriteReviewScreen } from '../screens/reviews/WriteReviewScreen';

export const RootNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    currentScreen,
    activeTab,
    setActiveTab,
    toast,
    hideToast,
    goBack,
    bookings,
    notifications,
  } = useApp();

  // Android status bar / battery percentage clearance
  // Prevents the status bar (clock, battery bar, notch/punch-hole) from overlapping screen content
  const androidTopMargin = Platform.OS === 'android'
    ? Math.max(insets.top, (StatusBar.currentHeight || 24) + 6, 32)
    : 0;

  const isSplash = currentScreen === 'splash';
  const topPadding = isSplash ? 0 : androidTopMargin;

  // Android hardware back button handler
  useEffect(() => {
    const onBackPress = () => {
      const handled = goBack();
      return handled; // if handled, prevent exit; otherwise exit app
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [goBack]);

  const activeBookingsCount = bookings.filter(
    (b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending_confirmation'
  ).length;

  const unreadMessagesCount = 1;

  // Render main tab view
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'bookings':
        return <BookingsScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'login':
        return <LoginScreen />;
      case 'signup':
        return <SignUpScreen />;
      case 'otp':
        return <OtpScreen />;
      case 'role_intro':
        return <RoleIntroScreen />;
      case 'friend_detail':
        return <FriendDetailScreen />;
      case 'booking_flow':
        return <BookingFlowScreen />;
      case 'booking_detail':
        return <BookingDetailScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'become_friend':
        return <BecomeAFriendScreen />;
      case 'provider_dashboard':
        return <ProviderDashboardScreen />;
      case 'manage_availability':
        return <ManageAvailabilityScreen />;
      case 'edit_profile':
        return <EditProfileScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'safety':
        return <SafetyScreen />;
      case 'community_guidelines':
        return <CommunityGuidelinesScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'write_review':
        return <WriteReviewScreen />;
      case 'main':
      default:
        return (
          <View style={styles.tabLayout}>
            <View style={styles.tabContent}>{renderTabContent()}</View>
            <BottomTabBar
              currentTab={activeTab}
              onTabSelect={setActiveTab}
              activeBookingsCount={activeBookingsCount}
              unreadMessagesCount={unreadMessagesCount}
            />
          </View>
        );
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      <View style={[styles.screenContainer, { paddingTop: topPadding }]}>
        {renderScreen()}
      </View>

      {/* Global In-App Toast */}
      <Toast
        visible={toast.visible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onDismiss={hideToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  tabLayout: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
});
