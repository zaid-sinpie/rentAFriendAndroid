import { FriendProfile, SearchFilterParams } from '../../types';
import { mockFriends } from '../../mocks/mockFriends';
import { simulateNetworkDelay } from '../api/apiClient';

class FriendService {
  private friends: FriendProfile[] = [...mockFriends];

  async getFriends(params?: SearchFilterParams): Promise<FriendProfile[]> {
    await simulateNetworkDelay(350);

    let results = [...this.friends];

    if (!params) return results;

    const { query, city, category, minPrice, maxPrice, minRating, isVerifiedOnly, sortBy } = params;

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter((friend) => {
        const inName = friend.displayName.toLowerCase().includes(q);
        const inBio = friend.bio.toLowerCase().includes(q);
        const inCity = friend.city.toLowerCase().includes(q);
        const inInterests = friend.interests.some((i) => i.toLowerCase().includes(q));
        const inHobbies = friend.hobbies.some((h) => h.toLowerCase().includes(q));
        const inActivities = friend.activities.some((a) => a.toLowerCase().includes(q));
        return inName || inBio || inCity || inInterests || inHobbies || inActivities;
      });
    }

    if (city && city !== 'All Cities') {
      results = results.filter((friend) => friend.city.toLowerCase() === city.toLowerCase());
    }

    if (category && category !== 'All') {
      results = results.filter((friend) =>
        friend.activities.some((a) => a.toLowerCase() === category.toLowerCase())
      );
    }

    if (minPrice !== undefined) {
      results = results.filter((friend) => friend.hourlyRate >= minPrice);
    }

    if (maxPrice !== undefined) {
      results = results.filter((friend) => friend.hourlyRate <= maxPrice);
    }

    if (minRating !== undefined && minRating > 0) {
      results = results.filter((friend) => friend.averageRating >= minRating);
    }

    if (isVerifiedOnly) {
      results = results.filter((friend) => friend.verificationStatus === 'verified');
    }

    if (sortBy) {
      switch (sortBy) {
        case 'rating':
          results.sort((a, b) => b.averageRating - a.averageRating);
          break;
        case 'price_low':
          results.sort((a, b) => a.hourlyRate - b.hourlyRate);
          break;
        case 'price_high':
          results.sort((a, b) => b.hourlyRate - a.hourlyRate);
          break;
        case 'recommended':
        default:
          results.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }

    return results;
  }

  async getFriendById(id: string): Promise<FriendProfile | null> {
    await simulateNetworkDelay(250);
    const friend = this.friends.find((f) => f.id === id);
    return friend || null;
  }

  async registerFriendProfile(profile: Omit<FriendProfile, 'id' | 'userId' | 'averageRating' | 'reviewCount'>): Promise<FriendProfile> {
    await simulateNetworkDelay(700);

    const newFriend: FriendProfile = {
      ...profile,
      id: `friend_${Date.now()}`,
      userId: 'user_current',
      averageRating: 5.0,
      reviewCount: 0,
      verificationStatus: 'pending_verification',
      profileStatus: 'submitted',
    };

    this.friends.unshift(newFriend);
    return newFriend;
  }
}

export const friendService = new FriendService();
