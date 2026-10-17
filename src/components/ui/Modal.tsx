import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  description,
  children,
  footer,
  scrollable = false,
}) => {
  const { colors, typography, borderRadius, shadows } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardView}
            >
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: borderRadius.xl,
                    ...shadows.elevated,
                  },
                ]}
              >
                {(title || description) && (
                  <View style={styles.header}>
                    <View style={styles.titleContainer}>
                      {title && (
                        <Text style={[typography.sectionTitle, { color: colors.text }]}>
                          {title}
                        </Text>
                      )}
                      {description && (
                        <Text
                          style={[
                            typography.caption,
                            { color: colors.textSecondary, marginTop: 4 },
                          ]}
                        >
                          {description}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={onClose}
                      style={[
                        styles.closeButton,
                        { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.full },
                      ]}
                    >
                      <X size={18} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                )}

                {scrollable ? (
                  <ScrollView
                    style={styles.scrollBody}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                  >
                    {children}
                  </ScrollView>
                ) : (
                  <View style={styles.body}>
                    {children}
                  </View>
                )}

                {footer && <View style={[styles.footer, { borderTopColor: colors.border }]}>{footer}</View>}
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keyboardView: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scrollBody: {
    maxHeight: 460,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
