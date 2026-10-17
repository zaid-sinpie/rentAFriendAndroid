import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface LabelProps extends TextProps {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ children, required, style, ...props }) => {
  const { colors, typography } = useTheme();

  return (
    <Text style={[typography.captionMedium, styles.label, { color: colors.text }, style]} {...props}>
      {children}
      {required && <Text style={{ color: colors.error }}> *</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
  },
});
