import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Label } from './Label';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  helperText,
  children,
  style,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.fieldContainer, style]}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {error ? (
        <Text style={[typography.small, styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={[typography.small, styles.helperText, { color: colors.textMuted }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  errorText: {
    marginTop: 4,
  },
  helperText: {
    marginTop: 4,
  },
});
