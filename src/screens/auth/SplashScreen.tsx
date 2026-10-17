import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Users2 } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';

export const SplashScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { navigateTo } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('welcome');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.logoCircle,
          {
            backgroundColor: colors.primary,
            borderRadius: borderRadius.xl,
          },
        ]}
      >
        <Users2 size={44} color={colors.white} strokeWidth={2.2} />
      </View>

      <Text style={[typography.hero, { color: colors.text, marginTop: 18 }]}>
        Rent a Friend
      </Text>

      <Text
        style={[
          typography.body,
          { color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
        ]}
      >
        Meaningful company for every plan
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoCircle: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
