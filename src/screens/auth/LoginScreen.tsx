import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Smartphone, Info } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { authService } from '../../services/auth/authService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppHeader } from '../../components/common/AppHeader';

export const LoginScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { navigateTo, goBack, showToast } = useApp();

  const [phone, setPhone] = useState('9876543210');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    setError('');
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendOtp(cleanPhone);
      setLoading(false);
      showToast('Demo Verification Code', 'Use 123456 to verify in prototype mode', 'info');
      navigateTo('otp');
    } catch {
      setLoading(false);
      setError('Unable to send code. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Sign In" showBack onBack={goBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={[typography.pageTitle, { color: colors.text, marginTop: 12 }]}>
            Welcome back
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 6, marginBottom: 28 }]}>
            Enter your mobile number to receive a verification code.
          </Text>

          {/* Dev Mode Banner */}
          <View
            style={[
              styles.devNotice,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Info size={16} color={colors.primaryDark} style={{ marginRight: 8, marginTop: 1 }} />
            <Text style={[typography.caption, { color: colors.textSecondary, flex: 1 }]}>
              Prototype Mode: External SMS gateway is simulated. You will verify with default test code{' '}
              <Text style={{ fontWeight: '700', color: colors.text }}>123456</Text>.
            </Text>
          </View>

          {/* Phone Input with +91 Prefix */}
          <Input
            label="Mobile Number"
            placeholder="10-digit number"
            value={phone}
            onChangeText={(txt) => {
              setPhone(txt.replace(/[^0-9]/g, ''));
              if (error) setError('');
            }}
            keyboardType="phone-pad"
            maxLength={10}
            error={error}
            leftIcon={
              <View style={styles.countryCode}>
                <Smartphone size={16} color={colors.textSecondary} />
                <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 6 }]}>
                  +91
                </Text>
                <View style={[styles.codeDivider, { backgroundColor: colors.border }]} />
              </View>
            }
          />

          <Button
            title="Send Verification Code"
            onPress={handleContinue}
            loading={loading}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginTop: 12 }}
          />

          <View style={styles.footerRow}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Do not have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigateTo('signup')}>
              <Text style={[typography.captionMedium, { color: colors.primary, fontWeight: '700' }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              typography.small,
              { color: colors.textMuted, textAlign: 'center', marginTop: 32, lineHeight: 18 },
            ]}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  devNotice: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  codeDivider: {
    width: 1,
    height: 20,
    marginLeft: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});
