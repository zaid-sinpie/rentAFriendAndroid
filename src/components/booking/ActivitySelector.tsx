import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Coffee,
  Utensils,
  Film,
  ShoppingBag,
  Compass,
  Activity as FitnessIcon,
  Gamepad2,
  Camera,
  Calendar,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface ActivityOption {
  id: string;
  title: string;
  iconName: string;
}

export const standardActivities: ActivityOption[] = [
  { id: 'Coffee & Conversation', title: 'Coffee & Conversation', iconName: 'coffee' },
  { id: 'Food & Dining', title: 'Food & Dining', iconName: 'dining' },
  { id: 'Sightseeing & Culture', title: 'Sightseeing & Culture', iconName: 'compass' },
  { id: 'Movies & Theatre', title: 'Movies & Theatre', iconName: 'film' },
  { id: 'Shopping & Styling', title: 'Shopping & Styling', iconName: 'shopping' },
  { id: 'Sports & Fitness', title: 'Sports & Fitness', iconName: 'fitness' },
  { id: 'Gaming & Arcades', title: 'Gaming & Arcades', iconName: 'game' },
  { id: 'Photography Walk', title: 'Photography Walk', iconName: 'camera' },
  { id: 'Events & Social Outings', title: 'Events & Social Outings', iconName: 'event' },
  { id: 'Learning a Hobby', title: 'Learning a Hobby', iconName: 'hobby' },
];

export interface ActivitySelectorProps {
  availableActivities?: string[];
  selectedActivity?: string;
  onSelectActivity: (activity: string) => void;
}

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  availableActivities,
  selectedActivity,
  onSelectActivity,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  const activities = availableActivities
    ? standardActivities.filter((a) => availableActivities.includes(a.id))
    : standardActivities;

  const getActivityIcon = (iconName: string, isSelected: boolean) => {
    const iconColor = isSelected ? colors.primaryDark : colors.textSecondary;
    const size = 18;

    switch (iconName) {
      case 'coffee':
        return <Coffee size={size} color={iconColor} />;
      case 'dining':
        return <Utensils size={size} color={iconColor} />;
      case 'compass':
        return <Compass size={size} color={iconColor} />;
      case 'film':
        return <Film size={size} color={iconColor} />;
      case 'shopping':
        return <ShoppingBag size={size} color={iconColor} />;
      case 'fitness':
        return <FitnessIcon size={size} color={iconColor} />;
      case 'game':
        return <Gamepad2 size={size} color={iconColor} />;
      case 'camera':
        return <Camera size={size} color={iconColor} />;
      case 'event':
        return <Calendar size={size} color={iconColor} />;
      case 'hobby':
      default:
        return <Sparkles size={size} color={iconColor} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.captionMedium, { color: colors.text, marginBottom: 10 }]}>
        Choose Companion Activity
      </Text>

      <View style={styles.grid}>
        {activities.map((item) => {
          const isSelected = item.id === selectedActivity;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => onSelectActivity(item.id)}
              style={[
                styles.itemCard,
                {
                  backgroundColor: isSelected ? colors.primaryLight : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <View style={styles.icon}>{getActivityIcon(item.iconName, isSelected)}</View>
              <Text
                style={[
                  typography.captionMedium,
                  {
                    color: isSelected ? colors.primaryDark : colors.text,
                    fontWeight: isSelected ? '700' : '500',
                    textAlign: 'center',
                  },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  itemCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    margin: '1.5%',
    borderWidth: 1.2,
  },
  icon: {
    marginRight: 8,
  },
});
