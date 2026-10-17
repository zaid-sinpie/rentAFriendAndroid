import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, CalendarDays, MessageSquare, User } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export type MainTabType = 'home' | 'explore' | 'bookings' | 'messages' | 'profile';

export interface BottomTabBarProps {
  currentTab: MainTabType;
  onTabSelect: (tab: MainTabType) => void;
  unreadMessagesCount?: number;
  activeBookingsCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onTabSelect,
  unreadMessagesCount = 0,
  activeBookingsCount = 0,
}) => {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const tabs: { id: MainTabType; label: string; icon: any; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays, badge: activeBookingsCount },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8),
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === currentTab;
        const IconComponent = tab.icon;

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => onTabSelect(tab.id)}
            style={styles.tabItem}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View style={styles.iconWrapper}>
              <IconComponent
                size={22}
                color={isActive ? colors.primary : colors.textSecondary}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              {tab.badge !== undefined && tab.badge > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={[typography.small, { color: colors.white, fontSize: 10, fontWeight: '700' }]}>
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                typography.small,
                styles.label,
                {
                  color: isActive ? colors.primary : colors.textSecondary,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 3,
    fontSize: 11,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -7,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
});
