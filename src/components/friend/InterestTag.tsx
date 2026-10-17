import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface InterestTagProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
}

export const InterestTag: React.FC<InterestTagProps> = ({
  label,
  selected = false,
  onPress,
  icon,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.tag,
        {
          backgroundColor: selected ? colors.primaryLight : colors.surfaceSubtle,
          borderColor: selected ? colors.primary : colors.borderSubtle,
          borderRadius: borderRadius.full,
        },
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          typography.small,
          {
            color: selected ? colors.primaryDark : colors.text,
            fontWeight: selected ? '700' : '500',
          },
        ]}
      >
        {label}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
});
