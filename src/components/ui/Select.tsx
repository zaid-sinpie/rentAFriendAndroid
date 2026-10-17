import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Modal } from './Modal';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange: (val: string) => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onValueChange,
  error,
  style,
}) => {
  const { colors, typography, borderRadius } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[typography.captionMedium, styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setIsOpen(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            borderRadius: borderRadius.md,
          },
        ]}
      >
        <Text
          style={[
            typography.body,
            { color: selectedOption ? colors.text : colors.textMuted },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {error && (
        <Text style={[typography.small, styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title={label || 'Select'}
        scrollable={options.length > 7}
      >
        <View style={styles.optionsList}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.7}
                onPress={() => {
                  onValueChange(opt.value);
                  setIsOpen(false);
                }}
                style={[
                  styles.optionRow,
                  {
                    backgroundColor: isSelected ? colors.surfaceSubtle : 'transparent',
                    borderRadius: borderRadius.sm,
                  },
                ]}
              >
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      typography.bodyMedium,
                      { color: isSelected ? colors.primaryDark : colors.text },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {opt.description && (
                    <Text
                      style={[
                        typography.caption,
                        { color: colors.textSecondary, marginTop: 2 },
                      ]}
                    >
                      {opt.description}
                    </Text>
                  )}
                </View>

                {isSelected && (
                  <Check size={18} color={colors.primary} strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.2,
  },
  errorText: {
    marginTop: 4,
  },
  optionsList: {
    paddingVertical: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 2,
  },
  optionTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
});
