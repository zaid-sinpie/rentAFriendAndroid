import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface PriceDisplayProps {
  amount: number;
  period?: string;
  size?: 'sm' | 'md' | 'lg';
  showCurrencySymbol?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  period = '/hr',
  size = 'md',
  showCurrencySymbol = true,
}) => {
  const { colors, typography } = useTheme();

  const getAmountStyle = () => {
    switch (size) {
      case 'lg':
        return { fontSize: 24, lineHeight: 28, fontWeight: '700' as const };
      case 'sm':
        return { fontSize: 14, lineHeight: 18, fontWeight: '600' as const };
      case 'md':
      default:
        return { fontSize: 18, lineHeight: 22, fontWeight: '700' as const };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[getAmountStyle(), { color: colors.text }]}>
        {showCurrencySymbol ? '₹' : ''}
        {amount.toLocaleString('en-IN')}
      </Text>
      {period && (
        <Text
          style={[
            typography.caption,
            { color: colors.textSecondary, marginLeft: 2, marginBottom: 1 },
          ]}
        >
          {period}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
