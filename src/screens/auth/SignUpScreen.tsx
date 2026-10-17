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
import { Smartphone } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { authService } from '../../services/auth/authService';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import { Button } from '../../components/ui/Button';
import { AppHeader } from '../../components/common/AppHeader';

const indianCities = [
  { value: 'Pune', label: 'Pune' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Bengaluru', label: 'Bengaluru' },
  { value: 'Delhi NCR', label: 'Delhi NCR' },
  { value: 'Hyderabad', label: 'Hyderabad' },
];

export const SignUpScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const { navigateTo, goBack, loginUser, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Pune');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!phone.trim() || phone.trim().length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (email.trim() && !email.includes('@')) {
      errs.email = 'Please enter a valid email address';
    }
    if (!agreed) {
      errs.agreed = 'You must accept the Terms of Service & Privacy Policy';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authService.signUp({
        fullName: fullName.trim(),
        phoneNumber: `+91 ${phone.trim()}`,
        email: email.trim() || undefined,
        city,
      });
      setLoading(false);
      showToast('Account Created!', `Welcome, ${res.user.fullName}`, 'success');
      loginUser(res.user);
    } catch {
      setLoading(false);
      showToast('Sign up failed', 'Please try again', 'error');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Create Account" showBack onBack={goBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={[typography.pageTitle, { color: colors.text, marginTop: 8 }]}>
            Join Rent a Friend
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4, marginBottom: 20 }]}>
            Create your account to discover companions or register as a friend.
          </Text>

          <Input
            label="Full Name"
            placeholder="e.g. Rahul Sharma"
            value={fullName}
            onChangeText={(txt) => {
              setFullName(txt);
              if (errors.fullName) setErrors({ ...errors, fullName: '' });
            }}
            error={errors.fullName}
          />

          <Input
            label="Mobile Number"
            placeholder="10-digit number"
            value={phone}
            onChangeText={(txt) => {
              setPhone(txt.replace(/[^0-9]/g, ''));
              if (errors.phone) setErrors({ ...errors, phone: '' });
            }}
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.phone}
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

          <Input
            label="Email Address (Optional)"
            placeholder="name@example.com"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Select
            label="Your Primary City"
            options={indianCities}
            value={city}
            onValueChange={setCity}
          />

          <Checkbox
            checked={agreed}
            onCheckedChange={(val) => {
              setAgreed(val);
              if (errors.agreed) setErrors({ ...errors, agreed: '' });
            }}
            label="I accept the Terms of Service & Privacy Policy"
            description="Our platform connects individuals for strictly public social outings."
          />
          {errors.agreed && (
            <Text style={[typography.small, { color: colors.error, marginTop: 4, marginBottom: 12 }]}>
              {errors.agreed}
            </Text>
          )}

          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginTop: 16 }}
          />

          <View style={styles.footerRow}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigateTo('login')}>
              <Text style={[typography.captionMedium, { color: colors.primary, fontWeight: '700' }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 20,
  },
});
