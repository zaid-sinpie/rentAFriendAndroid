import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  daysCount?: number;
  unavailableDates?: string[];
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelectDate,
  daysCount = 14,
  unavailableDates = [],
}) => {
  const { colors, typography, borderRadius } = useTheme();

  // Generate next N days starting from tomorrow/today
  const days = Array.from({ length: daysCount }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() + index);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOfMonth = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const isUnavailable = unavailableDates.includes(dateStr);

    return {
      dateStr,
      dayOfWeek,
      dayOfMonth,
      month,
      isUnavailable,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <CalendarIcon size={16} color={colors.primary} />
          <Text style={[typography.captionMedium, { color: colors.text, marginLeft: 6 }]}>
            Available Dates
          </Text>
        </View>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          Next {daysCount} days
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((item) => {
          const isSelected = item.dateStr === selectedDate;

          return (
            <TouchableOpacity
              key={item.dateStr}
              activeOpacity={0.75}
              disabled={item.isUnavailable}
              onPress={() => onSelectDate(item.dateStr)}
              style={[
                styles.dayCard,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : item.isUnavailable
                    ? colors.surfaceSubtle
                    : colors.card,
                  borderColor: isSelected
                    ? colors.primary
                    : item.isUnavailable
                    ? colors.borderSubtle
                    : colors.border,
                  borderRadius: borderRadius.md,
                  opacity: item.isUnavailable ? 0.45 : 1,
                },
              ]}
            >
              <Text
                style={[
                  typography.small,
                  {
                    color: isSelected ? colors.white : colors.textSecondary,
                    textTransform: 'uppercase',
                  },
                ]}
              >
                {item.dayOfWeek}
              </Text>

              <Text
                style={[
                  typography.sectionTitle,
                  {
                    color: isSelected ? colors.white : colors.text,
                    marginVertical: 4,
                  },
                ]}
              >
                {item.dayOfMonth}
              </Text>

              <Text
                style={[
                  typography.small,
                  {
                    color: isSelected ? colors.white : colors.textMuted,
                  },
                ]}
              >
                {item.month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingVertical: 4,
    paddingRight: 10,
  },
  dayCard: {
    width: 68,
    height: 84,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});
