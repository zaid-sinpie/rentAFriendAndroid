import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { AppHeader } from '../../components/common/AppHeader';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

const cities = [
  { value: 'Pune', label: 'Pune' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Bengaluru', label: 'Bengaluru' },
  { value: 'Delhi NCR', label: 'Delhi NCR' },
  { value: 'Hyderabad', label: 'Hyderabad' },
];

export const EditProfileScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const { currentUser, goBack, updateUser } = useApp();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(currentUser?.city || 'Pune');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateUser({
      fullName: fullName.trim(),
      email: email.trim() || undefined,
      city,
    });
    setLoading(false);
    goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Edit Profile" showBack onBack={goBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <Input
            label="Mobile Number"
            value={currentUser?.phoneNumber || ''}
            editable={false}
            helperText="Phone number cannot be changed"
          />

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Select
            label="City"
            options={cities}
            value={city}
            onValueChange={setCity}
          />

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginTop: 16 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
});
