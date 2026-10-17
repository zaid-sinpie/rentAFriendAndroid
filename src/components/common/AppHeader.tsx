import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  style,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }, style]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={[styles.backButton, { backgroundColor: colors.surfaceSubtle }]}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          {title && (
            <Text
              numberOfLines={1}
              style={[typography.sectionTitle, { color: colors.text }]}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              numberOfLines={1}
              style={[typography.caption, { color: colors.textSecondary }]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightAction && <View style={styles.rightContainer}>{rightAction}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
});
