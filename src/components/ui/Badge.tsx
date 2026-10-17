import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
  icon,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'default':
        return colors.primary;
      case 'secondary':
        return colors.surfaceSubtle;
      case 'success':
        return colors.successLight;
      case 'warning':
        return colors.warningLight;
      case 'destructive':
        return colors.errorLight;
      case 'outline':
      default:
        return 'transparent';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'default':
        return colors.white;
      case 'secondary':
        return colors.text;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'destructive':
        return colors.error;
      case 'outline':
      default:
        return colors.text;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? colors.border : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          borderRadius: borderRadius.full,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[typography.small, { color: getTextColor(), fontWeight: '600' }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
});
