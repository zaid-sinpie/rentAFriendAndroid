import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { friendService } from '../../services/friends/friendService';
import { FriendProfile } from '../../types';
import { AppHeader } from '../../components/common/AppHeader';
import { FriendCard } from '../../components/friend/FriendCard';
import { EmptyState } from '../../components/common/EmptyState';

export const FavoritesScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const { favorites, goBack, navigateTo, toggleFavorite, isFavorite, setActiveTab } = useApp();

  const [favFriends, setFavFriends] = useState<FriendProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        setLoading(true);
        const all = await friendService.getFriends();
        const filtered = all.filter((f) => favorites.includes(f.id));
        setFavFriends(filtered);
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, [favorites]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Saved Favorites"
        subtitle={`${favorites.length} friends`}
        showBack
        onBack={goBack}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {favFriends.length === 0 ? (
          <EmptyState
            icon={<Heart size={32} color={colors.textSecondary} />}
            title="No favorites saved"
            description="Tap the heart icon on any companion profile to save them for quick access."
            actionTitle="Explore Companions"
            onActionPress={() => {
              setActiveTab('explore');
            }}
          />
        ) : (
          favFriends.map((friend) => (
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 36,
  },
});
