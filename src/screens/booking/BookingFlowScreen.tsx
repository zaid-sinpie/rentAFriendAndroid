import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { friendService } from '../../services/friends/friendService';
import { bookingService } from '../../services/bookings/bookingService';
import { paymentService } from '../../services/payments/paymentService';
import { FriendProfile, MeetingLocation, PaymentMethodType, Booking } from '../../types';
import { AppHeader } from '../../components/common/AppHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { DatePicker } from '../../components/ui/DatePicker';
import { TimePicker } from '../../components/ui/TimePicker';
import { ActivitySelector } from '../../components/booking/ActivitySelector';
import { DurationSelector, calculateEndTime } from '../../components/booking/DurationSelector';
import { LocationSelector } from '../../components/booking/LocationSelector';
import { PriceBreakdown, calculatePriceBreakdown } from '../../components/booking/PriceBreakdown';
import { PaymentMethodItem, standardPaymentOptions } from '../../components/booking/PaymentMethodItem';
import { mockLocations } from '../../mocks/mockLocations';

export const BookingFlowScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { selectedFriendId, goBack, navigateTo, showToast, refreshBookings } = useApp();

  const [friend, setFriend] = useState<FriendProfile | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Booking Form State
  const [activity, setActivity] = useState<string>('Coffee & Conversation');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStartTime, setSelectedStartTime] = useState<string>('03:00 PM');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [meetingLocation, setMeetingLocation] = useState<MeetingLocation | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Load friend profile
  useEffect(() => {
    const fetch = async () => {
      if (!selectedFriendId) return;
      try {
        setLoading(true);
        const f = await friendService.getFriendById(selectedFriendId);
        if (f) {
          setFriend(f);
          if (f.activities.length > 0) {
            setActivity(f.activities[0]);
          }
          // Default location for the city
          const defaultLocs = mockLocations[f.city] || mockLocations.Pune;
          if (defaultLocs.length > 0) {
            setMeetingLocation(defaultLocs[0]);
          }
        }
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    };
    fetch();

    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, [selectedFriendId]);

  if (!friend) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AppHeader title="Book Companion" showBack onBack={goBack} />
        <View style={styles.loadingCenter}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Loading companion availability...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const calculatedEnd = calculateEndTime(selectedStartTime, durationHours);
  const pricing = calculatePriceBreakdown(friend.hourlyRate, durationHours);

  // Step Validation & Handlers
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!activity;
      case 2:
        return !!selectedDate;
      case 3:
        return !!selectedStartTime;
      case 4:
        return durationHours >= friend.minimumDuration && durationHours <= friend.maximumDuration;
      case 5:
        return !!meetingLocation && !!meetingLocation.name;
      case 6:
        return true; // Review step
      case 7:
        return !!paymentMethod;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 7) {
      handleFinalizeBooking();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      goBack();
    }
  };

  const handleFinalizeBooking = async () => {
    if (!meetingLocation) return;
    setSubmitting(true);

    try {
      // 1. Process simulated payment
      const paymentRes = await paymentService.processPayment({
        bookingId: `pending_${Date.now()}`,
        amount: pricing.total,
        provider: paymentMethod,
      });

      // 2. Create confirmed booking record
      const newBk = await bookingService.createBooking({
        friendId: friend.id,
        friendName: friend.displayName,
        friendAvatar: friend.avatarUrl,
        friendHourlyRate: friend.hourlyRate,
        activity,
        scheduledDate: selectedDate,
        scheduledStart: selectedStartTime,
        scheduledEnd: calculatedEnd,
        durationHours,
        meetingLocation,
        clientNotes: clientNotes.trim() || undefined,
        priceBreakdown: pricing,
        paymentMethod: paymentMethod.toUpperCase(),
      });

      await refreshBookings();
      setConfirmedBooking(newBk);
      setCurrentStep(8); // Confirmation step
      showToast('Booking Successful!', `Your outing with ${friend.displayName} is confirmed`, 'success');
    } catch {
      showToast('Booking Failed', 'Unable to complete booking. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = [
    'Choose Activity',
    'Select Date',
    'Start Time',
    'Duration',
    'Meeting Location',
    'Review Summary',
    'Payment Method',
    'Confirmed',
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title={currentStep === 8 ? 'Booking Confirmed' : `Step ${currentStep} of 7`}
        subtitle={stepTitles[currentStep - 1]}
        showBack={currentStep < 8}
        onBack={handlePrevStep}
      />

      {/* Progress Bar (Steps 1 to 7) */}
      {currentStep <= 7 && (
        <View style={[styles.progressTrack, { backgroundColor: colors.borderSubtle }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${(currentStep / 7) * 100}%`,
              },
            ]}
          />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Companion Mini Header (Sticky Context) */}
          {currentStep <= 7 && (
            <View
              style={[
                styles.companionBanner,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
              ]}
            >
              <Avatar source={friend.avatarUrl} name={friend.displayName} size={42} />
              <View style={styles.companionBannerInfo}>
                <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700' }]}>
                  {friend.displayName}
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  ₹{friend.hourlyRate}/hr • {friend.city}
                </Text>
              </View>
            </View>
          )}

          {/* STEP 1: Activity Selection */}
          {currentStep === 1 && (
            <View>
              <ActivitySelector
                availableActivities={friend.activities}
                selectedActivity={activity}
                onSelectActivity={setActivity}
              />

              <Input
                label="Special Plan Note (Optional)"
                placeholder="e.g. Want to focus on architectural photography"
                value={clientNotes}
                onChangeText={setClientNotes}
                style={{ marginTop: 8 }}
              />
            </View>
          )}

          {/* STEP 2: Date Selection */}
          {currentStep === 2 && (
            <View>
              <DatePicker
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                daysCount={14}
              />
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 12 }]}>
                Selected Outing Date: <Text style={{ fontWeight: '700', color: colors.text }}>{selectedDate}</Text>
              </Text>
            </View>
          )}

          {/* STEP 3: Start Time Selection */}
          {currentStep === 3 && (
            <View>
              <TimePicker
                selectedTime={selectedStartTime}
                onSelectTime={setSelectedStartTime}
              />
            </View>
          )}

          {/* STEP 4: Duration Selection */}
          {currentStep === 4 && (
            <View>
              <DurationSelector
                selectedDuration={durationHours}
                onSelectDuration={setDurationHours}
                minDuration={friend.minimumDuration}
                maxDuration={friend.maximumDuration}
                startTime={selectedStartTime}
              />
            </View>
          )}

          {/* STEP 5: Meeting Location Selection */}
          {currentStep === 5 && (
            <View>
              <LocationSelector
                city={friend.city}
                selectedLocation={meetingLocation}
                onSelectLocation={setMeetingLocation}
              />
            </View>
          )}

          {/* STEP 6: Review Booking Summary */}
          {currentStep === 6 && (
            <View>
              <View
                style={[
                  styles.reviewCard,
                  { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
                ]}
              >
                <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
                  Booking Details
                </Text>

                <View style={styles.reviewDetailRow}>
                  <Calendar size={16} color={colors.primary} />
                  <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 8 }]}>Date:</Text>
                  <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 'auto' }]}>
                    {selectedDate}
                  </Text>
                </View>

                <View style={styles.reviewDetailRow}>
                  <Clock size={16} color={colors.primary} />
                  <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 8 }]}>Time Window:</Text>
                  <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 'auto' }]}>
                    {selectedStartTime} - {calculatedEnd} ({durationHours}h)
                  </Text>
                </View>

                <View style={styles.reviewDetailRow}>
                  <MapPin size={16} color={colors.primary} />
                  <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 8 }]}>Venue:</Text>
                  <Text
                    numberOfLines={1}
                    style={[typography.bodyMedium, { color: colors.text, marginLeft: 'auto', maxWidth: '60%' }]}
                  >
                    {meetingLocation?.name}
                  </Text>
                </View>

                {clientNotes ? (
                  <View style={{ marginTop: 8 }}>
                    <Text style={[typography.small, { color: colors.textSecondary }]}>Notes:</Text>
                    <Text style={[typography.caption, { color: colors.text, marginTop: 2 }]}>
                      {clientNotes}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Price Breakdown */}
              <View
                style={[
                  styles.reviewCard,
                  { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg, marginTop: 12 },
                ]}
              >
                <PriceBreakdown breakdown={pricing} />
              </View>

              {/* Cancellation Policy Box */}
              <View
                style={[
                  styles.cancellationBox,
                  { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.md },
                ]}
              >
                <ShieldCheck size={18} color={colors.success} style={{ marginRight: 8, marginTop: 1 }} />
                <Text style={[typography.caption, { color: colors.textSecondary, flex: 1, lineHeight: 18 }]}>
                  Cancellation Policy: Full refund if cancelled at least 6 hours before start time.
                </Text>
              </View>
            </View>
          )}

          {/* STEP 7: Payment Method */}
          {currentStep === 7 && (
            <View>
              {/* Simulation Notice Banner */}
              <View
                style={[
                  styles.simulatedNotice,
                  { backgroundColor: colors.warningLight, borderColor: colors.warning, borderRadius: borderRadius.md },
                ]}
              >
                <AlertCircle size={20} color={colors.warning} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[typography.captionMedium, { color: colors.warning, fontWeight: '700' }]}>
                    Prototype Payment Mode
                  </Text>
                  <Text style={[typography.caption, { color: colors.text, marginTop: 2, lineHeight: 17 }]}>
                    All payments are simulated in demo mode. No real money or bank deduction will take place.
                  </Text>
                </View>
              </View>

              <Text style={[typography.captionMedium, { color: colors.text, marginBottom: 8, marginTop: 8 }]}>
                Select Payment Method
              </Text>

              {standardPaymentOptions.map((opt) => (
                <PaymentMethodItem
                  key={opt.id}
                  option={opt}
                  isSelected={paymentMethod === opt.id}
                  onSelect={setPaymentMethod}
                />
              ))}

              <View
                style={[
                  styles.paySummaryBox,
                  { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md, marginTop: 16 },
                ]}
              >
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Payable Amount</Text>
                <Text style={[typography.pageTitle, { color: colors.primaryDark, marginTop: 2 }]}>
                  ₹{pricing.total.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          )}

          {/* STEP 8: Confirmation Screen */}
          {currentStep === 8 && confirmedBooking && (
            <View style={styles.confirmationContainer}>
              <View style={[styles.successIconCircle, { backgroundColor: colors.successLight }]}>
                <CheckCircle2 size={48} color={colors.success} strokeWidth={2.4} />
              </View>

              <Text style={[typography.pageTitle, { color: colors.text, textAlign: 'center', marginTop: 16 }]}>
                Booking Confirmed!
              </Text>
              <Text
                style={[
                  typography.captionMedium,
                  { color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
                ]}
              >
                Booking Ref: <Text style={{ fontWeight: '700', color: colors.text }}>{confirmedBooking.bookingReference}</Text>
              </Text>

              <View
                style={[
                  styles.confirmSummaryCard,
                  { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
                ]}
              >
                <View style={styles.confirmHeader}>
                  <Avatar source={confirmedBooking.friendAvatar} name={confirmedBooking.friendName} size={48} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={[typography.sectionTitle, { color: colors.text }]}>
                      {confirmedBooking.friendName}
                    </Text>
                    <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
                      {confirmedBooking.activity}
                    </Text>
                  </View>
                </View>

                <View style={styles.confirmRow}>
                  <Calendar size={16} color={colors.textSecondary} />
                  <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 8 }]}>
                    {confirmedBooking.scheduledDate}
                  </Text>
                </View>

                <View style={styles.confirmRow}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 8 }]}>
                    {confirmedBooking.scheduledStart} - {confirmedBooking.scheduledEnd} ({confirmedBooking.durationHours} hours)
                  </Text>
                </View>

                <View style={styles.confirmRow}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 8, flex: 1 }]}>
                    {confirmedBooking.meetingLocation.name}, {confirmedBooking.meetingLocation.city}
                  </Text>
                </View>

                <View style={[styles.paymentStatusRow, { borderTopColor: colors.borderSubtle }]}>
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>Status:</Text>
                  <Text style={[typography.captionMedium, { color: colors.success, fontWeight: '700' }]}>
                    Confirmed & Paid (Demo)
                  </Text>
                </View>
              </View>

              <Button
                title="View in Bookings"
                onPress={() => {
                  navigateTo('main');
                  // small timeout to switch tab to Bookings
                }}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: 20 }}
              />

              <Button
                title="Explore More Companions"
                onPress={() => navigateTo('main')}
                variant="outline"
                size="md"
                fullWidth
                style={{ marginTop: 10 }}
              />
            </View>
          )}
        </ScrollView>

        {/* Step Navigation Bar */}
        {currentStep <= 7 && (
          <View
            style={[
              styles.navFooter,
              { backgroundColor: colors.card, borderTopColor: colors.border },
            ]}
          >
            <Button
              title={currentStep === 1 ? 'Cancel' : 'Back'}
              onPress={handlePrevStep}
              variant="outline"
              size="md"
              style={{ minWidth: 90 }}
            />

            <Button
              title={currentStep === 7 ? `Pay ₹${pricing.total.toLocaleString('en-IN')}` : 'Continue'}
              onPress={handleNextStep}
              disabled={!canProceed()}
              loading={submitting}
              variant="primary"
              size="md"
              style={{ minWidth: 160 }}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTrack: {
    height: 4,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 90,
  },
  companionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  companionBannerInfo: {
    marginLeft: 12,
  },
  reviewCard: {
    padding: 16,
    borderWidth: 1,
  },
  reviewDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  cancellationBox: {
    flexDirection: 'row',
    padding: 12,
    marginTop: 12,
  },
  simulatedNotice: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  paySummaryBox: {
    padding: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  navFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmSummaryCard: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    marginTop: 20,
  },
  confirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  paymentStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
  },
});
