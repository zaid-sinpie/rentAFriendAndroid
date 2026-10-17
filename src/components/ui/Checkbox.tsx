import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  style,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderRadius: borderRadius.xs,
            borderColor: checked ? colors.primary : colors.border,
            backgroundColor: checked ? colors.primary : 'transparent',
          },
        ]}
      >
        {checked && <Check size={14} color={colors.white} strokeWidth={3} />}
      </View>

      {(label || description) && (
        <View style={styles.textContainer}>
          {label && (
            <Text
              style={[
                typography.bodyMedium,
                { color: disabled ? colors.textMuted : colors.text },
              ]}
            >
              {label}
            </Text>
          )}
          {description && (
            <Text
              style={[
                typography.caption,
                { color: colors.textSecondary, marginTop: 2 },
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
});
