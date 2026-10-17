import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Heart, UserCheck, Shield, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { AppHeader } from '../../components/common/AppHeader';

export const CommunityGuidelinesScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { goBack } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Community Standards" showBack onBack={goBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[typography.pageTitle, { color: colors.text, marginTop: 4 }]}>
          Strictly Platonic & Respectful
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4, marginBottom: 20 }]}>
          Our platform is a social discovery community, not a dating service or adult entertainment platform.
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Heart size={20} color={colors.primary} />
            <Text style={[typography.sectionTitle, { color: colors.text, marginLeft: 8 }]}>
              Zero Tolerance for Solicitation
            </Text>
          </View>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 6, lineHeight: 20 }]}>
            Any attempt to solicit romantic or sexual advances, inappropriate touch, or illicit services will lead to immediate account termination and permanent device banning.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg, marginTop: 12 },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <UserCheck size={20} color={colors.success} />
            <Text style={[typography.sectionTitle, { color: colors.text, marginLeft: 8 }]}>
              Mutual Respect & Punctuality
            </Text>
          </View>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 6, lineHeight: 20 }]}>
            Respect your companion's boundaries and scheduled time. Arrive on time for agreed public outings and communicate promptly if delays occur.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg, marginTop: 12 },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Shield size={20} color={colors.primaryDark} />
            <Text style={[typography.sectionTitle, { color: colors.text, marginLeft: 8 }]}>
              Safe Reporting Mechanism
            </Text>
          </View>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 6, lineHeight: 20 }]}>
            Both clients and companions have the immediate right to leave any outing and file an in-app report if they ever feel uncomfortable or if platform guidelines are violated.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingBottom: 36,
  },
  card: {
    padding: 16,
    borderWidth: 1,
  },
});
