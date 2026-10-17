import React from 'react';
import { Switch as RNSwitch, View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface SwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  description,
  disabled,
  style,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, style]}>
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

      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.surfaceSubtle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
});
