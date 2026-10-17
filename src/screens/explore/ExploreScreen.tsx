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
import { LayoutGrid, List as ListIcon, X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { friendService } from '../../services/friends/friendService';
import { FriendProfile, SearchFilterParams } from '../../types';
import { SearchBar } from '../../components/common/SearchBar';
import { FriendCard } from '../../components/friend/FriendCard';
import { FriendCardSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { FilterModal } from './FilterModal';

export const ExploreScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { navigateTo, toggleFavorite, isFavorite } = useApp();

  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGrid, setIsGrid] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [filters, setFilters] = useState<SearchFilterParams>({
    sortBy: 'recommended',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await friendService.getFriends({
        ...filters,
        query: searchQuery,
      });
      setFriends(res);
    } catch {
      // fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Calculate active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.city) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.minRating) count++;
    if (filters.isVerifiedOnly) count++;
    if (filters.sortBy && filters.sortBy !== 'recommended') count++;
    return count;
  };

  const removeCityFilter = () => setFilters((prev) => ({ ...prev, city: undefined }));
  const removePriceFilter = () => setFilters((prev) => ({ ...prev, minPrice: undefined, maxPrice: undefined }));
  const removeRatingFilter = () => setFilters((prev) => ({ ...prev, minRating: undefined }));
  const removeVerifiedFilter = () => setFilters((prev) => ({ ...prev, isVerifiedOnly: false }));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[typography.pageTitle, { color: colors.text }]}>
            Find a Companion
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
            Connect with verified locals for outings & shared hobbies
          </Text>
        </View>

        {/* Search & Filter Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by hobby, interest, or city..."
          onFilterPress={() => setFilterModalVisible(true)}
          activeFilterCount={getActiveFilterCount()}
        />

        {/* Active Filter Chips */}
        {getActiveFilterCount() > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
          >
            {filters.city && (
              <TouchableOpacity
                onPress={removeCityFilter}
                style={[styles.filterChip, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
              >
                <Text style={[typography.small, { color: colors.primaryDark, fontWeight: '600' }]}>
                  City: {filters.city}
                </Text>
                <X size={12} color={colors.primaryDark} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            )}

            {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
              <TouchableOpacity
                onPress={removePriceFilter}
                style={[styles.filterChip, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
              >
                <Text style={[typography.small, { color: colors.primaryDark, fontWeight: '600' }]}>
                  Price Filter
                </Text>
                <X size={12} color={colors.primaryDark} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            )}

            {filters.minRating && (
              <TouchableOpacity
                onPress={removeRatingFilter}
                style={[styles.filterChip, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
              >
                <Text style={[typography.small, { color: colors.primaryDark, fontWeight: '600' }]}>
                  {filters.minRating}★ & above
                </Text>
                <X size={12} color={colors.primaryDark} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            )}

            {filters.isVerifiedOnly && (
              <TouchableOpacity
                onPress={removeVerifiedFilter}
                style={[styles.filterChip, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
              >
                <Text style={[typography.small, { color: colors.primaryDark, fontWeight: '600' }]}>
                  Verified Only
                </Text>
                <X size={12} color={colors.primaryDark} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            )}
          </ScrollView>
        )}

        {/* Results Bar */}
        <View style={styles.resultsBar}>
          <Text style={[typography.captionMedium, { color: colors.textSecondary }]}>
            {loading ? 'Searching...' : `${friends.length} companions found`}
          </Text>

          <View style={styles.viewToggle}>
            <TouchableOpacity
              onPress={() => setIsGrid(false)}
              style={[
                styles.toggleIconBtn,
                { backgroundColor: !isGrid ? colors.primaryLight : 'transparent' },
              ]}
            >
              <ListIcon size={18} color={!isGrid ? colors.primaryDark : colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsGrid(true)}
              style={[
                styles.toggleIconBtn,
                { backgroundColor: isGrid ? colors.primaryLight : 'transparent', marginLeft: 4 },
              ]}
            >
              <LayoutGrid size={18} color={isGrid ? colors.primaryDark : colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* List of Friends */}
        <ScrollView
          contentContainerStyle={styles.scrollList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {loading ? (
            <View>
              <FriendCardSkeleton />
              <FriendCardSkeleton />
              <FriendCardSkeleton />
            </View>
          ) : friends.length === 0 ? (
            <EmptyState
              title="No companions found"
              description="Try adjusting your keywords, price range, or city filters to find available companions."
              actionTitle="Clear All Filters"
              onActionPress={() => {
                setFilters({ sortBy: 'recommended' });
                setSearchQuery('');
              }}
            />
          ) : (
            friends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                compact={isGrid}
                isFavorite={isFavorite(friend.id)}
                onToggleFavorite={() => toggleFavorite(friend.id)}
                onPress={() => navigateTo('friend_detail', { friendId: friend.id })}
                onBookPress={() => navigateTo('booking_flow', { friendId: friend.id })}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
        onClearFilters={() => setFilters({ sortBy: 'recommended' })}
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
    paddingBottom: 4,
  },
  filterChipsRow: {
    paddingVertical: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 6,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollList: {
    paddingBottom: 36,
  },
});
