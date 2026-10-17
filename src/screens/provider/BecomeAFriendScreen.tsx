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
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Languages,
  Clock,
  MapPin,
  IndianRupee,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { AppHeader } from '../../components/common/AppHeader';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { InterestTag } from '../../components/friend/InterestTag';
import { standardActivities } from '../../components/booking/ActivitySelector';
import { Switch } from '../../components/ui/Switch';

const availableHobbies = [
  'Film Photography',
  'Specialty Coffee',
  'Heritage Walks',
  'Board Games',
  'Live Gigs',
  'Art & Painting',
  'Badminton & Sports',
  'Book Clubs',
  'Street Food Tours',
  'Pottery & Crafts',
  'City Cycling',
  'World Cinema',
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const BecomeAFriendScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { goBack, registerAsProvider } = useApp();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState('Rahul Kulkarni');
  const [city, setCity] = useState('Pune');
  const [bio, setBio] = useState('Enthusiastic explorer who loves local cafes, architecture, and photography.');
  const [languages, setLanguages] = useState('English, Hindi, Marathi');

  // Step 2
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([
    'Film Photography',
    'Specialty Coffee',
    'Heritage Walks',
  ]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'Coffee & Conversation',
    'Photography Walk',
    'Sightseeing & Culture',
  ]);

  // Step 3
  const [hourlyPrice, setHourlyPrice] = useState('650');
  const [minHours, setMinHours] = useState('1');
  const [maxHours, setMaxHours] = useState('5');
  const [serviceArea, setServiceArea] = useState('Koregaon Park, FC Road, Kalyani Nagar');

  // Step 4
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Friday',
    'Saturday',
    'Sunday',
  ]);
  const [startTime, setStartTime] = useState('11:00 AM');
  const [endTime, setEndTime] = useState('08:00 PM');

  // Step 5
  const [meetingPrefs, setMeetingPrefs] = useState('Public coffee shops, shopping plazas, and heritage parks.');

  // Step 6
  const [idConsent, setIdConsent] = useState(true);

  const toggleHobby = (h: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(h) ? prev.filter((item) => item !== h) : [...prev, h]
    );
  };

  const toggleActivity = (a: string) => {
    setSelectedActivities((prev) =>
      prev.includes(a) ? prev.filter((item) => item !== a) : [...prev, a]
    );
  };

  const toggleDay = (d: string) => {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await registerAsProvider({
      displayName,
      city,
      bio,
      hourlyPrice: parseInt(hourlyPrice, 10) || 600,
      activities: selectedActivities,
      interests: selectedHobbies,
      serviceArea,
    });
    setLoading(false);
  };

  const stepTitles = [
    'Basic Profile',
    'Hobbies & Activities',
    'Services & Pricing',
    'Weekly Availability',
    'Meeting Guidelines',
    'Verification & Safety',
    'Review & Submit',
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title={`Step ${step} of 7`}
        subtitle={stepTitles[step - 1]}
        showBack
        onBack={() => {
          if (step > 1) setStep(step - 1);
          else goBack();
        }}
      />

      {/* Progress Track */}
      <View style={[styles.progressTrack, { backgroundColor: colors.borderSubtle }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${(step / 7) * 100}%`,
            },
          ]}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* STEP 1: Basic Profile */}
          {step === 1 && (
            <View>
              <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 4 }]}>
                Tell clients about yourself
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 16 }]}>
                A clear introduction helps clients know if you share the same vibe.
              </Text>

              <Input
                label="Companion Display Name"
                value={displayName}
                onChangeText={setDisplayName}
              />

              <Input
                label="City"
                value={city}
                onChangeText={setCity}
              />

              <Input
                label="Languages Spoken"
                value={languages}
                onChangeText={setLanguages}
                helperText="Separate by commas"
              />

              <Textarea
                label="Short Bio"
                value={bio}
                onChangeText={setBio}
                minHeight={100}
                placeholder="Share your interests, personality, and preferred kinds of outings..."
              />
            </View>
          )}

          {/* STEP 2: Hobbies & Activities */}
          {step === 2 && (
            <View>
              <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 4 }]}>
                What do you enjoy doing?
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 16 }]}>
                Select the activities you want to offer companionship for.
              </Text>

              <Text style={[typography.captionMedium, { color: colors.text, marginBottom: 8 }]}>
                Offered Activities ({selectedActivities.length})
              </Text>
              <View style={styles.tagsContainer}>
                {standardActivities.map((act) => {
                  const isSelected = selectedActivities.includes(act.title);
                  return (
                    <InterestTag
                      key={act.id}
                      label={act.title}
                      selected={isSelected}
                      onPress={() => toggleActivity(act.title)}
                    />
                  );
                })}
              </View>

              <Text style={[typography.captionMedium, { color: colors.text, marginTop: 16, marginBottom: 8 }]}>
                Personal Hobbies ({selectedHobbies.length})
              </Text>
              <View style={styles.tagsContainer}>
                {availableHobbies.map((h) => {
                  const isSelected = selectedHobbies.includes(h);
                  return (
                    <InterestTag
                      key={h}
                      label={h}
                      selected={isSelected}
                      onPress={() => toggleHobby(h)}
                    />
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 3: Pricing & Services */}
          {step === 3 && (
            <View>
              <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 4 }]}>
                Set your hourly pricing
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 16 }]}>
                Companions typically charge between ₹400 and ₹1,000 per hour.
              </Text>

              <Input
                label="Hourly Rate (INR ₹)"
                value={hourlyPrice}
                onChangeText={setHourlyPrice}
                keyboardType="numeric"
                leftIcon={<IndianRupee size={16} color={colors.textSecondary} />}
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Input
                    label="Min Duration (hrs)"
                    value={minHours}
                    onChangeText={setMinHours}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Input
                    label="Max Duration (hrs)"
                    value={maxHours}
                    onChangeText={setMaxHours}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Input
                label="Neighborhoods & Service Area"
                value={serviceArea}
                onChangeText={setServiceArea}
                placeholder="e.g. Koregaon Park, FC Road, Aundh"
              />
            </View>
          )}

          {/* STEP 4: Availability */}
          {step === 4 && (
            <View>
              <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 4 }]}>
                When are you free?
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 16 }]}>
                Clients can only request bookings during your chosen active days.
              </Text>

              <Text style={[typography.captionMedium, { color: colors.text, marginBottom: 8 }]}>
                Available Days of the Week
              </Text>
              <View style={styles.tagsContainer}>
                {daysOfWeek.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <InterestTag
                      key={day}
                      label={day}
                      selected={isSelected}
                      onPress={() => toggleDay(day)}
                    />
                  );
                })}
              </View>

              <View style={[styles.row, { marginTop: 12 }]}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Input
                    label="Earliest Start Time"
                    value={startTime}
                    onChangeText={setStartTime}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Input
                    label="Latest End Time"
                    value={endTime}
                    onChangeText={setEndTime}
                  />
                </View>
              </View>
            </View>
          )}

          {/* STEP 5: Meeting Preferences */}
          {step === 5 && (
            <View>
              <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 4 }]}>
                Public Meeting Preferences
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 16 }]}>
                Establish your safety boundaries and preferred public environments.
              </Text>

              <View
                style={[
                  styles.safetyInfoBox,
                  { backgroundColor: colors.successLight, borderColor: colors.success, borderRadius: borderRadius.md },
                ]}
              >
                <ShieldCheck size={20} color={colors.success} style={{ marginRight: 8, marginTop: 1 }} />
                <Text style={[typography.caption, { color: colors.success, flex: 1, lineHeight: 18 }]}>
                  Platform Policy: Never meet clients at private residences, hotel rooms, or secluded areas.
                </Text>
              </View>

              <Textarea
                label="Preferred Public Spots"
                value={meetingPrefs}
                onChangeText={setMeetingPrefs}
                minHeight={90}
                placeholder="e.g. Well-lit cafes, popular bookstores, shopping malls..."
              />
            </View>
          )}

          {/* STEP 6: Verification & Safety */}
          {step === 6 && (
            <View>
              <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 4 }]}>
                Trust & Verification
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 16 }]}>
                In prototype mode, verification workflow is simulated.
              </Text>

              <View
                style={[
                  styles.verificationCard,
                  { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
                ]}
              >
                <CheckCircle2 size={24} color={colors.primary} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700' }]}>
                    Government ID Verification
                  </Text>
                  <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                    Aadhaar / Voter ID check (Simulated for development prototype).
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 16 }}>
                <Switch
                  label="Community Code of Conduct"
                  description="I agree to uphold respectful, strictly platonic companion behavior at all public outings."
                  value={idConsent}
                  onValueChange={setIdConsent}
                />
              </View>
            </View>
          )}

          {/* STEP 7: Review & Submit */}
          {step === 7 && (
            <View>
              <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 4 }]}>
                Review Your Companion Profile
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 16 }]}>
                Check your details before publishing.
              </Text>

              <View
                style={[
                  styles.summaryBox,
                  { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
                ]}
              >
                <Text style={[typography.sectionTitle, { color: colors.text }]}>{displayName}</Text>
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                  {city} • ₹{hourlyPrice}/hr
                </Text>

                <Text style={[typography.body, { color: colors.text, marginTop: 12, fontSize: 13.5 }]}>
                  {bio}
                </Text>

                <View style={[styles.summaryDivider, { backgroundColor: colors.borderSubtle }]} />

                <Text style={[typography.small, { color: colors.textSecondary, fontWeight: '700' }]}>
                  OFFERED ACTIVITIES:
                </Text>
                <Text style={[typography.caption, { color: colors.text, marginTop: 2 }]}>
                  {selectedActivities.join(', ')}
                </Text>

                <Text style={[typography.small, { color: colors.textSecondary, fontWeight: '700', marginTop: 10 }]}>
                  ACTIVE DAYS:
                </Text>
                <Text style={[typography.caption, { color: colors.text, marginTop: 2 }]}>
                  {selectedDays.join(', ')} ({startTime} - {endTime})
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Navigation */}
        <View
          style={[
            styles.footerBar,
            { backgroundColor: colors.card, borderTopColor: colors.border },
          ]}
        >
          <Button
            title={step === 1 ? 'Cancel' : 'Back'}
            onPress={() => {
              if (step > 1) setStep(step - 1);
              else goBack();
            }}
            variant="outline"
            size="md"
            style={{ minWidth: 90 }}
          />

          <Button
            title={step === 7 ? 'Submit Companion Profile' : 'Continue'}
            onPress={handleNext}
            loading={loading}
            variant="primary"
            size="md"
            style={{ minWidth: 160 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    paddingVertical: 16,
    paddingBottom: 90,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
  },
  safetyInfoBox: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
  },
  summaryBox: {
    padding: 16,
    borderWidth: 1,
  },
  summaryDivider: {
    height: 1,
    marginVertical: 12,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
});
