import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTheme } from '../../theme/ThemeContext';

export interface ConfirmationDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  loading = false,
}) => {
  const { colors, typography } = useTheme();

  return (
    <Modal visible={visible} onClose={onClose} title={title} scrollable={false}>
      <Text style={[typography.body, { color: colors.textSecondary, marginBottom: 20, lineHeight: 22 }]}>
        {message}
      </Text>

      <View style={styles.buttonRow}>
        <Button
          title={cancelLabel}
          onPress={onClose}
          variant="outline"
          size="md"
          style={styles.btn}
        />
        <Button
          title={confirmLabel}
          onPress={onConfirm}
          variant={isDestructive ? 'destructive' : 'primary'}
          size="md"
          loading={loading}
          style={[styles.btn, { marginLeft: 10 }]}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  btn: {
    minWidth: 100,
  },
});
