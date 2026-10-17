import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  activeFilterCount?: number;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search by name, hobby, activity...',
  onFilterPress,
  activeFilterCount = 0,
  onClear,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
          },
        ]}
      >
        <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, typography.body, { color: colors.text }]}
        />

        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              onChangeText('');
              if (onClear) onClear();
            }}
            style={styles.clearBtn}
          >
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onFilterPress}
          style={[
            styles.filterBtn,
            {
              backgroundColor: activeFilterCount > 0 ? colors.primaryLight : colors.surface,
              borderColor: activeFilterCount > 0 ? colors.primary : colors.border,
              borderRadius: borderRadius.lg,
            },
          ]}
        >
          <SlidersHorizontal
            size={18}
            color={activeFilterCount > 0 ? colors.primaryDark : colors.text}
          />
          {activeFilterCount > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: colors.primary }]}>
              <Text style={[typography.small, { color: colors.white, fontSize: 10, fontWeight: '700' }]}>
                {activeFilterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    height: 48,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 4,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
});
