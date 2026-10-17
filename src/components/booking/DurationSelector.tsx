import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Timer, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface DurationSelectorProps {
  selectedDuration: number; // in hours
  onSelectDuration: (hours: number) => void;
  minDuration?: number;
  maxDuration?: number;
  startTime?: string; // e.g. "03:00 PM"
}

export const calculateEndTime = (start: string, durationHours: number): string => {
  if (!start) return '';
  const match = start.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '';

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();

  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  let endHours = (hours + durationHours) % 24;
  const endAmpm = endHours >= 12 ? 'PM' : 'AM';
  let displayHours = endHours % 12;
  if (displayHours === 0) displayHours = 12;

  const paddedHours = displayHours < 10 ? `0${displayHours}` : `${displayHours}`;
  return `${paddedHours}:${minutes} ${endAmpm}`;
};

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  selectedDuration,
  onSelectDuration,
  minDuration = 1,
  maxDuration = 5,
  startTime,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  const durations = Array.from(
    { length: maxDuration - minDuration + 1 },
    (_, i) => minDuration + i
  );

  const calculatedEnd = startTime ? calculateEndTime(startTime, selectedDuration) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Timer size={16} color={colors.primary} />
        <Text style={[typography.captionMedium, { color: colors.text, marginLeft: 6 }]}>
          Booking Duration
        </Text>
      </View>

      <View style={styles.buttonsRow}>
        {durations.map((hrs) => {
          const isSelected = hrs === selectedDuration;

          return (
            <TouchableOpacity
              key={hrs}
              activeOpacity={0.75}
              onPress={() => onSelectDuration(hrs)}
              style={[
                styles.durationBtn,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <Text
                style={[
                  typography.bodyMedium,
                  {
                    color: isSelected ? colors.white : colors.text,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {startTime && calculatedEnd && (
        <View
          style={[
            styles.timeSummary,
            { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.md },
          ]}
        >
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            Estimated Time Window:
          </Text>
          <View style={styles.timeWindowRow}>
            <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700' }]}>
              {startTime}
            </Text>
            <ArrowRight size={14} color={colors.primary} style={{ marginHorizontal: 6 }} />
            <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700' }]}>
              {calculatedEnd}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 6 }]}>
              ({selectedDuration} {selectedDuration === 1 ? 'hr' : 'hrs'})
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  durationBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.2,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSummary: {
    marginTop: 12,
    padding: 12,
  },
  timeWindowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});
