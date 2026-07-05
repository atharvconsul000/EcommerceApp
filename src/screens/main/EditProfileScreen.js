import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setName(data.full_name || '');
      setPhone(data.phone || '');
      setAvatarUrl(data.avatar_url || null);
    }
    setLoading(false);
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Gallery access is required to pick a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      // For a real production app, we would upload this file to Supabase Storage here.
      // For this demo, we'll just save the local URI to the database so it works locally.
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        full_name: name.trim(), 
        phone: phone.trim(), 
        avatar_url: avatarUrl 
      });

    if (!error) {
      Alert.alert('Saved! ✅', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', 'Could not save profile.');
    }
    setSaving(false);
  };

  if (loading) return <LoadingSpinner color={colors.primary} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Edit Profile" navigation={navigation} showBack />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* ── Avatar Picker ── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.avatarLetter, { color: colors.primary }]}>
                  {name.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
            {/* Camera overlay */}
            <View style={[styles.cameraOverlay, { backgroundColor: colors.primary }]}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={[styles.changePhotoText, { color: colors.primary }]}>Tap to change photo</Text>
        </View>

        {/* ── Form Fields ── */}
        <Input label="Full Name" value={name} onChangeText={setName} placeholder="Your full name" colors={colors} />
        <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" colors={colors} />

        {/* Email (read-only) */}
        <View style={styles.emailRow}>
          <Text style={[styles.emailLabel, { color: colors.textSecondary }]}>Email</Text>
          <Text style={[styles.emailValue, { color: colors.textLight }]}>{user?.email}</Text>
          <Text style={[styles.emailNote, { color: colors.textLight }]}>Cannot be changed here</Text>
        </View>

        <Button title="Save Changes" onPress={handleSave} loading={saving} style={{ marginTop: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarWrapper: { position: 'relative', marginBottom: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { fontSize: 44, fontWeight: '800' },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { fontSize: 14 },
  changePhotoText: { fontSize: 14, fontWeight: '600' },
  emailRow: { padding: 14, marginBottom: 16 },
  emailLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  emailValue: { fontSize: 15, marginBottom: 2 },
  emailNote: { fontSize: 12 },
});
