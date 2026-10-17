import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeightPercent?: number;
  scrollable?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  description,
  children,
  footer,
  maxHeightPercent = 85,
  scrollable = false,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: colors.card,
                  borderTopLeftRadius: borderRadius.xl,
                  borderTopRightRadius: borderRadius.xl,
                  borderColor: colors.border,
                  maxHeight: `${maxHeightPercent}%`,
                },
              ]}
            >
              {/* Drag handle */}
              <View style={styles.handleContainer}>
                <View style={[styles.handle, { backgroundColor: colors.border }]} />
              </View>

              {/* Title & Close */}
              {(title || description) && (
                <View style={styles.header}>
                  <View style={styles.titleArea}>
                    {title && (
                      <Text style={[typography.sectionTitle, { color: colors.text }]}>
                        {title}
                      </Text>
                    )}
                    {description && (
                      <Text
                        style={[
                          typography.caption,
                          { color: colors.textSecondary, marginTop: 2 },
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

              {/* Content */}
              {scrollable ? (
                <ScrollView
                  style={styles.content}
                  contentContainerStyle={styles.contentContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {children}
                </ScrollView>
              ) : (
                <View style={styles.content}>
                  {children}
                </View>
              )}

              {/* Footer */}
              {footer && (
                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                  {footer}
                </View>
              )}

              <SafeAreaView />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    borderTopWidth: 1,
    paddingBottom: 10,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  titleArea: {
    flex: 1,
    paddingRight: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
});
