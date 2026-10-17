export type AccountStatus = 'active' | 'suspended' | 'pending';
export type VerificationStatus = 'verified' | 'unverified' | 'pending_verification';
export type ProfileStatus = 'draft' | 'submitted' | 'pending_review' | 'active' | 'inactive' | 'rejected';

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  profilePhoto?: string;
  city: string;
  accountStatus: AccountStatus;
  hasFriendProfile: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FriendProfile {
  id: string;
  userId: string;
  displayName: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  hobbies: string[];
  activities: string[];
  languages: string[];
  hourlyRate: number;
  minimumDuration: number; // in hours
  maximumDuration: number; // in hours
  serviceArea: string;
  meetingPreferences: string;
  averageRating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  profileStatus: ProfileStatus;
  avatarUrl: string;
  galleryPhotos: string[];
  memberSince: string;
  responseRate: string;
  travelWillingness: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // e.g. "10:00 AM"
  endTime: string;   // e.g. "12:00 PM"
  isAvailable: boolean;
}

export interface DaySchedule {
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  dayName: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  slots: string[];
}

export interface AvailabilityCalendarDay {
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
  slots: string[];
}

export type BookingStatus =
  | 'draft'
  | 'pending_confirmation'
  | 'awaiting_payment'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'payment_failed'
  | 'refund_pending'
  | 'refunded';

export type PaymentStatus =
  | 'unpaid'
  | 'awaiting_payment'
  | 'simulated_paid'
  | 'paid'
  | 'failed'
  | 'refund_pending'
  | 'refunded';

export interface PriceBreakdown {
  hourlyRate: number;
  hours: number;
  subtotal: number;
  platformFee: number;
  taxes: number;
  discount: number;
  total: number;
}

export interface MeetingLocation {
  name: string;
  address: string;
  landmark?: string;
  city: string;
  isPublicPlace: boolean;
  notes?: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  friendHourlyRate: number;
  activity: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledStart: string; // e.g. "03:00 PM"
  scheduledEnd: string;   // e.g. "05:00 PM"
  durationHours: number;
  meetingLocation: MeetingLocation;
  clientNotes?: string;
  priceBreakdown: PriceBreakdown;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  cancellationPolicy: string;
  cancellationReason?: string;
  isReviewed?: boolean;
  createdAt: string;
}

export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet';

export interface PaymentOption {
  id: PaymentMethodType;
  title: string;
  subtitle: string;
  iconName: string;
  isPopular?: boolean;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  provider: PaymentMethodType;
  providerPaymentId: string;
  amount: number;
  currency: 'INR';
  paymentStatus: PaymentStatus;
  isSimulated: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  friendId: string;
  rating: number;
  comment: string;
  activityName: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  friendId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  bookingRefId?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantCity: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

export type NotificationType =
  | 'booking_request'
  | 'booking_accepted'
  | 'booking_declined'
  | 'payment_update'
  | 'upcoming_booking'
  | 'cancellation_update'
  | 'review_reminder'
  | 'account_update';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  targetScreen?: string;
  targetId?: string;
}

export interface SearchFilterParams {
  query?: string;
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  language?: string;
  isVerifiedOnly?: boolean;
  sortBy?: 'recommended' | 'rating' | 'price_low' | 'price_high';
}
