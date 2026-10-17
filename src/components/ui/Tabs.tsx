import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface TabItem {
  id: string;
  label: string;
  badge?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'pill' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
  variant = 'pill',
}) => {
  const { colors, typography, borderRadius } = useTheme();

  if (variant === 'underline') {
    return (
      <View style={[styles.underlineContainer, { borderBottomColor: colors.border }, style]}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.75}
              onPress={() => onTabChange(tab.id)}
              style={[
                styles.underlineTab,
                { borderBottomColor: isActive ? colors.primary : 'transparent' },
              ]}
            >
              <Text
                style={[
                  typography.bodyMedium,
                  {
                    color: isActive ? colors.primary : colors.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
              {tab.badge !== undefined && tab.badge > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    { backgroundColor: isActive ? colors.primary : colors.surfaceSubtle },
                  ]}
                >
                  <Text
                    style={[
                      typography.small,
                      { color: isActive ? colors.white : colors.textSecondary },
                    ]}
                  >
                    {tab.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.pillContainer,
        {
          backgroundColor: colors.surfaceSubtle,
          borderRadius: borderRadius.md,
        },
        style,
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.75}
            onPress={() => onTabChange(tab.id)}
            style={[
              styles.pillTab,
              {
                backgroundColor: isActive ? colors.card : 'transparent',
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Text
              style={[
                typography.captionMedium,
                {
                  color: isActive ? colors.text : colors.textSecondary,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
            {tab.badge !== undefined && tab.badge > 0 && (
              <View
                style={[
                  styles.tabBadge,
                  { backgroundColor: isActive ? colors.primaryLight : colors.border },
                ]}
              >
                <Text
                  style={[
                    typography.small,
                    { color: isActive ? colors.primaryDark : colors.textMuted },
                  ]}
                >
                  {tab.badge}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: 16,
  },
  pillTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  underlineContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  underlineTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
});
