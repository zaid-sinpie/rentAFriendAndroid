import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Clock, Check } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { AppHeader } from '../../components/common/AppHeader';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Input } from '../../components/ui/Input';

interface DayConfig {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

export const ManageAvailabilityScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { goBack, showToast } = useApp();

  const [schedule, setSchedule] = useState<DayConfig[]>([
    { day: 'Monday', enabled: false, start: '10:00 AM', end: '07:00 PM' },
    { day: 'Tuesday', enabled: false, start: '10:00 AM', end: '07:00 PM' },
    { day: 'Wednesday', enabled: false, start: '10:00 AM', end: '07:00 PM' },
    { day: 'Thursday', enabled: false, start: '10:00 AM', end: '07:00 PM' },
    { day: 'Friday', enabled: true, start: '11:00 AM', end: '08:00 PM' },
    { day: 'Saturday', enabled: true, start: '10:00 AM', end: '09:00 PM' },
    { day: 'Sunday', enabled: true, start: '10:00 AM', end: '08:00 PM' },
  ]);

  const toggleDay = (index: number) => {
    setSchedule((prev) => {
      const copy = [...prev];
      copy[index].enabled = !copy[index].enabled;
      return copy;
    });
  };

  const handleSave = () => {
    showToast('Schedule Updated', 'Your companion working hours have been saved', 'success');
    goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Manage Availability" showBack onBack={goBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[typography.sectionTitle, { color: colors.text, marginBottom: 4 }]}>
          Weekly Working Hours
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 16 }]}>
          Toggle days you are available to receive companion booking requests.
        </Text>

        {schedule.map((item, index) => (
          <View
            key={item.day}
            style={[
              styles.dayCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
            ]}
          >
            <Switch
              label={item.day}
              value={item.enabled}
              onValueChange={() => toggleDay(index)}
            />

            {item.enabled && (
              <View style={[styles.timeRow, { borderTopColor: colors.borderSubtle }]}>
                <Clock size={15} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {item.start} to {item.end}
                </Text>
              </View>
            )}
          </View>
        ))}

        <Button
          title="Save Weekly Schedule"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 36,
  },
  dayCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
  },
});
