import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  ShieldCheck,
  MapPin,
  PhoneCall,
  AlertOctagon,
  Eye,
  CheckCircle,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { AppHeader } from '../../components/common/AppHeader';

export const SafetyScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { goBack } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader title="Safety & Trust Guidelines" showBack onBack={goBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[typography.pageTitle, { color: colors.text, marginTop: 4 }]}>
          Your Safety Comes First
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4, marginBottom: 20 }]}>
          Rent a Friend is designed exclusively for verified, public, platonic social companionship.
        </Text>

        {/* 1. Public Place Rule */}
        <View
          style={[
            styles.ruleCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.successLight }]}>
            <MapPin size={22} color={colors.success} />
          </View>
          <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 10 }]}>
            1. Strictly Public Meeting Places
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4, lineHeight: 20 }]}>
            All outings must occur in well-lit, public environments such as cafes, shopping malls, cultural centers, botanical gardens, and sports arenas. Meetings in private homes, hotel rooms, or secluded spots are strictly forbidden.
          </Text>
        </View>

        {/* 2. Platform Messaging & Payments */}
        <View
          style={[
            styles.ruleCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg, marginTop: 12 },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <ShieldCheck size={22} color={colors.primaryDark} />
          </View>
          <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 10 }]}>
            2. Transact & Coordinate on Platform
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4, lineHeight: 20 }]}>
            Always keep your initial communications within the app. Do not send cash advances or transfer money off-platform. Our cancellation and refund safeguards only protect bookings made through the app.
          </Text>
        </View>

        {/* 3. Share Your Itinerary */}
        <View
          style={[
            styles.ruleCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.lg, marginTop: 12 },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceSubtle }]}>
            <Eye size={22} color={colors.text} />
          </View>
          <Text style={[typography.sectionTitle, { color: colors.text, marginTop: 10 }]}>
            3. Tell a Close Friend or Family Member
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4, lineHeight: 20 }]}>
            Before heading to your outing, share your meeting time, venue address, and estimated return time with someone you trust.
          </Text>
        </View>

        {/* Emergency Assistance Helpline Box */}
        <View
          style={[
            styles.emergencyBox,
            { backgroundColor: colors.errorLight, borderColor: colors.error, borderRadius: borderRadius.lg, marginTop: 20 },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AlertOctagon size={24} color={colors.error} style={{ marginRight: 8 }} />
            <Text style={[typography.sectionTitle, { color: colors.error }]}>
              Emergency Contacts (India)
            </Text>
          </View>

          <Text style={[typography.caption, { color: colors.text, marginTop: 8, lineHeight: 18 }]}>
            If you ever feel unsafe or need immediate assistance during an outing, do not hesitate to contact emergency authorities:
          </Text>

          <View style={[styles.contactRow, { borderTopColor: 'rgba(198,77,77,0.2)' }]}>
            <PhoneCall size={16} color={colors.error} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 8 }]}>
              National Emergency Services:
            </Text>
            <Text style={[typography.bodyMedium, { color: colors.error, fontWeight: '700', marginLeft: 'auto' }]}>
              112
            </Text>
          </View>

          <View style={[styles.contactRow, { borderTopColor: 'rgba(198,77,77,0.2)' }]}>
            <PhoneCall size={16} color={colors.error} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 8 }]}>
              Women Helpline (All India):
            </Text>
            <Text style={[typography.bodyMedium, { color: colors.error, fontWeight: '700', marginLeft: 'auto' }]}>
              1091 / 181
            </Text>
          </View>
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
  ruleCard: {
    padding: 18,
    borderWidth: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyBox: {
    padding: 18,
    borderWidth: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
  },
});
