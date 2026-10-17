import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { MapPin, ShieldCheck, Check } from 'lucide-react-native';
import { MeetingLocation } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { mockLocations } from '../../mocks/mockLocations';

export interface LocationSelectorProps {
  city: string;
  selectedLocation?: MeetingLocation;
  onSelectLocation: (location: MeetingLocation) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  city,
  selectedLocation,
  onSelectLocation,
}) => {
  const { colors, typography, borderRadius } = useTheme();
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAddress, setCustomAddress] = useState('');

  const citySpots = mockLocations[city] || mockLocations.Pune;

  const handleCustomApply = () => {
    if (customName.trim() && customAddress.trim()) {
      onSelectLocation({
        name: customName.trim(),
        address: customAddress.trim(),
        city,
        isPublicPlace: true,
        notes: 'Custom public meeting location specified by client.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MapPin size={16} color={colors.primary} />
        <Text style={[typography.captionMedium, { color: colors.text, marginLeft: 6 }]}>
          Meeting Location in {city}
        </Text>
      </View>

      {/* Safety Banner */}
      <View
        style={[
          styles.safetyBanner,
          {
            backgroundColor: colors.successLight,
            borderColor: colors.success,
            borderRadius: borderRadius.md,
          },
        ]}
      >
        <ShieldCheck size={18} color={colors.success} style={{ marginRight: 8, marginTop: 1 }} />
        <Text style={[typography.caption, { color: colors.success, flex: 1, lineHeight: 18 }]}>
          For safety and trust, all companion meetings must take place at verified public venues (cafes, malls, or public places). Private residences are not permitted.
        </Text>
      </View>

      {/* Preset Public Places */}
      <Text style={[typography.captionMedium, { color: colors.textSecondary, marginBottom: 8 }]}>
        Popular Public Meeting Venues
      </Text>

      {citySpots.map((spot) => {
        const isSelected = !isCustom && selectedLocation?.name === spot.name;

        return (
          <TouchableOpacity
            key={spot.name}
            activeOpacity={0.75}
            onPress={() => {
              setIsCustom(false);
              onSelectLocation(spot);
            }}
            style={[
              styles.locationCard,
              {
                backgroundColor: isSelected ? colors.primaryLight : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <View style={styles.locationTextContainer}>
              <Text
                style={[
                  typography.bodyMedium,
                  {
                    color: isSelected ? colors.primaryDark : colors.text,
                    fontWeight: isSelected ? '700' : '600',
                  },
                ]}
              >
                {spot.name}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                {spot.address}
              </Text>
              {spot.notes && (
                <Text style={[typography.small, { color: colors.textMuted, marginTop: 3 }]}>
                  {spot.notes}
                </Text>
              )}
            </View>

            {isSelected && <Check size={18} color={colors.primary} strokeWidth={2.5} />}
          </TouchableOpacity>
        );
      })}

      {/* Custom Public Address Option */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setIsCustom(true)}
        style={[
          styles.customToggle,
          {
            backgroundColor: isCustom ? colors.surfaceSubtle : 'transparent',
            borderColor: colors.border,
            borderRadius: borderRadius.md,
          },
        ]}
      >
        <Text style={[typography.captionMedium, { color: colors.primary }]}>
          + Specify Another Public Spot in {city}
        </Text>
      </TouchableOpacity>

      {isCustom && (
        <View
          style={[
            styles.customForm,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Text style={[typography.caption, { color: colors.text, marginBottom: 4 }]}>
            Public Place Name (e.g., Starbucks, Phoenix Mall)
          </Text>
          <TextInput
            placeholder="Place name"
            placeholderTextColor={colors.textMuted}
            value={customName}
            onChangeText={setCustomName}
            style={[
              styles.input,
              typography.body,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.sm,
                color: colors.text,
              },
            ]}
          />

          <Text style={[typography.caption, { color: colors.text, marginTop: 8, marginBottom: 4 }]}>
            Street Address & Landmark
          </Text>
          <TextInput
            placeholder="Address and landmark"
            placeholderTextColor={colors.textMuted}
            value={customAddress}
            onChangeText={setCustomAddress}
            style={[
              styles.input,
              typography.body,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.sm,
                color: colors.text,
              },
            ]}
          />

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleCustomApply}
            style={[
              styles.applyBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Text style={[typography.button, { color: colors.white, fontSize: 13 }]}>
              Use This Location
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  safetyBanner: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1.2,
    marginBottom: 8,
  },
  locationTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  customToggle: {
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: 4,
  },
  customForm: {
    marginTop: 10,
    padding: 14,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  applyBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
});
