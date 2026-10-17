import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriceBreakdown as PriceBreakdownType } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { Separator } from '../ui/Separator';

export interface PriceBreakdownProps {
  breakdown: PriceBreakdownType;
}

export const calculatePriceBreakdown = (
  hourlyRate: number,
  hours: number,
  discount: number = 0
): PriceBreakdownType => {
  const subtotal = hourlyRate * hours;
  const platformFee = Math.round(subtotal * 0.05); // 5% platform fee
  const taxes = Math.round((subtotal + platformFee) * 0.18); // 18% GST
  const total = Math.max(0, subtotal + platformFee + taxes - discount);

  return {
    hourlyRate,
    hours,
    subtotal,
    platformFee,
    taxes,
    discount,
    total,
  };
};

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ breakdown }) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[typography.captionMedium, { color: colors.text, marginBottom: 12 }]}>
        Price Breakdown
      </Text>

      {/* Hourly Rate x Hours */}
      <View style={styles.row}>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          ₹{breakdown.hourlyRate.toLocaleString('en-IN')} × {breakdown.hours}{' '}
          {breakdown.hours === 1 ? 'hour' : 'hours'}
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.text }]}>
          ₹{breakdown.subtotal.toLocaleString('en-IN')}
        </Text>
      </View>

      {/* Platform fee */}
      <View style={styles.row}>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          Platform service fee (5%)
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.text }]}>
          ₹{breakdown.platformFee.toLocaleString('en-IN')}
        </Text>
      </View>

      {/* Taxes */}
      <View style={styles.row}>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          Applicable GST (18%)
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.text }]}>
          ₹{breakdown.taxes.toLocaleString('en-IN')}
        </Text>
      </View>

      {/* Discount if present */}
      {breakdown.discount > 0 && (
        <View style={styles.row}>
          <Text style={[typography.body, { color: colors.success }]}>
            Promo / Discount
          </Text>
          <Text style={[typography.bodyMedium, { color: colors.success }]}>
            -₹{breakdown.discount.toLocaleString('en-IN')}
          </Text>
        </View>
      )}

      <Separator orientation="horizontal" style={{ marginVertical: 8 }} />

      {/* Total Amount */}
      <View style={styles.row}>
        <Text style={[typography.sectionTitle, { color: colors.text }]}>
          Total Amount
        </Text>
        <Text style={[typography.sectionTitle, { color: colors.primaryDark, fontSize: 20 }]}>
          ₹{breakdown.total.toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
});
