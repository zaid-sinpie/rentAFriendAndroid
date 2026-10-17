import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { authService } from '../../services/auth/authService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppHeader } from '../../components/common/AppHeader';

export const OtpScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { loginUser, goBack, showToast } = useApp();

  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async () => {
    setError('');
    if (!otp || otp.length < 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyOtp(otp);
      setLoading(false);
      if (res.success && res.user) {
        loginUser(res.user);
      } else {
        setError(res.error || 'Verification failed. Try 123456.');
      }
    } catch {
      setLoading(false);
      setError('Connection failed. Please retry.');
    }
  };

  const handleResend = () => {
    if (cooldown === 0) {
      setCooldown(30);
      showToast('Code Resent', 'Enter test code 123456', 'info');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Verify OTP" showBack onBack={goBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={[typography.pageTitle, { color: colors.text, marginTop: 16 }]}>
          Enter 6-digit code
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 6, marginBottom: 24 }]}>
          We sent a verification code to your registered mobile number.
        </Text>

        {/* Demo Hint Banner */}
        <View
          style={[
            styles.hintBanner,
            {
              backgroundColor: colors.primaryLight,
              borderColor: colors.primary,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <ShieldCheck size={18} color={colors.primaryDark} style={{ marginRight: 8 }} />
          <Text style={[typography.captionMedium, { color: colors.primaryDark, flex: 1 }]}>
            Prototype test code: Enter <Text style={{ fontWeight: '800' }}>123456</Text>
          </Text>
        </View>

        <Input
          label="Verification Code"
          placeholder="6-digit code"
          value={otp}
          onChangeText={(txt) => {
            setOtp(txt.replace(/[^0-9]/g, ''));
            if (error) setError('');
          }}
          keyboardType="number-pad"
          maxLength={6}
          error={error}
          style={{ letterSpacing: 8, fontSize: 20, textAlign: 'center', fontWeight: '700' }}
        />

        <Button
          title="Verify & Continue"
          onPress={handleVerify}
          loading={loading}
          variant="primary"
          size="lg"
          fullWidth
          style={{ marginTop: 12 }}
        />

        <View style={styles.resendRow}>
          {cooldown > 0 ? (
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Resend code in <Text style={{ fontWeight: '700', color: colors.text }}>{cooldown}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[typography.captionMedium, { color: colors.primary, fontWeight: '700' }]}>
                Resend Verification Code
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  hintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 24,
  },
});
