import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FolderSearch } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionTitle?: string;
  onActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionTitle,
  onActionPress,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.surfaceSubtle,
            borderRadius: borderRadius.full,
          },
        ]}
      >
        {icon || <FolderSearch size={32} color={colors.textSecondary} />}
      </View>

      <Text style={[typography.sectionTitle, { color: colors.text, textAlign: 'center' }]}>
        {title}
      </Text>

      <Text
        style={[
          typography.body,
          {
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 6,
            marginBottom: 20,
            maxWidth: 280,
          },
        ]}
      >
        {description}
      </Text>

      {actionTitle && onActionPress && (
        <Button
          title={actionTitle}
          onPress={onActionPress}
          variant="outline"
          size="md"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
});
