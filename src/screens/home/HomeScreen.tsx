import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Bell,
  MapPin,
  ChevronDown,
  Sparkles,
  Calendar,
  ArrowRight,
  Coffee,
  Utensils,
  Compass,
  Film,
  ShoppingBag,
  Activity as FitnessIcon,
  Gamepad2,
  Camera,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { friendService } from '../../services/friends/friendService';
import { FriendProfile } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionHeader } from '../../components/common/SectionHeader';
import { FriendCard } from '../../components/friend/FriendCard';
import { FriendCardSkeleton } from '../../components/common/LoadingSkeleton';
import { Select } from '../../components/ui/Select';

const categoryChips = [
  { id: 'Coffee & Conversation', title: 'Coffee & Talks', icon: Coffee },
  { id: 'Food & Dining', title: 'Dining & Cafes', icon: Utensils },
  { id: 'Sightseeing & Culture', title: 'Sightseeing', icon: Compass },
  { id: 'Photography Walk', title: 'Photo Walks', icon: Camera },
  { id: 'Gaming & Arcades', title: 'Board Games', icon: Gamepad2 },
  { id: 'Movies & Theatre', title: 'Movies & Plays', icon: Film },
  { id: 'Shopping & Styling', title: 'Shopping', icon: ShoppingBag },
  { id: 'Sports & Fitness', title: 'Fitness Buddy', icon: FitnessIcon },
];

