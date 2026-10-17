import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onValueChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onValueChange,
  style,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <View style={style}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.75}
            onPress={() => onValueChange(option.value)}
            style={[
              styles.optionItem,
              {
                backgroundColor: isSelected ? colors.surfaceSubtle : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <View
              style={[
                styles.outerCircle,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              {isSelected && (
                <View
                  style={[
                    styles.innerCircle,
                    {
                      backgroundColor: colors.primary,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                />
              )}
            </View>

            <View style={styles.content}>
              <View style={styles.titleRow}>
                <Text style={[typography.bodyMedium, { color: colors.text }]}>
                  {option.label}
                </Text>
                {option.badge && (
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: colors.primaryLight,
                        borderRadius: borderRadius.sm,
                      },
                    ]}
                  >
                    <Text style={[typography.small, { color: colors.primaryDark, fontWeight: '700' }]}>
                      {option.badge}
                    </Text>
                  </View>
                )}
              </View>

              {option.description && (
                <Text
                  style={[
                    typography.caption,
                    { color: colors.textSecondary, marginTop: 2 },
                  ]}
                >
                  {option.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.2,
    marginVertical: 5,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 10,
    height: 10,
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
