import { Review } from '../../types';
import { mockReviews } from '../../mocks/mockReviews';
import { simulateNetworkDelay } from '../api/apiClient';

class ReviewService {
  private reviews: Review[] = [...mockReviews];

  async getReviewsForFriend(friendId: string): Promise<Review[]> {
    await simulateNetworkDelay(250);
    return this.reviews.filter((r) => r.friendId === friendId);
  }

  async submitReview(params: {
    bookingId: string;
    friendId: string;
    rating: number;
    comment: string;
    activityName: string;
  }): Promise<Review> {
    await simulateNetworkDelay(500);

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      bookingId: params.bookingId,
      reviewerId: 'user_current',
      reviewerName: 'Rahul K.',
      friendId: params.friendId,
      rating: params.rating,
      comment: params.comment,
      activityName: params.activityName,
      createdAt: new Date().toISOString(),
    };

    this.reviews.unshift(newReview);
    return newReview;
  }
}

export const reviewService = new ReviewService();
