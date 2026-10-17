import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface TimeSlotOption {
  time: string;
  isAvailable: boolean;
}

export interface TimePickerProps {
  slots?: TimeSlotOption[];
  selectedTime?: string;
  onSelectTime: (time: string) => void;
}

const defaultSlots: TimeSlotOption[] = [
  { time: '10:00 AM', isAvailable: true },
  { time: '11:00 AM', isAvailable: true },
  { time: '12:00 PM', isAvailable: false },
  { time: '01:00 PM', isAvailable: true },
  { time: '02:00 PM', isAvailable: true },
  { time: '03:00 PM', isAvailable: true },
  { time: '04:00 PM', isAvailable: true },
  { time: '05:00 PM', isAvailable: true },
  { time: '06:00 PM', isAvailable: false },
  { time: '07:00 PM', isAvailable: true },
  { time: '08:00 PM', isAvailable: true },
];

export const TimePicker: React.FC<TimePickerProps> = ({
  slots = defaultSlots,
  selectedTime,
  onSelectTime,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock size={16} color={colors.primary} />
        <Text style={[typography.captionMedium, { color: colors.text, marginLeft: 6 }]}>
          Select Start Time
        </Text>
      </View>

      <View style={styles.grid}>
        {slots.map((item) => {
          const isSelected = item.time === selectedTime;

          return (
            <TouchableOpacity
              key={item.time}
              activeOpacity={0.75}
              disabled={!item.isAvailable}
              onPress={() => onSelectTime(item.time)}
              style={[
                styles.slotButton,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : item.isAvailable
                    ? colors.card
                    : colors.surfaceSubtle,
                  borderColor: isSelected
                    ? colors.primary
                    : item.isAvailable
                    ? colors.border
                    : colors.borderSubtle,
                  borderRadius: borderRadius.md,
                  opacity: item.isAvailable ? 1 : 0.45,
                },
              ]}
            >
              <Text
                style={[
                  typography.captionMedium,
                  {
                    color: isSelected
                      ? colors.white
                      : item.isAvailable
                      ? colors.text
                      : colors.textMuted,
                  },
                ]}
              >
                {item.time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  slotButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 84,
  },
});
