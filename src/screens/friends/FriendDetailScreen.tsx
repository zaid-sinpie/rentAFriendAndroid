import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import {
  Heart,
  Share2,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  Languages,
  Calendar,
  AlertTriangle,
  Flag,
  UserX,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { friendService } from '../../services/friends/friendService';
import { reviewService } from '../../services/reviews/reviewService';
import { FriendProfile, Review } from '../../types';
import { AppHeader } from '../../components/common/AppHeader';
import { RatingDisplay } from '../../components/common/RatingDisplay';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { InterestTag } from '../../components/friend/InterestTag';
import { Button } from '../../components/ui/Button';
import { Separator } from '../../components/ui/Separator';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

export const FriendDetailScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { selectedFriendId, goBack, navigateTo, toggleFavorite, isFavorite, showToast } = useApp();

  const [friend, setFriend] = useState<FriendProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Safety dialog states
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!selectedFriendId) return;
      try {
        setLoading(true);
        const data = await friendService.getFriendById(selectedFriendId);
        setFriend(data);
        const revs = await reviewService.getReviewsForFriend(selectedFriendId);
        setReviews(revs);
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [selectedFriendId]);

  if (!friend) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AppHeader title="Friend Profile" showBack onBack={goBack} />
        <View style={styles.loadingContainer}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Loading companion profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${friend.displayName}'s companion profile on Rent a Friend! Specializing in ${friend.interests.slice(0, 3).join(', ')}.`,
      });
    } catch {
      // ignore
    }
  };

  const handleReport = () => {
    setReportModalVisible(false);
    showToast('Report Submitted', 'Thank you. Our safety trust team will inspect this profile.', 'info');
  };

  const handleBlock = () => {
    setBlockModalVisible(false);
    showToast('User Blocked', `${friend.displayName} will no longer appear in your feed.`, 'info');
    goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title={friend.displayName}
        showBack
        onBack={goBack}
        rightAction={
          <View style={styles.headerIconsRow}>
            <TouchableOpacity onPress={handleShare} style={styles.headerIconBtn}>
              <Share2 size={20} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleFavorite(friend.id)}
              style={styles.headerIconBtn}
            >
              <Heart
                size={20}
                color={isFavorite(friend.id) ? colors.error : colors.text}
                fill={isFavorite(friend.id) ? colors.error : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Photograph Banner */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: friend.avatarUrl }}
            style={[styles.profileImage, { backgroundColor: colors.surfaceSubtle }]}
          />
        </View>

        {/* Basic Info */}
        <View style={styles.infoCard}>
          <View style={styles.nameHeaderRow}>
            <Text style={[typography.pageTitle, { color: colors.text }]}>
              {friend.displayName}, {friend.age}
            </Text>

            {friend.verificationStatus === 'verified' && (
              <View
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: colors.successLight, borderRadius: borderRadius.full },
                ]}
              >
                <CheckCircle2 size={14} color={colors.success} />
                <Text style={[typography.small, { color: colors.success, marginLeft: 4, fontWeight: '700' }]}>
                  Verified Companion
                </Text>
              </View>
            )}
          </View>

          {/* Location & Response Rate */}
          <View style={styles.metaRow}>
            <MapPin size={15} color={colors.primary} />
            <Text style={[typography.captionMedium, { color: colors.text, marginLeft: 5 }]}>
              {friend.city} ({friend.serviceArea})
            </Text>
          </View>

          <View style={[styles.metaRow, { marginTop: 4 }]}>
            <Clock size={15} color={colors.textSecondary} />
            <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 5 }]}>
              Typical reply: {friend.responseRate} • Member since {friend.memberSince}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <RatingDisplay rating={friend.averageRating} reviewCount={friend.reviewCount} size="md" />
          </View>

          <Separator orientation="horizontal" />

          {/* Biography */}
          <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 6 }]}>
            About {friend.displayName.split(' ')[0]}
          </Text>
          <Text style={[typography.body, { color: colors.text, lineHeight: 22 }]}>
            {friend.bio}
          </Text>

          {/* Spoken Languages */}
          <View style={[styles.languagesBox, { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.md }]}>
            <Languages size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[typography.captionMedium, { color: colors.text, flex: 1 }]}>
              Languages: {friend.languages.join(', ')}
            </Text>
          </View>

          <Separator orientation="horizontal" />

          {/* Hobbies & Interests */}
          <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 8 }]}>
            Hobbies & Interests
          </Text>
          <View style={styles.tagsWrapper}>
            {friend.interests.map((interest, i) => (
              <InterestTag key={i} label={interest} />
            ))}
            {friend.hobbies.map((hobby, i) => (
              <InterestTag key={`h_${i}`} label={hobby} />
            ))}
          </View>

          <Separator orientation="horizontal" />

          {/* Services & Companion Outings */}
          <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 8 }]}>
            Available Activities
          </Text>
          <View style={styles.tagsWrapper}>
            {friend.activities.map((activity, i) => (
              <InterestTag key={`act_${i}`} label={activity} selected />
            ))}
          </View>

          <Separator orientation="horizontal" />

          {/* Meeting & Travel Preferences */}
          <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 8 }]}>
            Meeting & Safety Rules
          </Text>
          <View
            style={[
              styles.safetyNotice,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderRadius: borderRadius.md },
            ]}
          >
            <ShieldCheck size={20} color={colors.success} style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={[typography.captionMedium, { color: colors.text }]}>
                Public Venues Only
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2, lineHeight: 18 }]}>
                {friend.meetingPreferences}
              </Text>
              <Text style={[typography.small, { color: colors.textMuted, marginTop: 4 }]}>
                Travel willingness: {friend.travelWillingness}
              </Text>
            </View>
          </View>

          <Separator orientation="horizontal" />

          {/* Reviews Section */}
          <View style={styles.reviewsHeaderRow}>
            <Text style={[typography.sectionTitle, { color: colors.text }]}>
              Client Reviews ({reviews.length})
            </Text>
            <RatingDisplay rating={friend.averageRating} size="sm" />
          </View>

          {reviews.length === 0 ? (
            <Text style={[typography.caption, { color: colors.textSecondary, fontStyle: 'italic', marginVertical: 8 }]}>
              No written reviews yet. Be the first to book and share feedback!
            </Text>
          ) : (
            reviews.map((rev) => (
              <View
                key={rev.id}
                style={[
                  styles.reviewItem,
                  { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.md },
                ]}
              >
                <View style={styles.reviewUserRow}>
                  <Text style={[typography.captionMedium, { color: colors.text, fontWeight: '700' }]}>
                    {rev.reviewerName}
                  </Text>
                  <RatingDisplay rating={rev.rating} size="sm" />
                </View>
                <Text style={[typography.small, { color: colors.primary, marginTop: 2 }]}>
                  Activity: {rev.activityName}
                </Text>
                <Text style={[typography.body, { color: colors.text, marginTop: 6, fontSize: 13.5 }]}>
                  "{rev.comment}"
                </Text>
              </View>
            ))
          )}

          {/* Report & Block Options */}
          <View style={styles.safetyActionButtons}>
            <TouchableOpacity
              onPress={() => setReportModalVisible(true)}
              style={styles.safetyLink}
            >
              <Flag size={14} color={colors.error} style={{ marginRight: 4 }} />
              <Text style={[typography.small, { color: colors.error }]}>Report Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setBlockModalVisible(true)}
              style={styles.safetyLink}
            >
              <UserX size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={[typography.small, { color: colors.textSecondary }]}>Block User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Bottom Booking CTA */}
      <View
        style={[
          styles.bottomCtaBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[typography.small, { color: colors.textSecondary }]}>Hourly Rate</Text>
          <PriceDisplay amount={friend.hourlyRate} period="/hr" size="lg" />
        </View>

        <Button
          title="Book Friend"
          onPress={() => navigateTo('booking_flow', { friendId: friend.id })}
          variant="primary"
          size="lg"
          style={{ minWidth: 160 }}
        />
      </View>

      {/* Report Modal Dialog */}
      <ConfirmationDialog
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onConfirm={handleReport}
        title="Report Profile"
        message="Are you sure you want to report this profile? Our safety trust team will immediately review community guideline compliance."
        confirmLabel="Submit Report"
        isDestructive
      />

      {/* Block Modal Dialog */}
      <ConfirmationDialog
        visible={blockModalVisible}
        onClose={() => setBlockModalVisible(false)}
        onConfirm={handleBlock}
        title="Block Companion"
        message="Blocking this user will prevent all mutual messaging and hide them from your search results."
        confirmLabel="Block User"
        isDestructive
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    padding: 6,
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 280,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingRow: {
    marginTop: 10,
  },
  languagesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 14,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  safetyNotice: {
    flexDirection: 'row',
    padding: 14,
    borderWidth: 1,
  },
  reviewsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewItem: {
    padding: 12,
    marginVertical: 6,
  },
  reviewUserRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safetyActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginBottom: 16,
  },
  safetyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  bottomCtaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    elevation: 10,
  },
});
