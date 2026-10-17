import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Smartphone, CreditCard, Landmark, Wallet, CheckCircle2 } from 'lucide-react-native';
import { PaymentOption, PaymentMethodType } from '../../types';
import { useTheme } from '../../theme/ThemeContext';

export interface PaymentMethodItemProps {
  option: PaymentOption;
  isSelected: boolean;
  onSelect: (id: PaymentMethodType) => void;
}

export const standardPaymentOptions: PaymentOption[] = [
  {
    id: 'upi',
    title: 'UPI (GPay / PhonePe / Paytm / BHIM)',
    subtitle: 'Fast, secure bank transfer with zero extra charges',
    iconName: 'upi',
    isPopular: true,
  },
  {
    id: 'card',
    title: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, RuPay, Diners Club',
    iconName: 'card',
  },
  {
    id: 'netbanking',
    title: 'Net Banking',
    subtitle: 'All major Indian banks supported',
    iconName: 'netbanking',
  },
  {
    id: 'wallet',
    title: 'Wallets',
    subtitle: 'Paytm, Amazon Pay, MobiKwik',
    iconName: 'wallet',
  },
];

export const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  const getIcon = () => {
    const iconColor = isSelected ? colors.primaryDark : colors.textSecondary;
    const size = 20;

    switch (option.iconName) {
      case 'upi':
        return <Smartphone size={size} color={iconColor} />;
      case 'card':
        return <CreditCard size={size} color={iconColor} />;
      case 'netbanking':
        return <Landmark size={size} color={iconColor} />;
      case 'wallet':
      default:
        return <Wallet size={size} color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onSelect(option.id)}
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? colors.primaryLight : colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
          borderRadius: borderRadius.md,
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isSelected ? colors.card : colors.surfaceSubtle,
            borderRadius: borderRadius.full,
          },
        ]}
      >
        {getIcon()}
      </View>

      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text
            style={[
              typography.bodyMedium,
              {
                color: isSelected ? colors.primaryDark : colors.text,
                fontWeight: isSelected ? '700' : '600',
              },
            ]}
          >
            {option.title}
          </Text>
          {option.isPopular && (
            <View
              style={[
                styles.popularBadge,
                { backgroundColor: colors.successLight, borderRadius: borderRadius.xs },
              ]}
            >
              <Text style={[typography.small, { color: colors.success, fontSize: 10, fontWeight: '700' }]}>
                RECOMMENDED
              </Text>
            </View>
          )}
        </View>

        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
          {option.subtitle}
        </Text>
      </View>

      <View style={styles.selectionIndicator}>
        {isSelected ? (
          <CheckCircle2 size={20} color={colors.primary} />
        ) : (
          <View style={[styles.emptyCircle, { borderColor: colors.border }]} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1.2,
    marginVertical: 6,
  },
  iconCircle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  popularBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  selectionIndicator: {
    marginLeft: 4,
  },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
});
