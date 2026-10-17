import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { UserCheck, Sparkles, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { Button } from '../../components/ui/Button';
import { AppHeader } from '../../components/common/AppHeader';

export const RoleIntroScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { navigateTo } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Account Setup" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[typography.pageTitle, { color: colors.text, marginTop: 8 }]}>
          One account, dual capabilities.
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 6, marginBottom: 24 }]}>
          With Rent a Friend, you can book companions or offer companionship from the same verified profile.
        </Text>

        {/* Client Mode Card */}
        <View
          style={[
            styles.roleCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <UserCheck size={24} color={colors.primaryDark} />
          </View>
          <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 12 }]}>
            Book Companions (Client)
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 6 }]}>
            Discover verified friends for coffee, food exploring, board games, museum walks, and social outings.
          </Text>
          <Button
            title="Browse Friends Now"
            onPress={() => navigateTo('main')}
            variant="primary"
            size="md"
            style={{ marginTop: 16 }}
          />
        </View>

        {/* Provider Mode Card */}
        <View
          style={[
            styles.roleCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg, marginTop: 16 },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.successLight }]}>
            <Sparkles size={24} color={colors.success} />
          </View>
          <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 12 }]}>
            Become a Companion (Friend)
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 6 }]}>
            Earn by sharing your time, local knowledge, and hobbies with others in safe, public settings.
          </Text>
          <Button
            title="Register as a Friend"
            onPress={() => navigateTo('become_friend')}
            variant="outline"
            size="md"
            style={{ marginTop: 16 }}
          />
        </View>

        <View style={styles.footerNote}>
          <ShieldCheck size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <Text style={[typography.caption, { color: colors.textSecondary, flex: 1 }]}>
            You can toggle or activate your companion profile anytime from the Profile tab.
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
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  roleCard: {
    padding: 20,
    borderWidth: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
});
