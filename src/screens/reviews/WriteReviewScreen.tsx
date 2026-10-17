import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { reviewService } from '../../services/reviews/reviewService';
import { bookingService } from '../../services/bookings/bookingService';
import { AppHeader } from '../../components/common/AppHeader';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

export const WriteReviewScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { selectedBookingId, selectedFriendId, goBack, showToast, refreshBookings } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError('Please write a short review sharing your experience.');
      return;
    }

    setLoading(true);
    try {
      await reviewService.submitReview({
        bookingId: selectedBookingId || 'bk_103',
        friendId: selectedFriendId || 'friend_4',
        rating,
        comment: comment.trim(),
        activityName: 'Coffee & Conversation',
      });

      if (selectedBookingId) {
        await bookingService.markAsReviewed(selectedBookingId);
      }

      await refreshBookings();
      setLoading(false);
      showToast('Review Submitted', 'Thank you for your constructive community feedback!', 'success');
      goBack();
    } catch {
      setLoading(false);
      showToast('Submission Failed', 'Please try again', 'error');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Rate Companion Outing" showBack onBack={goBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 8 }]}>
            How was your outing experience?
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4, marginBottom: 20 }]}>
            Your rating and comments help other community members find trusted companions.
          </Text>

          {/* Star Rating Selector */}
          <View
            style={[
              styles.starsBox,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
            ]}
          >
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  activeOpacity={0.7}
                  onPress={() => setRating(star)}
                  style={styles.starBtn}
                >
                  <Star
                    size={36}
                    color="#E5A93C"
                    fill={star <= rating ? '#E5A93C' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[typography.captionMedium, { color: colors.text, marginTop: 10 }]}>
              {rating === 5
                ? '5.0 - Exceptional Companion'
                : rating === 4
                ? '4.0 - Very Good'
                : rating === 3
                ? '3.0 - Average'
                : 'Could be better'}
            </Text>
          </View>

          {/* Written Feedback */}
          <Textarea
            label="Your Review"
            value={comment}
            onChangeText={(txt) => {
              setComment(txt);
              if (error) setError('');
            }}
            placeholder="Share details about punctuality, friendliness, conversation, and outing venue..."
            minHeight={120}
            error={error}
          />

          <Button
            title="Submit Review"
            onPress={handleSubmit}
            loading={loading}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginTop: 16 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  starsBox: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starBtn: {
    padding: 6,
  },
});
