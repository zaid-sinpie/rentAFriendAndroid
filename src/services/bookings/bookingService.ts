import { Booking, BookingStatus, PriceBreakdown, MeetingLocation } from '../../types';
import { mockBookings } from '../../mocks/mockBookings';
import { simulateNetworkDelay } from '../api/apiClient';

class BookingService {
  private bookings: Booking[] = [...mockBookings];

  async getBookings(type?: 'upcoming' | 'past' | 'cancelled'): Promise<Booking[]> {
    await simulateNetworkDelay(300);

    if (type === 'upcoming') {
      return this.bookings.filter(
        (b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending_confirmation'
      );
    }
    if (type === 'past') {
      return this.bookings.filter((b) => b.bookingStatus === 'completed');
    }
    if (type === 'cancelled') {
      return this.bookings.filter((b) => b.bookingStatus === 'cancelled');
    }

    return [...this.bookings];
  }

  async getBookingById(id: string): Promise<Booking | null> {
    await simulateNetworkDelay(200);
    const booking = this.bookings.find((b) => b.id === id);
    return booking || null;
  }

  async createBooking(payload: {
    friendId: string;
    friendName: string;
    friendAvatar: string;
    friendHourlyRate: number;
    activity: string;
    scheduledDate: string;
    scheduledStart: string;
    scheduledEnd: string;
    durationHours: number;
    meetingLocation: MeetingLocation;
    clientNotes?: string;
    priceBreakdown: PriceBreakdown;
    paymentMethod: string;
  }): Promise<Booking> {
    await simulateNetworkDelay(600);

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      bookingReference: `RAF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: 'user_current',
      clientName: 'Rahul Kulkarni',
      clientPhone: '+91 98765 43210',
      friendId: payload.friendId,
      friendName: payload.friendName,
      friendAvatar: payload.friendAvatar,
      friendHourlyRate: payload.friendHourlyRate,
      activity: payload.activity,
      scheduledDate: payload.scheduledDate,
      scheduledStart: payload.scheduledStart,
      scheduledEnd: payload.scheduledEnd,
      durationHours: payload.durationHours,
      meetingLocation: payload.meetingLocation,
      clientNotes: payload.clientNotes,
      priceBreakdown: payload.priceBreakdown,
      totalAmount: payload.priceBreakdown.total,
      bookingStatus: 'confirmed',
      paymentStatus: 'simulated_paid',
      paymentMethod: payload.paymentMethod,
      cancellationPolicy: 'Free cancellation up to 6 hours before meeting.',
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);
    return newBooking;
  }

  async cancelBooking(id: string, reason: string): Promise<{ success: boolean; booking?: Booking }> {
    await simulateNetworkDelay(500);

    const bookingIndex = this.bookings.findIndex((b) => b.id === id);
    if (bookingIndex === -1) {
      return { success: false };
    }

    const updated: Booking = {
      ...this.bookings[bookingIndex],
      bookingStatus: 'cancelled',
      paymentStatus: 'refunded',
      cancellationReason: reason,
    };

    this.bookings[bookingIndex] = updated;
    return { success: true, booking: updated };
  }

  async markAsReviewed(bookingId: string): Promise<void> {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.isReviewed = true;
    }
  }
}

export const bookingService = new BookingService();
