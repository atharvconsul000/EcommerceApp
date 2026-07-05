import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

// A single menu row
function MenuItem({ icon, label, value, onPress, colors, danger }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={[styles.menuLabel, { color: danger ? colors.error : colors.text }]}>{label}</Text>
      {value ? <Text style={[styles.menuValue, { color: colors.textSecondary }]}>{value}</Text> : null}
      <Text style={[styles.menuArrow, { color: colors.textLight }]}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  
  const [profile, setProfile] = useState(null);
  const [orderCount, setOrderCount] = useState(0);

  // We add a listener to refresh profile when navigating back from EditProfile
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    if (!user) return;
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (profileData) setProfile(profileData);

    // Fetch order count
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
      
    if (count !== null) setOrderCount(count);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const displayName = profile?.full_name || user?.email || 'User';
  const avatarUrl = profile?.avatar_url || null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Profile Header ── */}
        <View style={[styles.profileHeader, { backgroundColor: colors.primary }]}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <Text style={styles.avatarLetter}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>

          {/* Edit button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats Row ── */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{orderCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Orders</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{wishlistCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wishlist</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{cartCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Cart</Text>
          </View>
        </View>

        {/* ── Menu Items ── */}
        <View style={[styles.menu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MenuItem icon="📦" label="Order History" value={`${orderCount} orders`} onPress={() => navigation.navigate('OrderHistory')} colors={colors} />
          <MenuItem icon="❤️" label="Wishlist" value={`${wishlistCount} items`} onPress={() => navigation.navigate('Wishlist')} colors={colors} />
          <MenuItem icon="📍" label="My Addresses" onPress={() => navigation.navigate('Address')} colors={colors} />
          <MenuItem icon="⚙️" label="Settings" onPress={() => navigation.navigate('Settings')} colors={colors} />
          <MenuItem icon="🚪" label="Sign Out" onPress={handleSignOut} colors={colors} danger />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: { padding: 24, alignItems: 'center', paddingBottom: 32 },
  avatarContainer: { marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#FFF' },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { fontSize: 40, color: '#FFF', fontWeight: '800' },
  profileName: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  editButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  editButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: -20, borderRadius: 14, borderWidth: 1, paddingVertical: 16, elevation: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4 },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, height: '80%', alignSelf: 'center' },
  menu: { margin: 16, borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginTop: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, gap: 12 },
  menuIcon: { fontSize: 22, width: 30 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  menuValue: { fontSize: 13 },
  menuArrow: { fontSize: 20 },
});
