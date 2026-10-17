import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Users2, Compass, HeartHandshake, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { Button } from '../../components/ui/Button';

export const WelcomeScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { navigateTo } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Brand Icon */}
        <View
          style={[
            styles.brandIconWrapper,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: borderRadius.xl,
            },
          ]}
        >
          <Users2 size={36} color={colors.primary} strokeWidth={2.2} />
        </View>

        {/* Tagline */}
        <Text style={[typography.hero, { color: colors.text, textAlign: 'center', marginTop: 24 }]}>
          Good company makes every plan better.
        </Text>

        <Text
          style={[
            typography.body,
            {
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: 12,
              lineHeight: 22,
              maxWidth: 320,
            },
          ]}
        >
          Find a companion who shares your interests, explore somewhere new, or make your next outing more enjoyable.
        </Text>

        {/* Trust Points */}
        <View style={styles.featuresContainer}>
          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
            ]}
          >
            <Compass size={20} color={colors.primary} />
            <Text style={[typography.captionMedium, { color: colors.text, marginLeft: 10, flex: 1 }]}>
              Explore verified companions for cafe talks, museum walks & hobbies
            </Text>
          </View>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
            ]}
          >
            <ShieldCheck size={20} color={colors.success} />
            <Text style={[typography.captionMedium, { color: colors.text, marginLeft: 10, flex: 1 }]}>
              Safe public meetings with transparent hourly rates in INR
            </Text>
          </View>

          <View
            style={[
              styles.featureCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
            ]}
          >
            <HeartHandshake size={20} color={colors.primaryDark} />
            <Text style={[typography.captionMedium, { color: colors.text, marginLeft: 10, flex: 1 }]}>
              Earn by offering companionship services in your city
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Explore Companions"
            onPress={() => navigateTo('main')}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginBottom: 12 }}
          />

          <Button
            title="Log In with Mobile"
            onPress={() => navigateTo('login')}
            variant="outline"
            size="md"
            fullWidth
            style={{ marginBottom: 10 }}
          />

          <Button
            title="Create an Account"
            onPress={() => navigateTo('signup')}
            variant="ghost"
            size="md"
            fullWidth
          />
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconWrapper: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  featuresContainer: {
    width: '100%',
    marginVertical: 28,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  actionsContainer: {
    width: '100%',
    marginTop: 8,
  },
});
