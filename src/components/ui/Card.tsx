import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  bordered = true,
}) => {
  const { colors, borderRadius, shadows } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: bordered ? 1 : 0,
    borderColor: colors.border,
    padding: 16,
    ...shadows.card,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

export const CardHeader: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => <View style={[styles.header, style]}>{children}</View>;

export const CardTitle: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => {
  const { colors, typography } = useTheme();
  return (
    <Text style={[typography.sectionTitle, { color: colors.text }, style]}>
      {children}
    </Text>
  );
};

export const CardDescription: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  const { colors, typography } = useTheme();
  return (
    <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }, style]}>
      {children}
    </Text>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => <View style={[styles.content, style]}>{children}</View>;

export const CardFooter: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => <View style={[styles.footer, style]}>{children}</View>;

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },
  content: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
