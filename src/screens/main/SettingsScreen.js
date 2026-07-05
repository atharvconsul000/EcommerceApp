import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { APP_NAME } from '../../utils/constants';
import Header from '../../components/Header';

function SettingToggle({ icon, label, subtitle, value, onValueChange, colors }) {
  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingText}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
        {subtitle ? <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: '#6C63FF' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );
}

function SettingTap({ icon, label, subtitle, onPress, colors, danger }) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingText}>
        <Text style={[styles.settingLabel, { color: danger ? colors.error : colors.text }]}>{label}</Text>
        {subtitle ? <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      <Text style={[styles.arrow, { color: colors.textLight }]}>›</Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Appearance ── */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>APPEARANCE</Text>
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingToggle
            icon="🌙"
            label="Dark Mode"
            subtitle={isDark ? 'Currently dark' : 'Currently light'}
            value={isDark}
            onValueChange={toggleTheme}
            colors={colors}
          />
        </View>

        {/* ── Notifications ── */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingToggle
            icon="🔔"
            label="Push Notifications"
            subtitle="Order updates & offers"
            value={notifications}
            onValueChange={setNotifications}
            colors={colors}
          />
        </View>

        {/* ── Account ── */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>ACCOUNT</Text>
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingTap icon="👤" label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} colors={colors} />
          <SettingTap icon="📍" label="Manage Addresses" onPress={() => navigation.navigate('Address')} colors={colors} />
        </View>

        {/* ── About ── */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>ABOUT</Text>
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>{APP_NAME}</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Version 1.0.0 (Supabase Edition)</Text>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <View style={[styles.section, styles.signOutSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingTap icon="🚪" label="Sign Out" onPress={handleSignOut} colors={colors} danger />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 20, marginBottom: 8, paddingHorizontal: 20 },
  section: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  signOutSection: { marginBottom: 32, marginTop: 24 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, gap: 12 },
  settingIcon: { fontSize: 22, width: 30 },
  settingText: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '600' },
  settingSubtitle: { fontSize: 12, marginTop: 2 },
  arrow: { fontSize: 22 },
});