const indianCities = [
  { value: 'All Cities', label: 'All Cities' },
  { value: 'Pune', label: 'Pune' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Bengaluru', label: 'Bengaluru' },
  { value: 'Delhi NCR', label: 'Delhi NCR' },
  { value: 'Hyderabad', label: 'Hyderabad' },
];

export const HomeScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const {
    currentUser,
    bookings,
    notifications,
    navigateTo,
    setActiveTab,
    toggleFavorite,
    isFavorite,
  } = useApp();

  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('Pune');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cityPickerVisible, setCityPickerVisible] = useState<boolean>(false);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const loadFriends = async () => {
    try {
      setLoading(true);
      const list = await friendService.getFriends({
        city: selectedCity === 'All Cities' ? undefined : selectedCity,
        category: selectedCategory || undefined,
        query: searchQuery || undefined,
        sortBy: 'recommended',
      });
      setFriends(list);
    } catch {
      // fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, [selectedCity, selectedCategory, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    loadFriends();
  };

  // Find next upcoming booking
  const upcomingBooking = bookings.find(
    (b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending_confirmation'
  );

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.topHeader, { borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.headerLeft}>
          <Avatar
            name={currentUser?.fullName || 'User'}
            size={42}
            style={{ marginRight: 10 }}
          />
          <View>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {getGreeting()},
            </Text>
            <Text style={[typography.subheading, { color: colors.text, fontWeight: '700' }]}>
              {currentUser?.fullName?.split(' ')[0] || 'Friend'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Location Selector Pill */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setCityPickerVisible(true)}
            style={[
              styles.locationPill,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
            ]}
          >
            <MapPin size={14} color={colors.primary} />
            <Text style={[typography.captionMedium, { color: colors.text, marginHorizontal: 4 }]}>
              {selectedCity}
            </Text>
            <ChevronDown size={14} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Notifications button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigateTo('notifications')}
            style={[
              styles.notificationBtn,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
            ]}
          >
            <Bell size={18} color={colors.text} />
            {unreadNotificationsCount > 0 && (
              <View style={[styles.notifBadge, { backgroundColor: colors.error }]}>
                <Text style={{ color: colors.white, fontSize: 9, fontWeight: '800' }}>
                  {unreadNotificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Find companions in ${selectedCity}...`}
          onFilterPress={() => {
            setActiveTab('explore');
          }}
        />

        {/* Upcoming Booking Banner */}
        {upcomingBooking && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigateTo('booking_detail', { bookingId: upcomingBooking.id })}
            style={[
              styles.upcomingBanner,
              {
                backgroundColor: colors.primaryLight,
                borderColor: colors.primary,
                borderRadius: borderRadius.lg,
              },
            ]}
          >
            <View style={styles.bannerRow}>
              <View style={[styles.calendarIconWrapper, { backgroundColor: colors.card }]}>
                <Calendar size={18} color={colors.primaryDark} />
              </View>
              <View style={styles.bannerText}>
                <Text style={[typography.small, { color: colors.primaryDark, fontWeight: '700' }]}>
                  UPCOMING COMPANION PLAN
                </Text>
                <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700' }]}>
                  {upcomingBooking.activity} with {upcomingBooking.friendName}
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {upcomingBooking.scheduledDate} at {upcomingBooking.scheduledStart}
                </Text>
              </View>
              <ArrowRight size={18} color={colors.primaryDark} />
            </View>
          </TouchableOpacity>
        )}

        {/* Activity Categories */}
        <SectionHeader
          title="Explore Activities"
          subtitle="Discover companions for what you enjoy doing"
          actionText={selectedCategory ? 'Clear Filter' : undefined}
          onActionPress={() => setSelectedCategory('')}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categoryChips.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.75}
                onPress={() => setSelectedCategory(isSelected ? '' : cat.id)}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <View
                  style={[
                    styles.catIconCircle,
                    { backgroundColor: isSelected ? colors.card : colors.surfaceSubtle },
                  ]}
                >
                  <Icon size={18} color={isSelected ? colors.primaryDark : colors.text} />
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    typography.captionMedium,
                    {
                      color: isSelected ? colors.primaryDark : colors.text,
                      fontWeight: isSelected ? '700' : '500',
                      marginTop: 6,
                    },
                  ]}
                >
                  {cat.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Become a Friend Promo Banner */}
        {!currentUser?.hasFriendProfile && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigateTo('become_friend')}
            style={[
              styles.promoCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
              },
            ]}
          >
            <View style={styles.promoContent}>
              <View style={[styles.promoIcon, { backgroundColor: colors.successLight }]}>
                <Sparkles size={20} color={colors.success} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[typography.sectionTitle, { color: colors.text, fontSize: 16 }]}>
                  Earn as a Companion
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                  Share your hobbies, explore your city, and set your own hourly rates.
                </Text>
              </View>
            </View>
            <View style={[styles.promoButton, { backgroundColor: colors.surfaceSubtle }]}>
              <Text style={[typography.captionMedium, { color: colors.primary, fontWeight: '700' }]}>
                Apply Now →
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Recommended Friends */}
        <SectionHeader
          title={`Companions in ${selectedCity}`}
          subtitle={`${friends.length} verified companions available`}
          actionText="View All"
          onActionPress={() => setActiveTab('explore')}
        />

        {loading ? (
          <View>
            <FriendCardSkeleton />
            <FriendCardSkeleton />
          </View>
        ) : friends.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderRadius: borderRadius.lg }]}>
            <Text style={[typography.bodyMedium, { color: colors.text }]}>
              No companions found in {selectedCity} for this activity.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedCity('All Cities');
                setSelectedCategory('');
                setSearchQuery('');
              }}
              style={{ marginTop: 10 }}
            >
              <Text style={[typography.captionMedium, { color: colors.primary, fontWeight: '700' }]}>
                Reset all filters
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          friends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              isFavorite={isFavorite(friend.id)}
              onToggleFavorite={() => toggleFavorite(friend.id)}
              onPress={() => navigateTo('friend_detail', { friendId: friend.id })}
              onBookPress={() => navigateTo('booking_flow', { friendId: friend.id })}
            />
          ))
        )}
      </ScrollView>

      {/* City Picker Modal */}
      {cityPickerVisible && (
        <Select
          label="Choose Location"
          options={indianCities}
          value={selectedCity}
          onValueChange={(val) => {
            setSelectedCity(val);
            setCityPickerVisible(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  notifBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  upcomingBanner: {
    padding: 14,
    borderWidth: 1,
    marginVertical: 10,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bannerText: {
    flex: 1,
  },
  categoryScroll: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  categoryCard: {
    width: 110,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1.2,
    alignItems: 'center',
    marginRight: 10,
  },
  catIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoCard: {
    padding: 16,
    borderWidth: 1,
    marginTop: 18,
    marginBottom: 8,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
  },
});
