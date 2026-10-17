import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { RadioGroup } from '../../components/ui/RadioGroup';
import { SearchFilterParams } from '../../types';

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: SearchFilterParams;
  onApplyFilters: (filters: SearchFilterParams) => void;
  onClearFilters: () => void;
}

const cityOptions = ['All Cities', 'Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad'];

const priceRanges = [
  { label: 'Any Price', min: undefined, max: undefined },
  { label: 'Under ₹600/hr', min: 0, max: 600 },
  { label: '₹600 - ₹800/hr', min: 600, max: 800 },
  { label: 'Above ₹800/hr', min: 800, max: 2000 },
];

const ratingOptions = [
  { label: 'All Ratings', value: 0 },
  { label: '4.8 ★ & above', value: 4.8 },
  { label: '4.9 ★ & above', value: 4.9 },
];

const sortOptions = [
  { value: 'recommended', label: 'Recommended & Active' },
  { value: 'rating', label: 'Highest Rated First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  const [city, setCity] = useState(filters.city || 'All Cities');
  const [minPrice, setMinPrice] = useState<number | undefined>(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(filters.maxPrice);
  const [minRating, setMinRating] = useState<number>(filters.minRating || 0);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState<boolean>(filters.isVerifiedOnly || false);
  const [sortBy, setSortBy] = useState<string>(filters.sortBy || 'recommended');

  const handleApply = () => {
    onApplyFilters({
      ...filters,
      city: city === 'All Cities' ? undefined : city,
      minPrice,
      maxPrice,
      minRating: minRating > 0 ? minRating : undefined,
      isVerifiedOnly,
      sortBy: sortBy as any,
    });
    onClose();
  };

  const handleClear = () => {
    setCity('All Cities');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinRating(0);
    setIsVerifiedOnly(false);
    setSortBy('recommended');
    onClearFilters();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Filter Companions"
      description="Refine companions by location, price, and rating."
      scrollable={false}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* City Filter */}
        <Text style={[typography.captionMedium, { color: colors.text, marginTop: 4, marginBottom: 8 }]}>
          Location
        </Text>
        <View style={styles.chipsRow}>
          {cityOptions.map((c) => {
            const isSelected = city === c;
            return (
              <TouchableOpacity
                key={c}
                activeOpacity={0.7}
                onPress={() => setCity(c)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.captionMedium,
                    { color: isSelected ? colors.primaryDark : colors.text },
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Hourly Price Range */}
        <Text style={[typography.captionMedium, { color: colors.text, marginTop: 16, marginBottom: 8 }]}>
          Hourly Rate (INR)
        </Text>
        <View style={styles.chipsRow}>
          {priceRanges.map((range, idx) => {
            const isSelected = minPrice === range.min && maxPrice === range.max;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => {
                  setMinPrice(range.min);
                  setMaxPrice(range.max);
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.captionMedium,
                    { color: isSelected ? colors.primaryDark : colors.text },
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Minimum Rating */}
        <Text style={[typography.captionMedium, { color: colors.text, marginTop: 16, marginBottom: 8 }]}>
          Minimum Rating
        </Text>
        <View style={styles.chipsRow}>
          {ratingOptions.map((r, idx) => {
            const isSelected = minRating === r.value;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => setMinRating(r.value)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.captionMedium,
                    { color: isSelected ? colors.primaryDark : colors.text },
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Verified Profiles Only Switch */}
        <View style={{ marginTop: 12 }}>
          <Switch
            label="Verified Companions Only"
            description="Show only companions with verified identity records"
            value={isVerifiedOnly}
            onValueChange={setIsVerifiedOnly}
          />
        </View>

        {/* Sort Options */}
        <Text style={[typography.captionMedium, { color: colors.text, marginTop: 16, marginBottom: 8 }]}>
          Sort By
        </Text>
        <RadioGroup
          options={sortOptions}
          value={sortBy}
          onValueChange={setSortBy}
        />

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button
            title="Reset All"
            onPress={handleClear}
            variant="outline"
            size="md"
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title="Apply Filters"
            onPress={handleApply}
            variant="primary"
            size="md"
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    maxHeight: 460,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 8,
  },
});
