import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastProps {
  visible: boolean;
  type?: ToastType;
  title: string;
  message?: string;
  onDismiss: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  type = 'info',
  title,
  message,
  onDismiss,
  durationMs = 3500,
}) => {
  const { colors, typography, borderRadius, shadows } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onDismiss());
      }, durationMs);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, durationMs, onDismiss]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color={colors.success} />;
      case 'warning':
        return <AlertTriangle size={20} color={colors.warning} />;
      case 'error':
        return <AlertCircle size={20} color={colors.error} />;
      case 'info':
      default:
        return <Info size={20} color={colors.primary} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
      default:
        return colors.primary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastWrapper,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.toastCard,
          {
            backgroundColor: colors.card,
            borderLeftColor: getBorderColor(),
            borderRadius: borderRadius.md,
            ...shadows.elevated,
          },
        ]}
      >
        <View style={styles.iconContainer}>{getIcon()}</View>

        <View style={styles.textContainer}>
          <Text style={[typography.bodyMedium, { color: colors.text }]}>
            {title}
          </Text>
          {message && (
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              {message}
            </Text>
          )}
        </View>

        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
          <X size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderLeftWidth: 4,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
